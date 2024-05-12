import fetchJson from './utils/fetch-json.js';

import ColumnChartV1 from "../../04-oop-basic-intro-to-dom/1-column-chart/index.js";

const BACKEND_URL = 'https://course-js.javascript.ru';

class ColumnChart extends ColumnChartV1 {
  subElements = {};

  constructor({
    data = [],
    label = '',
    value = 0,
    link = '',
    formatHeading = value => value,
    url = 'api/dashboard/orders',
    range = {
      from: '',
      to: '',
    }
  } = {}) {
    super({data, label, value, link, formatHeading});

    this.range = range;
    this.url = url;
    this.subElements = this.getSubElements();

    this.update();
  }

  getSubElements() {
    const elements = {};

    this.element.querySelectorAll('[data-element]').forEach(element => {
      elements[element.dataset.element] = element;
    });

    return elements;
  }

  createURL() {
    const q = new URL(this.url, BACKEND_URL);

    const {from, to} = this.range;

    q.searchParams.set("from", from);
    q.searchParams.set("to", to);

    return q.href;
  }

  async loadData() {
    return await fetchJson(this.createURL());
  }

  getData() {
    return this.loadData().then(data => data);
  }

  async update(from = this.range.from, to = this.range.to, is = false) {
    this.range = {from: from, to: to};

    const newData = await this.getData();
    this.data = Object.values(newData);

    this.element.className = this.getChartClasses();

    const chart = this.element.querySelector('.column-chart__chart');
    chart.innerHTML = this.createColumns();

    return newData;
  }
}

export default ColumnChart;
