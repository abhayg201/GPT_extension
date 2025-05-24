import { ChatGPTService } from '../services/chatgpt-service';

export class TextContainer {
  private container: HTMLElement | null = null;

  constructor() {
    console.log('TextContainer constructor called');
  }

  async init(): Promise<TextContainer> {
    try {
      console.log('Initializing TextContainer...');
      
      // Create container element directly
      this.container = document.createElement('div');
      this.container.id = 'selected-text-container';
      this.container.className = 'text-container';
      
      // Create the HTML structure
      this.container.innerHTML = `
        <span class="close-button">✖</span>
        <div id="selected-text-content" class="content"></div>
        <div id="gpt-response" class="gpt-response">
          <div class="loading-spinner" style="display: none;">Loading...</div>
          <div class="response-text"></div>
        </div>
      `;
      
      // Set styles directly
      this.container.style.position = 'absolute';
      this.container.style.zIndex = '100000';
      this.container.style.display = 'none';
      this.container.style.visibility = 'hidden';
      this.container.style.backgroundColor = '#fff';
      this.container.style.border = '1px solid #ccc';
      this.container.style.padding = '10px';
      this.container.style.borderRadius = '6px';
      this.container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
      this.container.style.minWidth = '300px';
      this.container.style.wordBreak = 'break-word';
      this.container.style.fontFamily = 'Arial, sans-serif';
      
      document.body.appendChild(this.container);
      console.log('Container created and appended to body:', this.container);
      
      // Set up close button
      const closeButton = this.container.querySelector('.close-button') as HTMLElement;
      if (closeButton) {
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '8px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = '#999';
        closeButton.style.fontSize = '14px';
        closeButton.style.fontWeight = 'bold';
        
        closeButton.addEventListener('click', () => {
          this.hide();
        });
      }
      
      return this;
    } catch (error) {
      console.error('Error initializing TextContainer:', error);
      throw error;
    }
  }

  async show(text: string, x: number, y: number): void {
    if (this.container) {
      console.log(`Showing container with text: "${text}" at position: x=${x}, y=${y}`);
      
      // Update the text content
      const contentElement = this.container.querySelector('#selected-text-content') as HTMLElement;
      if (contentElement) {
        contentElement.textContent = text;
        contentElement.style.color = '#000';
        contentElement.style.marginTop = '15px';
        contentElement.style.fontSize = '14px';
        contentElement.style.lineHeight = '1.4';
        console.log('Content element updated with text:', text);
      }
      
      // Position the container
      const left = x + window.scrollX + 5;
      const top = y + window.scrollY + 5;
      
      this.container.style.left = `${left}px`;
      this.container.style.top = `${top}px`;
      this.container.style.display = 'block';
      this.container.style.visibility = 'visible';
      
      // Start ChatGPT request
      this.requestChatGPTResponse(text);
      
      console.log('Container positioned and made visible');
    } else {
      console.error('Container element not available');
    }
  }

  hide(): void {
    if (this.container) {
      this.container.style.display = 'none';
      this.container.style.visibility = 'hidden';
      console.log('Container hidden');
    }
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

  private async requestChatGPTResponse(selectedText: string): Promise<void> {
    const loadingSpinner = this.container?.querySelector('.loading-spinner') as HTMLElement;
    const responseElement = this.container?.querySelector('.response-text') as HTMLElement;
    
    if (!loadingSpinner || !responseElement) {
      console.error('Loading spinner or response element not found');
      return;
    }

    try {
      // Show loading state
      loadingSpinner.style.display = 'block';
      responseElement.textContent = '';
      
      console.log('Requesting ChatGPT response for:', selectedText);
      
      // Call ChatGPT API
      const result = await ChatGPTService.sendMessage(selectedText);
      
      // Hide loading state
      loadingSpinner.style.display = 'none';
      
      if (result.success && result.response) {
        responseElement.textContent = result.response;
        responseElement.style.color = '#333';
        responseElement.style.marginTop = '10px';
        responseElement.style.fontSize = '14px';
        responseElement.style.lineHeight = '1.4';
        console.log('ChatGPT response displayed successfully');
      } else {
        responseElement.textContent = result.error || 'Failed to get response from ChatGPT';
        responseElement.style.color = '#d32f2f';
        responseElement.style.fontStyle = 'italic';
        console.error('ChatGPT request failed:', result.error);
      }
      
    } catch (error) {
      console.error('Error requesting ChatGPT response:', error);
      loadingSpinner.style.display = 'none';
      responseElement.textContent = 'Error: Failed to connect to ChatGPT';
      responseElement.style.color = '#d32f2f';
      responseElement.style.fontStyle = 'italic';
    }
  }
} 