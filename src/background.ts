// Background service worker
console.log('Background script loaded');

// Import reload client for development
import './reload-client.js';

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  
  if (message.type === 'SELECTED_TEXT') {
    // Store the selected text
    chrome.storage.local.set({ selectedText: message.text });
    sendResponse({ success: true });
  }
  
  return true; // Keep message channel open for async response
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});