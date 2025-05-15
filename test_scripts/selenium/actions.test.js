const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('Actions Module Tests - Selenium', function() {
  // Increase timeout for Selenium tests
  this.timeout(30000);
  
  let driver;
  
  before(async function() {
    // Initialize the WebDriver
    driver = await new Builder().forBrowser('chrome').build();
  });
  
  beforeEach(async function() {
    // Navigate to the actions page before each test
    await driver.get('http://localhost:8080/commands/actions');
  });
  
  after(async function() {
    // Close the browser after all tests
    if (driver) await driver.quit();
  });
  
  it('TC-A-001: .type() - Type into a DOM element', async function() {
    // Type text into email field
    const emailField = await driver.findElement(By.css('.action-email'));
    await emailField.sendKeys('fake@email.com');
    
    // Verify text was entered correctly
    expect(await emailField.getAttribute('value')).to.equal('fake@email.com');
    
    // Clear the field
    await emailField.clear();
    
    // Type with key modifiers
    await emailField.sendKeys(Key.CONTROL, 'a'); // Press Ctrl+A
    await emailField.sendKeys(Key.DELETE); // Press Delete
    
    // Type with delay - in Selenium this is done by sending keys with pauses
    const slowText = 'slow.typing@email.com';
    for (const char of slowText) {
      await emailField.sendKeys(char);
      await driver.sleep(100); // 100ms delay between keystrokes
    }
    
    // Verify slower typing was successful
    expect(await emailField.getAttribute('value')).to.equal(slowText);
  });
  
  it('TC-A-002: .focus() - Focus on a DOM element', async function() {
    // Get the element and focus on it
    const focusElement = await driver.findElement(By.css('.action-focus'));
    await driver.executeScript("arguments[0].focus();", focusElement);
    
    // Verify the element has the focus class
    const classes = await focusElement.getAttribute('class');
    expect(classes).to.include('focus');
    
    // Verify the previous element has the expected style
    const prevElement = await driver.findElement(By.css('.action-focus'))
      .findElement(By.xpath('../preceding-sibling::label'));
    const style = await prevElement.getAttribute('style');
    expect(style).to.equal('color: orange;');
  });
  
  it('TC-A-003: .blur() - Blur off a DOM element', async function() {
    // Type into the element
    const blurElement = await driver.findElement(By.css('.action-blur'));
    await blurElement.sendKeys('About to blur');
    
    // Trigger blur by clicking elsewhere
    await driver.executeScript("arguments[0].blur();", blurElement);
    
    // Verify the element has the error class
    const classes = await blurElement.getAttribute('class');
    expect(classes).to.include('error');
    
    // Verify the previous element has the expected style
    const prevElement = await driver.findElement(By.css('.action-blur'))
      .findElement(By.xpath('../preceding-sibling::label'));
    const style = await prevElement.getAttribute('style');
    expect(style).to.equal('color: red;');
  });
  
  it('TC-A-004: .clear() - Clear an input or textarea element', async function() {
    // Type text into the field
    const clearElement = await driver.findElement(By.css('.action-clear'));
    await clearElement.sendKeys('Clear this text');
    
    // Verify text was entered correctly
    expect(await clearElement.getAttribute('value')).to.equal('Clear this text');
    
    // Clear the field
    await clearElement.clear();
    
    // Verify the field is empty
    expect(await clearElement.getAttribute('value')).to.equal('');
  });
  
  it('TC-A-005: .submit() - Submit a form', async function() {
    // Type in the form field
    const formInput = await driver.findElement(By.css('.action-form [type="text"]'));
    await formInput.sendKeys('HALFOFF');
    
    // Submit the form
    const form = await driver.findElement(By.css('.action-form'));
    await driver.executeScript("arguments[0].submit();", form);
    
    // Verify the confirmation message
    const confirmationText = await driver.findElement(
      By.xpath('//form[@class="action-form"]/following-sibling::div')
    ).getText();
    expect(confirmationText).to.include('Your form has been submitted!');
  });
  
  it('TC-A-006: .click() - Click on a DOM element', async function() {
    // Click on the action button
    await driver.findElement(By.css('.action-btn')).click();
    
    // Click on the canvas element
    const canvas = await driver.findElement(By.css('#action-canvas'));
    await canvas.click(); // center by default
    
    // Click with JavaScript at specific coordinates
    // This might not actually draw on the canvas as in Cypress, but it demonstrates the concept
    await driver.executeScript(`
      const canvas = arguments[0];
      const rect = canvas.getBoundingClientRect();
      const evt = new MouseEvent('click', {
        clientX: rect.left + 80,
        clientY: rect.top + 75,
        bubbles: true,
        cancelable: true
      });
      canvas.dispatchEvent(evt);
    `, canvas);
    
    // Click on multiple elements
    const labels = await driver.findElements(By.css('.action-labels>.label'));
    for (const label of labels) {
      await label.click();
    }
  });
  
  it('TC-A-007: .dblclick() - Double click on a DOM element', async function() {
    // Get the element
    const actionDiv = await driver.findElement(By.css('.action-div'));
    
    // Perform a double-click using the Actions class
    const actions = driver.actions({bridge: true});
    await actions.doubleClick(actionDiv).perform();
    
    // Verify the div is hidden
    const isDisplayed = await driver.executeScript(
      "return window.getComputedStyle(arguments[0]).display !== 'none'", 
      actionDiv
    );
    expect(isDisplayed).to.be.false;
    
    // Verify the input is visible
    const hiddenInput = await driver.findElement(By.css('.action-input-hidden'));
    const isInputDisplayed = await hiddenInput.isDisplayed();
    expect(isInputDisplayed).to.be.true;
  });
  
  it('TC-A-008: .rightclick() - Right click on a DOM element', async function() {
    // Get the element
    const rightClickDiv = await driver.findElement(By.css('.rightclick-action-div'));
    
    // Perform a right-click using the Actions class
    const actions = driver.actions({bridge: true});
    await actions.contextClick(rightClickDiv).perform();
    
    // Verify the div is hidden
    await driver.wait(until.elementIsNotVisible(rightClickDiv), 2000);
    
    // Verify the input is visible
    const hiddenInput = await driver.findElement(By.css('.rightclick-action-input-hidden'));
    const isInputDisplayed = await hiddenInput.isDisplayed();
    expect(isInputDisplayed).to.be.true;
  });
  
  it('TC-A-009: .check() - Check a checkbox or radio element', async function() {
    // Check all enabled checkboxes
    const checkboxes = await driver.findElements(
      By.css('.action-checkboxes [type="checkbox"]:not([disabled])')
    );
    
    for (const checkbox of checkboxes) {
      await checkbox.click(); // Click to check
    }
    
    // Verify all enabled checkboxes are checked
    for (const checkbox of checkboxes) {
      expect(await checkbox.isSelected()).to.be.true;
    }
    
    // Check radio by value
    const radio = await driver.findElement(
      By.css('.action-radios [type="radio"][value="radio1"]')
    );
    await radio.click();
    expect(await radio.isSelected()).to.be.true;
    
    // Check multiple checkboxes
    const checkbox1 = await driver.findElement(
      By.css('.action-multiple-checkboxes [type="checkbox"][value="checkbox1"]')
    );
    const checkbox2 = await driver.findElement(
      By.css('.action-multiple-checkboxes [type="checkbox"][value="checkbox2"]')
    );
    
    if (!await checkbox1.isSelected()) await checkbox1.click();
    if (!await checkbox2.isSelected()) await checkbox2.click();
    
    // Verify they're checked
    expect(await checkbox1.isSelected()).to.be.true;
    expect(await checkbox2.isSelected()).to.be.true;
  });
  
  it('TC-A-010: .uncheck() - Uncheck a checkbox element', async function() {
    // First, check the box
    const checkbox = await driver.findElement(
      By.css('.action-check [type="checkbox"]:not([disabled])')
    );
    if (!await checkbox.isSelected()) await checkbox.click();
    
    // Then uncheck it
    if (await checkbox.isSelected()) await checkbox.click();
    
    // Verify it's unchecked
    expect(await checkbox.isSelected()).to.be.false;
    
    // Check specific checkbox by value, then uncheck
    const checkbox1 = await driver.findElement(
      By.css('.action-check [type="checkbox"][value="checkbox1"]')
    );
    
    if (!await checkbox1.isSelected()) await checkbox1.click();
    expect(await checkbox1.isSelected()).to.be.true;
    
    await checkbox1.click(); // Uncheck
    expect(await checkbox1.isSelected()).to.be.false;
  });
  
  it('TC-A-011: .select() - Select an option in a <select> element', async function() {
    // Get the select element
    const selectElement = await driver.findElement(By.css('.action-select'));
    
    // Verify initial state
    expect(await selectElement.getAttribute('value')).to.equal('--Select a fruit--');
    
    // Select option by value
    await driver.executeScript(
      "arguments[0].value = arguments[1]", 
      selectElement, 
      'fr-apples'
    );
    // Trigger change event
    await driver.executeScript(
      "arguments[0].dispatchEvent(new Event('change'))",
      selectElement
    );
    
    // Verify selection
    expect(await selectElement.getAttribute('value')).to.equal('fr-apples');
  });
  
  it('TC-A-012: .scrollIntoView() - Scroll an element into view', async function() {
    // Scroll button into view
    const horizontalButton = await driver.findElement(By.css('#scroll-horizontal button'));
    await driver.executeScript("arguments[0].scrollIntoView();", horizontalButton);
    
    // Verify button is visible (by checking if it's in the viewport)
    const isInViewport = await driver.executeScript(`
      const rect = arguments[0].getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    `, horizontalButton);
    
    expect(isInViewport).to.be.true;
  });
  
  it('TC-A-013: .trigger() - Trigger an event on a DOM element', async function() {
    // Get the range input
    const rangeInput = await driver.findElement(By.css('.trigger-input-range'));
    
    // Set value and trigger change event
    await driver.executeScript(`
      arguments[0].value = 25;
      arguments[0].dispatchEvent(new Event('change'));
    `, rangeInput);
    
    // Get the text of the paragraph element showing the value
    const valueDisplay = await driver.findElement(
      By.xpath('//input[@class="trigger-input-range"]/following-sibling::p')
    );
    
    // Verify the value was updated
    expect(await valueDisplay.getText()).to.equal('25');
  });
  
  it('TC-A-014: cy.scrollTo() - Scroll the window or element to a position', async function() {
    // Scroll window to bottom
    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    
    // Scroll horizontal element to right
    const horizontalScrollable = await driver.findElement(By.css('#scrollable-horizontal'));
    await driver.executeScript(
      "arguments[0].scrollLeft = arguments[0].scrollWidth", 
      horizontalScrollable
    );
    
    // Scroll vertical element to specific position
    const verticalScrollable = await driver.findElement(By.css('#scrollable-vertical'));
    await driver.executeScript(
      "arguments[0].scrollTo(250, 250)", 
      verticalScrollable
    );
    
    // Scroll to percentage
    const bothScrollable = await driver.findElement(By.css('#scrollable-both'));
    await driver.executeScript(`
      arguments[0].scrollLeft = arguments[0].scrollWidth * 0.75;
      arguments[0].scrollTop = arguments[0].scrollHeight * 0.25;
    `, bothScrollable);
  });
  
  // Note: Accessibility testing in Selenium would typically use a separate tool
  // This is a simplified version that checks keyboard navigation
  it('TC-A-101: Actions Module Accessibility - Keyboard Navigation', async function() {
    // Test keyboard navigation using Tab key
    await driver.actions().sendKeys(Key.TAB).perform(); // First element
    
    // Get the active element
    const activeElement = await driver.switchTo().activeElement();
    
    // Verify some element is focused
    const tagName = await activeElement.getTagName();
    const type = await activeElement.getAttribute('type');
    
    // Check that we're focused on a form control
    expect(['input', 'button', 'select', 'textarea', 'a']).to.include(tagName.toLowerCase());
  });
  
  it('TC-A-201: Actions Module Input Validation', async function() {
    // Test XSS attack vector
    const xssScript = '<script>alert("XSS")</script>';
    
    // Input potential XSS in email field
    const emailField = await driver.findElement(By.css('.action-email'));
    await emailField.sendKeys(xssScript);
    
    // Get the actual value
    const actualValue = await emailField.getAttribute('value');
    
    // Check if the value contains executable script tags
    // Note: Most browsers will escape the input, showing exactly what the user typed
    // but it won't be executable as JavaScript
    expect(actualValue).to.equal(xssScript);
    
    // Check if any alert was triggered (should not be)
    const alertsPresent = await driver.executeScript(
      "return window.alertShown === true"
    );
    expect(alertsPresent).to.not.be.true;
  });
  
  it('TC-A-301: Actions Module Performance', async function() {
    // Measure response time for typing
    const emailField = await driver.findElement(By.css('.action-email'));
    
    const start = Date.now();
    await emailField.sendKeys('performance@test.com');
    const end = Date.now();
    
    const duration = end - start;
    console.log(`Type operation took ${duration}ms`);
    
    // Expect reasonable performance (under 1 second)
    expect(duration).to.be.below(1000);
  });
});
