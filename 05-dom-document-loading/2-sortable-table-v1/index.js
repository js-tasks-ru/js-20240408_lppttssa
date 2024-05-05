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
        ${this.createBodyRowCellsTemplate(rowData)}
      </a>
    `;
  }

  createBodyRowCellsTemplate(rowData) {
    const bodyRowTemplate = [];

    for (const headerItem of this.headerConfig) {
      if (headerItem.id === 'images' && rowData.images) {
        bodyRowTemplate.push(this.createBodyRowCellTemplate(rowData.images[0], true, rowData.title));
      } else {
        bodyRowTemplate.push(this.createBodyRowCellTemplate(rowData[headerItem.id]));
      }
    }

    return bodyRowTemplate.join('');
  }

  createBodyRowCellTemplate(data, isImage = false, altData = '') {
    if (data) {
      if (isImage) {
        return this.createBodyImageCellTemplate(data, altData);
      }

      return `<div class="sortable-table__cell">${data}</div>`;
    }

    return null;
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
