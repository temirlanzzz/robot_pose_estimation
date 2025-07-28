import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useRobotStore } from '../store/robotStore'

interface RobotModelProps {
  showLabels?: boolean
  showEndEffector?: boolean
}

export function RobotModel({ showLabels = true, showEndEffector = true }: RobotModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const baseRef = useRef<THREE.Group>(null)
  const shoulderRef = useRef<THREE.Group>(null)
  const elbowRef = useRef<THREE.Group>(null)
  const wrist1Ref = useRef<THREE.Group>(null)
  const wrist2Ref = useRef<THREE.Group>(null)
  const wrist3Ref = useRef<THREE.Group>(null)
  const endEffectorRef = useRef<THREE.Group>(null)

  const { joints, isLiveSimulation, confidence, poseEstimationError } = useRobotStore()

  // Live simulation animation
  useFrame((state) => {
    if (isLiveSimulation) {
      const time = state.clock.elapsedTime
      joints.forEach((joint, index) => {
        const amplitude = (joint.max - joint.min) * 0.3
        const frequency = 0.5 + index * 0.2
        const newAngle = joint.min + (joint.max - joint.min) / 2 + 
                        amplitude * Math.sin(time * frequency)
        useRobotStore.getState().updateJoint(joint.name, newAngle)
      })
    }
  })

  // Update joint rotations based on store
  useEffect(() => {
    if (baseRef.current) {
      baseRef.current.rotation.y = THREE.MathUtils.degToRad(joints[0]?.angle || 0)
    }
    if (shoulderRef.current) {
      shoulderRef.current.rotation.z = THREE.MathUtils.degToRad(joints[1]?.angle || 0)
    }
    if (elbowRef.current) {
      elbowRef.current.rotation.z = THREE.MathUtils.degToRad(joints[2]?.angle || 0)
    }
    if (wrist1Ref.current) {
      wrist1Ref.current.rotation.y = THREE.MathUtils.degToRad(joints[3]?.angle || 0)
    }
    if (wrist2Ref.current) {
      wrist2Ref.current.rotation.z = THREE.MathUtils.degToRad(joints[4]?.angle || 0)
    }
    if (wrist3Ref.current) {
      wrist3Ref.current.rotation.y = THREE.MathUtils.degToRad(joints[5]?.angle || 0)
    }
  }, [joints])

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return '#4ade80' // green
    if (conf >= 0.6) return '#fbbf24' // yellow
    return '#ef4444' // red
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Base */}
      <group ref={baseRef} position={[0, 0, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 8]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        
        {/* Shoulder */}
        <group ref={shoulderRef} position={[0, 0.3, 0]}>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.2, 0.8, 0.2]} />
            <meshStandardMaterial color="#6b7280" />
          </mesh>
          
          {/* Upper arm */}
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[0.15, 1.2, 0.15]} />
            <meshStandardMaterial color="#9ca3af" />
          </mesh>
          
          {/* Elbow */}
          <group ref={elbowRef} position={[0, 1.4, 0]}>
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color="#6b7280" />
            </mesh>
            
            {/* Lower arm */}
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[0.12, 1.2, 0.12]} />
              <meshStandardMaterial color="#9ca3af" />
            </mesh>
            
            {/* Wrist 1 */}
            <group ref={wrist1Ref} position={[0, 1.2, 0]}>
              <mesh position={[0, 0.1, 0]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial color="#6b7280" />
              </mesh>
              
              {/* Wrist 2 */}
              <group ref={wrist2Ref} position={[0, 0.2, 0]}>
                <mesh position={[0, 0.1, 0]}>
                  <sphereGeometry args={[0.08, 8, 8]} />
                  <meshStandardMaterial color="#6b7280" />
                </mesh>
                
                {/* Wrist 3 */}
                <group ref={wrist3Ref} position={[0, 0.16, 0]}>
                  <mesh position={[0, 0.1, 0]}>
                    <sphereGeometry args={[0.06, 8, 8]} />
                    <meshStandardMaterial color="#6b7280" />
                  </mesh>
                  
                  {/* End effector */}
                  {showEndEffector && (
                    <group ref={endEffectorRef} position={[0, 0.2, 0]}>
                      <mesh position={[0, 0.05, 0]}>
                        <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
                        <meshStandardMaterial color="#ef4444" />
                      </mesh>
                      <mesh position={[0, 0.1, 0]}>
                        <coneGeometry args={[0.03, 0.1, 8]} />
                        <meshStandardMaterial color="#dc2626" />
                      </mesh>
                    </group>
                  )}
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* Joint labels */}
      {showLabels && (
        <>
          <Html position={[0, 0.2, 0.4]} center>
            <div style={{
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}>
              Base: {joints[0]?.angle.toFixed(1)}°
            </div>
          </Html>
          
          <Html position={[0.3, 0.8, 0]} center>
            <div style={{
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}>
              Shoulder: {joints[1]?.angle.toFixed(1)}°
            </div>
          </Html>
          
          <Html position={[0.2, 1.4, 0]} center>
            <div style={{
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}>
              Elbow: {joints[2]?.angle.toFixed(1)}°
            </div>
          </Html>
        </>
      )}

      {/* Confidence indicator */}
      <Html position={[0, 2.5, 0]} center>
        <div style={{
          background: 'rgba(0,0,0,0.9)',
          color: getConfidenceColor(confidence),
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 'bold',
          border: `2px solid ${getConfidenceColor(confidence)}`
        }}>
          Confidence: {(confidence * 100).toFixed(1)}%
        </div>
      </Html>

      {/* Error indicator */}
      {poseEstimationError && (
        <Html position={[0, 3, 0]} center>
          <div style={{
            background: 'rgba(239, 68, 68, 0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            ⚠️ {poseEstimationError}
          </div>
        </Html>
      )}
    </group>
  )
} 