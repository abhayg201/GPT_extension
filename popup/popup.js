// This script runs when the popup is opened.
// It requests the selected text from the active tab by injecting a script.

document.addEventListener('DOMContentLoaded', function() {
  const textContainer = document.getElementById('textContainer');

  // Query for the active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs.length === 0) {
      textContainer.innerHTML = '<span id="errorMessage">Error: No active tab found.</span>';
      return;
    }
    const activeTab = tabs[0];

    // Check if the tab URL is accessible for scripting
    if (activeTab.url && (
        activeTab.url.startsWith('chrome://') ||
        activeTab.url.startsWith('edge://') ||
        activeTab.url.startsWith('about:') ||
        activeTab.url.startsWith('https://chrome.google.com/webstore')
        )) {
      textContainer.innerHTML = '<span id="errorMessage">Cannot access content on this page.</span>';
      return;
    }

    // Execute a script in the active tab to get the selected text
    chrome.scripting.executeScript(
      {
        target: { tabId: activeTab.id },
        files: ['scripts/get_selected_text.js'] // Path relative to extension root
      },
      (injectionResults) => {
        console.log(injectionResults);
        // Check for errors during script injection
        if (chrome.runtime.lastError) {
          textContainer.innerHTML = `<span id="errorMessage">Error: ${chrome.runtime.lastError.message}</span>`;
          console.error("Scripting Error:", chrome.runtime.lastError.message);
          return;
        }

        if (injectionResults && injectionResults.length > 0 && injectionResults[0].result !== undefined) {
          const selectedText = injectionResults[0].result;
          if (selectedText && selectedText.trim() !== '') {
            textContainer.textContent = selectedText;
          } else {
            textContainer.innerHTML = '<span id="noSelection">No text selected on the page.</span>';
          }
        } else {
          textContainer.innerHTML = '<span id="noSelection">No text selected or unable to retrieve.</span>';
        }
      }
    );
  });
}); 