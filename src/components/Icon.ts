import { loadTemplate } from '../utils/template-utils';

export class SelectionIcon {
  private icon: HTMLElement | null = null;

  constructor() {
    console.log('SelectionIcon constructor called');
  }

  private async injectIconCSS(): Promise<void> {
    // Check if CSS is already injected
    if (document.getElementById('icon-styles')) {
      return;
    }

    try {
      const cssUrl = chrome.runtime.getURL('src/styles/icon.css');
      const response = await fetch(cssUrl);
      const css = await response.text();
      
      const style = document.createElement('style');
      style.id = 'icon-styles';
      style.textContent = css;
      document.head.appendChild(style);
      console.log('Icon CSS injected successfully');
    } catch (error) {
      console.error('Error loading icon CSS:', error);
      // Fallback to inline styles if CSS loading fails
      this.injectFallbackCSS();
    }
  }

  private injectFallbackCSS(): void {
    const style = document.createElement('style');
    style.id = 'icon-styles-fallback';
    style.textContent = `
      .popup-icon {
        position: absolute;
        z-index: 99999;
        display: none;
        cursor: pointer;
        user-select: none;
        background-color: #4285f4;
        border: 1px solid #1a73e8;
        border-radius: 50%;
        padding: 5px;
        font-size: 14px;
        box-shadow: 0px 2px 8px rgba(0,0,0,0.3);
        width: 24px;
        height: 24px;
        color: white;
        text-align: center;
        line-height: 14px;
        transition: all 0.2s ease;
      }
      .popup-icon:hover {
        background-color: #1a73e8;
        transform: scale(1.1);
      }
    `;
    document.head.appendChild(style);
    console.log('Fallback icon CSS injected');
  }

  async init(): Promise<SelectionIcon> {
    try {
      console.log('Initializing SelectionIcon...');
      
      // Inject CSS first
      await this.injectIconCSS();
      
      // Try to load template, fallback to creating element if it fails
      try {
        this.icon = await loadTemplate('src/templates/icon.html');
        console.log('Icon template loaded successfully');
      } catch (templateError) {
        console.warn('Failed to load icon template, creating element directly:', templateError);
        // Fallback to creating element directly
        this.icon = document.createElement('div');
        this.icon.id = 'selection-popup-icon';
        this.icon.className = 'popup-icon';
        this.icon.innerHTML = '💬';
      }
      
      if (!this.icon) {
        throw new Error('Failed to create icon element');
      }
      
      // Ensure the icon has the correct ID and class
      if (!this.icon.id) {
        this.icon.id = 'selection-popup-icon';
      }
      if (!this.icon.classList.contains('popup-icon')) {
        this.icon.classList.add('popup-icon');
      }
      
      document.body.appendChild(this.icon);
      console.log('Icon created and appended to body:', this.icon);
      
      return this;
    } catch (error) {
      console.error('Error initializing SelectionIcon:', error);
      throw error;
    }
  }

  show(x: number, y: number): void {
    if (this.icon) {
      console.log(`Showing icon at position: x=${x}, y=${y}`);
      this.icon.style.left = `${x + window.scrollX + 5}px`;
      this.icon.style.top = `${y + window.scrollY + 5}px`;
      this.icon.style.display = 'block';
    }
  }

  hide(): void {
    if (this.icon) {
      console.log('Hiding icon');
      this.icon.style.display = 'none';
    }
  }

  getBoundingClientRect(): DOMRect {
    if (this.icon) {
      return this.icon.getBoundingClientRect();
    }
    return new DOMRect();
  }

  addEventListener(event: string, handler: EventListener): void {
    if (this.icon) {
      this.icon.addEventListener(event, handler);
    }
  }
} 