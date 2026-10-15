import { useState } from "react";
import {
  ArrowDownToLine,
  RotateCcw,
  Box,
  Move3D,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import RobotModel from "./components/RobotModel";
import { JointControls, TargetControls } from "./components/Controls";
import AnimatedContent from "./components/reactbits/AnimatedContent";
import {
  forward,
  inverse,
  urdf,
  rad,
  HOME,
  LIMITS,
  Joints,
  Vec3,
  MODEL,
  distance,
} from "./kinematics";
import "./App.css";
function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function App() {
  const [joints, setJoints] = useState<Joints>(HOME),
    [target, setTarget] = useState<Vec3>([0.8, 0.4, 0.65]),
    [tab, setTab] = useState<"joints" | "target">("joints"),
    [workspace, setWorkspace] = useState(false),
    [view, setView] = useState(0),
    [message, setMessage] = useState(""),
    [help, setHelp] = useState(false);
  const points = forward(joints),
    tip = points[3],
    result = inverse(target, joints),
    residual = distance(tip, target),
    singular = Math.abs(Math.sin(rad(joints[2]))) < 0.05;
  const setJoint = (i: number, n: number) => {
    if (!Number.isFinite(n)) return;
    setJoints(
      (q) =>
        q.map((v, k) =>
          k === i ? Math.max(LIMITS[i][0], Math.min(LIMITS[i][1], n)) : v,
        ) as Joints,
    );
    setMessage("");
  };
  return (
    <div className="app">
      <header>
        <a className="brand" href="#">
          <span className="brand-icon">
            <Move3D size={23} />
          </span>{" "}
          AXIS <span className="brand-sub">KINEMATICS LAB</span>
        </a>
        <div className="header-right">
          <span className="local">
            <i /> Local computation
          </span>
          <button
            className="icon"
            aria-label="About this model"
            onClick={() => setHelp(!help)}
          >
            <Info size={18} />
          </button>
        </div>
      </header>
      <main>
        <AnimatedContent distance={12} duration={0.55} trigger="mount">
          <section className="intro">
            <div>
              <div className="eyebrow">ROBOTICS / INTERACTIVE STUDY 01</div>
              <h1>
                Every angle. <span>Understood.</span>
              </h1>
              <p>A hands-on workspace for the geometry of motion.</p>
            </div>
            <div className="model-tag">
              <span>MODEL</span>
              <strong>AX–03</strong>
              <small>3 revolute joints · position control</small>
            </div>
          </section>
        </AnimatedContent>
        {help && (
          <section className="notice">
            <strong>A geometric model, not a digital twin.</strong> AX–03 is an
            educational 3R arm with analytic forward and inverse kinematics.
            Coordinates use X forward, Y left, Z up, in meters. No sensors, pose
            estimation, collision detection, dynamics, or hardware connection.
            The wireframe shows the outer reach bound, not the joint-limited
            workspace. URDF contains visual geometry and limits, without inertia
            or collision models.
          </section>
        )}
        <section className="workbench">
          <div className="viewport">
            <div className="viewport-head">
              <span>
                <i /> LIVE VIEW
              </span>
              <span>PERSPECTIVE · Z UP</span>
            </div>
            <RobotModel
              joints={joints}
              target={target}
              workspace={workspace}
              view={view}
            />
            <div className="view-tools">
              <button
                className={workspace ? "active" : ""}
                onClick={() => setWorkspace(!workspace)}
                aria-pressed={workspace}
              >
                <Box size={15} /> Reach bound
              </button>
              <button onClick={() => setView((v) => v + 1)}>
                <RotateCcw size={15} /> Reset view
              </button>
            </div>
            <div className="view-caption">
              <span className="axis-key">
                <b>X</b> <b>Y</b> <b>Z</b>
              </span>
              <span>Drag to orbit · Scroll to zoom</span>
            </div>
            <div className="floating-label">
              <span className="tool-dot" /> TOOL CENTER POINT{" "}
              <strong>
                {tip.map((v) => v.toFixed(3)).join(" / ")} <small>m</small>
              </strong>
            </div>
          </div>
          <aside className="controls">
            <div className="panel-title">
              <div>
                <span className="eyebrow">CONTROL SPACE</span>
                <h2>Move the arm</h2>
              </div>
              <SlidersHorizontal size={19} />
            </div>
            <div className="tabs" role="group" aria-label="Control mode">
              <button
                aria-pressed={tab === "joints"}
                onClick={() => {
                  setTab("joints");
                  setMessage("");
                }}
              >
                Joint angles
              </button>
              <button
                aria-pressed={tab === "target"}
                onClick={() => {
                  setTab("target");
                  setMessage("");
                }}
              >
                Target position
              </button>
            </div>
            {tab === "joints" ? (
              <JointControls
                joints={joints}
                setJoint={setJoint}
                setJoints={setJoints}
                setMessage={setMessage}
              />
            ) : (
              <TargetControls
                target={target}
                setTarget={setTarget}
                tip={tip}
                result={result}
                setJoints={setJoints}
                setMessage={setMessage}
              />
            )}
            <div className="panel-note">
              <i className={singular ? "amber" : "green"} />
              <span>
                {singular
                  ? "Near a straight-arm singularity"
                  : "Joint limits enforced"}
                <small>Analytical geometry · no physics simulation</small>
              </span>
            </div>
          </aside>
        </section>
        <section className="telemetry">
          <div className="telemetry-heading">
            <span className="eyebrow">FORWARD KINEMATICS</span>
            <h2>Position, in real time.</h2>
            <span className="telemetry-note">World frame · meters</span>
          </div>
          {tip.map((n, i) => (
            <div className="metric" key={i}>
              <span className={`axis axis-${i}`}>{["X", "Y", "Z"][i]}</span>
              <div>
                <strong>{n.toFixed(4)}</strong>
                <small>{["FORWARD", "LATERAL", "HEIGHT"][i]}</small>
              </div>
            </div>
          ))}
          <div className="residual">
            <span>TARGET RESIDUAL</span>
            <strong>
              {(residual * 1000).toFixed(2)} <small>mm</small>
            </strong>
          </div>
        </section>
        <section className="bottom">
          <div className="spec">
            <span className="eyebrow">THE GEOMETRY</span>
            <h3>Simple model. Real mathematics.</h3>
            <p>
              Yaw + a two-link planar chain. Closed-form solutions, explicit
              limits, and inspectable state.
            </p>
            <div className="dimensions">
              <span>
                Base <b>{MODEL.base.toFixed(2)} m</b>
              </span>
              <span>
                Upper arm <b>{MODEL.upper.toFixed(2)} m</b>
              </span>
              <span>
                Forearm <b>{MODEL.forearm.toFixed(2)} m</b>
              </span>
            </div>
          </div>
          <div className="export">
            <span className="eyebrow">TAKE IT FURTHER</span>
            <h3>Your model, outside the browser.</h3>
            <p>
              Export the visual robot description or a snapshot of joint angles
              and tool coordinates.
            </p>
            <div>
              <button
                onClick={() => {
                  download("axis-3r.urdf", urdf(), "application/xml");
                  setMessage(
                    "URDF downloaded. Visual geometry and limits; no dynamics.",
                  );
                }}
              >
                <ArrowDownToLine size={15} /> Robot URDF
              </button>
              <button
                onClick={() => {
                  download(
                    "axis-pose.json",
                    JSON.stringify(
                      {
                        model: "AX-03",
                        units: { position: "meters", joints: "radians" },
                        joint_names: ["base_yaw", "shoulder", "elbow"],
                        joints: joints.map(rad),
                        tool_position: tip,
                        target_position: target,
                      },
                      null,
                      2,
                    ),
                    "application/json",
                  );
                  setMessage("Pose snapshot downloaded.");
                }}
              >
                <ArrowDownToLine size={15} /> Pose JSON
              </button>
            </div>
          </div>
        </section>
        <div className="feedback" role="status" aria-live="polite">
          {message}
        </div>
        <footer>
          <span>AXIS / A browser-based robotics study</span>
          <span>
            3 DOF <i /> Analytic IK <i /> No data leaves your device
          </span>
        </footer>
      </main>
    </div>
  );
}
