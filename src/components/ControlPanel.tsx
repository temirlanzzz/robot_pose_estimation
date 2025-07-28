import React from 'react'
import { useRobotStore } from '../store/robotStore'
import { Camera, Download, Play, Square, Settings, AlertTriangle } from 'lucide-react'

export function ControlPanel() {
  const {
    joints,
    savedPoses,
    selectedPoseId,
    isLiveSimulation,
    showJointLabels,
    showEndEffector,
    confidence,
    poseEstimationError,
    updateJoint,
    selectPose,
    toggleLiveSimulation,
    toggleJointLabels,
    toggleEndEffector,
    setPoseEstimationError,
    setConfidence,
    resetToDefault
  } = useRobotStore()

  const handlePoseSelect = (poseId: string) => {
    selectPose(poseId)
    // Simulate pose estimation
    const pose = savedPoses.find(p => p.id === poseId)
    if (pose) {
      setConfidence(pose.confidence)
      if (pose.confidence < 0.7) {
        setPoseEstimationError('Low confidence pose estimation')
      } else {
        setPoseEstimationError(null)
      }
    }
  }

  const handleCalibrateCamera = () => {
    // Simulate camera calibration
    setPoseEstimationError('Calibrating camera...')
    setTimeout(() => {
      setPoseEstimationError(null)
      setConfidence(0.95)
    }, 2000)
  }

  const handleExportData = () => {
    const data = {
      poses: savedPoses,
      currentJoints: joints,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'robot-poses.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSimulateError = () => {
    setPoseEstimationError('Pose estimation failed - insufficient lighting')
    setConfidence(0.3)
  }

  return (
    <div className="control-panel">
      <div className="panel-section">
        <h3>Pose Selection</h3>
        <select 
          value={selectedPoseId || ''} 
          onChange={(e) => handlePoseSelect(e.target.value)}
          className="pose-select"
        >
          {savedPoses.map(pose => (
            <option key={pose.id} value={pose.id}>
              {pose.name} ({(pose.confidence * 100).toFixed(0)}%)
            </option>
          ))}
        </select>
      </div>

      <div className="panel-section">
        <h3>Joint Controls</h3>
        <div className="joint-sliders">
          {joints.map((joint) => (
            <div key={joint.name} className="joint-control">
              <label>
                {joint.name.replace('_', ' ').toUpperCase()}: {joint.angle.toFixed(1)}°
              </label>
              <input
                type="range"
                min={joint.min}
                max={joint.max}
                value={joint.angle}
                onChange={(e) => updateJoint(joint.name, parseFloat(e.target.value))}
                className="joint-slider"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h3>Visualization</h3>
        <div className="toggle-controls">
          <button 
            onClick={toggleJointLabels}
            className={`toggle-btn ${showJointLabels ? 'active' : ''}`}
          >
            Joint Labels
          </button>
          <button 
            onClick={toggleEndEffector}
            className={`toggle-btn ${showEndEffector ? 'active' : ''}`}
          >
            End Effector
          </button>
        </div>
      </div>

      <div className="panel-section">
        <h3>Simulation</h3>
        <button 
          onClick={toggleLiveSimulation}
          className={`simulation-btn ${isLiveSimulation ? 'active' : ''}`}
        >
          {isLiveSimulation ? <Square size={16} /> : <Play size={16} />}
          {isLiveSimulation ? 'Stop' : 'Start'} Live Simulation
        </button>
      </div>

      <div className="panel-section">
        <h3>Features</h3>
        <div className="intrinsic-controls">
          <button onClick={handleCalibrateCamera} className="calibrate-btn">
            <Camera size={16} />
            Calibrate Camera
          </button>
          <button onClick={handleExportData} className="export-btn">
            <Download size={16} />
            Export to URDF/ROS
          </button>
          <button onClick={handleSimulateError} className="error-btn">
            <AlertTriangle size={16} />
            Simulate Error
          </button>
        </div>
      </div>

      <div className="panel-section">
        <h3>Status</h3>
        <div className="status-info">
          <div className="confidence-bar">
            <span>Confidence:</span>
            <div className="bar-container">
              <div 
                className="bar-fill" 
                style={{ 
                  width: `${confidence * 100}%`,
                  backgroundColor: confidence >= 0.8 ? '#4ade80' : 
                                 confidence >= 0.6 ? '#fbbf24' : '#ef4444'
                }}
              />
            </div>
            <span>{(confidence * 100).toFixed(1)}%</span>
          </div>
          {poseEstimationError && (
            <div className="error-message">
              ⚠️ {poseEstimationError}
            </div>
          )}
        </div>
      </div>

      <div className="panel-section">
        <button onClick={resetToDefault} className="reset-btn">
          <Settings size={16} />
          Reset to Default
        </button>
      </div>
    </div>
  )
} 