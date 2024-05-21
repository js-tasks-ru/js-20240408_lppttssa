import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductFormV1 {
  element = null;
  subElements;

  constructor(productId) {
    this.productId = productId;

    this.data = [];
    this.categories = [];
  }

  createElement(template = this.createElementTemplate()) {
    const container = document.createElement('div');

    container.innerHTML = template;

    return container.firstElementChild;
  }

  getSubElements() {
    const elements = {};

    this.element.querySelectorAll('[data-element]').forEach(element => {
      elements[element.dataset.element] = element;
    });

    return elements;
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
              <ul class="sortable-list">
                ${this.createImages()}
              </ul>
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

  createImages = () => {
    return this.data.images.map(image => this.createImageItemTemplate(image)).join('');
  };

  createImageItemTemplate(image) {
    return `
      <li class="products-edit__imagelist-item sortable-list__item" style="">
        <input type="hidden" name="url" value="https://i.imgur.com/MWorX2R.jpg">
        <input type="hidden" name="source" value="75462242_3746019958756848_838491213769211904_n.jpg">
        <span>
          <img src="icon-grab.svg" data-grab-handle="" alt="grab">
          <img class="sortable-table__cell-img" alt="Image" src="${image.url}">
          <span>${image.source}</span>
        </span>
        <button type="button">
          <img src="icon-trash.svg" data-delete-handle="" alt="delete">
        </button>
        </li>
    `;
  }

  createCategoryOptions() {
    const options = [];

    this.categories.map(category => {
      if (category.subcategories?.length) {
        category.subcategories.map(subcategory => {
          options.push(this.createOptionTemplate(subcategory.id, `${category.title} &gt; ${subcategory.title}`, subcategory.id === this.data.subcategory));
        });
      } else {
        options.push(this.createOptionTemplate(category.id, category.title, category.id === this.data.subcategory));
      }
    });

    return options.join('');
  }

  createOptionTemplate(value, text, isSelected = false) {
    return `<option value="${value}" ${isSelected ? 'selected' : ''}>${text}</option>`;
  }

  createImageInputTemplate() {
    return `<input type="file" accept="image/*" name="image" id="file" style="display: none;">`;
  }

  createLabelTemplate(text) {
    return `<label class="form-label">${text}</label>`;
  }

  createImageInput = () => {
    const input = this.createElement(this.createImageInputTemplate());
    input.addEventListener('change', this.handleImageUpload);

    document.body.appendChild(input);

    input.click();
  };

  createUrl(url) {
    return `${BACKEND_URL}/api/rest/${url}`;
  }

  getFormControls() {
    return this.element.querySelectorAll('.form-control');
  }

  createListeners() {
    this.subElements.productForm.addEventListener("submit", async (event) => this.handleSave(event));

    const controls = this.getFormControls();
    for (const control of controls) {
      if (control.id) {
        control.addEventListener('change', (event) => this.handleInputChange(event, control.id));
      }
    }

    this.element.querySelector('#uploadImage').addEventListener('click', this.handleImageSelect);
  }

  handleImageSelect = () => {
    this.createImageInput();
  };

  handleImageUpload = async (event) => {
    const image = event.target.files[0];

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetchJson(`https://api.imgur.com/3/image`, {
        method: 'POST',
        headers: {
          'Authorization': IMGUR_CLIENT_ID,
        }
      });

      this.data.images.push({url: response.data.link, source: image.name});

      this.updateImagesList();
    } catch (err) {
      console.log(err);
    }
  };

  updateImagesList() {
    this.element.querySelector('.sortable-list').innerHTML = this.createImages();
  }

  handleInputChange(event, key) {
    const value = event.target.value;

    this.data[key] = isNaN(value) ? value : parseInt(value);
  }

  isEditPage() {
    return this.productId !== undefined;
  }

  getPostData() {
    return {
      title: this.data.title,
      description: this.data.description,
      discount: this.data.discount,
      id: this.data.id,
      images: this.data.images,
      price: this.data.price,
      quantity: this.data.quantity,
      status: this.data.status,
      subcategory: this.data.subcategory,
    };
  }

  async handleSave(event) {
    event.preventDefault();

    await this.save();
  }

  async save() {
    await fetchJson(this.createUrl('products'), {
      method: this.isEditPage() ? 'PATCH' : 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.getPostData())
    });

    return this.element.dispatchEvent(new CustomEvent('product-updated', this.data));
  }

  async loadData() {
    this.categories = await this.loadCategoriesData().then(categories => categories);

    if (this.productId !== undefined) {
      this.data = await this.loadItemData().then(data => data[0]);
    }
  }

  async loadItemData() {
    return await fetchJson(this.createUrl(`products?id=${this.productId}`));
  }

  async loadCategoriesData() {
    return await fetchJson(this.createUrl('categories?_sort=weight&_refs=subcategory'));
  }

  async render() {
    await this.loadData();
    this.element = this.createElement();
    this.subElements = this.getSubElements();

    this.createListeners();

    return this.element;
  }

  removeListeners = () => {
    this.subElements.productForm.removeEventListener('submit', this.handleSave);

    const controls = this.getFormControls();
    for (const control of controls) {
      if (control.id) {
        control.removeEventListener('change', this.handleInputChange);
      }
    }

    this.element.querySelector('#uploadImage').removeEventListener('click', this.handleImageSelect);

    const file = document.querySelector('#file');
    if (file) {
      file.removeEventListener('change', this.handleImageUpload);
    }
  };

  remove() {
    this.element.remove();
  }

  destroy() {
    this.removeListeners();
    this.remove();
  }
}
