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