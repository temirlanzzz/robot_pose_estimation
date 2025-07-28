#  Robot Pose Visualizer

A React + Three.js web application for visualizing robot arm poses with perception workflow features.


###  Features
- **3D Robot Visualization**: Interactive 6-joint industrial robot arm
- **Real-time Pose Estimation**: Live confidence scoring and error handling
- **Joint Control**: Manual adjustment of all 6 joints with sliders
- **Pose Library**: Pre-configured poses (Home, Pick, Place) with confidence scores
- **Camera Calibration**: Simulated camera calibration workflow
- **Export Functionality**: Export pose data to JSON/URDF format
- **Error State Handling**: Visual error indicators and low confidence warnings
- **Live Simulation**: Animated sine wave joint movements
- **Confidence Scoring**: Real-time confidence visualization with color coding


### Tech Stack
- **React 18**: Modern React with hooks
- **Three.js**: 3D graphics and rendering
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Useful helpers for Three.js
- **Zustand**: Lightweight state management
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
