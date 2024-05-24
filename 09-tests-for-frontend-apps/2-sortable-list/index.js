export default class SortableList {
  element;
  currentDroppable = null;

  constructor({items = []}) {
    this.items = items.map((listItem, index) => {
      return {listItem, id: `item-${index.toString()}`};
    });

    this.element = this.createElement();

    this.createListeners();
  }

  createElement() {
    const list = document.createElement('ul');
    list.classList.add('sortable-list');

    this.items.map(item => {
      const listItem = item.listItem;
      listItem.classList.add('sortable-list__item', 'static');
      listItem.id = item.id;
      list.append(listItem);
    });

    return list;
  }

  createPlaceholder = (height) => {
    const placeholder = document.createElement('div');
    placeholder.classList.add('sortable-list__placeholder');
    placeholder.style.height = `${height}px`;

    return placeholder;
  };

  getElementParent = (element) => {
    return element.closest('li');
  };

  handleMoveAt = (event, shiftX, shiftY) => {
    this.currentDroppable.style.left = event.pageX - shiftX + 'px';
    this.currentDroppable.style.top = event.pageY - shiftY + 'px';
  };

  handleCardSelect = (event) => {
    this.currentDroppable = this.getElementParent(event.target);
    const placeholder = this.createPlaceholder(this.currentDroppable.offsetHeight);

    const {left, top} = this.currentDroppable.getBoundingClientRect();
    let shiftX = event.clientX - left;
    let shiftY = event.clientY - top;

    this.element.insertBefore(placeholder, this.currentDroppable);
    this.currentDroppable.style.position = 'absolute';
    this.currentDroppable.style.zIndex = 1000;
    this.currentDroppable.classList.remove('static');
    this.currentDroppable.draggable = false;

    this.handleMoveAt(event, shiftX, shiftY);

    const handleMouseMove = (event) => {
      this.handleMoveAt(event, shiftX, shiftY);

      this.currentDroppable.style.display = 'none';
      let contentBelow = document.elementFromPoint(event.clientX, event.clientY);
      this.currentDroppable.style.display = 'block';

      if (!contentBelow) {
        return;
      }

      let droppableBelow = contentBelow.closest('.static');

      if (this.currentDroppable !== droppableBelow) {
        if (droppableBelow) {
          if (this.element.contains(placeholder)) {
            this.element.removeChild(placeholder);
          }

          droppableBelow.after(placeholder);
        }
      }
    };

    document.addEventListener('pointermove', handleMouseMove);

    const handlePointerUp = () => {
      this.currentDroppable.style.position = 'static';
      this.currentDroppable.classList.add('static');
      placeholder.after(this.currentDroppable);
      this.element.removeChild(placeholder);

      document.removeEventListener('pointermove', handleMouseMove);
      this.currentDroppable.removeEventListener('pointerup', handlePointerUp);
    };

    this.currentDroppable.addEventListener('pointerup', handlePointerUp);
  };

  handleDelete = (event) => {
    const id = this.getElementParent(event.target).id;
    this.items.filter(item => item.id !== id);

    const itemToDelete = this.element.querySelector(`#${id}`);
    this.element.removeChild(itemToDelete);
  };

  createListeners() {
    for (const item of this.items) {
      item.listItem.querySelector('[data-grab-handle]').addEventListener('pointerdown', this.handleCardSelect);
      item.listItem.querySelector('[data-delete-handle]').addEventListener('pointerdown', this.handleDelete);
    }
  }

  removeListeners() {
    for (const item of this.items) {
      item.listItem.querySelector('[data-grab-handle]').removeEventListener('pointerdown', this.handleCardSelect);
      item.listItem.querySelector('[data-delete-handle]').removeEventListener('pointerdown', this.handleDelete);
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.createListeners();
    this.remove();
  }
}
