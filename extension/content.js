// Function to add test button and label
function addElements() {
    // Check if elements already exist to prevent duplicate creation
    if (document.getElementById('test')) {
        return; // Already exists, don't add again
    }

    // Find the target button to insert before
    const targetButton = document.querySelector('button.ant-btn.ant-btn-primary.ant-btn-lg.ant-btn-block.ng-star-inserted');
    if (targetButton) {
        // Create and insert test button
        const testButton = document.createElement('button');
        testButton.id = 'test';
        testButton.textContent = 'テスト';
        targetButton.parentNode.insertBefore(testButton, targetButton);
    }

    // Add label container if it doesn't exist
    if (!document.getElementById('address-label')) {
        const targetDiv = document.querySelector('div.v4-layout-field.mt-\\[36px\\]');
        if (targetDiv) {
            const addressLabel = document.createElement('label');
            addressLabel.id = 'address-label';
            targetDiv.parentNode.insertBefore(addressLabel, targetDiv);
        }
    }
}

// Function to fetch address from zipcode
async function fetchAddress(zipcode) {
    try {
        const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`);
        const data = await response.json();
        
        if (data.status === 200 && data.results && data.results.length > 0) {
            const result = data.results[0];
            return `${result.address1}${result.address2}${result.address3}`;
        } else {
            return '住所が見つかりませんでした';
        }
    } catch (error) {
        console.error('Error fetching address:', error);
        return 'エラーが発生しました';
    }
}

// Function to handle test button click
async function handleTestButtonClick() {
    const accountInput = document.querySelector('input[formcontrolname="account"]');
    if (accountInput) {
        const zipcode = accountInput.value;
        const address = await fetchAddress(zipcode);
        const addressLabel = document.getElementById('address-label');
        if (addressLabel) {
            addressLabel.textContent = address;
        }
    }
}

// Initialize the extension
function initialize() {
    // Temporarily disconnect observer while making changes
    if (window.extensionObserver) {
        window.extensionObserver.disconnect();
    }

    // Add elements to the page
    addElements();

    // Add click event listener to test button
    const testButton = document.getElementById('test');
    if (testButton && !testButton.hasAttribute('data-listener-attached')) {
        testButton.addEventListener('click', handleTestButtonClick);
        testButton.setAttribute('data-listener-attached', 'true');
    }

    // Reconnect observer
    if (window.extensionObserver) {
        window.extensionObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// Wait for the page to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Add MutationObserver to handle dynamic content loading
window.extensionObserver = new MutationObserver((mutations) => {
    // Check if our elements are still present
    const testButton = document.getElementById('test');
    const addressLabel = document.getElementById('address-label');
    
    if (!testButton || !addressLabel) {
        initialize();
    }
});

window.extensionObserver.observe(document.body, {
    childList: true,
    subtree: true
});

// Function to check if drawer exists and find stay code
function checkDrawerAndInitialize() {
    const drawer = document.querySelector('div[class="ant-drawer-content-wrapper"]');
    if (!drawer) {
        return false;
    }
    findStayCodeAndAddButton();
    return true;
}

// Function to find stay code and add button
function findStayCodeAndAddButton() {
    // Get all v4-layout-field divs
    const divList = document.querySelectorAll('div[class="v4-layout-field"]');
    let foundElement = null;
    let stayCode = "";

    // Find the div containing stay code
    for (const itemDiv of divList) {
        const labelSpan = itemDiv.querySelector('div[class="v4-layout-field-label"] span');
        if (labelSpan && labelSpan.innerHTML.includes('入住号')) {
            foundElement = itemDiv;
            break;
        }
    }

    // If found element exists, get stay code and add button
    if (foundElement) {
        const ellipsisDiv = foundElement.querySelector('div[class="ellipsis"]');
        if (ellipsisDiv) {
            stayCode = ellipsisDiv.innerHTML.trim();
            addSwitchBotButton(foundElement, stayCode);
        }
    }
}

// Function to add SwitchBot button
function addSwitchBotButton(targetElement, stayCode) {
    // Check if button already exists
    if (document.getElementById('switchBotbtn')) {
        return;
    }

    // Create button container
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'button ng-star-inserted';
    buttonDiv.innerHTML = `
        <button id="switchBotbtn" nztype="primary" nzsize="small" class="ant-btn ant-btn-primary ant-btn-sm ng-star-inserted">
            <span class="ng-star-inserted"> SwitchBot </span>
        </button>
    `;

    // Add click event listener
    buttonDiv.querySelector('#switchBotbtn').addEventListener('click', () => {
        handleSwitchBotClick(stayCode);
    });

    // Insert after target element
    targetElement.parentNode.insertBefore(buttonDiv, targetElement.nextSibling);
}

// Function to fetch address and show alert
async function handleSwitchBotClick(stayCode) {
    try {
        const response = await fetch('https://zipcloud.ibsnet.co.jp/api/search?zipcode=1230872');
        const data = await response.json();
        
        if (data.status === 200 && data.results && data.results.length > 0) {
            const result = data.results[0];
            const address = `${result.address1}${result.address2}${result.address3}`;
            alert(`${address}:${stayCode}`);
        } else {
            alert('住所の取得に失敗しました');
        }
    } catch (error) {
        console.error('Error fetching address:', error);
        alert('エラーが発生しました');
    }
}

// Start periodic check for drawer
const checkInterval = setInterval(() => {
    if (checkDrawerAndInitialize()) {
        clearInterval(checkInterval);
    }
}, 1000);

// Initial check
checkDrawerAndInitialize(); 