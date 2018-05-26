"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Palette = function () {
  function Palette(window, config) {
    _classCallCheck(this, Palette);

    this.colors = config.colors;
    this.active_color = 3; // 1 = white on the c64
    this.window = window;

    var template = "\n      <div id=\"palette_all_colors\"></div>\n      <div id=\"palette_spritecolors\">\n          <div id=\"palette_0\">\n              <p>Transparent</p>\n              <div class=\"palette_color_item_active_colors\" id=\"color_0\" title=\"transparent&nbsp;(2)\"></div>\n          </div>\n          <div id=\"palette_1\">\n              <p>Individual</p>\n              <div class=\"palette_color_item_active_colors\" id=\"color_1\" title=\"individual&nbsp;color&nbsp;(1)\"></div>\n          </div>\n          <div id=\"palette_2\">\n              <p>Multicolor 1</p>\n              <div class=\"palette_color_item_active_colors\" id=\"color_2\" title=\"multicolor&nbsp;1&nbsp;(3)\"></div>\n          </div>\n          <div id=\"palette_3\">\n              <p>Multicolor 2</p>\n              <div class=\"palette_color_item_active_colors\" id=\"color_3\" title=\"multicolor&nbsp;2&nbsp;(4)\"></div>\n          </div>\n      </div>\n\n    ";

    $("#window-" + this.window).append(template);

    this.draw_palette();
  }

  _createClass(Palette, [{
    key: "update",
    value: function update(all_data) {
      var sprite_is_multicolor = all_data.sprites[all_data.current_sprite].multicolor;

      // set the colors of the pens
      $("#color_0").css("background-color", this.colors[all_data.colors[0]]);
      $("#color_1").css("background-color", this.colors[all_data.sprites[all_data.current_sprite].color]);
      $("#color_2").css("background-color", this.colors[all_data.colors[2]]);
      $("#color_3").css("background-color", this.colors[all_data.colors[3]]);

      // now set the right pen active
      $('#palette_spritecolors div').removeClass("palette_color_item_selected");
      $('#palette_spritecolors p').removeClass("palette_highlight_text");

      $('#color_' + all_data.pen).addClass("palette_color_item_selected");
      $('#palette_' + all_data.pen + ' p').addClass("palette_highlight_text");

      this.set_multicolor(sprite_is_multicolor);
    }
  }, {
    key: "draw_palette",
    value: function draw_palette() {
      /* 
       draws the colors from the config as DIVs 
       */

      $("#palette_all_colors").empty(); // clear all color items in case there are already some (e.g. when switching palettes)
      var x = 0;

      for (var i = 0; i < this.colors.length; i++) {
        var picker_div = "<div class=\"palette_color_item\" id=\"palette_color_" + this.colors[i] + "\" title=\"" + this.colors[i] + "\" style=\"background-color:" + this.colors[i] + ";\"></div>";

        x++;
        if (x == 2) {
          x = 0;
          picker_div += "<div style=\"clear:both;\"></div>"; // after two colors, break to next line
        }

        $("#palette_all_colors").append(picker_div);
      }
    }
  }, {
    key: "set_multicolor",
    value: function set_multicolor(is_multicolor) {
      if (is_multicolor) {
        $('#palette_2').show();
        $('#palette_3').show();
      } else {
        $('#palette_2').hide();
        $('#palette_3').hide();
      }
    }
  }, {
    key: "set_active_color",
    value: function set_active_color(e) {
      var picked_color = $(e.target).prop('id').replace('palette_color_', '');
      this.active_color = this.colors.indexOf(picked_color);
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
  }]);

  return Palette;
}();