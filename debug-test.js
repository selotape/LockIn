/**
 * Debug Test - Take screenshot and capture console logs
 */

const { chromium } = require('playwright');

async function debug() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Capture all console messages
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  // Capture page errors
  page.on('pageerror', error => {
    consoleLogs.push(`[PAGE ERROR] ${error.message}`);
  });

  // Navigate to the page
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });

  // Wait a bit for JavaScript to execute
  await page.waitForTimeout(2000);

  // Take screenshot
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
  console.log('✓ Screenshot saved to debug-screenshot.png');

  // Get page HTML
  const html = await page.content();
  console.log('\n========== PAGE HTML ==========');
  console.log(html.substring(0, 1000) + '...');

  // Check for specific elements
  console.log('\n========== ELEMENT CHECK ==========');
  const signInDiv = await page.locator('#signInDiv').innerHTML().catch(() => null);
  console.log('signInDiv content:', signInDiv ? signInDiv.substring(0, 200) : 'NOT FOUND');

  const mockButton = await page.locator('button:has-text("Load Mock Workouts")').count();
  console.log('Mock button count:', mockButton);

  // Print all console logs
  console.log('\n========== CONSOLE LOGS (' + consoleLogs.length + ' total) ==========');
  consoleLogs.forEach(log => console.log(log));

  // Check loaded scripts
  const scripts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('script')).map(s => s.src || '[inline]');
  });
  console.log('\n========== LOADED SCRIPTS ==========');
  scripts.forEach(script => console.log(script));

  await browser.close();
}

debug().catch(console.error);
