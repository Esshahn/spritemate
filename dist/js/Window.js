"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

    Class Window

 */

var Window = function Window(config, callback) {
  _classCallCheck(this, Window);

  config.id = "window-" + $('div[id^="window-"]').length;
  config.position = { my: "left top", at: "left+" + config.left + " top+" + config.top };
  if (config.top == undefined) config.position = undefined;
  if (config.modal == undefined) config.modal = false;
  if (config.escape == undefined) config.escape = false;

  $("#app").append("<div id='" + config.id + "' class='" + config.type + "' title='" + config.title + "'></div>");

  $("#" + config.id).dialog({
    width: config.width,
    height: config.height,
    dialogClass: "no-close",
    modal: config.modal,
    closeOnEscape: config.escape,
    autoOpen: config.autoOpen,
    position: config.position,
    resizable: config.resizable,
    buttons: config.buttons
  });

  // in case a callback was defined for this window
  // we send the position and size information back to the app for storage
  if (callback) {
    $("#" + config.id).dialog({
      dragStop: function dragStop(event, ui) {
        var obj = { name: config.name, data: { top: ui.position.top, left: ui.position.left } };
        callback(obj);
      }
    });
    $("#" + config.id).dialog({
      resizeStop: function resizeStop(event, ui) {
        var obj = { name: config.name, data: { top: ui.position.top, left: ui.position.left, width: ui.size.width, height: ui.size.height } };
        callback(obj);
      }
    });
  }
};