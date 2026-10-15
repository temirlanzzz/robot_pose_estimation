import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { Quaternion, Vector3 } from "three";
import { Component, ReactNode } from "react";
import { forward, Joints, Vec3 } from "../kinematics";
const world = ([x, y, z]: Vec3): Vec3 => [x, z, -y];
function Link({ a, b, index }: { a: Vec3; b: Vec3; index: number }) {
  const start = new Vector3(...a),
    end = new Vector3(...b),
    delta = end.clone().sub(start);
  const q = new Quaternion().setFromUnitVectors(
    new Vector3(0, 1, 0),
    delta.clone().normalize(),
  );
  return (
    <group>
      <mesh
        position={start.clone().add(end).multiplyScalar(0.5)}
        quaternion={q}
        castShadow
      >
        <boxGeometry
          args={[index === 0 ? 0.17 : 0.105, delta.length(), 0.105]}
        />
        <meshStandardMaterial
          color={index === 0 ? "#303b42" : "#e6e8df"}
          metalness={0.6}
          roughness={0.28}
        />
      </mesh>
      <mesh position={a} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.095, 0.095, 0.16, 32]} />
        <meshStandardMaterial
          color="#edb854"
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="fallback">
        3D needs WebGL. All kinematics controls and numerical results remain
        available.
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function RobotModel({
  joints,
  target,
  workspace,
  view,
}: {
  joints: Joints;
  target: Vec3;
  workspace: boolean;
  view: number;
}) {
  const points = forward(joints).map(world),
    tip = points[3];
  return (
    <Boundary>
      <Canvas
        key={view}
        shadows
        camera={{ position: [2.6, 2.1, 2.7], fov: 40 }}
        dpr={[1, 1.8]}
        aria-label="Interactive 3D robot arm; drag to orbit and scroll to zoom"
        fallback={
          <div className="fallback">
            WebGL unavailable. Use the numerical controls below.
          </div>
        }
      >
        <color attach="background" args={["#171e23"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 2]} intensity={2} castShadow />
        <directionalLight
          position={[-3, 2, -3]}
          intensity={1}
          color="#8dc0e0"
        />
        <gridHelper args={[5, 50, "#34454c", "#273238"]} />
        <mesh position={[0, -0.032, 0]} receiveShadow>
          <boxGeometry args={[0.5, 0.06, 0.5]} />
          <meshStandardMaterial
            color="#33434b"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
        {points.slice(0, -1).map((point, i) => (
          <Link key={i} a={point} b={points[i + 1]} index={i} />
        ))}
        <mesh position={tip}>
          <sphereGeometry args={[0.055, 24, 24]} />
          <meshStandardMaterial
            color="#90e4c1"
            emissive="#397b63"
            emissiveIntensity={0.6}
          />
        </mesh>
        <Line
          points={[tip, [tip[0], 0, tip[2]]]}
          color="#728b8d"
          dashed
          dashSize={0.035}
          gapSize={0.035}
        />
        <mesh position={world(target)}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshBasicMaterial
            color="#f0ba5c"
            wireframe
            transparent
            opacity={0.65}
          />
        </mesh>
        {workspace && (
          <mesh position={[0, 0.28, 0]}>
            <sphereGeometry args={[1.3, 32, 24]} />
            <meshBasicMaterial
              color="#8fcaaf"
              transparent
              opacity={0.035}
              wireframe
            />
          </mesh>
        )}
        <Line
          points={[
            [0, 0.005, 0],
            [0.5, 0.005, 0],
          ]}
          color="#d47674"
        />
        <Line
          points={[
            [0, 0.005, 0],
            [0, 0.005, -0.5],
          ]}
          color="#86ae92"
        />
        <Line
          points={[
            [0, 0, 0],
            [0, 0.5, 0],
          ]}
          color="#7dabc8"
        />
        <OrbitControls
          makeDefault
          target={[0, 0.55, 0]}
          minDistance={1.4}
          maxDistance={6}
          maxPolarAngle={Math.PI * 0.49}
        />
      </Canvas>
    </Boundary>
  );
}
