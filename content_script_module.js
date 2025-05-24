// Use dynamic imports instead of static imports
let SelectionIcon, TextContainer;

let icon = null;
let container = null;

let lastSelectedText = '';
let lastSelectionRect = null;

async function initialize() {
  try {
    // Dynamic imports for Chrome extension modules
    const iconModule = await import(chrome.runtime.getURL('./src/components/Icon.js'));
    const containerModule = await import(chrome.runtime.getURL('./src/components/Container.js'));
    
    SelectionIcon = iconModule.SelectionIcon;
    TextContainer = containerModule.TextContainer;

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
      console.log('Icon clicked!');
      const selectedText = getSelectedText();
      console.log('selectedText', selectedText);
      if (selectedText) {
        console.log('selectedText for container:', selectedText);
        const rect = icon.getBoundingClientRect();
        console.log('Icon rect for container positioning:', rect);
        container.show(selectedText, rect.right, rect.bottom);
      } else {
        console.log('No selected text when icon clicked');
      }
      icon.hide();
    });

    // Setup document event listeners
    setupMouseEvents();
  } catch (error) {
    console.error('Failed to initialize components:', error);
  }
}

function setupMouseEvents() {
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('selectionchange', handleSelectionChange);
}

function handleMouseUp(event) {
  console.log('Mouse up event triggered');
  
  if (event.target.id === 'selection-popup-icon' ||
      event.target.tagName === 'INPUT' ||
      event.target.tagName === 'TEXTAREA' ||
      event.target.isContentEditable) {
    console.log('Ignoring mouse up on input/textarea/editable element');
    return;
  }

  // Use stored selected text if current selection is empty
  const currentSelectedText = getSelectedText();
  const selectedText = currentSelectedText || lastSelectedText;
  const rect = lastSelectionRect;
  
  console.log('Selected text:', selectedText);
  
  if (selectedText && rect) {
    console.log('Selection rect:', rect);
    
    if (icon && typeof icon.show === 'function') {
      icon.show(rect.right, rect.bottom);
      console.log('Icon show method called');
    } else {
      console.error('Icon or icon.show method not available');
    }
  } else {
    console.log('No text selected, hiding icon');
    if (icon && typeof icon.hide === 'function') {
      icon.hide();
    }
    if (container && typeof container.hide === 'function') {
      container.hide();
    }
    // Clear stored text
    lastSelectedText = '';
    lastSelectionRect = null;
  }
}

function handleMouseDown(event) {
  // Don't hide if clicking on the icon or container
  if (event.target.id !== 'selection-popup-icon' && 
      !event.target.closest('#text-container')) {
    if (icon && typeof icon.hide === 'function') {
      icon.hide();
    }
    if (container && typeof container.hide === 'function') {
      container.hide();
    }
  }
}

function handleSelectionChange() {
  const selectedText = getSelectedText();
  console.log('selectedText', selectedText);
  
  if (selectedText) {
    // Store the selected text and its position
    lastSelectedText = selectedText;
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      lastSelectionRect = range.getBoundingClientRect();
    }
  } else {
    // Only clear if we're not clicking on our UI elements
    if (icon && container) {
      if (typeof icon.hide === 'function') {
        icon.hide();
      }
      if (typeof container.hide === 'function') {
        container.hide();
      }
    }
  }
}

function getSelectedText() {
  const selection = window.getSelection();
  return selection.toString().trim();
}

// Initialize the components
initialize();