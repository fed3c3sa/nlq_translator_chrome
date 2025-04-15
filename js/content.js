// Content script for NLQ Translator extension
// This script handles the automatic opening of the extension popup on Elastic Cloud pages

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openExtension") {
    try {
      // Create a floating button that opens the extension
      createFloatingButton();
      
      // Don't automatically open the popup as it causes issues
      // Just show the floating button instead
    } catch (error) {
      console.error("Error in NLQ Translator extension:", error);
    }
  }
});

// Function to create a floating button that stays visible
function createFloatingButton() {
  try {
    // Check if button already exists
    if (document.getElementById('nlq-translator-button')) {
      return;
    }
    
    // Create the button element
    const button = document.createElement('div');
    button.id = 'nlq-translator-button';
    button.textContent = 'NLQ';
    
    // Style the button
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.borderRadius = '50%';
    button.style.backgroundColor = '#0d6efd';
    button.style.color = 'white';
    button.style.display = 'flex';
    button.style.justifyContent = 'center';
    button.style.alignItems = 'center';
    button.style.fontWeight = 'bold';
    button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    button.style.cursor = 'pointer';
    button.style.zIndex = '10000';
    
    // Add hover effect
    button.onmouseover = function() {
      this.style.backgroundColor = '#0b5ed7';
    };
    button.onmouseout = function() {
      this.style.backgroundColor = '#0d6efd';
    };
    
    // Add click event to open the extension popup
    button.onclick = function() {
      try {
        // Use chrome.runtime.sendMessage to tell the background script to open the popup
        chrome.runtime.sendMessage({ action: "openPopup" });
      } catch (error) {
        console.error("Error opening popup:", error);
      }
    };
    
    // Add the button to the page
    document.body.appendChild(button);
    console.log("NLQ Translator button added to page");
  } catch (error) {
    console.error("Error creating floating button:", error);
  }
}

// Initialize when the page loads
window.addEventListener('load', function() {
  try {
    console.log("NLQ Translator content script loaded on:", window.location.href);
    // Check if we're on an Elastic Cloud page
    if (window.location.href.includes('elastic-cloud.com')) {
      console.log("Detected Elastic Cloud page, creating button");
      // Create the floating button
      createFloatingButton();
    }
  } catch (error) {
    console.error("Error in NLQ Translator load handler:", error);
  }
});

// Also run immediately in case the page is already loaded
try {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log("Document already loaded, checking for Elastic Cloud page");
    if (window.location.href.includes('elastic-cloud.com')) {
      console.log("Detected Elastic Cloud page, creating button immediately");
      createFloatingButton();
    }
  }
} catch (error) {
  console.error("Error in immediate execution:", error);
}
