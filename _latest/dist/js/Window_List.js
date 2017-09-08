"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

    Class Window

 */

var Window_List = function () {
    function Window_List(config) {
        _classCallCheck(this, Window_List);

        this.id = "window-" + $('div[id^="window-"]').length;
        this.title = config.title;
        this.type = "list";
        this.left = config.left;
        this.top = config.top;
        this.width = config.width;
        this.height = config.height;
        this.resizable = true;
        this.position = { at: "left+" + this.left + " top+" + this.top };
        this.create_window();
    }

    _createClass(Window_List, [{
        key: "create_window",
        value: function create_window() {
            $("#app").append("<div id='" + this.id + "' class='" + this.type + "' title='" + this.title + "'></div>");
            $("#" + this.id).dialog({
                width: this.width,
                height: this.height,
                dialogClass: "no-close",
                position: this.position,
                resizable: this.resizable,
                buttons: this.buttons
            });

            var template = "\n        <div id=\"list_menu\">\n        <img src=\"img/icon3/icon-list-new.png\" id=\"icon-list-new\">\n        <img src=\"img/icon3/icon-list-delete.png\" id=\"icon-list-delete\">\n        <div id=\"spritelist\"></div>\n        </div>\n        ";

            $("#" + this.id).append(template);
        }
    }]);

    return Window_List;
}();