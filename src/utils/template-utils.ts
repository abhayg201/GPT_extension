// Utility function for loading templates
export async function loadTemplate(templatePath: string): Promise<HTMLElement | null> {
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
    
    return template.content.firstElementChild as HTMLElement;
  } catch (error) {
    console.error(`Error loading template ${templatePath}:`, error);
    throw error;
  }
}

// Helper function to get selected text
export function getSelectedText(): string {
  const selection = window.getSelection();
  return selection ? selection.toString().trim() : '';
} 