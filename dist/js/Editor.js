"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Editor = function (_Window_Controls) {
  _inherits(Editor, _Window_Controls);

  function Editor(window, config) {
    _classCallCheck(this, Editor);

    var _this = _possibleConstructorReturn(this, (Editor.__proto__ || Object.getPrototypeOf(Editor)).call(this));

    _this.config = config;
    _this.grid = _this.config.window_editor.grid;
    _this.window = window;
    _this.canvas_element = document.createElement('canvas');
    _this.zoom = _this.config.window_editor.zoom;
    _this.zoom_min = 10;
    _this.zoom_max = 26;
    _this.pixels_x = _this.config.sprite_x;
    _this.pixels_y = _this.config.sprite_y;
    _this.width = _this.pixels_x * _this.zoom;
    _this.height = _this.pixels_y * _this.zoom;

    _this.canvas_element.id = "editor";
    _this.canvas_element.width = _this.width;
    _this.canvas_element.height = _this.height;

    var template = "\n      <div class=\"window_menu\">\n        <div class=\"icons-zoom-area\">\n          <img src=\"img/ui/icon-zoom-in.png\" id=\"icon-editor-zoom-in\" title=\"zoom in\">\n          <img src=\"img/ui/icon-zoom-out.png\" id=\"icon-editor-zoom-out\" title=\"zoom out\">\n          <img src=\"img/ui/icon-grid.png\" id=\"icon-editor-grid\" title=\"toggle grid borders\">\n        </div>\n\n        <img src=\"img/ui/icon-multicolor.png\" title=\"toggle single- & multicolor (m)\" id=\"icon-multicolor\">\n        <img src=\"img/ui/icon-shift-left.png\" title=\"shift left\" id=\"icon-shift-left\">\n        <img src=\"img/ui/icon-shift-right.png\" title=\"shift right\" id=\"icon-shift-right\">\n        <img src=\"img/ui/icon-shift-up.png\" title=\"shift up\" id=\"icon-shift-up\">\n        <img src=\"img/ui/icon-shift-down.png\" title=\"shift down\" id=\"icon-shift-down\">\n        <img src=\"img/ui/icon-flip-horizontal.png\" title=\"flip horizontal\" id=\"icon-flip-horizontal\">\n        <img src=\"img/ui/icon-flip-vertical.png\" title=\"flip vertical\" id=\"icon-flip-vertical\">\n        \n      </div>\n      <div id=\"editor-canvas\"></div>\n    ";

    $("#window-" + _this.window).append(template);
    $("#editor-canvas").append(_this.canvas_element);

    _this.canvas = _this.canvas_element.getContext('2d', { alpha: false });

    return _this;
  }

  _createClass(Editor, [{
    key: "update",
    value: function update(all_data) {
      this.canvas_element.width = this.width;
      this.canvas_element.height = this.height;

      var sprite_data = all_data.sprites[all_data.current_sprite];
      var x_grid_step = 1;
      if (sprite_data.multicolor) x_grid_step = 2;

      // first fill the whole sprite with the background color
      this.canvas.fillStyle = this.config.colors[all_data.colors[0]];
      this.canvas.fillRect(0, 0, this.width, this.height);

      // overlay from previous sprite
      if (all_data.current_sprite > 0) {
        var previous_sprite = all_data.sprites[all_data.current_sprite - 1];
        if (previous_sprite.overlay) this.display_overlay(all_data, "previous");
      }

      // current sprite
      this.fill_canvas(all_data, sprite_data, x_grid_step, 1);

      // overlay from next sprite
      if (sprite_data.overlay && all_data.current_sprite < all_data.sprites.length - 1) this.display_overlay(all_data);

      // grid
      if (this.grid) this.display_grid(sprite_data);
    }
  }, {
    key: "display_overlay",
    value: function display_overlay(all_data, mode) {
      var alpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.4;

      var overlay_sprite_number = 1;
      if (mode == "previous") overlay_sprite_number = -1;
      var sprite_data = all_data.sprites[all_data.current_sprite + overlay_sprite_number];
      var x_grid_step = 1;
      if (sprite_data.multicolor) x_grid_step = 2;

      this.fill_canvas(all_data, sprite_data, x_grid_step, alpha);
    }
  }, {
    key: "fill_canvas",
    value: function fill_canvas(all_data, sprite_data, x_grid_step) {
      var alpha = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;


      for (var i = 0; i < this.pixels_x; i = i + x_grid_step) {
        for (var j = 0; j < this.pixels_y; j++) {
          var array_entry = sprite_data.pixels[j][i];

          if (array_entry != 0) // not transparent
            {
              var color = sprite_data.color;
              if (array_entry != 1 && sprite_data.multicolor) color = all_data.colors[array_entry];
              this.canvas.fillStyle = this.overlay_color(this.config.colors[color], alpha);
              this.canvas.fillRect(i * this.zoom, j * this.zoom, x_grid_step * this.zoom, this.zoom);
            }
        }
      }
    }
  }, {
    key: "overlay_color",
    value: function overlay_color(hex, alpha) {
      // expects a hex value like "#ff8800" and returns a rbga + alpha value like "rgba (50,20,100,0.5)"
      var bigint = parseInt(hex.slice(-6), 16);
      var r = bigint >> 16 & 255;
      var g = bigint >> 8 & 255;
      var b = bigint & 255;
      var combined = r + "," + g + "," + b;
      var result = "rgba(" + combined + "," + alpha + ")";
      return result;
    }
  }, {
    key: "display_grid",
    value: function display_grid(sprite_data) {
      // show a grid

      this.canvas.setLineDash([1, 1]);
      var x_grid_step = 1;

      if (sprite_data.multicolor) x_grid_step = 2;

      for (var i = 0; i <= this.pixels_x; i = i + x_grid_step) {

        // adds a vertical line in the middle
        this.canvas.strokeStyle = "#666666";
        if (i == this.pixels_x / 2) this.canvas.strokeStyle = "#888888";

        this.canvas.beginPath();
        this.canvas.moveTo(i * this.zoom, 0);
        this.canvas.lineTo(i * this.zoom, this.height);
        this.canvas.stroke();
      }

      for (var _i = 0; _i <= this.pixels_y; _i++) {

        // adds 3 horizontal lines
        this.canvas.strokeStyle = "#666666";
        if (_i % (this.pixels_y / 3) == 0) this.canvas.strokeStyle = "#888888";

        this.canvas.beginPath();
        this.canvas.moveTo(0, _i * this.zoom);
        this.canvas.lineTo(this.width, _i * this.zoom);
        this.canvas.stroke();
      }
    }
  }, {
    key: "get_pixel",
    value: function get_pixel(e)
    // input: x,y position of the mouse inside the editor window in pixels
    // output: x,y position in the sprite grid
    {
      var obj = this.canvas_element.getBoundingClientRect();
      var x = e.clientX - obj.left;
      var y = e.clientY - obj.top;
      var x_grid = Math.floor(x / (this.width / this.config.sprite_x));
      var y_grid = Math.floor(y / (this.height / this.config.sprite_y));
      return { x: x_grid, y: y_grid };
    }
  }, {
    key: "toggle_grid",
    value: function toggle_grid() {
      this.grid = !this.grid;
    }
  }, {
    key: "get_grid",
    value: function get_grid() {
      return this.grid;
    }
  }]);

  return Editor;
}(Window_Controls);