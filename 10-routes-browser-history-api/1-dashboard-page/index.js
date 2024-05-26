import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
  element;
  subElements = {};
  selectedPeriod;
  rangePicker;

  constructor() {
    this.selectedPeriod = {from: new Date(), to: new Date()};

    this.element = this.createElement();

    this.subElements = this.getSubElements();

    this.updateContent();

    this.createListeners();
  }

  getSubElements() {
    const elements = {};

    this.element.querySelectorAll('[data-element]').forEach(element => {
      elements[element.dataset.element] = element;
    });

    return elements;
  }


  createElement() {
    const container = document.createElement('div');

    container.innerHTML = this.createElementTemplate();

    return container.firstElementChild;
  }

  createRangePicker() {
    this.rangePicker = new RangePicker({...this.selectedPeriod});
    const container = this.subElements.rangePicker;
    container.innerHTML = '';

    container.append(this.rangePicker.element);
  }

  createColumnCharts() {
    const charts = ['orders', 'sales', 'customers'];

    for (const chart of charts) {
      const chartElement = new ColumnChart({
        url: `api/dashboard/${chart}`,
        label: chart,
        range: {...this.selectedPeriod}
      });

      const chartContainer = this.subElements[`${chart}Chart`];
      chartContainer.innerHTML = '';

      chartContainer.append(chartElement.element);
    }
  }

  createBestSellers() {
    const container = this.subElements.sortableTable;
    container.innerHTML = '';

    const bestSellers = new SortableTable(header, {url: 'api/dashboard/bestsellers'});

    container.append(bestSellers.element);
  }

  createElementTemplate() {
    return `
      <section class="content" id="content">
        <div class="dashboard">
          <div class="content__top-panel">
            <h2 class="page-title">Dashboard</h2>
            <div data-element="rangePicker"></div>
          </div>
          <div data-element="chartsRoot" class="dashboard__charts">
            <div data-element="ordersChart" class="dashboard__chart_orders"></div>
            <div data-element="salesChart" class="dashboard__chart_sales"></div>
            <div data-element="customersChart" class="dashboard__chart_customers"></div>
          </div>

          <h3 class="block-title">Best sellers</h3>

          <div data-element="sortableTable">
          </div>
        </div>
      </section>
    `;
  }

  updateContent = () => {
    this.createRangePicker();
    this.createColumnCharts();
    this.createBestSellers();
  };

  handleDateSelect = (event) => {
    this.selectedPeriod = {...event.detail};

    this.updateContent();
  };

  createListeners() {
    this.rangePicker.element.addEventListener('date-select', this.handleDateSelect);
  }

  removeListeners() {
    this.rangePicker.element.removeEventListener('date-select', this.handleDateSelect);
  }

  async render() {
    return this.element;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.removeListeners();
    this.remove();
  }
}
