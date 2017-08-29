"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
  function App(config) {
    _classCallCheck(this, App);

    this.config = config;
    this.sprite = new Sprite(this.config);

    // init the base windows
    var window_config = {
      title: "Edit Sprite",
      left: 250,
      top: 150
    };
    this.window_editor = new Window_Editor(window_config);
    this.editor = new Editor(0, this.config);

    // create the color palette for the color window
    window_config = {
      title: "Palette",
      left: 100,
      top: 150
    };
    this.window_colors = new Window_Palette(window_config);
    this.palette = new Palette(1, this.config, this.sprite.get_colors());

    window_config = {
      title: "Preview",
      left: 750,
      top: 150
    };
    this.window_preview = new Window_Preview(window_config);
    this.preview = new Preview(2, this.config);

    this.editor.update(this.sprite.get_current_sprite());
    this.preview.update(this.sprite.get_current_sprite());
    this.is_drawing = false;
    this.user_interaction();
  }

  _createClass(App, [{
    key: "draw_pixel",
    value: function draw_pixel(e) {
      var color = this.palette.get_color();

      if (e.shiftKey) {
        color = this.sprite.get_delete_color();
      }

      // draw pixels
      var gridpos = this.editor.get_pixel(e); // returns the pixel grid position of the clicked pixel
      this.sprite.set_pixel(gridpos.x, gridpos.y, color); // updates the sprite array at the grid position with the color chosen on the palette
      this.editor.update(this.sprite.get_current_sprite()); // redraws the sprite in the editor window
      this.preview.update(this.sprite.get_current_sprite());
      this.is_drawing = true; // needed for mousemove drawing
    }
  }, {
    key: "update_ui",
    value: function update_ui() {
      this.editor.update(this.sprite.get_current_sprite());
      this.preview.update(this.sprite.get_current_sprite());
    }
  }, {
    key: "user_interaction",
    value: function user_interaction() {
      var _this = this;

      $(document).keydown(function (e) {

        if (e.key == "a") {
          // toggle hires or multicolor
          _this.sprite.shift_horizontal("right");
          _this.update_ui();
        }

        if (e.key == "A") {
          // toggle hires or multicolor
          _this.sprite.shift_horizontal("left");
          _this.update_ui();
        }

        if (e.key == "c") {
          // clear sprite
          _this.sprite.clear();
          _this.update_ui();
        }

        if (e.key == "d") {
          _this.sprite.mirror_horizontal();
          _this.update_ui();
        }

        if (e.key == "D") {
          _this.sprite.mirror_vertical();
          _this.update_ui();
        }

        if (e.key == "f") {
          // fill sprite with active color
          var color = _this.palette.get_color();
          _this.sprite.fill(color);
          _this.update_ui();
        }

        if (e.key == "g") {
          // toggle grid display
          _this.editor.toggle_grid();
          _this.update_ui();
        }

        if (e.key == "m") {
          // toggle hires or multicolor
          _this.sprite.toggle_multicolor();
          _this.update_ui();
        }

        if (e.key == "s") {
          // toggle hires or multicolor
          _this.sprite.shift_vertical("down");
          _this.update_ui();
        }

        if (e.key == "S") {
          // toggle hires or multicolor
          _this.sprite.shift_vertical("up");
          _this.update_ui();
        }
      });

      $('#editor').mousedown(function (e) {
        _this.draw_pixel(e);
      });

      $('#editor').mousemove(function (e) {
        if (_this.is_drawing) {
          _this.draw_pixel(e);
        }
      });

      $('#editor').mouseup(function (e) {
        // stop drawing pixels
        _this.is_drawing = false;
      });

      $('#palette').mouseup(function (e) {
        _this.palette.set_active_color(e);
      });
    }
  }, {
    key: "get_pos_window",
    value: function get_pos_window(obj, e)
    // returns the x and y position in pixels of the clicked window
    {
      var curleft = 0,
          curtop = 0;
      if (obj.offsetParent) {
        do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);

        var x = e.pageX - curleft;
        var y = e.pageY - curtop; // TODO: the -2 is a hack, no idea why is isn't exact otherwise

        return { x: x, y: y };
      }
      return undefined;
    }
  }]);

  return App;
}();