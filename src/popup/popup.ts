// Popup script
document.addEventListener('DOMContentLoaded', async () => {
  const textDisplay = document.getElementById('selectedText') as HTMLDivElement;
  const refreshBtn = document.getElementById('refreshBtn') as HTMLButtonElement;

  // Load stored selected text
  async function loadSelectedText() {
    try {
      const result = await chrome.storage.local.get(['selectedText']);
      if (result.selectedText) {
        textDisplay.textContent = result.selectedText;
      } else {
        textDisplay.textContent = 'No text selected yet...';
      }
    } catch (error) {
      console.error('Error loading selected text:', error);
      textDisplay.textContent = 'Error loading text';
    }
  }

  // Refresh button handler
  refreshBtn.addEventListener('click', async () => {
    try {
      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab.id) {
        // Ask content script for currently selected text
        try {
          const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_SELECTED_TEXT' });
          if (chrome.runtime.lastError) {
            throw new Error(chrome.runtime.lastError.message);
          }
          if (response?.text) {
            textDisplay.textContent = response.text;
            // Store it
            await chrome.storage.local.set({ selectedText: response.text });
          } else {
            textDisplay.textContent = 'No text currently selected';
          }
        } catch (messageError) {
          console.error('Failed to communicate with content script:', messageError);
          textDisplay.textContent = 'Error: Content script not available on this page';
        }
      }
    } catch (error) {
      console.error('Error refreshing:', error);
      textDisplay.textContent = 'Error: Make sure you\'re on a web page';
    }
  });

  // Initial load
  await loadSelectedText();
}); 