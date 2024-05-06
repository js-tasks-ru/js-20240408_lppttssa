class Tooltip {
  static instance;
  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  createElement() {
    const container = document.createElement('div');

    container.innerHTML = this.createElementTemplate();

    return container.firstElementChild;
  }

  createElementTemplate() {
    return `
      <div class="tooltip">This is tooltip</div>
    `;
  }

  handlePointerOver(event) {
    const tooltipText = event.target.dataset.tooltip;

    if (tooltipText !== undefined) {
      this.render(tooltipText);
    }
  }

  handlePointerOut() {
    this.remove();
  }

  handlePointerMove(event) {
    this.element.style.top = `${event.clientY}px`;
    this.element.style.left = `${event.clientX}px`;
  }

  createListeners() {
    document.addEventListener('pointerover', (event) => this.handlePointerOver(event));
    document.addEventListener('pointerout', () => this.handlePointerOut());
    document.addEventListener('pointermove', (event) => this.handlePointerMove(event));
  }

  initialize() {
    this.element = this.createElement();
    this.createListeners();
  }

  render(content = '') {
    this.element.textContent = content;
    document.body.append(this.element);
  }

  removeListeners() {
    document.removeEventListener('pointerover', this.handlePointerOver);
    document.removeEventListener('pointerout', this.handlePointerOut);
    document.removeEventListener('pointermove', this.handlePointerMove);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.removeListeners();
    this.remove();
  }
}

export default Tooltip;
