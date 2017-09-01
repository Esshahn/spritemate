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
    this.colors = [5, 7];
    this.spritelist = [];
    this.current_sprite = 0;
    this.new(6, false);
    this.new(3, true);
    this.new(2, false);
  }

  _createClass(Sprite, [{
    key: "new",
    value: function _new(color, multicolor) {
      var sprite = {
        "color": color,
        "multicolor": multicolor,
        "double_x": false,
        "double_y": false
      };

      sprite.pixels = [];
      var line = [];
      for (var i = 0; i < this.height; i++) {
        line = [];
        for (var j = 0; j < this.width; j++) {
          line.push(sprite.color);
        }
        sprite.pixels.push(line);
      }
      this.spritelist.push(sprite);
    }
  }, {
    key: "clear",
    value: function clear() {
      // fills the sprite data with the default color
      // generate a bitmap array
      var pixels = [];
      var line = [];
      for (var i = 0; i < this.height; i++) {
        line = [];
        for (var j = 0; j < this.width; j++) {
          line.push(this.colors[0]);
        }
        pixels.push(line);
      }
      this.spritelist[this.current_sprite].pixels = pixels;
    }
  }, {
    key: "fill",
    value: function fill(color) {
      // fills the sprite data with the default color
      // generate a bitmap array
      var pixels = [];
      var line = [];
      for (var i = 0; i < this.height; i++) {
        line = [];
        for (var j = 0; j < this.width; j++) {
          line.push(color);
        }
        pixels.push(line);
      }
      this.spritelist[this.current_sprite].pixels = pixels;
    }
  }, {
    key: "flip_vertical",
    value: function flip_vertical() {
      this.spritelist[this.current_sprite].pixels.reverse();
    }
  }, {
    key: "flip_horizontal",
    value: function flip_horizontal() {
      for (var i = 0; i < this.height; i++) {
        this.spritelist[this.current_sprite].pixels[i].reverse();
      }
    }
  }, {
    key: "shift_vertical",
    value: function shift_vertical(direction) {
      var s = this.spritelist[this.current_sprite];
      if (direction == "down") {
        s.pixels.unshift(s.pixels.pop());
      } else {
        s.pixels.push(s.pixels.shift());
      }
      this.spritelist[this.current_sprite] = s;
    }
  }, {
    key: "shift_horizontal",
    value: function shift_horizontal(direction) {
      var s = this.spritelist[this.current_sprite];
      for (var i = 0; i < this.height; i++) {
        if (direction == "right") {

          if (s.multicolor) {
            s.pixels[i].unshift(s.pixels[i].pop());
            s.pixels[i].unshift(s.pixels[i].pop());
          } else {
            s.pixels[i].unshift(s.pixels[i].pop());
          }
        } else {

          if (s.multicolor) {
            s.pixels[i].push(s.pixels[i].shift());
            s.pixels[i].push(s.pixels[i].shift());
          } else {
            s.pixels[i].push(s.pixels[i].shift());
          }
        }
      }
      this.spritelist[this.current_sprite] = s;
    }
  }, {
    key: "get_pixel",
    value: function get_pixel(x, y) {
      return this.spritelist[this.current_sprite].pixels[y][x];
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
      return this.spritelist[this.current_sprite].multicolor;
    }
  }, {
    key: "is_double_x",
    value: function is_double_x() {
      return this.spritelist[this.current_sprite].double_x;
    }
  }, {
    key: "is_double_y",
    value: function is_double_y() {
      return this.spritelist[this.current_sprite].double_y;
    }
  }, {
    key: "toggle_multicolor",
    value: function toggle_multicolor() {
      if (this.spritelist[this.current_sprite].multicolor) {
        this.spritelist[this.current_sprite].multicolor = false;
      } else {
        this.spritelist[this.current_sprite].multicolor = true;
      }
    }
  }, {
    key: "set_pixel",
    value: function set_pixel(x, y, color) {
      // writes a pixel to the sprite pixel array

      // multicolor check
      if (this.spritelist[this.current_sprite].multicolor && x % 2 !== 0) x = x - 1;

      this.spritelist[this.current_sprite].pixels[y][x] = color;
    }
  }, {
    key: "get_current_sprite",
    value: function get_current_sprite() {
      return this.spritelist[this.current_sprite];
    }
  }, {
    key: "get_all_sprites",
    value: function get_all_sprites() {
      if (this.spritelist) {
        return this.spritelist;
      } else {
        return false;
      }
    }
  }, {
    key: "set_current_sprite",
    value: function set_current_sprite(spritenumber) {
      this.current_sprite = spritenumber;
    }
  }]);

  return Sprite;
}();