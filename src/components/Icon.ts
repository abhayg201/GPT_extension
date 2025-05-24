
const templateIconHTML = `<div id="selection-popup-icon" class="popup-icon">
  💬
</div> `

export class SelectionIcon {
  private icon: HTMLElement | null = null;

  async init(): Promise<SelectionIcon> {
    try {
      this.icon = document.createElement('div');
      this.icon.innerHTML = templateIconHTML;
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

  show(x: number, y: number): void {
    if (!this.icon) return;
    
    this.icon.style.left = `${x + window.scrollX + 5}px`;
    this.icon.style.top = `${y + window.scrollY + 5}px`;
    this.icon.style.display = 'block';
  }

  hide(): void {
    if (!this.icon) return;
    this.icon.style.display = 'none';
  }

  addEventListener(event: string, handler: (e: Event) => void): void {
    if (!this.icon) return;
    this.icon.addEventListener(event, handler);
  }

  getBoundingClientRect(): DOMRect {
    if (!this.icon) {
      return new DOMRect(0, 0, 0, 0);
    }
    return this.icon.getBoundingClientRect();
  }
} 