import {sort} from "./utils.js";

export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.element = this.createElement();
    this.subElements = this.getSubElements();
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

  createElementTemplate() {
    return `
      <div class="sortable-table">
        ${this.createHeaderTemplate()}
        ${this.createBodyTemplate()}
      </div>
    `;
  }

  createHeaderTemplate() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerConfig.map(cell => this.createHeaderCellTemplate(cell)).join('')}
      </div>
    `;
  }

  createHeaderCellTemplate(cellData) {
    if (cellData.template) {
      return cellData.template();
    }

    return `
      <div class="sortable-table__cell" data-id="${cellData.id}" data-sortable="${cellData.sortable}">
        <span>${cellData.title}</span>
      </div>
    `;
  }

  createBodyTemplate() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.createBodyDataTemplate()}
      </div>
    `;
  }

  createBodyDataTemplate() {
    return this.data.map(cell => this.createBodyRowTemplate(cell)).join('');
  }

  createBodyRowTemplate(rowData) {
    return `
      <a href="/products/${rowData.id}" class="sortable-table__row">
        ${rowData.images && this.createBodyImageCellTemplate(rowData.images[0], rowData.title)}

        ${rowData.title && `<div class="sortable-table__cell">${rowData.title}</div>`}

        ${rowData.quantity && `<div class="sortable-table__cell">${rowData.quantity}</div>`}
        ${rowData.price && `<div class="sortable-table__cell">${rowData.price}</div>`}
        ${rowData.sales && `<div class="sortable-table__cell">${rowData.sales}</div>`}
      </a>
    `;
  }

  createBodyImageCellTemplate(image, alt) {
    if (image) {
      return `
        <div class="sortable-table__cell">
            <img class="sortable-table-image" alt="${alt}" src="${image.url}">
        </div>
      `;
    }

    return null;
  }

  sort(field = 'title', direction = 'asc') {
    const sortType = this.headerConfig.find(item => item.id === field).sortType;

    this.data = sort(this.data, field, direction, sortType);

    return this.updateBody();
  }

  updateBody() {
    this.subElements.body.innerHTML = this.createBodyDataTemplate();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
