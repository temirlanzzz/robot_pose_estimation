import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import { RobotModel } from './components/RobotModel'
import { ControlPanel } from './components/ControlPanel'
import { useRobotStore } from './store/robotStore'
import './App.css'

function Scene() {
  const { showJointLabels, showEndEffector } = useRobotStore()

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <RobotModel showLabels={showJointLabels} showEndEffector={showEndEffector} />
      
      <Grid 
        args={[20, 20]} 
        cellSize={1} 
        cellThickness={0.5} 
        cellColor="#374151" 
        sectionSize={5} 
        sectionThickness={1} 
        sectionColor="#6b7280" 
        fadeDistance={25} 
        fadeStrength={1} 
        followCamera={false} 
        infiniteGrid={true} 
      />
      
      <Environment preset="warehouse" />
    </>
  )
}

export default function App() {
  return (
    <div className="app">
      <div className="header">
        <h1>Robot Pose Visualizer</h1>
        <p>Perception workflow simulation</p>
      </div>
      
      <div className="main-content">
        <div className="canvas-container">
          <Canvas
            camera={{ position: [5, 3, 5], fov: 50 }}
            shadows
            gl={{ antialias: true }}
          >
            <Scene />
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={20}
            />
          </Canvas>
        </div>
        
        <ControlPanel />
      </div>
    </div>
  )
} 