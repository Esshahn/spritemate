"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

    Class Window

 */

var Window = function () {
    function Window(title) {
        _classCallCheck(this, Window);

        this.id = "window-" + $('div[id^="window-"]').length;
        this.title = title;
        this.resizable = false;
    }

    _createClass(Window, [{
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

    return Window;
}();

var WindowPreview = function (_Window) {
    _inherits(WindowPreview, _Window);

    function WindowPreview(title, zoomFactor, left, top) {
        _classCallCheck(this, WindowPreview);

        var _this = _possibleConstructorReturn(this, (WindowPreview.__proto__ || Object.getPrototypeOf(WindowPreview)).call(this, title));

        _this.type = "preview";
        _this.zoomFactor = zoomFactor;
        _this.width = "auto"; //24 * this.zoomFactor;
        _this.height = "auto"; //21 * this.zoomFactor;
        _this.resizable = false;
        _this.position = { at: "left+" + left + " top+" + top };

        _this.create_window();

        return _this;
    }

    return WindowPreview;
}(Window);

var WindowPalette = function (_Window2) {
    _inherits(WindowPalette, _Window2);

    function WindowPalette(title) {
        _classCallCheck(this, WindowPalette);

        var _this2 = _possibleConstructorReturn(this, (WindowPalette.__proto__ || Object.getPrototypeOf(WindowPalette)).call(this, title));

        _this2.type = "colors";
        _this2.width = "auto";
        _this2.height = "auto";
        _this2.position = { at: "center+100 top+150" };
        _this2.resizable = true;
        _this2.create_window();
        return _this2;
    }

    return WindowPalette;
}(Window);