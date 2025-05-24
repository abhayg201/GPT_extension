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
  
  export class SelectionIcon {
    constructor() {
      this.icon = null;
    }
  
    async init() {
      try {
        this.icon = await loadTemplate('src/templates/icon.html');
        if (!this.icon) {
          console.error('Failed to load icon template');
          return this;
        }
        
        // Ensure the icon has proper styling
        this.icon.style.position = 'absolute';
        this.icon.style.zIndex = '10000';
        this.icon.style.display = 'none';
        this.icon.style.pointerEvents = 'auto';
        
        // Set an ID if it doesn't have one
        if (!this.icon.id) {
          this.icon.id = 'selection-popup-icon';
        }
        
        document.body.appendChild(this.icon);
        console.log('Icon initialized and appended to body:', this.icon);
      } catch (error) {
        console.error('Error loading icon template:', error);
      }
      return this;
    }
  
    // Delegate addEventListener to the DOM element
    addEventListener(event, handler, options) {
      if (this.icon) {
        this.icon.addEventListener(event, handler, options);
      }
    }
  
    // Delegate removeEventListener to the DOM element
    removeEventListener(event, handler, options) {
      if (this.icon) {
        this.icon.removeEventListener(event, handler, options);
      }
    }
  
    // Delegate getBoundingClientRect to the DOM element
    getBoundingClientRect() {
      return this.icon ? this.icon.getBoundingClientRect() : null;
    }
  
    show(x, y) {
      if (this.icon) {
        const left = x + window.scrollX + 5;
        const top = y + window.scrollY + 5;
        
        console.log(`Showing icon at position: left=${left}, top=${top}`);
        
        this.icon.style.left = `${left}px`;
        this.icon.style.top = `${top}px`;
        this.icon.style.display = 'block';
        this.icon.style.visibility = 'visible';
        
        console.log('Icon styles after show:', {
          display: this.icon.style.display,
          visibility: this.icon.style.visibility,
          left: this.icon.style.left,
          top: this.icon.style.top,
          zIndex: this.icon.style.zIndex
        });
      } else {
        console.error('Icon element not available');
      }
    }
  
    hide() {
      if (this.icon) {
        this.icon.style.display = 'none';
      }
    }
  
    // Getter for accessing the DOM element directly if needed
    get element() {
      return this.icon;
    }
  }