import { loadTemplate } from '../utils/template-utils.js';

export class TextContainer {
  constructor() {
    this.container = null;
  }

  async init() {
    try {
      this.container = await loadTemplate('src/templates/container.html');
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

  setupEventListeners() {
    const closeBtn = this.container.querySelector('.close-button');
    closeBtn.onclick = () => this.container.remove();
  }

  show(selectedText, x, y) {
    this.container.querySelector('#selected-text-content').textContent = selectedText;
    this.container.style.left = `${x + window.scrollX + 10}px`;
    this.container.style.top = `${y + window.scrollY + 10}px`;
    this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }

  remove() {
    this.container.remove();
  }
} 