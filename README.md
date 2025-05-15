# Cypress Kitchen Sink Multi-Framework Testing

This repository contains tests for the [Cypress Example Kitchen Sink](https://github.com/cypress-io/cypress-example-kitchensink) application using multiple testing frameworks:

- Playwright
- Selenium
- Puppeteer

## Structure

- `/test_cases`: Test case specifications
- `/test_scripts`: Implementation of tests using different frameworks
  - `/playwright`
  - `/selenium`
  - `/puppeteer` 
- `/results`: Test results and reports

## Test Coverage

The tests in this repository cover:

- **Unit Testing**: Testing individual components in isolation
- **Integration Testing**: Testing interactions between integrated components
- **System Testing**: Testing the complete, integrated system
- **Acceptance Testing**: Validating against business requirements
- **Regression Testing**: Ensuring new changes don't break existing functionality
- **Load/Performance Testing**: Testing behavior under expected load conditions
- **Stress Testing**: Testing beyond normal operational capacity
- **Security Testing**: Identifying vulnerabilities and security risks
- **Usability Testing**: Evaluating user-friendliness
- **Accessibility Testing**: Ensuring applications work for people with disabilities
- **API Testing**: Testing application programming interfaces directly
- **Visual Testing**: Automated comparison of visual elements

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Docker (optional, for containerized execution)

### Installation

```bash
# Clone the repository
git clone https://github.com/pkumv1/cypress-multi-framework-testing.git
cd cypress-multi-framework-testing

# Install dependencies
npm install
```

### Running Tests

```bash
# Run Playwright tests
npm run test:playwright

# Run Selenium tests
npm run test:selenium

# Run Puppeteer tests
npm run test:puppeteer

# Run all tests
npm test
```

## Test Results

Test results will be generated in the `/results` directory with both HTML and PDF reports.

## License

MIT