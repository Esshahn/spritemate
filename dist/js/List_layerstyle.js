"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var List = function (_Window_Controls) {
  _inherits(List, _Window_Controls);

  function List(window, config) {
    _classCallCheck(this, List);

    var _this = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this));

    _this.config = config;
    _this.window = window;
    _this.zoom = _this.config.window_list.zoom;
    _this.zoom_min = 2;
    _this.zoom_max = 16;
    _this.pixels_x = _this.config.sprite_x;
    _this.pixels_y = _this.config.sprite_y;
    _this.width = _this.pixels_x * _this.zoom;
    _this.height = _this.pixels_y * _this.zoom;
    _this.clicked_sprite = 0;
    _this.sorted_array = [];
    _this.grid = true;

    var template = "\n      <div class=\"window_menu\">\n        <div class=\"icons-zoom-area\">\n          <img src=\"img/ui/icon-zoom-in.png\" id=\"icon-list-zoom-in\" title=\"zoom in\">\n          <img src=\"img/ui/icon-zoom-out.png\" id=\"icon-list-zoom-out\" title=\"zoom out\">\n          <img src=\"img/ui/icon-grid.png\" id=\"icon-editor-grid\" title=\"toggle grid borders\">\n        </div>\n        <img src=\"img/ui/icon-list-new.png\" id=\"icon-list-new\" title=\"new sprite\">\n        <img src=\"img/ui/icon-list-delete.png\" id=\"icon-list-delete\" title=\"remove sprite\">\n        <img src=\"img/ui/icon-list-copy.png\" id=\"icon-list-copy\" title=\"copy sprite\">\n        <img src=\"img/ui/icon-list-paste.png\" id=\"icon-list-paste\" title=\"paste sprite\">\n      </div>\n      <div id=\"spritelist\"></div>\n    ";

    $("#window-" + _this.window).append(template);

    $("#spritelist").sortable({
      cursor: "move",
      tolerance: "pointer",
      revert: 'invalid'
    });

    $("#spritelist").disableSelection();
    return _this;
  }

  _createClass(List, [{
    key: "get_clicked_sprite",
    value: function get_clicked_sprite() {
      return this.clicked_sprite;
    }
  }, {
    key: "toggle_grid",
    value: function toggle_grid() {
      this.grid = !this.grid;
    }
  }, {
    key: "update",
    value: function update(all_data) {

      // this one gets called during drawing in the editor
      // because the normal update method gets too slow
      // when the sprite list is becoming longer

      $('#window-' + this.window).dialog('option', 'title', 'sprite ' + (all_data.current_sprite + 1) + " of " + all_data.sprites.length);

      var sprite_data = all_data.sprites[all_data.current_sprite];
      var canvas = document.getElementById("canvas-" + all_data.current_sprite).getContext('2d');

      var x_grid_step = 1;
      if (sprite_data.multicolor) x_grid_step = 2;

      // first fill the whole sprite with the background color
      canvas.fillStyle = this.config.colors[all_data.colors[0]];
      canvas.fillRect(0, 0, this.width, this.height);

      for (var i = 0; i < this.pixels_x; i = i + x_grid_step) {
        for (var j = 0; j < this.pixels_y; j++) {

          var array_entry = sprite_data.pixels[j][i];

          if (array_entry != 0) // transparent
            {
              var color = sprite_data.color;
              if (array_entry != 1 && sprite_data.multicolor) color = all_data.colors[array_entry];
              canvas.fillStyle = this.config.colors[color];
              canvas.fillRect(i * this.zoom, j * this.zoom, x_grid_step * this.zoom, this.zoom);
            }
        }
      }
    }
  }, {
    key: "update_all",
    value: function update_all(all_data) {
      var _this2 = this;

      $(".sprite_layer").remove();

      var length = all_data.sprites.length;

      var _loop = function _loop(i) {
        var canvas_element = document.createElement('canvas');
        canvas_element.id = "canvas-" + i;
        canvas_element.width = _this2.width;
        canvas_element.height = _this2.height;

        var template = "\n      <div class=\"sprite_layer\" id=\"" + i + "\">\n        <div class=\"sprite_layer_canvas\"></div>\n        <div class=\"sprite_layer_info\">\n          ID: #" + i + "<br/>\n          NAME: #" + i + "\n        </div>\n        <div style=\"clear:both;\"></div>\n      </div>";

        $("#spritelist").append(template);
        $("#" + i + " .sprite_layer_canvas").append(canvas_element);
        $("#" + i).mouseup(function (e) {
          return _this2.clicked_sprite = i;
        });

        var canvas = canvas_element.getContext('2d');
        var sprite_data = all_data.sprites[i];
        var x_grid_step = 1;
        if (sprite_data.multicolor) x_grid_step = 2;

        // first fill the whole sprite with the background color
        canvas.fillStyle = _this2.config.colors[all_data.colors[0]];
        canvas.fillRect(0, 0, _this2.width, _this2.height);

        for (var _i = 0; _i < _this2.pixels_x; _i = _i + x_grid_step) {
          for (var j = 0; j < _this2.pixels_y; j++) {
            var array_entry = sprite_data.pixels[j][_i];

            if (array_entry != 0) // transparent
              {
                var color = sprite_data.color;
                if (array_entry != 1 && sprite_data.multicolor) color = all_data.colors[array_entry];
                canvas.fillStyle = _this2.config.colors[color];
                canvas.fillRect(_i * _this2.zoom, j * _this2.zoom, x_grid_step * _this2.zoom, _this2.zoom);
              }
          }
        }
      };

      for (var i = 0; i < length; i++) {
        _loop(i);
      }
    }
  }]);

  return List;
}(Window_Controls);