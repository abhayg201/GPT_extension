// background.js

// Listen for a message from the content script to open the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openPopup") {
    // Store the selected text from the message
    if (request.text) {
      chrome.storage.local.set({ selectedTextForPopup: request.text }, () => {
        // Open the popup after storing the text
        chrome.action.openPopup({}, () => {
          if (chrome.runtime.lastError) {
            console.warn("Could not open popup: " + chrome.runtime.lastError.message);
            // Attempt to open in a new tab if popup fails (e.g., if no window is focused)
            // This is an optional fallback, might not always be desired.
            // chrome.tabs.create({ url: chrome.runtime.getURL("popup/popup.html") });
          }
        });
      });
    } else {
      // If no text is provided, just open the popup
      chrome.action.openPopup({}, () => {
        if (chrome.runtime.lastError) {
          console.warn("Could not open popup: " + chrome.runtime.lastError.message);
        }
      });
    }
    return true; // Indicates you wish to send a response asynchronously
  }

  if (request.type === 'get-template') {
    const templatePath = request.path;
    
    fetch(chrome.runtime.getURL(templatePath))
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch template: ${response.statusText}`);
        }
        return response.text();
      })
      .then(html => {
        sendResponse({ success: true, html });
      })
      .catch(error => {
        console.error('Error loading template:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Keep the message channel open for the async response
  }
});

// Optional: Set an initial value in storage if needed, or clear it on startup
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.remove("selectedTextForPopup");
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.remove("selectedTextForPopup");
}); 