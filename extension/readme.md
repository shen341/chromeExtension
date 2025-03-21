# Address Lookup Chrome Extension

This Chrome extension adds address lookup functionality to the specified webpage. When installed, it adds a test button that can fetch address information based on a zipcode input.

## Features

- Automatically adds a "テスト" button on the specified page
- Fetches address information from zipcode using the zipcloud API
- Displays the fetched address on the page

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory containing these files

## Usage

1. Navigate to `https://hostex.io/app/login/forgot`
2. The extension will automatically add a "テスト" button above the existing submit button
3. Enter a Japanese zipcode in the account input field
4. Click the "テスト" button to fetch and display the corresponding address

## Implementation Details

The extension consists of the following files:

### manifest.json
- Defines the extension configuration
- Specifies permissions and content scripts
- Sets up URL matching patterns

### content.js
- Handles DOM manipulation and event listening
- Implements the address lookup functionality
- Uses MutationObserver to handle dynamic content loading

Key functions:
- `addElements()`: Adds the test button and address label to the page
- `fetchAddress()`: Retrieves address data from the zipcloud API
- `handleTestButtonClick()`: Manages the click event on the test button
- `initialize()`: Sets up the extension functionality

## API Integration

The extension uses the zipcloud API (`https://zipcloud.ibsnet.co.jp/api/search`) to fetch address information. The API returns data in the following format:

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

- The extension uses Manifest V3
- It includes error handling for API requests
- Implements a MutationObserver to handle dynamically loaded content
