import fetchJson from './utils/fetch-json.js';
import {sort} from "../../05-dom-document-loading/2-sortable-table-v1/utils.js";

import SortableTableV2 from "../../06-events-practice/1-sortable-table-v2/index.js";

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {
  page = 0;
  itemsPerPage = 30;
  isDataLoading = false;

  constructor(headersConfig, {
    data = [],
    sorted = {},
    url = 'api/rest/products',
    isSortLocally = false
  } = {}) {
    super(headersConfig, {data, sorted, isSortLocally});

    this.url = url;

    window.addEventListener("scroll", this.handleInfiniteScroll);

    this.updateData();
  }

  createLoaderTemplate() {
    return `<div data-element="loading" class="loading-line sortable-table__loading-line"></div>`;
  }

  createEmptyTemplate() {
    return `
      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <div>
          <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
        </div>
      </div>
    `;
  }

  createElementTemplate() {
    return `
      <div class="sortable-table">
        ${this.createHeaderTemplate()}
        ${this.createBodyTemplate()}
        ${this.createLoaderTemplate()}
      </div>
    `;
  }

  createURL(id, order) {
    const q = new URL(this.url, BACKEND_URL);

    q.searchParams.set("_sort", id);
    q.searchParams.set("_order", order);
    q.searchParams.set("_start", (this.page * this.itemsPerPage).toString());
    q.searchParams.set("_end", ((this.page + 1) * this.itemsPerPage).toString());

    return q.href;
  }

  async loadData(id, order) {
    return await fetchJson(this.createURL(id, order));
  }

  async updateData(id = this.sorted.id, order = this.sorted.order) {
    this.toggleElementLoadingClass();
    this.isDataLoading = true;

    this.data = [...this.data, ...await this.loadData(id, order).then(data => {
      this.toggleElementLoadingClass();
      this.isDataLoading = false;

      return data;
    })];

    this.updateBody();
  }

  updateBody() {
    this.subElements.body.innerHTML = this.data.length ? this.createBodyDataTemplate() : this.createEmptyTemplate();
  }

  toggleElementLoadingClass = () => {
    this.element.classList.toggle('sortable-table_loading');
  };

  handleInfiniteScroll = () => {
    if (!this.isDataLoading && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
      this.page += 1;

      this.updateData();
    }
  };

  sort = (id = 'title', order = 'asc') => {
    this.page = 0;

    if (this.isSortLocally) {
      this.sortOnClient(id, order);
    } else {
      this.sorted = {id, order};
      this.sortOnServer(id, order);
    }
  };

  sortOnClient = (id, order) => {
    const sortType = this.headerConfig.find(item => item.id === id).sortType;

    this.data = sort(this.data, id, order, sortType);

    this.updateBody();
  };

  async sortOnServer(id, order) {
    this.data = [];

    this.updateBody();
    await this.updateData(id, order);
  }

  async render() {
    await this.updateData();
  }
}
