import {sort} from "../../05-dom-document-loading/2-sortable-table-v1/utils.js";

export default class SortableTable {
  element;
  subElements = {};
  currentSortFieldId = '';
  currentSortDirection = '';

  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}, isSortLocally = true) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.isSortLocally = isSortLocally;
    this.sorted = sorted;

    this.element = this.createElement();
    this.subElements = this.getSubElements();

    this.createListeners();

    if (this.sorted) {
      this.currentSortFieldId = this.sorted.id;
      this.currentSortDirection = this.sorted.order;

      this.sort(this.currentSortFieldId, this.currentSortDirection);
    }
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
        ${this.headersConfig.map(cell => this.createHeaderCellTemplate(cell)).join('')}
      </div>
    `;
  }

  createHeaderCellTemplate(cellData) {
    const arrow = this.createSortArrowTemplate();

    if (cellData.template) {
      return cellData.template();
    }

    return `
      <div class="sortable-table__cell" data-id="${cellData.id}" data-sortable="${cellData.sortable}">
        <span>${cellData.title}</span>
        ${cellData.sortable ? arrow : null}
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

    for (const headerItem of this.headersConfig) {
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

  createSortArrowTemplate() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  getSortDirection(currentDirection = this.currentSortDirection) {
    return currentDirection === 'asc' ? 'desc' : 'asc';
  }

  getSortableHeaderCells() {
    const headerCells = this.subElements.header.querySelectorAll('.sortable-table__cell');

    return Array.from(headerCells).filter(cell => cell.getAttribute('data-sortable'));
  }

  createListeners() {
    const sortableHeaderCells = this.getSortableHeaderCells();

    for (const cell of sortableHeaderCells) {
      cell.addEventListener('pointerdown', () => this.handleColumnSort(cell.getAttribute('data-id')));
    }
  }

  removeListeners() {
    const sortableHeaderCells = this.getSortableHeaderCells();

    for (const cell of sortableHeaderCells) {
      cell.removeEventListener('pointerdown', this.handleColumnSort);
    }
  }

  handleColumnSort(id) {
    if (this.currentSortFieldId === id) {
      this.currentSortDirection = this.getSortDirection();
    } else {
      this.currentSortDirection = 'desc';
      this.currentSortFieldId = id;
    }

    this.sort(this.currentSortFieldId, this.currentSortDirection);
  }

  sort(field = 'title', direction = 'asc') {
    if (this.isSortLocally) {
      const sortType = this.headersConfig.find(item => item.id === field).sortType;

      this.data = sort(this.data, field, direction, sortType);

      return this.updateBody();
    }
  }

  updateBody() {
    this.subElements.body.innerHTML = this.createBodyDataTemplate();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.removeListeners();
  }
}

