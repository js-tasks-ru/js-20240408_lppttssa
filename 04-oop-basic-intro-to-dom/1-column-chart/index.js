export default class ColumnChart {
  element;
  chartHeight;

  constructor({data = [], label = '', value = 0, link = '', formatHeading = value => value} = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;

    this.chartHeight = 50;
    this.element = this.createElement();
  }

  getColumnProps() {
    const maxValue = Math.max(...this.data);
    const scale = 50 / maxValue;

    return this.data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  getChartClasses() {
    const commonClass = "column-chart";

    return this.data.length ? commonClass : commonClass + " column-chart_loading";
  }

  createElement() {
    const container = document.createElement('div');

    container.innerHTML = `
      <div class="${this.getChartClasses()}" style="--chart-height: 50">
        <div class="column-chart__title">
          ${this.label}
          ${this.link ? `<a href=${this.link} class="column-chart__link">View all</a>` : null}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
          <div data-element="body" class="column-chart__chart">
            ${this.createColumns()}
          </div>
        </div>
      </div>
    `;

    return container.firstElementChild;
  }

  createColumns() {
    return this.getColumnProps().map(data => this.createColumn(data.percent, data.value)).join('');
  }

  createColumn(percent, value) {
    return `<div style="--value: ${value}" data-tooltip="${percent}"></div>`;
  }

  update(newData) {
    this.data = newData;

    const container = this.element.querySelector('.column-chart__chart');

    container.innerHTML = this.createColumns();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
