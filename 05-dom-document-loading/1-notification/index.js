export default class NotificationMessage {
  static lastShownComponent;
  element;
  timer;

  constructor(message = '', {duration = 0, type = 'success'} = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.element = this.createElement();
  }

  createElement() {
    const container = document.createElement('div');

    container.innerHTML = this.createElementTemplate();

    return container.firstElementChild;
  }

  createElementTemplate() {
    return `
      <div class="notification ${this.type}" style="--value:${this.duration}ms">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `;
  }

  show(targetElement = document.body) {
    if (NotificationMessage.lastShownComponent) {
      NotificationMessage.lastShownComponent.hide();
    }

    targetElement.append(this.element);
    NotificationMessage.lastShownComponent = this;

    this.timer = setTimeout(() => {
      this.hide();
    }, this.duration);
  }

  hide() {
    this.remove();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    clearTimeout(this.timer);
  }
}
