import { TextContainer } from './components/Container';
import { SelectionIcon } from './components/Icon';
import { getSelectedText } from './utils/template-utils';

// Content script that runs on all pages
console.log('Content script  on:', window.location.href);

let icon: SelectionIcon | null = null;
let container: TextContainer | null = null;
let lastSelectedText = '';
let lastSelectionRect: DOMRect | null = null;

async function initialize(): Promise<void> {
  try {
    console.log('Starting initialization...');
    
    // Initialize icon
    console.log('Creating SelectionIcon...');
    icon = new SelectionIcon();
    await icon.init();
    console.log('Icon initialized successfully');
    
    // Initialize container
    console.log('Creating TextContainer...');
    container = new TextContainer();
    await container.init();
    console.log('Container initialized successfully');
    
    // Setup icon event listeners
    setupIconEventListeners();
    
    // Setup document event listeners
    setupMouseEvents();
    
    console.log('Initialization completed successfully');
  } catch (error) {
    console.error('Error initializing content script:', error);
  }
}

function setupIconEventListeners(): void {
  if (!icon) return;
  
  console.log('Setting up icon event listeners...');
  
  icon.addEventListener('mousedown', (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
  });

  icon.addEventListener('click', async (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Icon clicked!');
    
    const selectedText = lastSelectedText || getSelectedText();
    console.log('Selected text for container:', selectedText);
    
    if (selectedText && container) {
      const rect = icon!.getBoundingClientRect();
      container.show(selectedText, rect.right, rect.bottom);
      
      // Send message to background
      try {
        chrome.runtime.sendMessage({
          type: 'SELECTED_TEXT',
          text: selectedText,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
    
    icon!.hide();
  });
}

function setupMouseEvents(): void {
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('selectionchange', handleSelectionChange);
}

function handleSelectionChange(): void {
  const selectedText = getSelectedText();
  
  if (selectedText) {
    lastSelectedText = selectedText;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      lastSelectionRect = range.getBoundingClientRect();
    }
  }
}

function handleMouseUp(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  
  if (target.id === 'selection-popup-icon' ||
      target.closest('#selection-popup-icon') ||
      target.closest('#selected-text-container') ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable) {
    return;
  }

  setTimeout(() => {
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
  }, 10);
}

function handleMouseDown(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (target.id !== 'selection-popup-icon' && 
      !target.closest('#selected-text-container') && 
      icon) {
    icon.hide();
  }
  if (target.id !== 'selected-text-container' && 
      !target.closest('#selected-text-container') && 
      container) {
    container.hide();
  }
}

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SELECTED_TEXT') {
    const selectedText = getSelectedText();
    sendResponse({ text: selectedText });
    return true;
  }
  return false;
});

// Initialize
initialize(); 