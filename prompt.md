# Chrome Extension Development Prompt

## Project Overview
Create a Chrome extension that integrates with the hostex.io calendar page to add IoT functionality. The extension should detect when a reservation drawer is opened, extract the stay code, and provide a button to retrieve one-time passwords for a smart lock system.

## Core Requirements

### 1. Extension Structure
- Create a manifest.json file using Manifest V3
- Implement content.js for the main functionality
- Include a README.md with installation and usage instructions

### 2. Manifest Configuration
- Set appropriate permissions (activeTab)
- Configure content scripts to run on https://hostex.io/app/calendar
- Add host permissions for API endpoints

### 3. Core Functionality
- Detect when a reservation drawer is opened
- Extract the stay code from the drawer content
- Add a button to retrieve one-time passwords
- Display the retrieved password in the drawer

## Detailed Implementation Guide

### 1. Initialization
- Implement a function to initialize the extension
- Set up a MutationObserver to monitor DOM changes
- Ensure the extension reinitializes when elements are removed

### 2. Drawer Detection
- Create a function to check if the drawer exists
- Implement a click event listener on host-reservation-bar elements
- Use a check interval to detect when drawer content is loaded
- Limit the number of checks to prevent infinite loops

### 3. Stay Code Extraction
- Find elements with class "v4-layout-field"
- Identify the element containing the stay code by checking for "入住号" text
- Extract the stay code from the ellipsis div

### 4. Button Integration
- Create a button with appropriate styling matching the existing UI
- Insert the button after the "退房时间" field
- Add a click event listener to handle password retrieval
- Prevent duplicate button creation

### 5. API Integration
- Implement a function to fetch password data from the API
- Handle API responses and errors
- Parse and validate the JSON response
- Display the password in the drawer

### 6. Dynamic Content Handling
- Use MutationObserver to monitor DOM changes
- Reinitialize elements when they are removed
- Clear password display when a new reservation is selected

## Technical Specifications

### DOM Structure
- Target elements with class "v4-layout-field"
- Look for elements with class "v4-layout-field-label" containing "入住号" text
- Extract stay code from elements with class "ellipsis"
- Insert button after elements with class "v4-layout-field-label" containing "退房时间" text

### API Integration
- Endpoint: https://67e8a51e20e3af747c41ac3d.mockapi.io/stays/1
- Expected response format:
  ```json
  {
    "status": "OK",
    "password": "123456"
  }
  ```
- Handle error cases (status: "NG")

### UI Components
- Button styling: "ant-btn ant-btn-primary ant-btn-sm ng-star-inserted"
- Password display: Create a new "v4-layout-field" element with appropriate structure

## Error Handling
- Implement try-catch blocks for API calls
- Handle JSON parsing errors
- Provide user-friendly error messages
- Log errors to console for debugging

## Testing Considerations
- Ensure the extension works with dynamic content loading
- Test with different stay codes
- Verify error handling for API failures
- Check compatibility with the hostex.io interface

## Additional Notes
- Use modern JavaScript features (async/await)
- Follow best practices for Chrome extension development
- Ensure the extension is non-intrusive to the existing UI
- Implement proper cleanup when elements are removed
