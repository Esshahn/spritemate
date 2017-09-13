'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Preview = function () {
  function Preview(window, config) {
    _classCallCheck(this, Preview);

    this.config = config;
    this.window = window;
    this.canvas_element = document.createElement('canvas');
    this.zoom = this.config.zoom_preview; // this.config.zoom;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;

    this.canvas_element.id = "preview";
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    this.canvas = this.canvas_element.getContext('2d');

    var template = '\n      <div id="preview_menu">\n      <div class="icon-preview-x2" id="icon-preview-x"></div>\n      <div class="icon-preview-y2" id="icon-preview-y"></div>\n      </div>\n    ';

    $("#window-" + this.window).append(template);

    $("#window-" + this.window).append(this.canvas_element);
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
    key: 'update',
    value: function update(all_data) {
      var sprite_data = all_data.sprites[all_data.current_sprite];
      var x_grid_step = 1;
      if (sprite_data.multicolor) x_grid_step = 2;

      for (var i = 0; i < this.pixels_x; i = i + x_grid_step) {
        for (var j = 0; j < this.pixels_y; j++) {

          var array_entry = sprite_data.pixels[j][i];
          if (array_entry == "individual") {
            var color = sprite_data.color;
          } else {
            var color = all_data.colors[array_entry];

            // if singlecolor only, replace the multicolor pixels with the individual color
            if (!sprite_data.multicolor && (array_entry == "multicolor_1" || array_entry == "multicolor_2")) color = sprite_data.color;
          }

          this.canvas.fillStyle = this.config.colors[color];
          this.canvas.fillRect(i * this.zoom, j * this.zoom, this.pixels_x * x_grid_step, this.pixels_y);
        }
      }

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
    }
  }]);

  return Preview;
}();