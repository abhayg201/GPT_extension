// Utility function for loading templates
export async function loadTemplate(templatePath) {
  try {
    // Make sure we're getting a valid extension URL
    if (!chrome || !chrome.runtime || !chrome.runtime.getURL) {
      console.error('Chrome runtime API not available');
      throw new Error('Chrome runtime API not available');
    }
    
    const url = chrome.runtime.getURL(templatePath);
    console.log('Loading template from URL:', url); // Debug log
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch template: ${response.statusText}`);
    }
    
    const text = await response.text();
    const template = document.createElement('template');
    template.innerHTML = text.trim();
    return template.content.firstElementChild;
  } catch (error) {
    console.error(`Error loading template ${templatePath}:`, error);
    throw error;
  }
} 