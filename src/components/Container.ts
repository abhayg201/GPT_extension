import { loadTemplate } from '../utils/template-utils.js';


const templateHTML = `<div id="selected-text-container" class="text-container">
  <span class="close-button">✖</span>
  <div id="selected-text-content" class="content"></div>
  <div id="gpt-response" class="gpt-response">
    <div class="loading-spinner" style="display: none;">Loading...</div>
    <div class="response-text"></div>
  </div>
</div> `

export class TextContainer {
  private container: HTMLElement | null = null;

  async init(): Promise<TextContainer> {
    try {
      this.container = document.createElement('div');
      this.container.innerHTML = templateHTML;
      if (!this.container) {
        console.error('Failed to load container template');
        return this;
      }
      this.setupEventListeners();
      document.body.appendChild(this.container);
    } catch (error) {
      console.error('Error loading container template:', error);
    }
    return this;
  }

  private setupEventListeners(): void {
    if (!this.container) return;
    
    const closeBtn = this.container.querySelector('.close-button') as HTMLElement;
    if (closeBtn) {
      closeBtn.onclick = () => this.remove();
    }
  }

  show(selectedText: string, x: number, y: number): void {
    if (!this.container) return;
    
    const contentElement = this.container.querySelector('#selected-text-content') as HTMLElement;
    if (contentElement) {
      contentElement.textContent = selectedText;
    }
    
    this.container.style.left = `${x + window.scrollX + 10}px`;
    this.container.style.top = `${y + window.scrollY + 10}px`;
    this.container.style.display = 'block';
  }

  hide(): void {
    if (!this.container) return;
    this.container.style.display = 'none';
  }

  remove(): void {
    if (!this.container) return;
    this.container.remove();
  }

  // Method to update GPT response section
  updateGPTResponse(response: string, isLoading: boolean = false): void {
    if (!this.container) return;
    
    const spinner = this.container.querySelector('.loading-spinner') as HTMLElement;
    const responseText = this.container.querySelector('.response-text') as HTMLElement;
    
    if (spinner) {
      spinner.style.display = isLoading ? 'block' : 'none';
    }
    
    if (responseText) {
      responseText.textContent = isLoading ? '' : response;
    }
  }
} 