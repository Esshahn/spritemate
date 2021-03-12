/*

    Class Window

 */

import $ from "jquery";
import { dom } from "./helper";

export default class Window {
  constructor(public config, public callback?) {
    config.id = "window-" + config.window_id;
    config.position = {
      my: "left top",
      at: "left+" + config.left + " top+" + config.top,
    };
    if (config.top === undefined) config.position = undefined;
    if (config.modal === undefined) config.modal = false;
    if (config.escape === undefined) config.escape = false;

    const elem = `<div id="${config.id}" class="${config.type}" title="${config.title}"></div>`;
    dom.append("#app", elem);

    $(this.get_window_id()).dialog({
      width: config.width,
      height: config.height,
      dialogClass: "no-close",
      modal: config.modal,
      closeOnEscape: config.escape,
      autoOpen: config.autoOpen,
      position: config.position,
      resizable: config.resizable,
      buttons: config.buttons,
    });

    // in case a callback was defined for this window
    // we send the position and size information back to the app for storage
    if (callback) {
      $(this.get_window_id()).dialog({
        dragStop: function (event: any, ui: any) {
          const obj = {
            name: config.name,
            data: { top: ui.position.top, left: ui.position.left },
          };
          callback(obj);
        },
      });
      $(this.get_window_id()).dialog({
        resizeStop: function (event: any, ui: any) {
          const obj = {
            name: config.name,
            data: {
              top: ui.position.top,
              left: ui.position.left,
              width: ui.size.width,
              height: ui.size.height,
            },
          };
          callback(obj);
        },
      });
    }
  }

  get_window_id(): string {
    return "#" + this.config.id;
  }
}
