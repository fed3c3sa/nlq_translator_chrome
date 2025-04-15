// Background script for NLQ Translator extension
// This script handles the automatic opening of the extension on Elastic Cloud pages

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the URL contains elastic-cloud.com and the page has finished loading
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('elastic-cloud.com')) {
    // Send a message to the content script to trigger the extension popup
    try {
      chrome.tabs.sendMessage(tabId, { action: "openExtension" });
      console.log("Sent openExtension message to tab:", tabId);
    } catch (error) {
      console.error("Error sending message to tab:", error);
    }
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openPopup") {
    try {
      console.log("Received request to open popup");
      // This will programmatically open the popup
      chrome.action.openPopup();
    } catch (error) {
      console.error("Error opening popup:", error);
    }
  }
});

// Listen for installation or update of the extension
chrome.runtime.onInstalled.addListener(() => {
  console.log("NLQ Translator extension installed or updated");
});
