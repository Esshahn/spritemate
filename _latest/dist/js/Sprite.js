"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sprite = function () {
  function Sprite(config) {
    _classCallCheck(this, Sprite);

    this.config = config;
    this.width = config.sprite_x;
    this.height = config.sprite_y;

    this.all = {};
    this.all.colors = { "transparent": 0, "multicolor_1": 4, "multicolor_2": 3 };
    this.all.sprites = [];
    this.all.current_sprite = 0;

    this.backup = [];
    this.backup_position = -1;

    this.new(5);
  }

  _createClass(Sprite, [{
    key: "new",
    value: function _new() {
      var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var multicolor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


      var sprite = {
        "color": color,
        "multicolor": multicolor,
        "double_x": false,
        "double_y": false,
        "pixels": []
      };

      for (var i = 0; i < this.height; i++) {
        var line = [];
        for (var j = 0; j < this.width; j++) {
          line.push(this.all.colors.transparent);
        }sprite.pixels.push(line);
      }
      this.all.sprites.push(sprite);
      this.all.current_sprite = this.all.sprites.length - 1;
      this.save_backup();
    }
  }, {
    key: "clear",
    value: function clear() {
      // fills the sprite data with the default color
      // generate a bitmap array
      var pixels = [];

      for (var i = 0; i < this.height; i++) {
        var line = [];
        for (var j = 0; j < this.width; j++) {
          line.push(this.all.colors[0]);
        }pixels.push(line);
      }
      this.all.sprites[this.all.current_sprite].pixels = pixels;
      this.save_backup();
    }
  }, {
    key: "fill",
    value: function fill(color) {
      // fills the sprite data with the default color
      // generate a bitmap array
      var pixels = [];

      for (var i = 0; i < this.height; i++) {
        var line = [];
        for (var j = 0; j < this.width; j++) {
          line.push(color);
        }pixels.push(line);
      }
      this.all.sprites[this.all.current_sprite].pixels = pixels;
      this.save_backup();
    }
  }, {
    key: "flip_vertical",
    value: function flip_vertical() {
      this.all.sprites[this.all.current_sprite].pixels.reverse();
      this.save_backup();
    }
  }, {
    key: "flip_horizontal",
    value: function flip_horizontal() {
      var s = this.all.sprites[this.all.current_sprite];
      for (var i = 0; i < this.height; i++) {
        s.pixels[i].reverse();
      }if (s.multicolor) {
        for (var _i = 0; _i < this.height; _i++) {
          s.pixels[_i].push(s.pixels[_i].shift());
        }
      }
      this.all.sprites[this.all.current_sprite] = s;
      this.save_backup();
    }
  }, {
    key: "shift_vertical",
    value: function shift_vertical(direction) {
      var s = this.all.sprites[this.all.current_sprite];
      if (direction == "down") {
        s.pixels.unshift(s.pixels.pop());
      } else {
        s.pixels.push(s.pixels.shift());
      }
      this.all.sprites[this.all.current_sprite] = s;
      this.save_backup();
    }
  }, {
    key: "shift_horizontal",
    value: function shift_horizontal(direction) {
      var s = this.all.sprites[this.all.current_sprite];
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
      this.all.sprites[this.all.current_sprite] = s;
      this.save_backup();
    }
  }, {
    key: "get_pixel",
    value: function get_pixel(x, y) {
      return this.all.sprites[this.all.current_sprite].pixels[y][x];
    }
  }, {
    key: "get_colors",
    value: function get_colors()
    // used to update the palette with the right colors
    {
      var sprite_colors = {
        "transparent": this.all.colors.transparent,
        "spritecolor": this.all.sprites[this.all.current_sprite].color,
        "multicolor_1": this.all.colors.multicolor_1,
        "multicolor_2": this.all.colors.multicolor_2
      };
      return sprite_colors;
    }
  }, {
    key: "get_delete_color",
    value: function get_delete_color() {
      return this.all.colors.transparent;
    }
  }, {
    key: "is_multicolor",
    value: function is_multicolor() {
      return this.all.sprites[this.all.current_sprite].multicolor;
    }
  }, {
    key: "toggle_double_x",
    value: function toggle_double_x() {
      if (this.all.sprites[this.all.current_sprite].double_x) {
        this.all.sprites[this.all.current_sprite].double_x = false;
      } else {
        this.all.sprites[this.all.current_sprite].double_x = true;
      }
      this.save_backup();
    }
  }, {
    key: "toggle_double_y",
    value: function toggle_double_y() {
      if (this.all.sprites[this.all.current_sprite].double_y) {
        this.all.sprites[this.all.current_sprite].double_y = false;
      } else {
        this.all.sprites[this.all.current_sprite].double_y = true;
      }
      this.save_backup();
    }
  }, {
    key: "toggle_multicolor",
    value: function toggle_multicolor() {
      if (this.all.sprites[this.all.current_sprite].multicolor) {
        this.all.sprites[this.all.current_sprite].multicolor = false;
      } else {
        this.all.sprites[this.all.current_sprite].multicolor = true;
      }
      this.save_backup();
    }
  }, {
    key: "set_pixel",
    value: function set_pixel(x, y, color) {
      // writes a pixel to the sprite pixel array
      // multicolor check
      if (this.all.sprites[this.all.current_sprite].multicolor && x % 2 !== 0) x = x - 1;
      this.all.sprites[this.all.current_sprite].pixels[y][x] = color;
    }
  }, {
    key: "get_current_sprite",
    value: function get_current_sprite() {
      return this.all.sprites[this.all.current_sprite];
    }
  }, {
    key: "get_current_sprite_number",
    value: function get_current_sprite_number() {
      return this.all.current_sprite;
    }
  }, {
    key: "only_one_sprite",
    value: function only_one_sprite() {
      if (this.all.sprites.length == 1) return true;
    }
  }, {
    key: "get_all_sprites",
    value: function get_all_sprites() {
      if (this.all.sprites) {
        return this.all.sprites;
      } else {
        return false;
      }
    }
  }, {
    key: "sort_spritelist",
    value: function sort_spritelist(sprite_order_from_dom) {
      var sorted_list = sprite_order_from_dom.map(function (x) {
        return parseInt(x);
      });
      var new_sprite_list = [];

      for (var i = 0; i < sorted_list.length; i++) {
        new_sprite_list.push(this.all.sprites[sorted_list[i]]);
        if (sorted_list[i] == this.all.current_sprite) var temp_current_sprite = i;
      }

      this.all.sprites = new_sprite_list;
      this.all.current_sprite = temp_current_sprite;
      this.save_backup();
    }
  }, {
    key: "set_current_sprite",
    value: function set_current_sprite(spritenumber) {
      this.all.current_sprite = spritenumber;
    }
  }, {
    key: "get_last_sprite",
    value: function get_last_sprite() {
      return this.all.sprites.length - 1;
    }
  }, {
    key: "delete",
    value: function _delete() {
      if (this.all.sprites.length > 1) {
        this.all.sprites.splice(this.all.current_sprite, 1);
        if (this.all.current_sprite == this.all.sprites.length) this.all.current_sprite--;
        this.save_backup();
      }
    }
  }, {
    key: "save_backup",
    value: function save_backup() {
      this.backup_position++;
      this.backup[this.backup_position] = jQuery.extend(true, {}, this.all);
    }
  }, {
    key: "undo",
    value: function undo() {
      if (this.backup_position > 0) {
        this.backup_position--;
        this.all = jQuery.extend(true, {}, this.backup[this.backup_position]);
      }
    }
  }]);

  return Sprite;
}();