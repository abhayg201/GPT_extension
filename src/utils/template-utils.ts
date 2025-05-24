// Utility function for loading templates
export async function loadTemplate(templatePath: string): Promise<HTMLElement> {
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
    
    const element = template.content.firstElementChild as HTMLElement;
    if (!element) {
      throw new Error('Template did not contain a valid HTML element');
    }
    
    return element;
  } catch (error) {
    console.error(`Error loading template ${templatePath}:`, error);
    throw error;
  }
}

// Helper function to get selected text
export function getSelectedText(): string {
  return window.getSelection()?.toString().trim() || '';
} 