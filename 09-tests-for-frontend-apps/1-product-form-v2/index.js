import SortableList from '../2-sortable-list/index.js';
import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';
import ProductFormV1 from "../../08-forms-fetch-api-part-2/1-product-form-v1/index.js";

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm extends ProductFormV1 {
  constructor(productId) {
    super(productId);
  }

  createElementTemplate() {
    return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid ">
          <div class="form-group form-group__half_left">
            <fieldset>
              ${this.createLabelTemplate('Название товара')}
              <input id="title" required="" type="text" name="title" class="form-control" placeholder="Название товара" value="${escapeHtml(this.data.title)}">
            </fieldset>
          </div>

          <div class="form-group form-group__wide">
            ${this.createLabelTemplate('Описание')}
            <textarea id="description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">${escapeHtml(this.data.description)}</textarea>
          </div>

          <div class="form-group form-group__wide" data-element="sortable-list-container">
            ${this.createLabelTemplate('Фото')}
            <div data-element="imageListContainer">
            </div>
            <button id="uploadImage" type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
          </div>

          <div class="form-group form-group__half_left">
            ${this.createLabelTemplate('Категория')}
            <select class="form-control" name="subcategory" id="subcategory">
              ${this.createCategoryOptions()}
            </select>
          </div>

          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              ${this.createLabelTemplate('Цена ($)')}
              <input id="price" required="" type="number" name="price" class="form-control" placeholder="100" value="${this.data.price}">
            </fieldset>
            <fieldset>
              ${this.createLabelTemplate('Скидка ($)')}
              <input id="discount" required="" type="number" name="discount" class="form-control" placeholder="0" value="${this.data.discount}">
            </fieldset>
          </div>

          <div class="form-group form-group__part-half">
            ${this.createLabelTemplate('Количество')}
            <input id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1" value="${this.data.quantity}">
          </div>

          <div class="form-group form-group__part-half">
            ${this.createLabelTemplate('Статус')}
            <select id="status" class="form-control" name="status">
              ${this.createOptionTemplate(1, 'Активен', this.data.status === 1)}
              ${this.createOptionTemplate(0, 'Неактивен', this.data.status === 0)}
            </select>
          </div>

          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              ${this.isEditPage() ? 'Сохранить товар' : 'Добавить товар'}
            </button>
          </div>
        </form>
      </div>
    `;
  }

  async render() {
    await this.loadData();
    this.element = this.createElement();
    this.subElements = this.getSubElements();
    this.subElements.imageListContainer.append(this.createImages());

    this.createListeners();

    return this.element;
  }

  createElement(template = this.createElementTemplate()) {
    const container = document.createElement('div');

    container.innerHTML = template;

    return container.firstElementChild;
  }

  createImages = () => {
    return new SortableList({items: this.data.images.map(image => this.createImageItemTemplate(image))}).element;
  };

  createImageItemTemplate(image) {
    const li = document.createElement('li');
    li.classList.add('products-edit__imagelist-item', 'sortable-list__item');
    li.innerHTML = `
      <input type="hidden" name="url" value="https://i.imgur.com/MWorX2R.jpg">
      <input type="hidden" name="source" value="75462242_3746019958756848_838491213769211904_n.jpg">
      <span>
        <img src="icon-grab.svg" data-grab-handle alt="grab">
        <img class="sortable-table__cell-img" alt="Image" src="${image.url}">
        <span>${image.source}</span>
      </span>
      <button type="button">
        <img src="icon-trash.svg" data-delete-handle alt="delete">
      </button>
    `;

    return li;
  }
}
