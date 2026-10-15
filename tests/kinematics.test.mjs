import test from "node:test";
import assert from "node:assert/strict";
import {
  forward,
  inverse,
  distance,
  HOME,
  LIMITS,
  urdf,
} from "../src/kinematics.ts";
test("zero pose and upright pose have correct Cartesian coordinates", () => {
  assert.ok(distance(forward([0, 0, 0])[3], [1.3, 0, 0.28]) < 1e-12);
  assert.ok(distance(forward([0, 90, 0])[3], [0, 0, 1.58]) < 1e-12);
  assert.ok(distance(forward([90, 0, 0])[3], [0, 1.3, 0.28]) < 1e-12);
});
test("IK round-trips deterministic configurations across all joint ranges", () => {
  let count = 0;
  for (let yaw = -175; yaw <= 175; yaw += 35)
    for (let shoulder = -95; shoulder <= 135; shoulder += 23)
      for (let elbow = -145; elbow <= 145; elbow += 29) {
        const pose = [yaw, shoulder, elbow],
          target = forward(pose)[3],
          result = inverse(target, pose);
        assert.ok(result, `missing solution ${pose}`);
        assert.ok(result.error < 1e-8);
        assert.ok(
          result.joints.every(
            (v, i) => v >= LIMITS[i][0] - 1e-8 && v <= LIMITS[i][1] + 1e-8,
          ),
        );
        count++;
      }
  assert.ok(count > 1000);
});
test("unreachable, invalid, and forbidden fully folded targets fail explicitly", () => {
  assert.equal(inverse([3, 0, 0], HOME), null);
  assert.equal(inverse([NaN, 0, 0], HOME), null);
  assert.equal(inverse([0, 0, 0.28], HOME), null);
});
test("outer reach and yaw singularity stay finite", () => {
  for (const target of [
    [1.3, 0, 0.28],
    [0, 0, 1.58],
  ]) {
    const result = inverse(target, HOME);
    assert.ok(result);
    assert.ok(result.error < 1e-8);
    assert.ok(result.joints.every(Number.isFinite));
  }
});
test("URDF describes revolute joints with SI limits and a fixed tool frame", () => {
  const xml = urdf();
  assert.ok(xml.startsWith("<?xml"));
  assert.equal((xml.match(/type="revolute"/g) || []).length, 3);
  assert.equal((xml.match(/<link /g) || []).length, 5);
  assert.match(xml, /<axis xyz="0 -1 0"/);
  assert.match(xml, /<joint name="tool_fixed" type="fixed"/);
});
test("URDF chain transforms independently reproduce FK for arbitrary joint configurations", () => {
  const xml = urdf();
  // Parse only the four known joints, then apply axis-angle rotations and translated origins.
  const definitions = [
    ...xml.matchAll(
      /<joint name="[^"]+" type="(revolute|fixed)">([\s\S]*?)<\/joint>/g,
    ),
  ].map((m) => ({
    type: m[1],
    origin: m[2]
      .match(/<origin xyz="([^"]+)"/)[1]
      .split(" ")
      .map(Number),
    axis: m[2]
      .match(/<axis xyz="([^"]+)"/)?.[1]
      .split(" ")
      .map(Number),
  }));
  const multiply = (a, b) =>
    a.map((row) =>
      b[0].map((_, j) => row.reduce((sum, v, k) => sum + v * b[k][j], 0)),
    );
  for (const angles of [[0, 0, 0], HOME, [-170, -85, 130], [135, 135, -145]]) {
    let rotation = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      position = [0, 0, 0],
      index = 0;
    for (const joint of definitions) {
      position = position.map(
        (v, i) =>
          v + rotation[i].reduce((sum, n, k) => sum + n * joint.origin[k], 0),
      );
      if (joint.type === "fixed") continue;
      const [x, y, z] = joint.axis,
        angle = (angles[index++] * Math.PI) / 180,
        c = Math.cos(angle),
        s = Math.sin(angle),
        t = 1 - c;
      rotation = multiply(rotation, [
        [t * x * x + c, t * x * y - s * z, t * x * z + s * y],
        [t * x * y + s * z, t * y * y + c, t * y * z - s * x],
        [t * x * z - s * y, t * y * z + s * x, t * z * z + c],
      ]);
    }
    assert.ok(distance(position, forward(angles)[3]) < 1e-12);
  }
});
test("solving the current target preserves the nearest seed across angle wrapping", () => {
  for (const pose of [
    [0, 130, 140],
    [45, 140, 150],
    [-170, 130, 140],
    [110, -95, -140],
  ]) {
    const result = inverse(forward(pose)[3], pose);
    assert.ok(result);
    assert.ok(
      distance(result.joints, pose) < 1e-8,
      `${pose} changed to ${result.joints}`,
    );
  }
  for (let yaw = -175; yaw <= 175; yaw += 35)
    for (let shoulder = -95; shoulder <= 135; shoulder += 23)
      for (let elbow = -145; elbow <= 145; elbow += 29) {
        const pose = [yaw, shoulder, elbow],
          result = inverse(forward(pose)[3], pose);
        assert.ok(result);
        assert.ok(
          distance(result.joints, pose) < 1e-5,
          `${pose} changed to ${result.joints}`,
        );
      }
});
