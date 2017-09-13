"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

    Class Window

 */

var Window = function Window(config) {
    _classCallCheck(this, Window);

    config.id = "window-" + $('div[id^="window-"]').length;
    config.position = { at: "left+" + config.left + " top+" + config.top };
    if (config.top == undefined) config.position = undefined;

    $("#app").append("<div id='" + config.id + "' class='" + config.type + "' title='" + config.title + "'></div>");
    $("#" + config.id).dialog({
        width: config.width,
        height: config.height,
        dialogClass: "no-close",
        autoOpen: config.autoOpen,
        position: config.position,
        resizable: config.resizable,
        buttons: config.buttons
    });
};