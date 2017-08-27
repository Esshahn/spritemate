"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sprite = function () {
  function Sprite(config) {
    _classCallCheck(this, Sprite);

    // basic sprite setup
    // has to become more flexible later on
    this.config = config;
    this.width = config.sprite_x;
    this.height = config.sprite_y;
    this.double_x = false;
    this.double_y = false;
    this.multicolor = false;
    this.colors = [5, 7, 2];
    this.clear();

    // TODO: delete these below
    this.pixels[3][3] = this.colors[1];
    this.pixels[4][3] = this.colors[1];
    this.pixels[3][5] = this.colors[2];
  }

  _createClass(Sprite, [{
    key: "clear",
    value: function clear() {
      // fills the sprite data with the default color
      // generate a bitmap array
      this.pixels = [];
      var line = [];
      for (var i = 0; i < this.height; i++) {
        line = [];
        for (var j = 0; j < this.width; j++) {
          line.push(this.colors[0]);
        }
        this.pixels.push(line);
      }
    }
  }, {
    key: "fill",
    value: function fill(color) {
      // fills the sprite data with the default color
      // generate a bitmap array
      this.pixels = [];
      var line = [];
      for (var i = 0; i < this.height; i++) {
        line = [];
        for (var j = 0; j < this.width; j++) {
          line.push(color);
        }
        this.pixels.push(line);
      }
    }
  }, {
    key: "get_pixel",
    value: function get_pixel(x, y) {
      return this.pixels[y][x];
    }
  }, {
    key: "get_colors",
    value: function get_colors() {
      return this.colors;
    }
  }, {
    key: "get_delete_color",
    value: function get_delete_color() {
      return this.colors[0];
    }
  }, {
    key: "is_multicolor",
    value: function is_multicolor() {
      return this.multicolor;
    }
  }, {
    key: "is_double_x",
    value: function is_double_x() {
      return this.double_x;
    }
  }, {
    key: "is_double_y",
    value: function is_double_y() {
      return this.double_y;
    }
  }, {
    key: "toggle_multicolor",
    value: function toggle_multicolor() {
      if (this.multicolor) {
        this.multicolor = false;
      } else {
        this.multicolor = true;
      }
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