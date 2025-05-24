import { SelectionIcon } from './src/components/Icon.js';
import { TextContainer } from './src/components/Container.js';

let icon = null;
let container = null;

async function initialize() {
  // Initialize components
  icon = await new SelectionIcon().init();
  container = await new TextContainer().init();
  console.log('icon', icon);
  console.log('container', container);
  // Setup icon event listeners
  icon.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });

  icon.addEventListener('click', async (e) => {
    e.stopPropagation();
    const selectedText = getSelectedText();
    if (selectedText) {
      const rect = icon.getBoundingClientRect();
      container.show(selectedText, rect.right, rect.bottom);
    }
    icon.hide();
  });

  // Setup document event listeners
  setupMouseEvents();
}

function setupMouseEvents() {
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('selectionchange', handleSelectionChange);
}

function handleMouseUp(event) {
  if (event.target.id === 'selection-popup-icon' ||
      event.target.tagName === 'INPUT' ||
      event.target.tagName === 'TEXTAREA' ||
      event.target.isContentEditable) {
    return;
  }

  const selectedText = getSelectedText();
  if (selectedText) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      icon.show(rect.right, rect.bottom);
    }
  } else {
    icon.hide();
  }
}

function handleMouseDown(event) {
  if (event.target.id !== 'selection-popup-icon') {
    icon.hide();
  }
}

function handleSelectionChange() {
  const selectedText = getSelectedText();
  if (!selectedText && icon && icon.style.display === 'block') {
    // Optional: Handle selection change
  }
}

// Direct template loading function within the content script
async function loadTemplate(templatePath) {
  try {
    const url = chrome.runtime.getURL(templatePath);
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

// Initialize the components
initialize(); 