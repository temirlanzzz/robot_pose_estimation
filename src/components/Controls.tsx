import { ArrowUpRight, Crosshair } from "lucide-react";
import { Joints, LIMITS, Vec3 } from "../kinematics";
const presets: { name: string; joints: Joints }[] = [
  { name: "Ready", joints: [30, 65, -95] },
  { name: "Reach", joints: [0, 15, -30] },
  { name: "Fold", joints: [-40, 100, -145] },
  { name: "Inspect", joints: [70, 35, 40] },
];
export function JointControls({
  joints,
  setJoint,
  setJoints,
  setMessage,
}: {
  joints: Joints;
  setJoint: (i: number, n: number) => void;
  setJoints: (j: Joints) => void;
  setMessage: (m: string) => void;
}) {
  return (
    <>
      <div className="joint-list">
        {["Base rotation", "Shoulder", "Elbow"].map((name, i) => (
          <div className="joint" key={name}>
            <div className="joint-label">
              <label htmlFor={`joint-${i}`}>
                <span>J{i + 1}</span>
                {name}
              </label>
              <div className="angle-input">
                <input
                  aria-label={`${name} degrees`}
                  type="number"
                  min={LIMITS[i][0]}
                  max={LIMITS[i][1]}
                  step="1"
                  value={Number(joints[i].toFixed(2))}
                  onChange={(e) => setJoint(i, Number(e.target.value))}
                />
                <span>°</span>
              </div>
            </div>
            <input
              id={`joint-${i}`}
              type="range"
              min={LIMITS[i][0]}
              max={LIMITS[i][1]}
              step=".1"
              value={joints[i]}
              onChange={(e) => setJoint(i, Number(e.target.value))}
            />
            <div className="range-labels">
              <span>{LIMITS[i][0]}°</span>
              <span>{LIMITS[i][1]}°</span>
            </div>
          </div>
        ))}
      </div>
      <div className="preset-label">QUICK POSES</div>
      <div className="presets">
        {presets.map((p) => (
          <button
            key={p.name}
            className={
              joints.every((q, i) => Math.abs(q - p.joints[i]) < 0.01)
                ? "selected"
                : ""
            }
            onClick={() => {
              setJoints([...p.joints]);
              setMessage(`${p.name} pose applied.`);
            }}
          >
            {p.name}
          </button>
        ))}
      </div>
    </>
  );
}
export function TargetControls({
  target,
  setTarget,
  tip,
  result,
  setJoints,
  setMessage,
}: {
  target: Vec3;
  setTarget: React.Dispatch<React.SetStateAction<Vec3>>;
  tip: Vec3;
  result: { joints: Joints; error: number } | null;
  setJoints: (j: Joints) => void;
  setMessage: (m: string) => void;
}) {
  return (
    <div className="target-panel">
      <p>
        Set a point in world coordinates. The solver selects the valid solution
        nearest your current joint angles.
      </p>
      {["X", "Y", "Z"].map((axis, i) => (
        <label className="target-input" key={axis}>
          {axis}
          <input
            type="number"
            aria-label={`Target ${axis}`}
            step=".01"
            value={target[i]}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n)) {
                setTarget((t) => t.map((v, k) => (k === i ? n : v)) as Vec3);
                setMessage("");
              }
            }}
          />
          <span>m</span>
        </label>
      ))}
      <div className={`reach-status ${!result ? "warning" : ""}`}>
        {result
          ? "Within joint-limited reach"
          : "No solution within reach / joint limits"}
      </div>
      <button
        className="primary"
        disabled={!result}
        onClick={() => {
          if (result) {
            setJoints(result.joints);
            setMessage(
              `Solved. Position error ${(result.error * 1000).toFixed(6)} mm.`,
            );
          }
        }}
      >
        <Crosshair size={16} /> Solve inverse kinematics
      </button>
      <button
        className="text-button"
        onClick={() => {
          setTarget([...tip]);
          setMessage("Target set to current tool position.");
        }}
      >
        Use current tool position <ArrowUpRight size={14} />
      </button>
    </div>
  );
}
