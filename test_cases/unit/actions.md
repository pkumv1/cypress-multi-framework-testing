# Actions Module Test Cases

This document contains test cases for the Actions module of the Cypress Example Kitchen Sink application.

## Test Case Categories

The Actions module tests DOM interaction commands like `.type()`, `.focus()`, `.blur()`, `.clear()`, `.submit()`, `.click()`, `.dblclick()`, `.rightclick()`, `.check()`, `.uncheck()`, `.select()`, `.scrollIntoView()`, `.trigger()`, and `cy.scrollTo()`.

## Test Cases

### TC-A-001: .type() - Type into a DOM element

**Description:** Verify that text can be typed into an input field, including special character sequences and modifier keys.

**Test Type:** Unit, Integration, Functional

**Priority:** High

**Preconditions:**
- App is running at http://localhost:8080/commands/actions

**Test Steps:**
1. Visit the actions page
2. Type "fake@email.com" into the email input field
3. Verify the input value is "fake@email.com"
4. Type special character sequences (arrow keys)
5. Type more special sequences (del, selectall, backspace)
6. Type with key modifiers (alt, ctrl, meta, shift)
7. Type with delay (100ms between keystrokes)
8. Type into a disabled input with force option

**Expected Results:**
- Text is correctly entered in the input field
- Special character sequences work as expected
- Key modifiers work as expected
- Delay works correctly between keystrokes
- Force option allows typing in a disabled field

### TC-A-002: .focus() - Focus on a DOM element

**Description:** Verify that an element can receive focus and proper styling is applied.

**Test Type:** Unit, Functional

**Priority:** Medium

**Preconditions:**
- App is running at http://localhost:8080/commands/actions

**Test Steps:**
1. Visit the actions page
2. Focus on the .action-focus element
3. Verify the element has class "focus"
4. Verify the previous element has style "color: orange;"

**Expected Results:**
- Element receives focus
- CSS classes and styles are applied correctly

### TC-A-003: .blur() - Blur off a DOM element

**Description:** Verify that an element can lose focus and proper styling is applied.

**Test Type:** Unit, Functional

**Priority:** Medium

**Preconditions:**
- App is running at http://localhost:8080/commands/actions

**Test Steps:**
1. Visit the actions page
2. Type "About to blur" into the .action-blur element
3. Trigger blur on the element
4. Verify the element has class "error"
5. Verify the previous element has style "color: red;"

**Expected Results:**
- Element loses focus
- CSS classes and styles are applied correctly

### TC-A-004: .clear() - Clear an input or textarea element

**Description:** Verify that an input field can be cleared.

**Test Type:** Unit, Functional

**Priority:** Medium

**Preconditions:**
- App is running at http://localhost:8080/commands/actions

**Test Steps:**
1. Visit the actions page
2. Type "Clear this text" into the .action-clear element
3. Verify the input value is "Clear this text"
4. Clear the input field
5. Verify the input value is empty

**Expected Results:**
- Text is correctly entered in the input field
- Field is cleared completely

### TC-A-005: .submit() - Submit a form

**Description:** Verify that a form can be submitted.

**Test Type:** Unit, Integration, Functional

**Priority:** High

**Preconditions:**
- App is running at http://localhost:8080/commands/actions

**Test Steps:**
1. Visit the actions page
2. Type "HALFOFF" into the form's text input
3. Submit the form
4. Verify the confirmation message appears

**Expected Results:**
- Form is submitted successfully
- Confirmation message "Your form has been submitted!" is shown

### TC-A-006: .click() - Click on a DOM element

**Description:** Verify clicking functionality including position-specific clicks.

**Test Type:** Unit, Functional

**Priority:** High

**Preconditions:**
- App is running at http://localhost:8080/commands/actions

**Test Steps:**
1. Visit the actions page
2. Click on the action button
3. Click on the canvas element (center by default)
4. Click on the canvas in various positions (topLeft, top, topRight, etc.)
5. Click on the canvas at specific coordinates
6. Click on multiple elements using multiple: true option
7. Click on element with force option

**Expected Results:**
- All clicks register correctly
- Position-specific clicks work as expected
- Coordinate clicks work as expected
- Multiple elements are clicked when specified
- Force option allows clicking on obscured elements

### TC-A-007: .dblclick() - Double click on a DOM element

**Description:** Verify double-click functionality.

**Test Type:** Unit, Functional

**Priority:** Medium

**Preconditions:**
- App is running at http://localhost:8080/commands/actions

**Test Steps:**
1. Visit the actions page
2. Double click on the .action-div element
3. Verify the div is hidden
4. Verify the input is visible

**Expected Results:**
- Double click is registered correctly
- UI updates accordingly (div hidden, input shown)

### TC-A-008: .rightclick() - Right click on a DOM element

**Description:** Verify right-click functionality.

**Test Type:** Unit, Functional

**Priority:** Medium

**Preconditions:**
- App is running at http://localhost:8080/commands/actions

**Test Steps:**
1. Visit the actions page
2. Right click on the .rightclick-action-div element
3. Verify the div is hidden
4. Verify the input is visible

**Expected Results:**
- Right click is registered correctly
- UI updates accordingly (div hidden, input shown)

### TC-A-009: .check() - Check a checkbox or radio element

**Description:** Verify checkbox and radio button checking functionality.

**Test Type:** Unit, Functional

**Priority:** High

**Preconditions:**
- App is running at http://localhost:8080/commands/actions

