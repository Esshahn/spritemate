"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Settings = function () {
    function Settings(window, config, eventhandler) {
        var _this = this;

        _classCallCheck(this, Settings);

        this.config = config;
        this.window = window;
        this.eventhandler = eventhandler;

        var template = "\n    <div id=\"modal\">\n        <h1 autofocus>Settings</h1>\n        <h2>Your settings will be saved locally to your browser storage</h2>\n        <fieldset>\n            <legend>Color palette</legend>\n            \n            <select id=\"colorpalette\">\n              <option>colodore</option>\n              <option>pepto</option>\n              <option>custom</option>\n            </select>\n\n            <br/>\n            <br/>\n\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-0\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-0\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-1\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-1\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-2\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-2\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-3\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-3\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-4\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-4\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-5\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-5\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-6\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-6\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-7\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-7\" name=\"\" value=\"\">\n            </div>\n\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-8\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-8\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-9\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-9\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-10\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-10\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-11\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-11\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-12\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-12\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-13\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-13\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-14\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-14\" name=\"\" value=\"\">\n            </div>\n            <div class=\"settings_colorfield\">\n                <div class=\"settings_color\" id=\"col-15\"></div>\n                <input type=\"text\" class=\"settings_colorvalue\" id=\"colval-15\" name=\"\" value=\"\">\n            </div>\n\n        </fieldset>\n\n        <!--\n        <fieldset>\n            <legend>Window settings</legend>\n            <div class=\"fieldset right\">\n                <button id=\"button-save\">Save now</button>\n                <button id=\"button-reset\">Reset to defaults</button>\n            </div>\n            <p>Saves the window layout and zoom levels</p>\n        </fieldset>\n        -->\n        <div id=\"button-row\">\n          <button id=\"button-apply\">Apply</button>\n        </div>\n\n    </div>\n    ";
        $("#window-" + this.window).append(template);

        this.config.colors = this.config.palettes[this.config.selected_palette];

        $("#colorpalette").val(this.config.selected_palette);

        this.init_inputfields(this.config.colors);
        this.selection_change();
        this.update_colors();

        $("#window-" + this.window).dialog({ show: 'fade', hide: 'fade' });

        $('#button-apply').mouseup(function (e) {
            return _this.close_window();
        });
    }

    _createClass(Settings, [{
        key: "update_colors",
        value: function update_colors() {
            for (var i = 0; i < this.config.colors.length; i++) {
                $("#colval-" + i).val(this.config.colors[i]);
                $("#col-" + i).animate({ backgroundColor: this.config.colors[i] }, 'fast');
            }
        }
    }, {
        key: "init_inputfields",
        value: function init_inputfields(colors) {
            var that = this;

            var _loop = function _loop(i) {
                $("#colval-" + i).change(function () {
                    that.update_custom_colors(i);
                });
            };

            for (var i = 0; i < colors.length; i++) {
                _loop(i);
            }

            if (this.config.selected_palette != "custom") {
                $('.settings_colorvalue').prop('disabled', true).fadeTo("fast", 0.33);
            } else {
                $('.settings_colorvalue').prop('disabled', false).fadeTo("fast", 1);
            }
        }
    }, {
        key: "selection_change",
        value: function selection_change() {
            var that = this;
            $("#colorpalette").change(function () {

                var palette = $("#colorpalette").val();

                that.config.colors = that.config.palettes[palette];
                that.config.selected_palette = palette;

                if (palette != "custom") {
                    $('.settings_colorvalue').prop('disabled', true).fadeTo("fast", 0.33);
                } else {
                    $('.settings_colorvalue').prop('disabled', false).fadeTo("fast", 1);
                }

                that.update_colors(that.config.colors);
            });
        }
    }, {
        key: "update_custom_colors",
        value: function update_custom_colors(color) {
            // takes the value of the input field and updates both the color and the input field
            var colvalue = $("#colval-" + color).val();
            colvalue = "#" + ("000000" + colvalue.replace(/#/g, "")).slice(-6);
            this.config.palettes.custom[color] = colvalue;
            this.config.colors = this.config.palettes.custom;
            this.update_colors();
        }
    }, {
        key: "close_window",
        value: function close_window() {
            $("#window-" + this.window).dialog("close");
            this.eventhandler.onLoad(); // calls "regain_keyboard_controls" method in app.js
        }
    }, {
        key: "get_config",
        value: function get_config() {
            return this.config;
        }
    }]);

    return Settings;
}();