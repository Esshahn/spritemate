"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sprite = function () {
  function Sprite(config) {
    _classCallCheck(this, Sprite);

    // basic sprite setup
    // has to become more flexible later on
    this.width = config.sprite_x;
    this.height = config.sprite_y;

    this.pixels = [];
    this.stretch_x = 0;
    this.stretch_y = 0;
    this.multicolor = true;
    this.colors = [0, 1, 2];

    // generate a bitmap array
    var line = [];
    for (var i = 0; i < this.height; i++) {
      line = [];
      for (var j = 0; j < this.width; j++) {
        line.push("#000000");
      }
      this.pixels.push(line);
    }
  }

  _createClass(Sprite, [{
    key: "get_pixel",
    value: function get_pixel(x, y) {
      return this.pixels[y][x];
    }
  }, {
    key: "set_pixel",
    value: function set_pixel(x, y, color) {
      // writes a pixel to the sprite pixel array

      // multicolor check
      if (this.multicolor && x % 2 !== 0) x = x - 1;

      this.pixels[y][x] = color;
    }
  }, {
    key: "get_current_sprite",
    value: function get_current_sprite() {
      return this;
    }
  }]);

  return Sprite;
}();