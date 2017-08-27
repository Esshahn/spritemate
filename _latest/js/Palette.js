"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Palette = function () {
  function Palette(window, config, spritecolors) {
    _classCallCheck(this, Palette);

    this.spritecolors = spritecolors; // contains the colors of the first sprite
    this.colors = config.colors;
    this.active_color = this.spritecolors[1]; // 1 = white on the c64
    this.window = window;
    this.canvas_element = document.createElement('canvas');
    this.colorsquare_width = 40;
    this.colorsquare_height = 20;
    this.width = this.colorsquare_width * 2;
    this.height = this.colors.length / 2 * this.colorsquare_height + this.colorsquare_height + 10;

    this.canvas_element.id = "palette";
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;

    $("#window-" + this.window).append(this.canvas_element);

    this.canvas = this.canvas_element.getContext('2d');

    this.draw_colors();
    this.draw_active_color();
  }

  _createClass(Palette, [{
    key: "draw_colors",
    value: function draw_colors() {

      var x = 0;
      var y = 0;

      for (var i = 0; i < this.colors.length; i++) {
        this.canvas.fillStyle = this.colors[i];
        this.canvas.fillRect(x * this.colorsquare_width, y * this.colorsquare_height, this.colorsquare_width, this.colorsquare_height);

        x++;
        if (x == 2) {
          x = 0;
          y++;
        }
      }
    }
  }, {
    key: "draw_active_color",
    value: function draw_active_color() {
      // draws the selected/active color
      // under the color palette

      this.canvas.fillStyle = this.colors[this.active_color];
      this.canvas.fillRect(0, this.colors.length / 2 * this.colorsquare_height + 10, this.colorsquare_width * 2, this.colorsquare_height);
    }
  }, {
    key: "set_active_color",
    value: function set_active_color(e) {
      var pos = this.findPos(this.canvas_element);
      var x = e.pageX - pos.x,
          y = e.pageY - pos.y;
      var c = this.canvas;
      var p = c.getImageData(x, y, 1, 1).data;
      var hex = "#" + ("000000" + this.rgbToHex(p[0], p[1], p[2])).slice(-6);
      this.active_color = this.colors.indexOf(hex);
      this.draw_active_color();
    }
  }, {
    key: "get_color",
    value: function get_color() {
      return this.active_color;
    }
  }, {
    key: "findPos",
    value: function findPos(obj) {
      var curleft = 0,
          curtop = 0;
      if (obj.offsetParent) {
        do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
      }
      return undefined;
    }
  }, {
    key: "rgbToHex",
    value: function rgbToHex(r, g, b) {
      if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
      return (r << 16 | g << 8 | b).toString(16);
    }
  }]);

  return Palette;
}();