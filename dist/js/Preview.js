'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Preview = function () {
  function Preview(window, config) {
    _classCallCheck(this, Preview);

    this.config = config;
    this.window = window;
    this.canvas_element = document.createElement('canvas');
    this.zoom = this.config.window_preview.zoom; // this.config.zoom;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;

    this.canvas_element.id = "preview";
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    this.canvas = this.canvas_element.getContext('2d');

    var template = '\n      <div class="window_menu">\n        <div class="icon-preview-x2" id="icon-preview-x" title="double width"></div>\n        <div class="icon-preview-y2" id="icon-preview-y" title="double height"></div>\n        <img src="img/icon3/icon-preview-overlay.png" id="icon-preview-overlay" title="overlay on/off">\n        <div class="right">\n          <img src="img/icon3/icon-zoom-in.png" id="icon-preview-zoom-in" title="zoom in"><img src="img/icon3/icon-zoom-out.png" id="icon-preview-zoom-out" title="zoom out">\n        </div>\n      </div>\n      <div id="preview-canvas"></div>\n    ';

    $("#window-" + this.window).append(template);
    $("#preview-canvas").append(this.canvas_element);
  }

  _createClass(Preview, [{
    key: 'get_width',
    value: function get_width() {
      return this.width;
    }
  }, {
    key: 'get_height',
    value: function get_height() {
      return this.height;
    }
  }, {
    key: 'zoom_in',
    value: function zoom_in() {
      if (this.zoom <= 24) {
        this.zoom += 2;
        this.update_zoom();
      }
    }
  }, {
    key: 'is_min_zoom',
    value: function is_min_zoom() {
      if (this.zoom < 2) return true;
    }
  }, {
    key: 'is_max_zoom',
    value: function is_max_zoom() {
      if (this.zoom >= 24) return true;
    }
  }, {
    key: 'zoom_out',
    value: function zoom_out() {
      if (this.zoom >= 2) {
        this.zoom -= 2;
        this.update_zoom();
      }
    }
  }, {
    key: 'get_zoom',
    value: function get_zoom() {
      return this.zoom;
    }
  }, {
    key: 'update_zoom',
    value: function update_zoom() {
      this.width = this.pixels_x * this.zoom;
      this.height = this.pixels_y * this.zoom;
    }
  }, {
    key: 'update',
    value: function update(all_data) {
      this.canvas_element.width = this.width;
      this.canvas_element.height = this.height;
      var sprite_data = all_data.sprites[all_data.current_sprite];
      var x_grid_step = 1;
      if (sprite_data.multicolor) x_grid_step = 2;

      // first fill the whole sprite with the background color
      this.canvas.fillStyle = this.config.colors[all_data.colors["t"]];
      this.canvas.fillRect(0, 0, this.width, this.height);

      for (var i = 0; i < this.pixels_x; i = i + x_grid_step) {
        for (var j = 0; j < this.pixels_y; j++) {
          var array_entry = sprite_data.pixels[j][i];

          if (array_entry != "t") {
            var color = sprite_data.color;
            if (array_entry != "i" && sprite_data.multicolor) color = all_data.colors[array_entry];
            this.canvas.fillStyle = this.config.colors[color];
            this.canvas.fillRect(i * this.zoom, j * this.zoom, x_grid_step * this.zoom, this.zoom);
          }
        }
      }

      if (sprite_data.overlay && all_data.current_sprite < all_data.sprites.length - 1) this.display_overlay(all_data);

      // set the preview window x and y stretch
      if (sprite_data.double_x) {
        var double_x = 2;
        $('#icon-preview-x').addClass('icon-preview-x2-hi');
      } else {
        var double_x = 1;
        $('#icon-preview-x').removeClass('icon-preview-x2-hi');
      }

      if (sprite_data.double_y) {
        var double_y = 2;
        $('#icon-preview-y').addClass('icon-preview-y2-hi');
      } else {
        var double_y = 1;
        $('#icon-preview-y').removeClass('icon-preview-y2-hi');
      }

      $('#preview').css('width', this.width * double_x);
      $('#preview').css('height', this.height * double_y);

      $('#input-overlay').val(sprite_data.overlay_list);
    }
  }, {
    key: 'display_overlay',
    value: function display_overlay(all_data) {
      var sprite_data = all_data.sprites[all_data.current_sprite + 1];
      var x_grid_step = 1;
      if (sprite_data.multicolor) x_grid_step = 2;

      for (var i = 0; i < this.pixels_x; i = i + x_grid_step) {
        for (var j = 0; j < this.pixels_y; j++) {
          var array_entry = sprite_data.pixels[j][i];

          // if singlecolor only, replace the multicolor pixels with the individual color
          if (!sprite_data.multicolor && (array_entry == "m1" || array_entry == "m2")) array_entry = "i";

          var color = sprite_data.color;
          if (array_entry != "i") color = all_data.colors[array_entry];

          if (array_entry != "t") {
            this.canvas.fillStyle = this.config.colors[color];
            this.canvas.fillRect(i * this.zoom, j * this.zoom, this.zoom * x_grid_step, this.zoom);
          }
        }
      }
    }
  }]);

  return Preview;
}();