**Test Steps:**
1. Visit the actions page
2. Check all enabled checkboxes
3. Verify the checkboxes are checked
4. Check all enabled radio buttons
5. Verify the radio buttons are checked
6. Check a specific radio by value
7. Check multiple checkboxes by value array
8. Check a disabled checkbox with force option

**Expected Results:**
- Checkboxes and radio buttons are checked correctly
- Value-based selection works
- Multiple selection works
- Force option allows checking disabled elements

### TC-A-010: .uncheck() - Uncheck a checkbox element

**Description:** Verify checkbox unchecking functionality.

**Test Type:** Unit, Functional

**Priority:** Medium

**Preconditions:**
- App is running at http://localhost:8080/commands/actions

**Test Steps:**
1. Visit the actions page
2. Check then uncheck all enabled checkboxes
3. Verify the checkboxes are unchecked
4. Check and uncheck a specific checkbox by value
5. Verify the specific checkbox is unchecked
6. Check and uncheck multiple checkboxes by value array
7. Verify the specific checkboxes are unchecked
8. Uncheck a disabled checkbox with force option

**Expected Results:**
- Checkboxes are unchecked correctly
- Value-based selection works
- Multiple selection works
- Force option allows unchecking disabled elements

### TC-A-011: .select() - Select an option in a <select> element

**Description:** Verify select dropdown functionality.

**Test Type:** Unit, Functional

**Priority:** High

**Preconditions:**
- App is running at http://localhost:8080/commands/actions

**Test Steps:**
1. Visit the actions page
2. Verify no option is initially selected
3. Select an option by text
4. Verify the value reflects the selection
5. Select multiple options by text in multi-select
6. Verify the values reflect the selections
7. Select option by value
8. Verify the selection by value
9. Select multiple options by value
10. Verify multiple selections by value

**Expected Results:**
- Single selections work correctly
- Multiple selections work correctly
- Selection by text works
- Selection by value works

### TC-A-012: .scrollIntoView() - Scroll an element into view

**Description:** Verify scrolling element into view functionality.

**Test Type:** Unit, Functional

**Priority:** Medium

**Preconditions:**
- App is running at http://localhost:8080/commands/actions

**Test Steps:**
1. Visit the actions page
2. Verify buttons are not initially visible
3. Scroll horizontal button into view
4. Verify horizontal button is now visible
5. Scroll vertical button into view
6. Verify vertical button is now visible
7. Scroll both directions button into view
8. Verify both directions button is now visible

**Expected Results:**
- Elements are initially not visible
- Elements become visible after scrolling into view
- Scroll direction is handled automatically

### TC-A-013: .trigger() - Trigger an event on a DOM element

**Description:** Verify event triggering functionality.

**Test Type:** Unit, Functional

**Priority:** Medium

**Preconditions:**
- App is running at http://localhost:8080/commands/actions

**Test Steps:**
1. Visit the actions page
2. Set the range input value using .invoke('val', 25)
3. Trigger the 'change' event on the range input
4. Verify the displayed value updates to "25"

**Expected Results:**
- Event is triggered successfully
- UI updates to reflect the new value

### TC-A-014: cy.scrollTo() - Scroll the window or element to a position

**Description:** Verify scrolling to different positions within window or element.

**Test Type:** Unit, Functional

**Priority:** Medium

**Preconditions:**
- App is running at http://localhost:8080/commands/actions

**Test Steps:**
1. Visit the actions page
2. Scroll the window to 'bottom'
3. Scroll the horizontal scrollable element to 'right'
4. Scroll the vertical scrollable element to coordinates (250, 250)
5. Scroll the both-direction scrollable element to percentage positions (75%, 25%)
6. Scroll with custom easing
7. Scroll with custom duration

**Expected Results:**
- Window and elements scroll to the specified positions
- Coordinate-based scrolling works
- Percentage-based scrolling works
- Scrolling options (easing, duration) work correctly

## Accessibility Testing

### TC-A-101: Actions Module Accessibility

**Description:** Verify that the Actions page meets accessibility standards.

**Test Type:** Accessibility

**Priority:** High

**Preconditions:**
- App is running at http://localhost:8080/commands/actions

**Test Steps:**
1. Visit the actions page
2. Run automated accessibility testing tool (axe-core)
3. Check for WCAG 2.1 AA compliance issues

**Expected Results:**
- No critical accessibility issues found
- All interactive elements are keyboard accessible
- Proper focus management is implemented
- Color contrast meets requirements

## Security Testing

### TC-A-201: Actions Module Input Validation

**Description:** Verify input validation and security for action inputs.

**Test Type:** Security

**Priority:** High

**Preconditions:**
- App is running at http://localhost:8080/commands/actions

**Test Steps:**
1. Visit the actions page
2. Attempt to input malicious scripts in text inputs
3. Attempt XSS attacks in form fields
4. Check for proper sanitization of inputs

**Expected Results:**
- Inputs are properly validated and sanitized
- No XSS vulnerabilities exist
- Malicious inputs are handled safely

## Performance Testing

### TC-A-301: Actions Module Performance

**Description:** Verify performance of action event handling.

**Test Type:** Performance

**Priority:** Medium

**Preconditions:**
- App is running at http://localhost:8080/commands/actions

**Test Steps:**
1. Visit the actions page
2. Measure response time for .type() operations
3. Measure response time for click events
4. Measure response time for form submission

**Expected Results:**
- All actions respond within acceptable time limits
- No significant UI delays during interaction
- Page remains responsive during operations