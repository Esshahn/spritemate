"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Settings = function () {
    function Settings(window, config) {
        var _this = this;

        _classCallCheck(this, Settings);

        this.config = config;
        this.window = window;
        this.custom_colors = config.colors;

        var template = "\n    <div id=\"modal\">\n        <h1 autofocus>Settings</h1>\n        <h2>Your settings will be saved locally in your browser storage</h2>\n        <fieldset>\n            <legend>Color palette</legend>\n            \n            <select name=\"colorpalette\" id=\"colorpalette\">\n              <option \"selected\">Colodore</option>\n              <option>Pepto</option>\n              <option>Vice</option>\n              <option>Custom</option>\n            </select>\n\n            <br/>\n            <br/>\n            <p>Custom values</p>\n\n            \n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-0\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-0\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-1\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-1\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-2\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-2\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-3\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-3\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-4\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-4\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-5\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-5\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-6\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-6\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-7\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-7\" name=\"\" value=\"\">\n            </div>\n\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-8\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-8\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-9\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-9\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-10\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-10\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-11\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-11\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-12\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-12\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-13\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-13\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-14\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-14\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-15\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-15\" name=\"\" value=\"\">\n            </div>\n        \n\n        </fieldset>\n\n        <button id=\"button-settings\">Done</button>\n\n    </div>\n    ";
        $("#window-" + this.window).append(template);

        // assign jquery ui style for the dropdown select
        $(function () {
            $("#colorpalette").selectmenu();
        });

        this.assign_colors(this.custom_colors);

        this.init_inputfields(this.custom_colors);

        $("#window-" + this.window).dialog({ show: 'fade', hide: 'fade' });
        $('#button-settings').mouseup(function (e) {
            return $("#window-" + _this.window).dialog("close");
        });
    }

    _createClass(Settings, [{
        key: "assign_colors",
        value: function assign_colors(colors) {
            for (var i = 0; i < colors.length; i++) {
                $("#colval-" + i).val(colors[i]);
                $("#col-" + i).animate({ backgroundColor: colors[i] }, 'fast');
            }
        }
    }, {
        key: "init_inputfields",
        value: function init_inputfields(colors) {
            var that = this;

            var _loop = function _loop(i) {
                $("#colval-" + i).change(function () {
                    that.update_color(i);
                });
            };

            for (var i = 0; i < colors.length; i++) {
                _loop(i);
            }
        }
    }, {
        key: "update_color",
        value: function update_color(color) {
            var colvalue = $("#colval-" + color).val();
            colvalue = "#" + colvalue.replace(/#/g, "");
            $("#colval-" + color).val(colvalue);
            $("#col-" + color).animate({ backgroundColor: colvalue }, 'fast');
        }
    }]);

    return Settings;
}();