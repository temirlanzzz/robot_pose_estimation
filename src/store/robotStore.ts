import { create } from 'zustand'

export interface JointConfig {
  name: string
  angle: number
  min: number
  max: number
  unit: string
}

export interface RobotPose {
  id: string
  name: string
  joints: JointConfig[]
  confidence: number
  timestamp: number
}

export interface CameraCalibration {
  position: [number, number, number]
  rotation: [number, number, number]
  focalLength: number
  sensorSize: [number, number]
}

interface RobotStore {
  // Robot state
  joints: JointConfig[]
  currentPose: RobotPose | null
  savedPoses: RobotPose[]
  selectedPoseId: string | null
  
  // UI state
  isLiveSimulation: boolean
  showJointLabels: boolean
  showEndEffector: boolean
  cameraCalibration: CameraCalibration
  
  // Error state
  poseEstimationError: string | null
  confidence: number
  
  // Actions
  updateJoint: (jointName: string, angle: number) => void
  setCurrentPose: (pose: RobotPose) => void
  addSavedPose: (pose: RobotPose) => void
  selectPose: (poseId: string) => void
  toggleLiveSimulation: () => void
  toggleJointLabels: () => void
  toggleEndEffector: () => void
  updateCameraCalibration: (calibration: Partial<CameraCalibration>) => void
  setPoseEstimationError: (error: string | null) => void
  setConfidence: (confidence: number) => void
  resetToDefault: () => void
}

const defaultJoints: JointConfig[] = [
  { name: 'base_rotation', angle: 0, min: -180, max: 180, unit: 'deg' },
  { name: 'shoulder', angle: -45, min: -90, max: 90, unit: 'deg' },
  { name: 'elbow', angle: 90, min: 0, max: 180, unit: 'deg' },
  { name: 'wrist_1', angle: 0, min: -180, max: 180, unit: 'deg' },
  { name: 'wrist_2', angle: 0, min: -180, max: 180, unit: 'deg' },
  { name: 'wrist_3', angle: 0, min: -180, max: 180, unit: 'deg' }
]

const defaultPoses: RobotPose[] = [
  {
    id: 'home',
    name: 'Home Position',
    joints: defaultJoints.map(j => ({ ...j, angle: 0 })),
    confidence: 0.95,
    timestamp: Date.now()
  },
  {
    id: 'pick',
    name: 'Pick Position',
    joints: [
      { name: 'base_rotation', angle: 45, min: -180, max: 180, unit: 'deg' },
      { name: 'shoulder', angle: -30, min: -90, max: 90, unit: 'deg' },
      { name: 'elbow', angle: 120, min: 0, max: 180, unit: 'deg' },
      { name: 'wrist_1', angle: -45, min: -180, max: 180, unit: 'deg' },
      { name: 'wrist_2', angle: 0, min: -180, max: 180, unit: 'deg' },
      { name: 'wrist_3', angle: 0, min: -180, max: 180, unit: 'deg' }
    ],
    confidence: 0.88,
    timestamp: Date.now()
  },
  {
    id: 'place',
    name: 'Place Position',
    joints: [
      { name: 'base_rotation', angle: -90, min: -180, max: 180, unit: 'deg' },
      { name: 'shoulder', angle: -60, min: -90, max: 90, unit: 'deg' },
      { name: 'elbow', angle: 150, min: 0, max: 180, unit: 'deg' },
      { name: 'wrist_1', angle: 30, min: -180, max: 180, unit: 'deg' },
      { name: 'wrist_2', angle: 0, min: -180, max: 180, unit: 'deg' },
      { name: 'wrist_3', angle: 0, min: -180, max: 180, unit: 'deg' }
    ],
    confidence: 0.92,
    timestamp: Date.now()
  }
]

export const useRobotStore = create<RobotStore>((set, get) => ({
  // Initial state
  joints: defaultJoints,
  currentPose: null,
  savedPoses: defaultPoses,
  selectedPoseId: 'home',
  isLiveSimulation: false,
  showJointLabels: true,
  showEndEffector: true,
  cameraCalibration: {
    position: [0, 2, 5],
    rotation: [0, 0, 0],
    focalLength: 50,
    sensorSize: [36, 24]
  },
  poseEstimationError: null,
  confidence: 0.95,

  // Actions
  updateJoint: (jointName: string, angle: number) => {
    set(state => ({
      joints: state.joints.map(joint =>
        joint.name === jointName ? { ...joint, angle } : joint
      )
    }))
  },

  setCurrentPose: (pose: RobotPose) => {
    set({ currentPose: pose, joints: pose.joints })
  },

  addSavedPose: (pose: RobotPose) => {
    set(state => ({
      savedPoses: [...state.savedPoses, pose]
    }))
  },

  selectPose: (poseId: string) => {
    const state = get()
    const pose = state.savedPoses.find(p => p.id === poseId)
    if (pose) {
      set({ selectedPoseId: poseId, joints: pose.joints })
    }
  },

  toggleLiveSimulation: () => {
    set(state => ({ isLiveSimulation: !state.isLiveSimulation }))
  },

  toggleJointLabels: () => {
    set(state => ({ showJointLabels: !state.showJointLabels }))
  },

  toggleEndEffector: () => {
    set(state => ({ showEndEffector: !state.showEndEffector }))
  },

  updateCameraCalibration: (calibration: Partial<CameraCalibration>) => {
    set(state => ({
      cameraCalibration: { ...state.cameraCalibration, ...calibration }
    }))
  },

  setPoseEstimationError: (error: string | null) => {
    set({ poseEstimationError: error })
  },

  setConfidence: (confidence: number) => {
    set({ confidence })
  },

  resetToDefault: () => {
    set({
      joints: defaultJoints,
      currentPose: null,
      selectedPoseId: 'home',
      isLiveSimulation: false,
      poseEstimationError: null,
      confidence: 0.95
    })
  }
})) 