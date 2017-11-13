"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Overlays = function () {
  function Overlays(window, config) {
    _classCallCheck(this, Overlays);

    this.config = config;
    this.window = window;

    var template = "\n      <img src=\"img/icon3/icon-preview-overlay.png\" id=\"icon-preview-overlay\" class=\"icon-inputfield\" title=\"overlay on/off\">\n      <input type=\"text\" id=\"input-overlay\" class=\"ui-inputfield\" title=\"enter a list of sprites (1,2,3) or leave blank for next sprite\" value=\"next sprite\">\n    ";

    $("#window-" + this.window).append(template);
  }

  _createClass(Overlays, [{
    key: "update",
    value: function update(all_data) {}
  }]);

  return Overlays;
}();