// Dynamic import for Chrome extension
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

export class TextContainer {
  constructor() {
    this.container = null;
  }

  async init() {
    try {
      console.log('Initializing TextContainer...');
      
      // Load the container template
      this.container = await loadTemplate('src/templates/container.html');
      
      if (!this.container) {
        throw new Error('Failed to load container template');
      }

      // Set up the container styling
      // this.container.style.position = 'absolute';
      // this.container.style.zIndex = '100000';
      // this.container.style.display = 'none';
      // this.container.style.visibility = 'hidden';
      
      // Add to DOM
      document.body.appendChild(this.container);
      console.log('Container added to DOM:', this.container);
      
      // Set up close button functionality
      const closeButton = this.container.querySelector('.close-button');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          this.hide();
        });
      }
      
      console.log('TextContainer initialized successfully');
      return this;
    } catch (error) {
      console.error('Error initializing TextContainer:', error);
      throw error;
    }
  }

  // Delegate addEventListener to the DOM element
  addEventListener(event, handler, options) {
    if (this.container) {
      this.container.addEventListener(event, handler, options);
    }
  }

  // Delegate removeEventListener to the DOM element
  removeEventListener(event, handler, options) {
    if (this.container) {
      this.container.removeEventListener(event, handler, options);
    }
  }

  show(text, x, y) {
    if (this.container) {
      console.log(`Showing container with text: "${text}" at position: x=${x}, y=${y}`);
      
      // Update the text content
      const contentElement = this.container.querySelector('#selected-text-content');
      if (contentElement) {
        contentElement.textContent = text;
      } else {
        console.error('Content element not found in container');
        return;
      }
      
      // Position the container
      const left = x + window.scrollX + 5;
      const top = y + window.scrollY + 5;
      
      this.container.style.left = `${left}px`;
      this.container.style.top = `${top}px`;
      this.container.style.display = 'block';
      this.container.style.visibility = 'visible';
      
      console.log('Container styles after show:', {
        display: this.container.style.display,
        visibility: this.container.style.visibility,
        left: this.container.style.left,
        top: this.container.style.top,
        zIndex: this.container.style.zIndex,
        textContent: contentElement ? contentElement.textContent : 'Content element not found'
      });
    } else {
      console.error('Container element not available');
    }
  }

  hide() {
    if (this.container) {
      this.container.style.display = 'none';
      this.container.style.visibility = 'hidden';
      console.log('Container hidden');
    }
  }

  // Getter for accessing the DOM element directly if needed
  get element() {
    return this.container;
  }
}