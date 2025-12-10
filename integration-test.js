/**
 * Comprehensive Integration Test for LockIn Application
 * Tests all phases from the manual testing plan
 */

const { chromium } = require('playwright');

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(80)}${colors.reset}`),
  phase: (msg) => console.log(`${colors.bright}${colors.blue}${msg}${colors.reset}`),
  pass: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  fail: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  detail: (msg) => console.log(`  ${msg}`),
};

let browser;
let page;
let consoleLogs = [];
let consoleErrors = [];
let testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  issues: [],
};

async function assert(condition, passMsg, failMsg) {
  if (condition) {
    log.pass(passMsg);
    testResults.passed++;
    return true;
  } else {
    log.fail(failMsg);
    testResults.failed++;
    testResults.issues.push(failMsg);
    return false;
  }
}

async function warn(condition, warnMsg) {
  if (!condition) {
    log.warn(warnMsg);
    testResults.warnings++;
    testResults.issues.push(`WARNING: ${warnMsg}`);
  }
}

async function setupBrowser() {
  log.phase('🚀 Setting up browser...');
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  page = await context.newPage();

  // Capture console logs
  page.on('console', (msg) => {
    const text = msg.text();
    consoleLogs.push(text);
    if (msg.type() === 'error') {
      consoleErrors.push(text);
    }
  });

  // Capture page errors
  page.on('pageerror', (error) => {
    consoleErrors.push(`Page error: ${error.message}`);
  });

  log.pass('Browser setup complete');
}

async function phase1_loadPage() {
  log.header();
  log.phase('📄 PHASE 1: Load Page and Verify Initial State');
  log.header();

  try {
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
    log.pass('Page loaded successfully');

    // Wait a moment for JavaScript to execute
    await page.waitForTimeout(1000);

    // Check page title
    const title = await page.title();
    await assert(
      title === 'Workout Timeline',
      'Page title is correct: "Workout Timeline"',
      `Page title incorrect. Expected "Workout Timeline", got "${title}"`
    );

    // Check main heading
    const heading = await page.locator('h1').textContent();
    await assert(
      heading.includes('Your Workout Timeline'),
      'Main heading is present and correct',
      `Main heading incorrect or missing. Got: "${heading}"`
    );

    // Check for mock mode text
    const mockModeText = await page.locator('text=Running in MOCK mode').count();
    await assert(
      mockModeText > 0,
      'Mock mode indicator text is visible',
      'Mock mode indicator text not found'
    );

    // Check for "Load Mock Workouts" button
    const signInButton = await page.locator('button:has-text("Load Mock Workouts")');
    const isVisible = await signInButton.isVisible();
    await assert(
      isVisible,
      '"Load Mock Workouts" button is visible',
      '"Load Mock Workouts" button not found or not visible'
    );

    // Check that Sign Out button is NOT visible initially
    const signOutButton = await page.locator('#signOutButton');
    const signOutVisible = await signOutButton.isVisible();
    await assert(
      !signOutVisible,
      'Sign Out button is hidden (as expected)',
      'Sign Out button should be hidden initially but is visible'
    );

    // Check that no workout data is visible
    const statsSection = await page.locator('#stats').count();
    const timelineSection = await page.locator('#timeline').count();
    await assert(
      statsSection === 0 || !(await page.locator('#stats').isVisible()),
      'Stats section is hidden initially',
      'Stats section should be hidden initially'
    );

  } catch (error) {
    log.fail(`Phase 1 failed with error: ${error.message}`);
    testResults.failed++;
    testResults.issues.push(`Phase 1 error: ${error.message}`);
  }
}

async function phase2_testSignIn() {
  log.header();
  log.phase('🔐 PHASE 2: Test Sign-In Flow');
  log.header();

  try {
    // Clear previous console logs
    const preSignInLogCount = consoleLogs.length;

    // Click the "Load Mock Workouts" button
    const signInButton = await page.locator('button:has-text("Load Mock Workouts")');
    await signInButton.click();
    log.info('Clicked "Load Mock Workouts" button');

    // Check for immediate console logs
    await page.waitForTimeout(200);
    const hasSigningInLog = consoleLogs.some(log => log.includes('Signing in'));
    await assert(
      hasSigningInLog,
      'Console log "Signing in..." appears',
      'Expected console log "Signing in..." not found'
    );

    const hasMockSignInLog = consoleLogs.some(log => log.includes('[MOCK] User signing in'));
    await assert(
      hasMockSignInLog,
      'Console log "[MOCK] User signing in..." appears',
      'Expected console log "[MOCK] User signing in..." not found'
    );

    // Wait for loading state
    await page.waitForTimeout(600);

    // Check if loading spinner appears
    const loadingSpinner = await page.locator('#loading');
    // Note: Spinner might disappear quickly, so we check if it was visible at any point
    log.info('Checking for loading state...');

    // Wait for data to load (mock delay is ~1.3 seconds total)
    await page.waitForTimeout(1500);

    // Check for successful sign-in logs
    const hasSignedInLog = consoleLogs.some(log => log.includes('[MOCK] User signed in successfully'));
    await assert(
      hasSignedInLog,
      'Console log "[MOCK] User signed in successfully" appears',
      'Expected console log about successful sign-in not found'
    );

    const hasMockDataLog = consoleLogs.some(log => log.includes('[MOCK API] Returning 30 mock workouts'));
    await assert(
      hasMockDataLog,
      'Console log "[MOCK API] Returning 30 mock workouts" appears',
      'Expected console log about mock data not found'
    );

    // Check state transition logs
    const hasLoadedState = consoleLogs.some(log => log.includes('State changed to: LOADED'));
    await assert(
      hasLoadedState,
      'State transitioned to LOADED',
      'State did not transition to LOADED'
    );

    // Verify Sign Out button is now visible
    await page.waitForTimeout(500);
    const signOutButton = await page.locator('#signOutButton');
    const signOutVisible = await signOutButton.isVisible();
    await assert(
      signOutVisible,
      'Sign Out button is now visible',
      'Sign Out button should be visible after sign-in'
    );

    // Verify "Load Mock Workouts" button is gone
    const loadButtonCount = await page.locator('button:has-text("Load Mock Workouts")').count();
    await assert(
      loadButtonCount === 0,
      '"Load Mock Workouts" button is removed after sign-in',
      '"Load Mock Workouts" button should be removed after sign-in'
    );

  } catch (error) {
    log.fail(`Phase 2 failed with error: ${error.message}`);
    testResults.failed++;
    testResults.issues.push(`Phase 2 error: ${error.message}`);
  }
}

async function phase3_testWorkoutDataDisplay() {
  log.header();
  log.phase('📊 PHASE 3: Test Workout Data Display');
  log.header();

  try {
    log.info('Testing Statistics Section...');

    // Check if stats section is visible
    const statsSection = await page.locator('#stats');
    const statsVisible = await statsSection.isVisible();
    await assert(
      statsVisible,
      'Statistics section is visible',
      'Statistics section should be visible after data loads'
    );

    if (statsVisible) {
      // Get all stat values
      const statCards = await page.locator('.stat-card').all();
      await assert(
        statCards.length === 3,
        `Found 3 stat cards (Total Workouts, Total Time, Most Active Day)`,
        `Expected 3 stat cards, found ${statCards.length}`
      );

      // Check total workouts (should be 30)
      const totalWorkoutsText = await page.locator('.stat-card').first().textContent();
      const hasThirty = totalWorkoutsText.includes('30');
      await assert(
        hasThirty,
        'Total workouts shows "30"',
        `Total workouts should show 30, got: "${totalWorkoutsText}"`
      );

      // Check total time (should have hours)
      const totalTimeText = await page.locator('.stat-card').nth(1).textContent();
      const hasHours = totalTimeText.includes('h') || totalTimeText.includes('hour');
      await assert(
        hasHours,
        'Total time displays hours correctly',
        `Total time should display hours, got: "${totalTimeText}"`
      );

      // Check most active day (should be a day name)
      const mostActiveDayText = await page.locator('.stat-card').nth(2).textContent();
      const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const hasDay = dayNames.some(day => mostActiveDayText.includes(day));
      await assert(
        hasDay,
        'Most active day shows a day name',
        `Most active day should show a day name, got: "${mostActiveDayText}"`
      );

      log.detail(`  Total Workouts: ${totalWorkoutsText.trim().split('\n')[0]}`);
      log.detail(`  Total Time: ${totalTimeText.trim().split('\n')[0]}`);
      log.detail(`  Most Active Day: ${mostActiveDayText.trim().split('\n')[0]}`);
    }

    log.info('Testing Timeline Section...');

    // Check if timeline section is visible
    const timelineSection = await page.locator('#timeline');
    const timelineVisible = await timelineSection.isVisible();
    await assert(
      timelineVisible,
      'Timeline section is visible',
      'Timeline section should be visible after data loads'
    );

    if (timelineVisible) {
      // Count workout items
      const workoutItems = await page.locator('.workout-item').all();
      const workoutCount = workoutItems.length;
      await assert(
        workoutCount === 30,
        `Found all 30 workout items in timeline`,
        `Expected 30 workout items, found ${workoutCount}`
      );

      log.detail(`  Total workout items rendered: ${workoutCount}`);

      // Check for date groups
      const dateGroups = await page.locator('.date-group').all();
      await assert(
        dateGroups.length > 0,
        `Found ${dateGroups.length} date groups`,
        'No date groups found in timeline'
      );

      // Sample a few workout items for quality checks
      if (workoutItems.length > 0) {
        const firstWorkout = workoutItems[0];
        const workoutText = await firstWorkout.textContent();

        // Check for icon (emoji)
        const hasIcon = /[🏃🧘🚴🏋️🏊🤸⚽🏀🎾]/.test(workoutText);
        await assert(
          hasIcon,
          'Workout items have activity icons',
          'Workout items should have activity type icons'
        );

        // Check for time format (e.g., "7:45 AM")
        const hasTime = /\d{1,2}:\d{2}\s*[AP]M/.test(workoutText);
        await assert(
          hasTime,
          'Workout items have formatted time (e.g., "7:45 AM")',
          'Workout items should have properly formatted time'
        );

        // Check for duration format (e.g., "45 min")
        const hasDuration = /\d+\s*(min|h)/.test(workoutText);
        await assert(
          hasDuration,
          'Workout items have formatted duration (e.g., "45 min")',
          'Workout items should have properly formatted duration'
        );

        log.detail(`  Sample workout item: ${workoutText.substring(0, 100)}...`);
      }

      // Check for "Mock Fitness App" source
      const hasMockSource = await page.locator('text=Mock Fitness App').count();
      await assert(
        hasMockSource > 0,
        'Workout items show source as "Mock Fitness App"',
        'Workout items should show "Mock Fitness App" as source'
      );
    }

  } catch (error) {
    log.fail(`Phase 3 failed with error: ${error.message}`);
    testResults.failed++;
    testResults.issues.push(`Phase 3 error: ${error.message}`);
  }
}

async function phase4_testSignOut() {
  log.header();
  log.phase('🚪 PHASE 4: Test Sign-Out Flow');
  log.header();

  try {
    // Click Sign Out button
    const signOutButton = await page.locator('#signOutButton');
    await signOutButton.click();
    log.info('Clicked Sign Out button');

    // Wait for sign-out to complete
    await page.waitForTimeout(500);

    // Check console logs for sign-out messages
    const hasSignOutLog = consoleLogs.some(log => log.includes('Signing out'));
    await assert(
      hasSignOutLog,
      'Console log "Signing out..." appears',
      'Expected console log "Signing out..." not found'
    );

    const hasMockSignOutLog = consoleLogs.some(log => log.includes('[MOCK] User signing out'));
    await assert(
      hasMockSignOutLog,
      'Console log "[MOCK] User signing out..." appears',
      'Expected console log about mock sign-out not found'
    );

    // Check state transition
    const hasSignedOutState = consoleLogs.some(log => log.includes('State changed to: SIGNED_OUT'));
    await assert(
      hasSignedOutState,
      'State transitioned back to SIGNED_OUT',
      'State did not transition to SIGNED_OUT'
    );

    // Verify "Load Mock Workouts" button is back
    const loadButtonVisible = await page.locator('button:has-text("Load Mock Workouts")').isVisible();
    await assert(
      loadButtonVisible,
      '"Load Mock Workouts" button is visible again',
      '"Load Mock Workouts" button should reappear after sign-out'
    );

    // Verify Sign Out button is hidden
    const signOutVisible = await signOutButton.isVisible();
    await assert(
      !signOutVisible,
      'Sign Out button is hidden again',
      'Sign Out button should be hidden after sign-out'
    );

    // Verify workout data is cleared
    const workoutItemsCount = await page.locator('.workout-item').count();
    await assert(
      workoutItemsCount === 0,
      'Workout data is cleared from UI',
      'Workout data should be cleared after sign-out'
    );

    log.info('Testing re-sign-in...');

    // Test re-sign-in
    const loadButton = await page.locator('button:has-text("Load Mock Workouts")');
    await loadButton.click();
    log.info('Clicked "Load Mock Workouts" button again');

    await page.waitForTimeout(2000);

    // Verify data loads again
    const workoutItemsAfterReSignIn = await page.locator('.workout-item').count();
    await assert(
      workoutItemsAfterReSignIn === 30,
      'Re-sign-in works correctly, data loads again',
      'Re-sign-in failed, data did not load properly'
    );

  } catch (error) {
    log.fail(`Phase 4 failed with error: ${error.message}`);
    testResults.failed++;
    testResults.issues.push(`Phase 4 error: ${error.message}`);
  }
}

async function phase5_testEdgeCases() {
  log.header();
  log.phase('🔧 PHASE 5: Test Edge Cases');
  log.header();

  try {
    // First, sign out to reset
    const signOutButton = await page.locator('#signOutButton');
    if (await signOutButton.isVisible()) {
      await signOutButton.click();
      await page.waitForTimeout(500);
    }

    log.info('Testing rapid button clicking...');

    // Rapid clicking test
    const loadButton = await page.locator('button:has-text("Load Mock Workouts")');
    await loadButton.click();
    await loadButton.click();
    await loadButton.click();
    log.info('Clicked button 3 times rapidly');

    await page.waitForTimeout(2000);

    // Check that only one load occurred (should have 30 workouts, not 90)
    const workoutCount = await page.locator('.workout-item').count();
    await assert(
      workoutCount === 30,
      'Rapid clicking handled correctly (no duplicate loads)',
      `Rapid clicking may have caused duplicate loads. Expected 30 workouts, got ${workoutCount}`
    );

    // Check for no errors
    const errorsSoFar = consoleErrors.filter(err => !err.includes('Webpack')).length;
    await assert(
      errorsSoFar === 0,
      'No console errors from rapid clicking',
      `Rapid clicking caused ${errorsSoFar} console errors`
    );

    log.info('Testing page refresh...');

    // Test page refresh
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Should be back to initial state
    const loadButtonAfterRefresh = await page.locator('button:has-text("Load Mock Workouts")').isVisible();
    await assert(
      loadButtonAfterRefresh,
      'Page refresh resets app to initial state',
      'Page should reset to initial state after refresh'
    );

    const workoutsAfterRefresh = await page.locator('.workout-item').count();
    await assert(
      workoutsAfterRefresh === 0,
      'No workout data persists after refresh',
      'Workout data should not persist after refresh'
    );

  } catch (error) {
    log.fail(`Phase 5 failed with error: ${error.message}`);
    testResults.failed++;
    testResults.issues.push(`Phase 5 error: ${error.message}`);
  }
}

async function phase6_testResponsive() {
  log.header();
  log.phase('📱 PHASE 6: Test Responsive Design');
  log.header();

  try {
    // Load the app with data
    const loadButton = await page.locator('button:has-text("Load Mock Workouts")');
    if (await loadButton.isVisible()) {
      await loadButton.click();
      await page.waitForTimeout(2000);
    }

    // Test mobile viewport (iPhone)
    log.info('Testing mobile viewport (375x667)...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Check if content is still visible and not overflowing
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    await assert(
      bodyWidth <= 375,
      'No horizontal scrolling on mobile (375px width)',
      `Horizontal scrolling detected on mobile. Body width: ${bodyWidth}px`
    );

    // Check if stats are visible
    const statsVisibleMobile = await page.locator('#stats').isVisible();
    await assert(
      statsVisibleMobile,
      'Stats section visible on mobile',
      'Stats section should be visible on mobile'
    );

    // Test tablet viewport (iPad)
    log.info('Testing tablet viewport (768x1024)...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    const bodyWidthTablet = await page.evaluate(() => document.body.scrollWidth);
    await assert(
      bodyWidthTablet <= 768,
      'No horizontal scrolling on tablet (768px width)',
      `Horizontal scrolling detected on tablet. Body width: ${bodyWidthTablet}px`
    );

    // Test desktop viewport
    log.info('Testing desktop viewport (1280x720)...');
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);

    const statsVisibleDesktop = await page.locator('#stats').isVisible();
    await assert(
      statsVisibleDesktop,
      'Stats section visible on desktop',
      'Stats section should be visible on desktop'
    );

  } catch (error) {
    log.fail(`Phase 6 failed with error: ${error.message}`);
    testResults.failed++;
    testResults.issues.push(`Phase 6 error: ${error.message}`);
  }
}

async function phase7_checkConsoleAndPerformance() {
  log.header();
  log.phase('🔍 PHASE 7: Check Console Cleanliness & Performance');
  log.header();

  try {
    // Filter out webpack/HMR related logs
    const relevantErrors = consoleErrors.filter(err =>
      !err.includes('Webpack') &&
      !err.includes('HMR') &&
      !err.includes('[webpack-dev-server]')
    );

    await assert(
      relevantErrors.length === 0,
      'No console errors (excluding Webpack/dev server)',
      `Found ${relevantErrors.length} console errors:\n  ${relevantErrors.join('\n  ')}`
    );

    // Check for expected console logs
    const hasConfigLogs = consoleLogs.some(log => log.includes('USE_MOCKS'));
    await assert(
      hasConfigLogs,
      'Configuration logs are present',
      'Expected configuration logs not found'
    );

    const hasServiceFactoryLogs = consoleLogs.some(log =>
      log.includes('MockAuthService') || log.includes('Mock Auth Service')
    );
    await assert(
      hasServiceFactoryLogs,
      'Service factory logs show mock services',
      'Service factory logs should indicate mock services are being used'
    );

    // Check for clean console (no unexpected warnings)
    log.info('Checking for unexpected warnings...');
    const warnings = consoleLogs.filter(log =>
      log.includes('warning') ||
      log.includes('deprecated') ||
      log.toLowerCase().includes('failed')
    ).filter(log =>
      !log.includes('Webpack') &&
      !log.includes('[webpack-dev-server]')
    );

    await warn(
      warnings.length === 0,
      `Found ${warnings.length} warnings in console`
    );

    // Log some stats
    log.info(`Total console logs captured: ${consoleLogs.length}`);
    log.info(`Total console errors: ${relevantErrors.length}`);
    log.info(`Warnings: ${warnings.length}`);

  } catch (error) {
    log.fail(`Phase 7 failed with error: ${error.message}`);
    testResults.failed++;
    testResults.issues.push(`Phase 7 error: ${error.message}`);
  }
}

async function generateReport() {
  log.header();
  log.phase('📋 INTEGRATION TEST REPORT');
  log.header();

  const total = testResults.passed + testResults.failed;
  const passRate = total > 0 ? ((testResults.passed / total) * 100).toFixed(1) : 0;

  console.log(`\n${colors.bright}Summary:${colors.reset}`);
  console.log(`  Total Tests: ${total}`);
  console.log(`  ${colors.green}Passed: ${testResults.passed}${colors.reset}`);
  console.log(`  ${colors.red}Failed: ${testResults.failed}${colors.reset}`);
  console.log(`  ${colors.yellow}Warnings: ${testResults.warnings}${colors.reset}`);
  console.log(`  Pass Rate: ${passRate}%`);

  if (testResults.issues.length > 0) {
    console.log(`\n${colors.bright}${colors.red}Issues Found:${colors.reset}`);
    testResults.issues.forEach((issue, index) => {
      console.log(`  ${index + 1}. ${issue}`);
    });
  } else {
    console.log(`\n${colors.green}${colors.bright}🎉 All tests passed! No issues found.${colors.reset}`);
  }

  log.header();

  // Exit code based on results
  return testResults.failed === 0 ? 0 : 1;
}

async function runAllTests() {
  try {
    await setupBrowser();
    await phase1_loadPage();
    await phase2_testSignIn();
    await phase3_testWorkoutDataDisplay();
    await phase4_testSignOut();
    await phase5_testEdgeCases();
    await phase6_testResponsive();
    await phase7_checkConsoleAndPerformance();

    const exitCode = await generateReport();

    if (browser) {
      await browser.close();
    }

    process.exit(exitCode);
  } catch (error) {
    log.fail(`Fatal error: ${error.message}`);
    console.error(error);
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

// Run the tests
runAllTests();
