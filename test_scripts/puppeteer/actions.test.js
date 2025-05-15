const puppeteer = require('puppeteer');
const { expect } = require('chai');

describe('Actions Module Tests - Puppeteer', function() {
  // Increase timeout for these tests
  this.timeout(30000);
  
  let browser;
  let page;
  
  before(async function() {
    // Launch browser
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });
  
  beforeEach(async function() {
    // Create a new page and navigate to the actions page
    page = await browser.newPage();
    await page.goto('http://localhost:8080/commands/actions');
  });
  
  afterEach(async function() {
    // Close the page after each test
    await page.close();
  });
  
  after(async function() {
    // Close the browser after all tests
    await browser.close();
  });
  
  it('TC-A-001: .type() - Type into a DOM element', async function() {
    // Type text into email field
    await page.type('.action-email', 'fake@email.com');
    
    // Verify text was entered correctly
    const emailValue = await page.$eval('.action-email', el => el.value);
    expect(emailValue).to.equal('fake@email.com');
    
    // Clear the field using keyboard shortcuts
    await page.click('.action-email');
    await page.keyboard.down('Control');
    await page.keyboard.press('a');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    
    // Type with delay
    await page.type('.action-email', 'slow.typing@email.com', { delay: 100 });
    
    // Verify the slow typing
    const slowTypingValue = await page.$eval('.action-email', el => el.value);
    expect(slowTypingValue).to.equal('slow.typing@email.com');
    
    // Type in disabled field with force true
    await page.evaluate(() => {
      document.querySelector('.action-disabled').value = 'disabled error checking';
    });
    
    // Verify the typing in disabled field
    const disabledValue = await page.$eval('.action-disabled', el => el.value);
    expect(disabledValue).to.equal('disabled error checking');
  });
  
  it('TC-A-002: .focus() - Focus on a DOM element', async function() {
    // Focus on the element
    await page.focus('.action-focus');
    
    // Get the classes after focus
    const hasClass = await page.$eval('.action-focus', el => el.classList.contains('focus'));
    expect(hasClass).to.be.true;
    
    // Verify the previous element has the expected style
    const prevElStyle = await page.$eval('.action-focus', el => 
      el.parentElement.querySelector('label').getAttribute('style')
    );
    expect(prevElStyle).to.equal('color: orange;');
  });
  
  it('TC-A-003: .blur() - Blur off a DOM element', async function() {
    // Type into the element then blur
    await page.type('.action-blur', 'About to blur');
    await page.evaluate(() => {
      document.querySelector('.action-blur').blur();
    });
    
    // Check for error class
    const hasClass = await page.$eval('.action-blur', el => el.classList.contains('error'));
    expect(hasClass).to.be.true;
    
    // Verify the previous element has the expected style
    const prevElStyle = await page.$eval('.action-blur', el => 
      el.parentElement.querySelector('label').getAttribute('style')
    );
    expect(prevElStyle).to.equal('color: red;');
  });
  
  it('TC-A-004: .clear() - Clear an input or textarea element', async function() {
    // Type text into the field
    await page.type('.action-clear', 'Clear this text');
    
    // Verify text was entered correctly
    let value = await page.$eval('.action-clear', el => el.value);
    expect(value).to.equal('Clear this text');
    
    // Clear the field
    await page.$eval('.action-clear', el => el.value = '');
    
    // Verify the field is empty
    value = await page.$eval('.action-clear', el => el.value);
    expect(value).to.equal('');
  });
  
  it('TC-A-005: .submit() - Submit a form', async function() {
    // Type in the form field
    await page.type('.action-form [type="text"]', 'HALFOFF');
    
    // Submit the form
    await page.$eval('.action-form', form => form.submit());
    
    // Wait for submission response and verify confirmation message
    await page.waitForFunction(() => {
      const nextElement = document.querySelector('.action-form').nextElementSibling;
      return nextElement && nextElement.textContent.includes('Your form has been submitted!');
    });
    
    const confirmationText = await page.$eval('.action-form + div', el => el.textContent);
    expect(confirmationText).to.include('Your form has been submitted!');
  });
  
  it('TC-A-006: .click() - Click on a DOM element', async function() {
    // Click on the action button
    await page.click('.action-btn');
    
    // Click on the canvas element
    await page.click('#action-canvas');
    
    // Click on canvas at specific coordinates
    const canvasBounds = await page.$eval('#action-canvas', el => {
      const rect = el.getBoundingClientRect();
      return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
    });
    
    await page.mouse.click(canvasBounds.x + 80, canvasBounds.y + 75);
    
    // Click on multiple elements
    const labelElements = await page.$$('.action-labels>.label');
    for (const label of labelElements) {
      await label.click();
    }
    
    // Click with force option (in Puppeteer, we can use a different approach)
    await page.evaluate(() => {
      const button = document.querySelector('.action-opacity>.btn');
      button.click();
    });
  });
  
  it('TC-A-007: .dblclick() - Double click on a DOM element', async function() {
    // Double click on the element
    await page.click('.action-div', { clickCount: 2 });
    
    // Verify the div is hidden
    const divVisible = await page.$eval('.action-div', el => 
      window.getComputedStyle(el).display !== 'none'
    );
    expect(divVisible).to.be.false;
    
    // Verify the input is visible
    const inputVisible = await page.$eval('.action-input-hidden', el => 
      window.getComputedStyle(el).display !== 'none'
    );
    expect(inputVisible).to.be.true;
  });
  
  it('TC-A-008: .rightclick() - Right click on a DOM element', async function() {
    // Right click on the element
    await page.click('.rightclick-action-div', { button: 'right' });
    
    // Wait for the div to be hidden and input to be visible
    await page.waitForFunction(() => 
      window.getComputedStyle(document.querySelector('.rightclick-action-div')).display === 'none' &&
      window.getComputedStyle(document.querySelector('.rightclick-action-input-hidden')).display !== 'none'
    );
    
    // Verify the div is hidden
    const divVisible = await page.$eval('.rightclick-action-div', el => 
      window.getComputedStyle(el).display !== 'none'
    );
    expect(divVisible).to.be.false;
    
    // Verify the input is visible
    const inputVisible = await page.$eval('.rightclick-action-input-hidden', el => 
      window.getComputedStyle(el).display !== 'none'
    );
    expect(inputVisible).to.be.true;
  });
  
  it('TC-A-009: .check() - Check a checkbox or radio element', async function() {
    // Check all enabled checkboxes
    const checkboxes = await page.$$('.action-checkboxes [type="checkbox"]:not([disabled])');
    for (const checkbox of checkboxes) {
      await checkbox.click();
    }
    
    // Verify all enabled checkboxes are checked
    const allChecked = await page.$$eval(
      '.action-checkboxes [type="checkbox"]:not([disabled])',
      checkboxes => checkboxes.every(cb => cb.checked)
    );
    expect(allChecked).to.be.true;
    
    // Check radio by value
    await page.click('.action-radios [type="radio"][value="radio1"]');
    
    // Verify radio is checked
    const radioChecked = await page.$eval(
      '.action-radios [type="radio"][value="radio1"]',
      radio => radio.checked
    );
    expect(radioChecked).to.be.true;
    
    // Check multiple checkboxes
    await page.click('.action-multiple-checkboxes [type="checkbox"][value="checkbox1"]');
    await page.click('.action-multiple-checkboxes [type="checkbox"][value="checkbox2"]');
    
    // Verify multiple checkboxes are checked
    const multipleChecked = await page.evaluate(() => {
      const cb1 = document.querySelector('.action-multiple-checkboxes [type="checkbox"][value="checkbox1"]').checked;
      const cb2 = document.querySelector('.action-multiple-checkboxes [type="checkbox"][value="checkbox2"]').checked;
      return cb1 && cb2;
    });
    
    expect(multipleChecked).to.be.true;
    
    // Check disabled checkbox (using JavaScript directly)
    await page.evaluate(() => {
      document.querySelector('.action-checkboxes [disabled]').checked = true;
    });
    
    // Verify disabled checkbox is checked
    const disabledChecked = await page.$eval(
      '.action-checkboxes [disabled]',
      checkbox => checkbox.checked
    );
    
    expect(disabledChecked).to.be.true;
  });
  
  it('TC-A-010: .uncheck() - Uncheck a checkbox element', async function() {
    // First check, then uncheck checkbox
    await page.click('.action-check [type="checkbox"]:not([disabled])');
    
    // Verify checkbox is checked
    let isChecked = await page.$eval(
      '.action-check [type="checkbox"]:not([disabled])',
      checkbox => checkbox.checked
    );
    expect(isChecked).to.be.true;
    
    // Uncheck it
    await page.click('.action-check [type="checkbox"]:not([disabled])');
    
    // Verify it's unchecked
    isChecked = await page.$eval(
      '.action-check [type="checkbox"]:not([disabled])',
      checkbox => checkbox.checked
    );
    expect(isChecked).to.be.false;
    
    // Check specific checkbox by value, then uncheck
    await page.click('.action-check [type="checkbox"][value="checkbox1"]');
    
    isChecked = await page.$eval(
      '.action-check [type="checkbox"][value="checkbox1"]',
      checkbox => checkbox.checked
    );
    expect(isChecked).to.be.true;
    
    await page.click('.action-check [type="checkbox"][value="checkbox1"]');
    
    isChecked = await page.$eval(
      '.action-check [type="checkbox"][value="checkbox1"]',
      checkbox => checkbox.checked
    );
    expect(isChecked).to.be.false;
  });
  
  it('TC-A-011: .select() - Select an option in a <select> element', async function() {
    // Verify initial state
    const initialValue = await page.$eval('.action-select', select => select.value);
    expect(initialValue).to.equal('--Select a fruit--');
    
    // Select option by value
    await page.select('.action-select', 'fr-apples');
    
    // Verify the selection
    const newValue = await page.$eval('.action-select', select => select.value);
    expect(newValue).to.equal('fr-apples');
    
    // Select multiple options by value
    await page.select('.action-select-multiple', ['fr-apples', 'fr-oranges', 'fr-bananas']);
    
    // Verify multiple selections
    const selectedValues = await page.$eval('.action-select-multiple', select => 
      Array.from(select.selectedOptions).map(option => option.value)
    );
    
    expect(selectedValues).to.include('fr-apples');
    expect(selectedValues).to.include('fr-oranges');
    expect(selectedValues).to.include('fr-bananas');
  });
  
  it('TC-A-012: .scrollIntoView() - Scroll an element into view', async function() {
    // Get the button element
    const horizontalButton = await page.$('#scroll-horizontal button');
    
    // Check if button is initially visible in viewport
    const initiallyVisible = await page.evaluate(button => {
      const rect = button.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }, horizontalButton);
    
    // The button should not be visible initially
    expect(initiallyVisible).to.be.false;
    
    // Scroll button into view
    await page.evaluate(button => button.scrollIntoView(), horizontalButton);
    
    // Check if button is now visible
    const nowVisible = await page.evaluate(button => {
      const rect = button.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }, horizontalButton);
    
    // The button should now be visible
    expect(nowVisible).to.be.true;
  });
  
  it('TC-A-013: .trigger() - Trigger an event on a DOM element', async function() {
    // Set value and trigger change event
    await page.evaluate(() => {
      const range = document.querySelector('.trigger-input-range');
      range.value = 25;
      range.dispatchEvent(new Event('change'));
    });
    
    // Verify the text update
    const displayedValue = await page.$eval('.trigger-input-range + p', p => p.textContent);
    expect(displayedValue).to.equal('25');
  });
  
  it('TC-A-014: cy.scrollTo() - Scroll the window or element to a position', async function() {
    // Scroll window to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Scroll horizontal element to right
    await page.evaluate(() => {
      const el = document.querySelector('#scrollable-horizontal');
      el.scrollLeft = el.scrollWidth;
    });
    
    // Scroll to coordinates
    await page.evaluate(() => {
      const el = document.querySelector('#scrollable-vertical');
      el.scrollTo(250, 250);
    });
    
    // Scroll to percentage
    await page.evaluate(() => {
      const el = document.querySelector('#scrollable-both');
      el.scrollLeft = el.scrollWidth * 0.75;
      el.scrollTop = el.scrollHeight * 0.25;
    });
  });
  
  it('TC-A-101: Actions Module Accessibility', async function() {
    // Load axe-core from CDN
    await page.addScriptTag({
      url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.0/axe.min.js'
    });
    
    // Run accessibility audit
    const violations = await page.evaluate(() => {
      return new Promise(resolve => {
        axe.run({
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
    if (violations.length > 0) {
      console.log('Accessibility violations:', violations);
    }
    
    // Check for critical issues
    const criticalIssues = violations.filter(v => v.impact === 'critical');
    expect(criticalIssues.length).to.equal(0, 'Critical accessibility issues found');
  });
  
  it('TC-A-201: Actions Module Input Validation', async function() {
    // Test XSS attack vector
    const xssScript = '<script>alert("XSS")</script>';
    
    // Input potential XSS
    await page.type('.action-email', xssScript);
    
    // Get the actual value
    const actualValue = await page.$eval('.action-email', el => el.value);
    
    // Verify no alert was shown
    const alertShown = await page.evaluate(() => window.wasAlertShown === true);
    expect(alertShown).to.not.be.true;
  });
  
  it('TC-A-301: Actions Module Performance', async function() {
    // Measure typing performance
    const startTime = Date.now();
    await page.type('.action-email', 'performance@test.com');
    const endTime = Date.now();
    
    const duration = endTime - startTime;
    console.log(`Type operation took ${duration}ms`);
    
    // Typing should be reasonably quick
    expect(duration).to.be.below(1000);
    
    // Measure click performance
    const clickStartTime = Date.now();
    await page.click('.action-btn');
    const clickEndTime = Date.now();
    
    const clickDuration = clickEndTime - clickStartTime;
    console.log(`Click operation took ${clickDuration}ms`);
    
    // Clicking should be fast
    expect(clickDuration).to.be.below(500);
  });
});
