// Optional browser regression check; run against npm run dev.
const { chromium } = require("@playwright/test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
let browser;
(async () => {
  browser = await chromium.launch({
    headless: true,
    args: [
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
    reducedMotion: "reduce",
  });
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:3000/robot_pose_estimation/");
  await page
    .getByRole("heading", { name: "Every angle. Understood." })
    .waitFor();
  await page.getByRole("button", { name: "Fold", exact: true }).click();
  assert.equal(
    await page.getByRole("spinbutton", { name: "Elbow degrees" }).inputValue(),
    "-145",
  );
  await page
    .getByRole("button", { name: "Target position", exact: true })
    .click();
  await page.getByRole("button", { name: "Solve inverse kinematics" }).click();
  await page.getByRole("status").filter({ hasText: "Solved." }).waitFor();
  await page.getByLabel("Target X", { exact: true }).fill("5");
  assert.ok(
    await page
      .getByRole("button", { name: "Solve inverse kinematics" })
      .isDisabled(),
  );
  await page.getByRole("button", { name: "Use current tool position" }).click();
  assert.ok(
    await page
      .getByRole("button", { name: "Solve inverse kinematics" })
      .isEnabled(),
  );
  for (const label of ["Robot URDF", "Pose JSON"]) {
    const wait = page.waitForEvent("download");
    await page.getByRole("button", { name: label }).click();
    const download = await wait;
    const body = await fs.readFile(await download.path(), "utf8");
    if (label === "Robot URDF") assert.match(body, /<robot name="axis_3r">/);
    else assert.equal(JSON.parse(body).units.joints, "radians");
  }
  await page.getByRole("button", { name: "Joint angles", exact: true }).click();
  await page.getByRole("button", { name: "Ready", exact: true }).click();
  const viewportBox = await page.locator(".viewport").boundingBox();
  const canvasBox = await page.locator(".viewport canvas").boundingBox();
  assert.ok(viewportBox && canvasBox);
  assert.ok(
    Math.abs(viewportBox.height - canvasBox.height) < 2,
    "Canvas fills the viewport panel",
  );
  await page.screenshot({ path: "axis-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  );
  await page.screenshot({ path: "axis-mobile.png", fullPage: true });
  assert.deepEqual(errors, []);
  await browser.close();
})().catch(async (error) => {
  await browser?.close();
  console.error(error);
  process.exitCode = 1;
});
