

// Initialize the extension
function initialize() {
    // Temporarily disconnect observer while making changes
    if (window.extensionObserver) {
        window.extensionObserver.disconnect();
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
            addTotBotButton(stayCode);
        }
    }
}

// Function to add SwitchBot button
function addTotBotButton(stayCode) {
    // Check if button already exists
    if (document.getElementById('oncetimePasswordGetbtn')) {
        return;
    }

    // Create button container
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'button ng-star-inserted';
    buttonDiv.innerHTML = `
        <button id="oncetimePasswordGetbtn" nztype="primary" nzsize="small" class="ant-btn ant-btn-primary ant-btn-sm ng-star-inserted">
            <span class="ng-star-inserted">智能锁密码取得</span>
        </button>
    `;

    // Add click event listener
    buttonDiv.querySelector('#oncetimePasswordGetbtn').addEventListener('click', () => {
        handleSwitchBotClick(stayCode);
    });

    // Get all v4-layout-field divs
    const divList = document.querySelectorAll('div[class="v4-layout-field"]');
    let foundInsertElement = null;
    console.log("divList======================",divList);
    // Find the div containing stay code
    for (const itemDiv of divList) {
        const labelSpan = itemDiv.querySelector('div[class="v4-layout-field-label"] span');
        console.log("labelSpan======================",labelSpan);
        if (labelSpan && labelSpan.innerHTML.includes('退房时间')) {
            foundInsertElement = itemDiv;
            break;
        }
    }

    // Insert button after the target element
    if (foundInsertElement) {
        console.log("foundInsertElement======================",foundInsertElement);
        foundInsertElement.parentNode.insertBefore(buttonDiv, foundInsertElement.nextSibling);
    }
}

// Function to fetch address and show alert
async function handleSwitchBotClick(stayCode) {
    try {
        console.log("stayCode======================",stayCode);
        const response = await fetch('https://67e8a51e20e3af747c41ac3d.mockapi.io/stays/1');
        const responseText = await response.text();
        console.log("Raw API Response:", responseText);

        let data;
        try {
            // 尝试清理和修复 JSON 字符串
            const cleanedJson = responseText
                .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3') // 给属性名添加双引号
                .replace(/'/g, '"'); // 将单引号替换为双引号
            
            data = JSON.parse(cleanedJson);
            console.log("Parsed data:", data);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Response Text:", responseText);
            alert('服务器返回数据格式错误');
            return;
        }
        
        if (data.status === "NG") {
            alert('密码取得错误！');
            return;
        }

        if (data.status && data.password) {
            const password = data.password;
            
            // Check if password element already exists
            const existingPasswordElement = document.getElementById('handleSwitchBotClickPassword');
            if (existingPasswordElement) {
                // Update existing password span
                const passwordSpan = existingPasswordElement.querySelector('#handleSwitchBotClickPasswordSpan');
                if (passwordSpan) {
                    passwordSpan.innerHTML = password;
                }
            } else {
                // Create new password element
                const passwordElement = document.createElement('div');
                passwordElement.className = 'v4-layout-field ng-star-inserted';
                passwordElement.id = 'handleSwitchBotClickPassword';
                passwordElement.innerHTML = `
                    <div class="v4-layout-field-label">
                        <span>门锁密码</span>
                    </div>
                    <div class="v4-layout-field-control">
                        <div class="v4-layout-field-row">
                            <div class="v4-layout-field-control">
                                <div class="v4-layout-field-row">
                                    <span id="handleSwitchBotClickPasswordSpan">${password}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                const targetButton = document.getElementById('oncetimePasswordGetbtn');
                if (targetButton) {
                    console.log("targetButton======================",targetButton);
                    // Get the button container (parent div)
                    const buttonContainer = targetButton.parentNode;
                    // Insert after the button container
                    buttonContainer.parentNode.insertBefore(passwordElement, buttonContainer.nextSibling);
                    console.log("passwordElement======================",passwordElement);
                }
            }
        } else {
            alert('密码取得失败');
        }
    } catch (error) {
        console.error('Error fetching password:', error);
        alert('发生错误');
    }
}

// 添加点击事件监听器
document.addEventListener('click', function(event) {
    // 检查事件路径中是否包含目标元素
    const path = event.composedPath();
    const isTargetClicked = path.some(element => 
        element instanceof HTMLElement && 
        element.matches('div.host-reservation-bar')
    );
    

    if (isTargetClicked) {

        // check id="handleSwitchBotClickPasswordSpan" exists, if exists, clear it
        const passwordSpan = document.getElementById('handleSwitchBotClickPasswordSpan');
        if (passwordSpan) {
            passwordSpan.innerHTML = '';
        }

        let checkCount = 0;
        const maxChecks = 5;
        
        // 创建新的检查间隔
        const newCheckInterval = setInterval(() => {
            checkCount++;
            if (checkDrawerAndInitialize() || checkCount >= maxChecks) {
                clearInterval(newCheckInterval);
            }
        }, 1000);
    }
}, true); 