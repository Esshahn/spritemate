"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Menu = function Menu(window, config) {
    _classCallCheck(this, Menu);

    this.config = config;
    this.window = window;

    var template = "\n    <div id=\"menu\">\n      <div class =\"iconset\" id=\"icon-load\">\n            <img src=\"img/ui/icon-load.png\" class=\"icon\" title=\"load\">\n            <div class=\"icontext\">load</div>\n        </div>\n        <div class =\"iconset\" id=\"icon-save\">\n            <img src=\"img/ui/icon-save.png\" class=\"icon\" title=\"save\">\n            <div class=\"icontext\">save</div>\n        </div>\n        <div class =\"iconset\" id=\"icon-undo\">\n            <img src=\"img/ui/icon-undo.png\" class=\"icon\" title=\"undo\">\n            <div class=\"icontext\">undo</div>\n        </div>\n        <div class =\"iconset\" id=\"icon-redo\">\n            <img src=\"img/ui/icon-redo.png\" class=\"icon\" title=\"redo\">\n            <div class=\"icontext\">redo</div>\n        </div>\n        <div class =\"iconset\" id=\"icon-draw\">\n            <img src=\"img/ui/icon-draw-hi.png\" class=\"icon\" id=\"image-icon-draw\" title=\"draw tool (d)\">\n            <div class=\"icontext\">draw</div>\n        </div>\n        <div class =\"iconset\" id=\"icon-fill\">\n            <img src=\"img/ui/icon-fill.png\" class=\"icon\"  id=\"image-icon-fill\" title=\"fill tool (d)\">  \n            <div class=\"icontext\">fill</div>\n        </div>\n        <div class =\"iconset\" id=\"icon-fullscreen\">\n            <img src=\"img/ui/icon-fullscreen.png\" class=\"icon\" title=\"toggle fullscreen (f)\">  \n            <div class=\"icontext\">fullscr.</div>\n        </div>\n        <div class =\"iconset\" id=\"icon-settings\">\n            <img src=\"img/ui/icon-settings.png\" class=\"icon\"  title=\"settings\">  \n            <div class=\"icontext\">settings</div>\n        </div>\n        <div class =\"iconset\" id=\"icon-help\">\n            <img src=\"img/ui/icon-help.png\" class=\"icon\"  title=\"info\">  \n            <div class=\"icontext\">help</div>\n        </div>\n         <div class =\"iconset\" id=\"icon-info\">\n            <img src=\"img/ui/icon-info.png\" class=\"icon\"  title=\"info\">  \n            <div class=\"icontext\">info</div>\n        </div>   \n      </div>\n    ";

    $("#window-" + this.window).append(template);
};