export default class RangePicker {
  element;
  subElements;
  controls;
  isOpened = false;
  isInitialRender = true;
  startDate = null;
  endDate = null;

  constructor({from = new Date(), to = new Date()}) {
    this.from = new Date(from);
    this.to = new Date(to);

    this.startDate = new Date(from);
    this.endDate = new Date(from);
    this.endDate.setMonth(this.endDate.getMonth() + 1);

    this.element = this.createElement();
    this.subElements = this.getSubElements();
    this.controls = [];

    this.updateSelectorContent();
    this.createListeners();
  }

  getSubElements() {
    const elements = {};

    this.element.querySelectorAll('[data-element]').forEach(element => {
      elements[element.dataset.element] = element;
    });

    return elements;
  }

  getControls() {
    return this.element.querySelectorAll('[data-control]');
  }

  createElement() {
    const container = document.createElement('div');

    container.innerHTML = this.createElementTemplate();

    return container.firstElementChild;
  }

  createElementTemplate() {
    return `
      <div class="${this.getRangePickerClasses()}">
        ${this.createInputTemplate()}
        <div class="rangepicker__selector" data-element="selector">
        </div>
      </div>
    `;
  }

  updateSelectorContent() {
    if (this.isInitialRender) {
      this.subElements.selector.innerHTML = '';
    } else {
      this.subElements.selector.innerHTML = this.createSelectorInnerTemplate();
    }

    this.isInitialRender = false;

    const buttons = this.element.querySelectorAll('#button');
    for (const button of buttons) {
      button.addEventListener('click', this.handleDateChoose);
    }

    this.controls = this.getControls();
    for (const control of this.controls) {
      control.addEventListener('click', this.handleChangeMonths);
    }
  }

  createSelectorInnerTemplate() {
    return `
      <div data-element="selectorContent" class="rangepicker__selector-arrow"></div>
        ${this.createSelectorInnerContentTemplate()}
      </div>
    `;
  }

  createSelectorInnerContentTemplate() {
    return `
      <div data-control="left" class="rangepicker__selector-control-left"></div>
        <div data-control="right" class="rangepicker__selector-control-right"></div>
        <div class="rangepicker__calendar">
          ${this.createMonthIndicatorTemplate()}
          ${this.createDaysTemplate()}
          <div class="rangepicker__date-grid">
            ${this.createDateGridContent()}
          </div>
        </div>
        <div class="rangepicker__calendar">
          ${this.createMonthIndicatorTemplate(this.endDate)}
          ${this.createDaysTemplate()}
          <div class="rangepicker__date-grid">
            ${this.createDateGridContent(this.endDate)}
          </div>
      </div>
    `;
  }

  createInputTemplate() {
    return `
      <div class="rangepicker__input" data-element="input">
        ${this.createInputContentTemplate()}
      </div>
    `;
  }

  createInputContentTemplate() {
    return `
      <span data-element="from">${this.formatDate(this.from)}</span> -
      <span data-element="to">${this.formatDate(this.to)}</span>
    `;
  }

  createDaysTemplate() {
    return `
    <div class="rangepicker__day-of-week">
      <div>Пн</div>
      <div>Вт</div>
      <div>Ср</div>
      <div>Чт</div>
      <div>Пт</div>
      <div>Сб</div>
      <div>Вс</div>
    </div>
    `;
  }

  createMonthIndicatorTemplate(date = this.startDate) {
    const month = date.toLocaleString('ru', { month: 'long' });

    return `
      <div class="rangepicker__month-indicator">
        ${this.createMonthTemplate(month)}
      </div>
    `;
  }

  createMonthTemplate(month) {
    return `<time datetime="${month}">${month}</time>`;
  }

  createDateGridContent(date = this.startDate) {
    const dates = this.getAllMonthDates(date.getMonth(), date.getFullYear());

    return dates.map(date => this.createSelectorDateTemplate(date)).join('');
  }

  createSelectorDateTemplate(date) {
    return `<button id="button" type="button" class="${this.getSelectorDateClasses(date)}" data-value="${date}">${date.getDate()}</button>`;
  }

  updateInputs() {
    this.subElements.input.innerHTML = this.createInputContentTemplate();
  }

  updateSelector = () => {
    const months = this.element.querySelectorAll('.rangepicker__month-indicator');
    months[0].innerHTML = this.createMonthTemplate(this.startDate);
    months[1].innerHTML = this.createMonthTemplate(this.endDate);

    this.element.querySelector('.rangepicker__selector-arrow').innerHTML = this.createSelectorInnerContentTemplate();
  }

  isDatesEqual = (firstDate, secondDate) => {
    return firstDate?.getTime() === secondDate?.getTime();
  }

  isDateBetween = (date) => {
    return date > this.from && date < this.to;
  };

  isDateFromBorder = (date) => {
    return this.isDatesEqual(date, this.from);
  };

  isDateToBorder = (date) => {
    return this.isDatesEqual(date, this.to);
  };

  getSelectorDateClasses = (date) => {
    let classes = 'rangepicker__cell';

    if (this.isDateBetween(date)) {
      classes += ' rangepicker__selected-between';
    }

    if (this.isDateFromBorder(date)) {
      classes += ' rangepicker__selected-from';
    }

    if (this.isDateToBorder(date)) {
      classes += ' rangepicker__selected-to';
    }

    return classes;
  };

  getAllMonthDates = (month, year) => {
    let date = new Date(year, month, 1);
    const days = [];

    while (date.getMonth() === month) {
      days.push(new Date(date));

      date.setDate(date.getDate() + 1);
    }

    return days;
  };

  getRangePickerClasses = () => {
    return `rangepicker ${this.isOpened ? 'rangepicker_open' : ''}`;
  };

  addLeadZeroToDate = (date) => {
    return ('0' + date).slice(-2);
  };

  formatDate = (date) => {
    return `${this.addLeadZeroToDate(date.getDate())}.${this.addLeadZeroToDate(date.getMonth() + 1)}.${date.getFullYear()}`;
  };

  handleChangeMonths = (event) => {
    const direction = event.target.getAttribute(['data-control']);

    if (direction === 'left') {
      this.endDate = new Date(this.startDate);
      this.startDate.setMonth(this.startDate.getMonth() - 1);
    } else {
      this.startDate = new Date(this.endDate);
      this.endDate.setMonth(this.endDate.getMonth() + 1);
    }

    this.updateSelector();
  }

  handleSelectorOpen = () => {
    this.isOpened = !this.isOpened;

    this.element.className = this.getRangePickerClasses();

    this.updateSelectorContent();
  };

  handleDateChoose = (event) => {
    const newDate = event.target.getAttribute(['data-value']);

    if (this.from && this.to) {
      this.from = new Date(newDate);
      this.to = null;
    }

    if (this.from && !this.to || !this.from) {
      if (this.from >= new Date(newDate) || !this.from) {
        this.from = new Date(newDate);
      } else {
        this.to = new Date(newDate);
      }
    }

    this.updateSelectorContent();

    if (this.from && this.to) {
      this.updateInputs();
    }
  }

  createListeners() {
    this.subElements.input.addEventListener('click', this.handleSelectorOpen);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
