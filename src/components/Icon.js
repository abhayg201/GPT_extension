import { loadTemplate } from '../utils/template-utils.js';

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
      document.body.appendChild(this.icon);
    } catch (error) {
      console.error('Error loading icon template:', error);
    }
    return this;
  }

  show(x, y) {
    this.icon.style.left = `${x + window.scrollX + 5}px`;
    this.icon.style.top = `${y + window.scrollY + 5}px`;
    this.icon.style.display = 'block';
  }

  hide() {
    this.icon.style.display = 'none';
  }
} 