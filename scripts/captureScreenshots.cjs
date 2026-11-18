const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve(__dirname, '../docs/screenshots');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function checkServer(port = 3000) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function ensureServerRunning(port = 3000) {
  const isRunning = await checkServer(port);
  if (isRunning) {
    console.log(`Server already running on port ${port}.`);
    return null;
  }

  console.log(`Starting preview server on port ${port}...`);
  const serverProc = spawn('npm', ['run', 'preview', '--', '--port', String(port)], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'ignore',
    shell: true,
  });

  // Wait for server to come up
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 500));
    const up = await checkServer(port);
    if (up) {
      console.log(`Preview server is now live on port ${port}!`);
      return serverProc;
    }
  }

  throw new Error('Failed to start server on port ' + port);
}

async function run() {
  const serverProc = await ensureServerRunning(3000);

  const profileDir = path.join(os.tmpdir(), 'campushub_pau_chrome_' + Date.now());
  console.log('Launching browser with isolated temp profile in:', profileDir);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    userDataDir: profileDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1440,900',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1440,
    height: 900,
    deviceScaleFactor: 2, // Retina 2x scale
  });

  const url = 'http://localhost:3000';
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 1000)));

  // Accept cookie banner to keep screenshots clean
  try {
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find((b) => b.textContent && b.textContent.includes('Acknowledge & Accept'));
      if (btn) btn.click();
    });
  } catch (e) {}

  await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));

  // 1. Screenshot: 01-catalog-and-rbac-navbar.png
  console.log('Capturing 01-catalog-and-rbac-navbar.png...');
  await page.screenshot({
    path: path.join(outputDir, '01-catalog-and-rbac-navbar.png'),
    fullPage: false,
  });

  // 2. Screenshot: 02-uc01-supervising-lecturer-rule.png
  console.log('Capturing 02-uc01-supervising-lecturer-rule.png...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const labTab = btns.find((b) => b.textContent && b.textContent.includes('Lab Equipment'));
    if (labTab) labTab.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));

  // Click "Book Resource" on Agilent Cary 60
  await page.evaluate(() => {
    const bookBtns = Array.from(document.querySelectorAll('button')).filter(
      (b) => b.textContent && b.textContent.includes('Book Resource')
    );
    if (bookBtns.length > 0) bookBtns[0].click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));

  await page.screenshot({
    path: path.join(outputDir, '02-uc01-supervising-lecturer-rule.png'),
    fullPage: false,
  });

  // Close booking modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cancelBtn = btns.find((b) => b.textContent && b.textContent.trim() === 'Cancel');
    if (cancelBtn) cancelBtn.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

  // 3. Screenshot: 03-uc02-staff-approval-and-rejection.png
  console.log('Capturing 03-uc02-staff-approval-and-rejection.png...');
  // Switch role to Facility Manager
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const mgrBtn = btns.find((b) => b.textContent && b.textContent.includes('Facility Mgr'));
    if (mgrBtn) mgrBtn.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

  // Click on "Staff Approvals" tab in nav
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const approvalsNav = btns.find((b) => b.textContent && b.textContent.includes('Staff Approvals'));
    if (approvalsNav) approvalsNav.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));

  // Click "Reject" on the pending booking
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const rejectBtn = btns.find((b) => b.textContent && b.textContent.trim() === 'Reject');
    if (rejectBtn) rejectBtn.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));

  await page.screenshot({
    path: path.join(outputDir, '03-uc02-staff-approval-and-rejection.png'),
    fullPage: false,
  });

  // Cancel rejection dialog
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cancelBtn = btns.find((b) => b.textContent && b.textContent.trim() === 'Cancel');
    if (cancelBtn) cancelBtn.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

  // 4. Screenshot: 04-uc03-waitlist-15min-slot-offer.png
  console.log('Capturing 04-uc03-waitlist-15min-slot-offer.png...');
  // Navigate to "My Bookings & Fines"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nav = btns.find((b) => b.textContent && b.textContent.includes('My Bookings & Fines'));
    if (nav) nav.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));

  // Cancel a booking with waiting queue
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cancelBtn = btns.find((b) => b.textContent && b.textContent.includes('Cancel (with 5s Undo)'));
    if (cancelBtn) cancelBtn.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));

  await page.screenshot({
    path: path.join(outputDir, '04-uc03-waitlist-15min-slot-offer.png'),
    fullPage: false,
  });

  // 5. Screenshot: 05-uc04-lab-equipment-statechart.png
  console.log('Capturing 05-uc04-lab-equipment-statechart.png...');
  // Switch role to Lab Tech
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const techBtn = btns.find((b) => b.textContent && b.textContent.includes('Lab Tech'));
    if (techBtn) techBtn.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

  // Click on "Lab Statechart (UC-04)" tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const labNav = btns.find((b) => b.textContent && b.textContent.includes('Lab Statechart'));
    if (labNav) labNav.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));

  // Open "Inspect Return (UC-04)"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const inspectBtn = btns.find((b) => b.textContent && b.textContent.includes('Inspect Return'));
    if (inspectBtn) inspectBtn.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));

  // Select "Damaged («extend»)" option
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const damagedBtn = btns.find((b) => b.textContent && b.textContent.includes('Damaged'));
    if (damagedBtn) damagedBtn.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));

  await page.screenshot({
    path: path.join(outputDir, '05-uc04-lab-equipment-statechart.png'),
    fullPage: false,
  });

  // Close inspection modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cancelBtn = btns.find((b) => b.textContent && b.textContent.trim() === 'Cancel');
    if (cancelBtn) cancelBtn.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

  // 6. Screenshot: 06-uc05-polymorphic-fine-simulator.png
  console.log('Capturing 06-uc05-polymorphic-fine-simulator.png...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const simNav = btns.find((b) => b.textContent && b.textContent.includes('Polymorphic Simulator'));
    if (simNav) simNav.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));

  // Set the slider value to 27 hours
  await page.evaluate(() => {
    const slider = document.querySelector('input[type="range"]');
    if (slider) {
      slider.value = 27;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));

  await page.screenshot({
    path: path.join(outputDir, '06-uc05-polymorphic-fine-simulator.png'),
    fullPage: false,
  });

  // 7. Screenshot: 07-command-palette-and-dark-mode.png
  console.log('Capturing 07-command-palette-and-dark-mode.png...');
  // Toggle dark mode
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const themeBtn = btns.find(
      (b) => b.getAttribute('title') && b.getAttribute('title').includes('Dark Mode')
    );
    if (themeBtn) themeBtn.click();
    else document.documentElement.classList.add('dark');
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

  // Open Command Palette
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cmdBtn = btns.find((b) => b.textContent && b.textContent.includes('K'));
    if (cmdBtn) cmdBtn.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));

  await page.screenshot({
    path: path.join(outputDir, '07-command-palette-and-dark-mode.png'),
    fullPage: false,
  });

  // Close Command Palette and switch back to light mode
  await page.keyboard.press('Escape');
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

  // 8. Screenshot: 08-audit-log-and-architecture-inspector.png
  console.log('Capturing 08-audit-log-and-architecture-inspector.png...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const archNav = btns.find((b) => b.textContent && b.textContent.includes('OOAD Architecture'));
    if (archNav) archNav.click();
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));

  await page.screenshot({
    path: path.join(outputDir, '08-audit-log-and-architecture-inspector.png'),
    fullPage: false,
  });

  console.log('All 8 high-resolution screenshots captured successfully!');
  await browser.close();

  if (serverProc) {
    serverProc.kill();
  }
}

run().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
