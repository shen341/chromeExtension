# SwitchBot Integration Chrome Extension

This Chrome extension adds SwitchBot integration functionality to the calendar page. It automatically detects the stay code and adds a SwitchBot button for quick address lookup.

## Features

- Automatically detects when the drawer content is loaded
- Finds and extracts the stay code from the page
- Adds a SwitchBot button next to the stay code
- Fetches address information when the SwitchBot button is clicked
- Displays the address along with the stay code

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory containing these files

## Usage

1. Navigate to `https://hostex.io/app/calendar`
2. When the drawer content loads, the extension will automatically:
   - Find the stay code in the page
   - Add a SwitchBot button next to it
3. Click the SwitchBot button to:
   - Fetch address information
   - Display an alert with the address and stay code

## Implementation Details

The extension consists of the following files:

### manifest.json
- Defines the extension configuration
- Specifies permissions and content scripts
- Sets up URL matching for the calendar page
- Configures host permissions for the zipcloud API

### content.js
Key functions:
- `checkDrawerAndInitialize()`: Checks for drawer content and initializes the extension
- `findStayCodeAndAddButton()`: Locates the stay code and adds the SwitchBot button
- `addSwitchBotButton()`: Creates and inserts the SwitchBot button
- `handleSwitchBotClick()`: Handles button clicks and fetches address data

## Technical Implementation

1. **Drawer Detection**
   - Uses `setInterval` to check for drawer content every second
   - Stops checking once the drawer is found

2. **Stay Code Detection**
   - Searches for elements with class "v4-layout-field"
   - Identifies the correct element by checking for "滞在コード" text
   - Extracts the stay code from the ellipsis div

3. **Button Integration**
   - Creates a new button with the same styling as existing buttons
   - Inserts the button after the stay code element
   - Adds click event listener for address lookup

4. **API Integration**
   - Fetches address data from zipcloud API
   - Formats and displays the address with the stay code
   - Includes error handling for API failures

## API Response Format

The extension expects the following response format from the zipcloud API:

```json
{
    "message": null,
    "results": [
        {
            "address1": "都道府県",
            "address2": "市区町村",
            "address3": "町域",
            "kana1": "フリガナ1",
            "kana2": "フリガナ2",
            "kana3": "フリガナ3",
            "prefcode": "XX",
            "zipcode": "XXXXXXX"
        }
    ],
    "status": 200
}
```

## Notes

- The extension uses MutationObserver to handle dynamic content
- Includes error handling for API requests and DOM operations
- Prevents duplicate button creation
- Uses modern JavaScript features and async/await for API calls
