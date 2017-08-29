"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tools = function () {
  function Tools(window, config) {
    _classCallCheck(this, Tools);

    this.window = window;
    this.setup_icons();
  }

  _createClass(Tools, [{
    key: "setup_icons",
    value: function setup_icons() {

      var template = "\n\n    <img src=\"img/icon-shift-left.png\" class=\"icon\" id=\"icon-shift-left\"><img src=\"img/icon-shift-right.png\" class=\"icon\" id=\"icon-shift-right\"><img src=\"img/icon-shift-up.png\" class=\"icon\" id=\"icon-shift-up\"><img src=\"img/icon-shift-down.png\" class=\"icon\" id=\"icon-shift-down\"><img src=\"img/icon-flip-horizontal.png\" class=\"icon\" id=\"icon-flip-horizontal\"><img src=\"img/icon-flip-vertical.png\" class=\"icon\" id=\"icon-flip-vertical\">\n\n    ";
      $("#window-" + this.window).append(template);
    }
  }]);

  return Tools;
}();