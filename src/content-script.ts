import { TextContainer } from './components/Container';
import { SelectionIcon } from './components/Icon';
import { getSelectedText } from './utils/template-utils';

// Content script that runs on all pages
console.log('Content script loaded on:', window.location.href);

let icon: SelectionIcon | null = null;
let container: TextContainer | null = null;

async function injectStyles(): Promise<void> {
  try {
    const cssUrl = chrome.runtime.getURL('src/styles/components.css');
    const response = await fetch(cssUrl);
    const css = await response.text();
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  } catch (error) {
    console.error('Error injecting styles:', error);
  }
}

async function initialize(): Promise<void> {
  try {
    // Inject CSS styles
    // await injectStyles();
    
    // Initialize components
    icon = await new SelectionIcon().init();
    container = await new TextContainer().init();
    
    console.log('Components initialized:', { icon, container });
    
    // Setup icon event listeners
    if (icon) {
      icon.addEventListener('mousedown', (e: Event) => {
        e.stopPropagation();
      });

      icon.addEventListener('click', async (e: Event) => {
        e.stopPropagation();
        const selectedText = getSelectedText();
        if (selectedText && container && icon) {
          const rect = icon.getBoundingClientRect();
          container.show(selectedText, rect.right, rect.bottom);
          
          // Send selected text to background script
          try {
            if (chrome.runtime && chrome.runtime.sendMessage) {
              chrome.runtime.sendMessage({
                type: 'SELECTED_TEXT',
                text: selectedText,
                url: window.location.href
              }, (response) => {
                if (chrome.runtime.lastError) {
                  console.error('Message sending failed:', chrome.runtime.lastError);
                } else {
                  console.log('Message sent successfully:', response);
                }
              });
            } else {
              console.warn('Chrome runtime not available');
            }
          } catch (error) {
            console.error('Error sending message:', error);
          }
        }
        if (icon) {
          icon.hide();
        }
      });
    }

    // Setup document event listeners
    setupMouseEvents();
  } catch (error) {
    console.error('Error initializing content script:', error);
  }
}

function setupMouseEvents(): void {
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('selectionchange', handleSelectionChange);
}

function handleMouseUp(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  
  // Skip if clicking on our icon or in input fields
  if (target.id === 'selection-popup-icon' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable) {
    return;
  }

  const selectedText = getSelectedText();
  if (selectedText && icon) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      icon.show(rect.right, rect.bottom);
    }
  } else if (icon) {
    icon.hide();
  }
}

function handleMouseDown(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (target.id !== 'selection-popup-icon' && icon) {
    icon.hide();
  }
}

function handleSelectionChange(): void {
  const selectedText = getSelectedText();
  if (!selectedText && icon) {
    // Optional: Handle selection change when text is deselected
  }
}

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    if (message.type === 'GET_SELECTED_TEXT') {
      const selectedText = getSelectedText();
      sendResponse({ text: selectedText });
      return true; // Indicate we will send a response
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
  
  return false; // No response needed for other message types
});

// Initialize the extension
initialize(); 