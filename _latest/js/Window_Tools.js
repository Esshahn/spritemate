"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

    Class Window_Tools

 */

var Window_Tools = function () {
    function Window_Tools(config) {
        _classCallCheck(this, Window_Tools);

        this.id = "window-" + $('div[id^="window-"]').length;
        this.title = config.title;
        this.type = "tools";
        this.left = config.left;
        this.top = config.top;
        this.width = "auto"; //24 * this.zoomFactor;
        this.height = "auto"; //21 * this.zoomFactor;
        this.resizable = false;
        this.position = { at: "left+" + this.left + " top+" + this.top };
        this.create_window();
        //$("#" + this.id).append( "<div class='editor_ui'>moin</div>" ); 
    }

    _createClass(Window_Tools, [{
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
        }
    }]);

    return Window_Tools;
}();