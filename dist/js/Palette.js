"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Palette = function () {
  function Palette(window, config) {
    _classCallCheck(this, Palette);

    this.colors = config.colors;
    this.active_color = 3; // 1 = white on the c64
    this.window = window;

    this.canvas_element = document.createElement('canvas');
    this.colorsquare_width = 40;
    this.colorsquare_height = 20;
    this.width = this.colorsquare_width * 2;
    this.height = this.colors.length / 2 * this.colorsquare_height;

    this.canvas_element.id = "palette";
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;

    var template = "\n      <div id=\"palette_all_colors\"></div>\n      <div id=\"palette_spritecolors\">\n          <div id=\"palette_i\">\n              <p>Individual</p>\n              <div class=\"palette_color_item\" id=\"color_i\" title=\"individual&nbsp;color&nbsp;(1)\"></div>\n          </div>\n          <div id=\"palette_t\">\n              <p>Transparent</p>\n              <div class=\"palette_color_item\" id=\"color_t\" title=\"transparent&nbsp;(2)\"></div>\n          </div>\n          <div id=\"palette_m1\">\n              <p>Multicolor 1</p>\n              <div class=\"palette_color_item\" id=\"color_m1\" title=\"multicolor&nbsp;1&nbsp;(3)\"></div>\n          </div>\n          <div id=\"palette_m2\">\n              <p>Multicolor 2</p>\n              <div class=\"palette_color_item\" id=\"color_m2\" title=\"multicolor&nbsp;2&nbsp;(4)\"></div>\n          </div>\n      </div>\n\n    ";

    $("#window-" + this.window).append(template);

    $("#palette_all_colors").append(this.canvas_element);

    this.canvas = this.canvas_element.getContext('2d');

    this.draw_palette();
  }

  _createClass(Palette, [{
    key: "update",
    value: function update(all_data) {
      var sprite_is_multicolor = all_data.sprites[all_data.current_sprite].multicolor;

      // set the colors of the pens
      $("#color_t").css("background-color", this.colors[all_data.colors.t]);
      $("#color_i").css("background-color", this.colors[all_data.sprites[all_data.current_sprite].color]);
      $("#color_m1").css("background-color", this.colors[all_data.colors.m1]);
      $("#color_m2").css("background-color", this.colors[all_data.colors.m2]);

      // now set the rigt pen active
      $('#palette_spritecolors div').removeClass("palette_color_item_selected");
      $('#palette_spritecolors p').removeClass("palette_highlight_text");

      $('#color_' + all_data.pen).addClass("palette_color_item_selected");
      $('#palette_' + all_data.pen + ' p').addClass("palette_highlight_text");

      /*
          if (!sprite_is_multicolor && (all_data.pen != "m1" && all_data.pen != "m2"))
          {
            // set the active pen to the individual one when switching to singlecolor
            $('#palette_spritecolors div').removeClass("palette_color_item_selected");
            $('#palette_spritecolors p').removeClass("palette_highlight_text");
            $('#color_individual').addClass("palette_color_item_selected");
            $('#palette_individual p').addClass("palette_highlight_text");
          }
      */
      this.set_multicolor(sprite_is_multicolor);
    }
  }, {
    key: "draw_palette",
    value: function draw_palette() {

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
    key: "set_multicolor",
    value: function set_multicolor(is_multicolor) {
      if (is_multicolor) {
        $('#palette_m1').show();
        $('#palette_m2').show();
      } else {
        $('#palette_m1').hide();
        $('#palette_m2').hide();
      }
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
    }
  }, {
    key: "get_color",
    value: function get_color() {
      return this.active_color;
    }
  }, {
    key: "set_colors",
    value: function set_colors(colors) {
      this.colors = colors;
      this.draw_palette();
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