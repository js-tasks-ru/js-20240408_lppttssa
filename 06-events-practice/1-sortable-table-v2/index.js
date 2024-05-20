import {sort} from "../../05-dom-document-loading/2-sortable-table-v1/utils.js";
import SortableTableV1 from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

class SortableTableV2 extends SortableTableV1 {
  currentSortFieldId = '';
  currentSortDirection = '';

  constructor(headerConfig, {
    isSortLocally = true,
    data = [],
    sorted = {}
  } = {}) {
    super(headerConfig, data);

    this.isSortLocally = isSortLocally;
    this.sorted = sorted;

    this.createListeners();

    if (this.sorted) {
      this.currentSortFieldId = this.sorted.id;
      this.currentSortDirection = this.sorted.order;

      this.sort(this.currentSortFieldId, this.currentSortDirection);
    }
  }

  createHeaderCellTemplate(cellData) {
    const arrow = this.createSortArrowTemplate();

    if (cellData.template && this.data.length) {
      return cellData.template(this.data);
    }

    return `
      <div class="sortable-table__cell" data-id="${cellData.id}" data-sortable="${cellData.sortable}">
        <span>${cellData.title}</span>
        ${cellData.sortable ? arrow : ''}
      </div>
    `;
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
      const sortType = this.headerConfig.find(item => item.id === field).sortType;

      this.data = sort(this.data, field, direction, sortType);

      return this.updateBody();
    }
  }

  destroy() {
    this.remove();
    this.removeListeners();
  }
}

export default SortableTableV2;
