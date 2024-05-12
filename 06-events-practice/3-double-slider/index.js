export default class DoubleSlider {
  element;
  trackElement;
  trackWidth;
  progressElement;
  selectedThumbElement;
  thumbElements;
  subElements;

  constructor({min = 0, max = 10, formatValue = value => value, selected = {}} = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = {from: selected.from || this.min, to: selected.to || this.max};

    this.selectedThumbElement = null;
    this.element = this.createElement();
    this.trackElement = this.element.querySelector('.range-slider__inner');
    this.progressElement = this.element.querySelector('.range-slider__progress');
    this.thumbElements = this.getSubElements('[data-thumb]', 'thumb');
    this.subElements = this.getSubElements('[data-element]');
    this.createListeners();
  }

  getSubElements(attribute, field = 'element') {
    const elements = {};

    this.element.querySelectorAll(attribute).forEach(element => {
      elements[element.dataset[field]] = element;
    });

    return elements;
  }

  createElement() {
    const container = document.createElement('div');

    container.innerHTML = this.createElementTemplate();

    return container.firstElementChild;
  }

  createElementTemplate() {
    return `
      <div class="range-slider">
        <span data-element="from">${this.formatValue(this.selected.from)}</span>
        <div class="range-slider__inner">
          <span class="range-slider__progress"></span>
          <span data-thumb="left" class="range-slider__thumb-left"></span>
          <span data-thumb="right" class="range-slider__thumb-right"></span>
        </div>
        <span data-element="to">${this.formatValue(this.selected.to)}</span>
      </div>
    `;
  }

  createListeners() {
    for (const thumb of Object.values(this.thumbElements)) {
      thumb.addEventListener('pointerdown', this.handleThumbSelect);
    }

    document.addEventListener('pointerup', this.handleThumbLeave);
    document.addEventListener('pointermove', this.handleThumbMove);
  }

  handleThumbSelect = (event) => {
    this.selectedThumbElement = event.target;
  };

  handleThumbLeave = () => {
    if (this.selectedThumbElement) {
      this.selectedThumbElement = null;
      this.selectRange();
    }
  };

  handleThumbMove = (event) => {
    if (!this.selectedThumbElement) {
      return;
    }

    const direction = this.selectedThumbElement.dataset.thumb;

    const thumbShift = this.getShift(event, direction);
    const thumbShiftFormatted = `${thumbShift}%`;

    if (this.isThumbsJoin() && parseInt(this.selectedThumbElement.style[direction]) <= thumbShift) {
      return;
    }

    this.selectedThumbElement.style[direction] = thumbShiftFormatted;
    this.progressElement.style[direction] = thumbShiftFormatted;
    this.setSelectedValue(thumbShift, direction);
  };

  isThumbsJoin = () => {
    return (parseInt(this.thumbElements.left.style.left) || 0) + (parseInt(this.thumbElements.right.style.right || 0)) >= 100;
  };

  setSelectedValue = (percentageShift, direction = 'left') => {
    const valueShift = Math.round((this.max - this.min) * percentageShift / 100);

    if (direction === 'left') {
      this.selected.from = this.min + valueShift;
      this.updateValue(this.selected.from);
      return;
    }

    this.selected.to = this.max - valueShift;
    this.updateValue(this.selected.to, 'to');
  };

  updateValue(newValue, element = "from") {
    const elementToUpdate = this.subElements[element];

    elementToUpdate.textContent = this.formatValue(newValue);
  }

  getShift = (event, direction = 'left') => {
    const {left: trackElementLeft, right: trackElementRight} = this.trackElement.getBoundingClientRect();

    const width = this.getTrackWidth();

    let position = 0;

    if (event.clientX >= trackElementLeft) {
      position = event.clientX - trackElementLeft;
    }

    if (event.clientX > trackElementRight) {
      position = trackElementRight - trackElementLeft;
    }

    const percentPosition = position / width * 100;
    return direction === 'left' ? percentPosition : 100 - percentPosition;
  };

  getTrackWidth = () => {
    if (!this.trackWidth) {
      this.trackWidth = this.trackElement.getBoundingClientRect().width;
    }

    return this.trackWidth;
  };

  selectRange() {
    const {from, to} = this.selected;

    return this.element.dispatchEvent(new CustomEvent('range-select', {detail: {from, to}}));
  }

  removeListeners() {
    for (const thumb of Object.values(this.thumbElements || {})) {
      thumb.removeEventListener('pointerdown', this.handleThumbSelect);
    }
    document.removeEventListener('pointerup', this.handleThumbLeave);
    document.removeEventListener('pointermove', this.handleThumbMove);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.removeListeners();
    this.remove();
    this.trackElement = null;
    this.trackWidth = null;
    this.progressElement = null;
    this.selectedThumbElement = null;
    this.thumbElements = null;
    this.subElements = null;
  }
}
