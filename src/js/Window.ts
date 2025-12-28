
import { dom } from "./helper";
import { Dialog } from "./Dialog";

export default class Window {
  private dialog: Dialog;

  constructor(public config, public callback?) {
    config.id = "window-" + config.window_id;
    if (config.modal === undefined) config.modal = false;
    if (config.escape === undefined) config.escape = false;

    // Create container div for the dialog content
    const elem = `<div id="${config.id}" class="${config.type}"></div>`;
    dom.append("#app", elem);

    // Create dialog with native implementation
    this.dialog = new Dialog({
      id: `dialog-${config.id}`,
      title: config.title,
      width: config.width,
      height: config.height,
      modal: config.modal,
      resizable: config.resizable,
      closeOnEscape: config.escape,
      autoOpen: config.autoOpen !== false,
      left: config.left,
      top: config.top,
      onDragStop: callback ? (position) => {
        const obj = {
          name: config.name,
          data: { top: position.top, left: position.left },
        };
        callback(obj);
      } : undefined,
      onResizeStop: callback ? (size) => {
        const obj = {
          name: config.name,
          data: {
            top: size.top,
            left: size.left,
            width: size.width,
            height: size.height,
          },
        };
        callback(obj);
      } : undefined,
    });

    // Move the content into the dialog
    const contentElement = document.querySelector(`#${config.id}`);
    if (contentElement) {
      const dialogContent = this.dialog.getContent();
      dialogContent.appendChild(contentElement);
    }

    // Add dialog-wrapper class with type
    const wrapper = this.dialog.getContent().closest('.dialog-wrapper') as HTMLElement;
    if (wrapper) {
      wrapper.classList.add(config.type);
    }
  }

  get_window_id(): string {
    return "#" + this.config.id;
  }

  // Compatibility methods for jQuery UI dialog API
  public open(): void {
    this.dialog.open();
  }

  public close(): void {
    this.dialog.close();
  }

  public isOpen(): boolean {
    return this.dialog.isOpen();
  }

  public setOption(key: string, value: any): void {
    this.dialog.setOption(key, value);
  }

  public getDialog(): Dialog {
    return this.dialog;
  }
}
