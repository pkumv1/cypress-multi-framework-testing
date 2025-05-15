const { test, expect } = require('@playwright/test');

test.describe('Actions Module', () => {
  // Setup for each test - visit the actions page
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/commands/actions');
  });

  test('TC-A-001: .type() - Type into a DOM element', async ({ page }) => {
    // Type text into email field
    await page.locator('.action-email').fill('fake@email.com');
    
    // Verify text was entered correctly
    await expect(page.locator('.action-email')).toHaveValue('fake@email.com');
    
    // Clear the field with special characters
    await page.locator('.action-email').press('Control+a');
    await page.locator('.action-email').press('Delete');
    
    // Type with delay
    await page.locator('.action-email').fill('slow.typing@email.com', { delay: 100 });
    await expect(page.locator('.action-email')).toHaveValue('slow.typing@email.com');
    
    // Type in disabled field with force option
    await page.locator('.action-disabled').fill('disabled error checking', { force: true });
    await expect(page.locator('.action-disabled')).toHaveValue('disabled error checking');
  });

  test('TC-A-002: .focus() - Focus on a DOM element', async ({ page }) => {
    // Focus on the element
    await page.locator('.action-focus').focus();
    
    // Verify the element has the focus class
    await expect(page.locator('.action-focus')).toHaveClass('focus');
    
    // Verify the previous element has the expected style
    const prevEl = page.locator('.action-focus').locator('xpath=../preceding-sibling::label');
    await expect(prevEl).toHaveAttribute('style', 'color: orange;');
  });

  test('TC-A-003: .blur() - Blur off a DOM element', async ({ page }) => {
    // Type into the element
    await page.locator('.action-blur').fill('About to blur');
    
    // Trigger blur
    await page.locator('.action-blur').blur();
    
    // Verify the element has the error class
    await expect(page.locator('.action-blur')).toHaveClass('error');
    
    // Verify the previous element has the expected style
    const prevEl = page.locator('.action-blur').locator('xpath=../preceding-sibling::label');
    await expect(prevEl).toHaveAttribute('style', 'color: red;');
  });

  test('TC-A-004: .clear() - Clear an input or textarea element', async ({ page }) => {
    // Type text into the field
    await page.locator('.action-clear').fill('Clear this text');
    
    // Verify text was entered correctly
    await expect(page.locator('.action-clear')).toHaveValue('Clear this text');
    
    // Clear the field
    await page.locator('.action-clear').clear();
    
    // Verify the field is empty
    await expect(page.locator('.action-clear')).toHaveValue('');
  });

  test('TC-A-005: .submit() - Submit a form', async ({ page }) => {
    // Type in the form field
    await page.locator('.action-form [type="text"]').fill('HALFOFF');
    
    // Submit the form
    await page.locator('.action-form').evaluate(form => form.submit());
    
    // Verify the confirmation message
    await expect(page.locator('.action-form').locator('xpath=following-sibling::div'))
      .toContainText('Your form has been submitted!');
  });

  test('TC-A-006: .click() - Click on a DOM element', async ({ page }) => {
    // Click on the action button
    await page.locator('.action-btn').click();
    
    // Click on the canvas element in different positions
    await page.locator('#action-canvas').click(); // center by default
    
    // Click on specific coordinates of the canvas
    await page.locator('#action-canvas').click({
      position: { x: 80, y: 75 }
    });
    
    // Click on multiple elements - in Playwright this can be done with a loop
    const labels = page.locator('.action-labels>.label');
    const count = await labels.count();
    for (let i = 0; i < count; i++) {
      await labels.nth(i).click();
    }
    
    // Click with force option
    await page.locator('.action-opacity>.btn').click({ force: true });
  });

  test('TC-A-007: .dblclick() - Double click on a DOM element', async ({ page }) => {
    // Double click on the element
    await page.locator('.action-div').dblclick();
    
    // Verify the div is hidden
    await expect(page.locator('.action-div')).toBeHidden();
    
    // Verify the input is visible
    await expect(page.locator('.action-input-hidden')).toBeVisible();
  });

  test('TC-A-008: .rightclick() - Right click on a DOM element', async ({ page }) => {
    // Right click on the element
    await page.locator('.rightclick-action-div').click({ button: 'right' });
    
    // Verify the div is hidden
    await expect(page.locator('.rightclick-action-div')).toBeHidden();
    
    // Verify the input is visible
    await expect(page.locator('.rightclick-action-input-hidden')).toBeVisible();
  });

  test('TC-A-009: .check() - Check a checkbox or radio element', async ({ page }) => {
    // Check all enabled checkboxes
    const checkboxes = page.locator('.action-checkboxes [type="checkbox"]').filter({ has: page.locator(':not([disabled])') });
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).check();
    }
    
    // Verify all enabled checkboxes are checked
    for (let i = 0; i < count; i++) {
      await expect(checkboxes.nth(i)).toBeChecked();
    }
    
    // Check radio by value
    await page.locator('.action-radios [type="radio"][value="radio1"]').check();
    await expect(page.locator('.action-radios [type="radio"][value="radio1"]')).toBeChecked();
    
    // Check multiple checkboxes
    await page.locator('.action-multiple-checkboxes [type="checkbox"][value="checkbox1"]').check();
    await page.locator('.action-multiple-checkboxes [type="checkbox"][value="checkbox2"]').check();
    
    // Verify they're checked
    await expect(page.locator('.action-multiple-checkboxes [type="checkbox"][value="checkbox1"]')).toBeChecked();
    await expect(page.locator('.action-multiple-checkboxes [type="checkbox"][value="checkbox2"]')).toBeChecked();
    
    // Check disabled checkbox with force
    await page.locator('.action-checkboxes [disabled]').check({ force: true });
    await expect(page.locator('.action-checkboxes [disabled]')).toBeChecked();
  });

  test('TC-A-010: .uncheck() - Uncheck a checkbox element', async ({ page }) => {
    // First, check the boxes then uncheck
    await page.locator('.action-check [type="checkbox"]').first().check();
    await page.locator('.action-check [type="checkbox"]').first().uncheck();
    
    // Verify it's unchecked
    await expect(page.locator('.action-check [type="checkbox"]').first()).not.toBeChecked();
    
    // Check specific checkbox by value, then uncheck
    await page.locator('.action-check [type="checkbox"][value="checkbox1"]').check();
    await expect(page.locator('.action-check [type="checkbox"][value="checkbox1"]')).toBeChecked();
    await page.locator('.action-check [type="checkbox"][value="checkbox1"]').uncheck();
    await expect(page.locator('.action-check [type="checkbox"][value="checkbox1"]')).not.toBeChecked();
    
    // Check multiple, then uncheck multiple
    await page.locator('.action-check [type="checkbox"][value="checkbox1"]').check();
    await page.locator('.action-check [type="checkbox"][value="checkbox3"]').check();
    
    await page.locator('.action-check [type="checkbox"][value="checkbox1"]').uncheck();
    await page.locator('.action-check [type="checkbox"][value="checkbox3"]').uncheck();
    
    // Verify they're unchecked
    await expect(page.locator('.action-check [type="checkbox"][value="checkbox1"]')).not.toBeChecked();
    await expect(page.locator('.action-check [type="checkbox"][value="checkbox3"]')).not.toBeChecked();
    
    // Uncheck disabled with force
    await page.locator('.action-check [disabled]').check({ force: true });
    await page.locator('.action-check [disabled]').uncheck({ force: true });
    await expect(page.locator('.action-check [disabled]')).not.toBeChecked();
  });

  test('TC-A-011: .select() - Select an option in a <select> element', async ({ page }) => {
    // Verify initial state
    await expect(page.locator('.action-select')).toHaveValue('--Select a fruit--');
    
    // Select option by text
    await page.locator('.action-select').selectOption('apples');
    await expect(page.locator('.action-select')).toHaveValue('fr-apples');
    
    // Select multiple options by text
    await page.locator('.action-select-multiple').selectOption(['apples', 'oranges', 'bananas']);
    
    // Verify multiple selections (using evaluate to get array of values)
    const values = await page.locator('.action-select-multiple').evaluate(select => Array.from(select.selectedOptions).map(option => option.value));
    expect(values).toEqual(['fr-apples', 'fr-oranges', 'fr-bananas']);
    
    // Select by value
    await page.locator('.action-select').selectOption('fr-bananas');
    await expect(page.locator('.action-select')).toHaveValue('fr-bananas');
  });

  test('TC-A-012: .scrollIntoView() - Scroll an element into view', async ({ page }) => {
    // Check button is not visible
    const horizontalButton = page.locator('#scroll-horizontal button');
    
    // Scroll button into view
    await horizontalButton.scrollIntoViewIfNeeded();
    
    // Verify button is now visible
    await expect(horizontalButton).toBeVisible();
    
    // Repeat for vertical scrolling
    const verticalButton = page.locator('#scroll-vertical button');
    await verticalButton.scrollIntoViewIfNeeded();
    await expect(verticalButton).toBeVisible();
    
    // Repeat for both directions
    const bothButton = page.locator('#scroll-both button');
    await bothButton.scrollIntoViewIfNeeded();
    await expect(bothButton).toBeVisible();
  });

  test('TC-A-013: .trigger() - Trigger an event on a DOM element', async ({ page }) => {
    // Set the range input value
    await page.locator('.trigger-input-range').evaluate(el => {
      el.value = 25;
      el.dispatchEvent(new Event('change'));
    });
    
    // Verify the displayed value updates
    await expect(page.locator('.trigger-input-range').locator('xpath=following-sibling::p')).toHaveText('25');
  });

  test('TC-A-014: cy.scrollTo() - Scroll the window or element to a position', async ({ page }) => {
    // Scroll window to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Scroll horizontal element to right
    await page.locator('#scrollable-horizontal').evaluate(el => el.scrollLeft = el.scrollWidth);
    
    // Scroll to specific coordinates
    await page.locator('#scrollable-vertical').evaluate(el => el.scrollTo(250, 250));
    
    // Scroll to percentage
    await page.locator('#scrollable-both').evaluate(el => {
      el.scrollLeft = el.scrollWidth * 0.75;
      el.scrollTop = el.scrollHeight * 0.25;
    });
  });

  test('TC-A-101: Actions Module Accessibility', async ({ page }) => {
    // Load axe-core from CDN
    await page.addScriptTag({
      url: 'https://cdn.jsdelivr.net/npm/axe-core@4.7.0/axe.min.js'
    });

    // Run accessibility audit
    const accessibilityViolations = await page.evaluate(async () => {
      return await new Promise(resolve => {
        window.axe.run({
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa']
          }
        }, (err, results) => {
          if (err) throw err;
          resolve(results.violations);
        });
      });
    });

    // Log violations if any
    if (accessibilityViolations.length > 0) {
      console.log('Accessibility violations:', accessibilityViolations);
    }

    // Assert no critical issues
    expect(accessibilityViolations.filter(v => v.impact === 'critical').length).toBe(0);
  });

  test('TC-A-201: Actions Module Input Validation', async ({ page }) => {
    // Test XSS attack vector
    const xssScript = '<script>alert("XSS")</script>';
    
    // Input potential XSS in email field
    await page.locator('.action-email').fill(xssScript);
    
    // Get the actual value (which should be sanitized or escaped if implemented correctly)
    const actualValue = await page.locator('.action-email').inputValue();
    
    // Check the value doesn't contain executable script tags
    expect(actualValue).not.toBe('<script>alert("XSS")</script>');
    expect(await page.evaluate(() => window.isXssExecuted)).toBeFalsy();
  });

  test('TC-A-301: Actions Module Performance', async ({ page }) => {
    // Measure response time for typing
    const typeStart = Date.now();
    await page.locator('.action-email').fill('performance@test.com');
    const typeEnd = Date.now();
    const typeDuration = typeEnd - typeStart;
    
    // Log typing performance
    console.log(`Type operation took ${typeDuration}ms`);
    
    // Typing should be reasonably quick
    expect(typeDuration).toBeLessThan(1000);
    
    // Measure click performance
    const clickStart = Date.now();
    await page.locator('.action-btn').click();
    const clickEnd = Date.now();
    const clickDuration = clickEnd - clickStart;
    
    // Log click performance
    console.log(`Click operation took ${clickDuration}ms`);
    
    // Clicking should be very quick
    expect(clickDuration).toBeLessThan(500);
  });
});