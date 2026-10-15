# AXIS — Kinematics Lab

An interactive, browser-local robotics study: manipulate a three-revolute-joint arm, inspect Cartesian position, solve inverse kinematics, and export an actual robot description.

## What works

- A Three.js scene with orbit/zoom, reset camera, tool-center projection, world axes, and an optional outer reach sphere.
- Joint sliders and numeric inputs with enforced limits, plus four useful preset poses.
- Analytic forward kinematics for base yaw and a two-link planar arm.
- Analytic inverse kinematics over both elbow configurations and signed radial solutions; chooses the valid solution nearest the current joint angles. Unreachable targets do not change the arm.
- Live X/Y/Z position and measured distance to the target, with singularity guidance.
- Download a visual URDF model (real XML), and a separate JSON pose snapshot in radians/meters.
- Responsive controls, keyboard support, reduced-motion behavior, and a numerical-controls fallback when WebGL fails.

## Model / conventions

AX–03 is a deliberately simple educational 3R model. Base height: 0.28 m; upper arm: 0.72 m; forearm: 0.58 m. Right-handed world coordinates: X forward, Y left, Z up. Joint values are displayed in degrees; URDF and JSON use SI units. Shoulder and elbow rotate about local negative Y so positive angles lift the arm.

Limits: yaw [-180, 180]°, shoulder [-100, 140]°, elbow [-150, 150]°. IK controls position only, not arbitrary end-effector orientation. The optional sphere is an outer reach bound, **not** the full joint-limited reachable workspace. Singularity guidance uses elbow alignment; it is not a complete Jacobian condition-number calculation.

This is **not** pose estimation, sensor calibration, a physical simulation, or hardware control. There is no invented confidence score. URDF includes visuals, joint axes and limits; it intentionally does not include inertial or collision models. This model is not suitable for commanding real machinery without additional engineering and validation.

## Development

Node.js 24+ (native TypeScript stripping is used by the numerical tests):

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run lint
npm run build
```

Vite serves at `http://localhost:3000/robot_pose_estimation/`. The production base remains `/robot_pose_estimation/` for GitHub Pages. Deployment runs type checks, numerical tests, lint and a build before publishing.

The deterministic suite checks reference poses, 1,331 FK→IK round trips across joint ranges, unreachable/invalid targets, singular endpoints, and URDF structure. `tests/browser.cjs` provides optional Playwright interaction and responsive checks against a running server; install Playwright and Chromium in your environment, then run `node tests/browser.cjs`.

## Design / attribution

The visual language is a graphite engineering instrument with amber controls and quiet mint telemetry. The intro uses the actual **AnimatedContent** component from [React Bits](https://reactbits.dev/animations/animated-content), sourced from [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Animations/AnimatedContent/AnimatedContent.tsx). Its built-in reduced-motion behavior is preserved. Source and the full MIT + Commons Clause license are vendored in `src/components/reactbits/`; Copyright © 2026 David Haz. It is used as part of this application, not redistributed as a component product.

UI fonts: DM Sans and IBM Plex Mono with local system fallbacks. All model calculations and exports run locally; Google Fonts may be fetched for typography. No application state is uploaded.

## Verification

Type checks, lint, seven numerical tests, production build, and desktop/mobile Playwright checks passed in [GitHub Actions run 38814229703](https://github.com/temirlanzzz/robot_pose_estimation/actions/runs/38814229703) for commit `6962bc6`. Browser checks exercised presets, reachable/unreachable IK, current-position targeting, URDF/JSON downloads, and mobile overflow. Desktop and mobile screenshot artifacts were produced and visually reviewed; the Three.js scene rendered correctly using software WebGL.

Local Chromium startup was blocked by the implementation environment's managed Unix-socket policy, so browser verification was performed on GitHub Actions rather than claimed locally. The production build reports a size warning for the Three.js vendor chunk.

## Dependency security

On 2026-10-15, a full `npm audit` (including development dependencies) reported **zero vulnerabilities** after updating to Vite 7.3.7, the compatible React plugin, and patched transitive packages. The unused `gh-pages` CLI was removed; publication uses the existing main-only GitHub Actions workflow. CI rejects high/critical npm advisories.

The prior findings primarily affected development/build tools (Vite, PostCSS, YAML and glob parsers). The deployed artifact is static and runs no Vite server. The app does not accept uploaded source, CSS, ZIP archives, or glob expressions, but those dependencies were remediated rather than relying on limited runtime exposure. Audit results are a point-in-time dependency check, not a complete security assessment.
