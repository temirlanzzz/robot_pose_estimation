export type Vec3 = [number, number, number];
export type Joints = [number, number, number];
export const MODEL = { base: 0.28, upper: 0.72, forearm: 0.58 };
export const LIMITS: [number, number][] = [
  [-180, 180],
  [-100, 140],
  [-150, 150],
];
export const HOME: Joints = [30, 65, -95];
export const rad = (degrees: number) => (degrees * Math.PI) / 180;
export const deg = (radians: number) => (radians * 180) / Math.PI;
export function forward(joints: Joints): Vec3[] {
  const [yaw, shoulder, elbow] = joints.map(rad);
  const point = (r: number, z: number): Vec3 => [
    r * Math.cos(yaw),
    r * Math.sin(yaw),
    z,
  ];
  const r1 = MODEL.upper * Math.cos(shoulder);
  const z1 = MODEL.base + MODEL.upper * Math.sin(shoulder);
  return [
    [0, 0, 0],
    [0, 0, MODEL.base],
    point(r1, z1),
    point(
      r1 + MODEL.forearm * Math.cos(shoulder + elbow),
      z1 + MODEL.forearm * Math.sin(shoulder + elbow),
    ),
  ];
}
export function distance(a: Vec3, b: Vec3) {
  return Math.hypot(...a.map((v, i) => v - b[i]));
}
export function inverse(
  target: Vec3,
  seed: Joints,
): { joints: Joints; error: number } | null {
  if (!target.every(Number.isFinite)) return null;
  const [x, y, z] = target;
  const radius = Math.hypot(x, y),
    height = z - MODEL.base;
  const cosine =
    (radius ** 2 + height ** 2 - MODEL.upper ** 2 - MODEL.forearm ** 2) /
    (2 * MODEL.upper * MODEL.forearm);
  if (cosine < -1 - 1e-10 || cosine > 1 + 1e-10) return null;
  const candidates: Joints[] = [];
  for (const signedRadius of radius < 1e-10 ? [radius] : [radius, -radius]) {
    let yaw =
      radius < 1e-10
        ? seed[0]
        : deg(Math.atan2(y, x)) + (signedRadius < 0 ? 180 : 0);
    if (yaw > 180) yaw -= 360;
    for (const sign of [-1, 1]) {
      const elbow = sign * Math.acos(Math.max(-1, Math.min(1, cosine)));
      const shoulder =
        Math.atan2(height, signedRadius) -
        Math.atan2(
          MODEL.forearm * Math.sin(elbow),
          MODEL.upper + MODEL.forearm * Math.cos(elbow),
        );
      let angle = deg(shoulder);
      if (angle > 180) angle -= 360;
      if (angle < -180) angle += 360;
      const joints: Joints = [yaw, angle, deg(elbow)];
      if (
        joints.every(
          (q, i) => q >= LIMITS[i][0] - 1e-8 && q <= LIMITS[i][1] + 1e-8,
        )
      )
        candidates.push(joints);
    }
  }
  candidates.sort(
    (a, b) =>
      a.reduce((s, v, i) => s + (v - seed[i]) ** 2, 0) -
      b.reduce((s, v, i) => s + (v - seed[i]) ** 2, 0),
  );
  return candidates.length
    ? {
        joints: candidates[0],
        error: distance(forward(candidates[0])[3], target),
      }
    : null;
}
export function urdf() {
  const link = (name: string, length: number) =>
    `<link name="${name}"><visual><origin xyz="${length / 2} 0 0"/><geometry><box size="${length} 0.08 0.08"/></geometry></visual></link>`;
  const joint = (
    name: string,
    parent: string,
    child: string,
    origin: string,
    axis: string,
    i: number,
  ) =>
    `<joint name="${name}" type="revolute"><parent link="${parent}"/><child link="${child}"/><origin xyz="${origin}"/><axis xyz="${axis}"/><limit lower="${rad(LIMITS[i][0])}" upper="${rad(LIMITS[i][1])}" effort="10" velocity="1"/></joint>`;
  return `<?xml version="1.0"?>\n<!-- Educational 3R visual model. SI units. No collision or inertial model. Joint state is exported separately. -->\n<robot name="axis_3r">\n<link name="base"><visual><origin xyz="0 0 ${MODEL.base / 2}"/><geometry><cylinder radius="0.12" length="${MODEL.base}"/></geometry></visual></link>\n<link name="yaw"/>\n${link("upper", MODEL.upper)}\n${link("forearm", MODEL.forearm)}\n<link name="tool"/>\n${joint("base_yaw", "base", "yaw", `0 0 ${MODEL.base}`, "0 0 1", 0)}\n${joint("shoulder", "yaw", "upper", "0 0 0", "0 -1 0", 1)}\n${joint("elbow", "upper", "forearm", `${MODEL.upper} 0 0`, "0 -1 0", 2)}\n<joint name="tool_fixed" type="fixed"><parent link="forearm"/><child link="tool"/><origin xyz="${MODEL.forearm} 0 0"/></joint>\n</robot>\n`;
}
