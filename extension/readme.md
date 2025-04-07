# Iot Integration Chrome Extension

This Chrome extension adds Iot integration functionality to the calendar page. It automatically detects the stay code and adds a Iot button for quick address lookup.

## Features

- Automatically detects when the drawer content is loaded
- Finds and extracts the stay code from the page
- Adds a Iot button for retrieving one-time passwords
- Fetches password information when the Iot button is clicked
- Displays the password along with the stay code
- Includes a test button and address label for testing purposes
- Provides address lookup functionality using zipcodes

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory containing these files

## Usage

1. Navigate to `https://hostex.io/app/calendar`
2. When the drawer content loads, the extension will automatically:
   - Find the stay code in the page
   - Add a Iot button next to it
3. Click the Iot button to:
   - Fetch password information
   - Display the password with the stay code

## Implementation Details

The extension consists of the following files:

### manifest.json
- Defines the extension configuration with manifest version 3
- Specifies activeTab permission for accessing the current tab
- Sets up content scripts to run on the calendar page
- Configures host permissions for the mock API endpoint and zipcloud API

### content.js
Key functions:
- `checkDrawerAndInitialize()`: Checks for drawer content and initializes the extension
- `findStayCodeAndAddButton()`: Locates the stay code and adds the Iot button
- `addIotButton()`: Creates and inserts the Iot button
- `handleIotClick()`: Handles button clicks and fetches password data

## Technical Implementation

1. **Drawer Detection**
   - Uses click event listener on host-reservation-bar elements
   - Implements a check interval to detect when drawer content is loaded
   - Stops checking after a maximum number of attempts (5 checks)

2. **Stay Code Detection**
   - Searches for elements with class "v4-layout-field"
   - Identifies the correct element by checking for "入住号" text
   - Extracts the stay code from the ellipsis div

3. **Button Integration**
   - Creates a new button with the same styling as existing buttons
   - Inserts the button after the target element (after the "退房时间" field)
   - Adds click event listener for password lookup
   - Prevents duplicate button creation by checking if the button already exists

4. **API Integration**
   - Fetches password data from a mock API endpoint (https://67e8a51e20e3af747c41ac3d.mockapi.io/stays/1)
   - Formats and displays the password with the stay code
   - Includes error handling for API failures and JSON parsing issues
   - Provides address lookup functionality using the zipcloud API

5. **Dynamic Content Handling**
   - Uses MutationObserver to monitor DOM changes
   - Reinitializes elements when they are removed from the page
   - Prevents duplicate button creation
   - Clears password display when a new reservation is selected

## API Response Format

The extension expects the following response format from the mock API:

```json
{
    "status": "OK",
    "password": "123456"
}
```

## Notes

- The extension uses MutationObserver to handle dynamic content
- Includes error handling for API requests and DOM operations
- Prevents duplicate button creation
- Uses modern JavaScript features and async/await for API calls
- Implements a test mode with additional UI elements for testing purposes
- Handles JSON parsing errors gracefully with user-friendly error messages
- Automatically reinitializes when the page content changes
