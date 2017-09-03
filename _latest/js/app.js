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
      left: 150,
      top: 180
    };
    this.window_editor = new Window_Editor(window_config);
    this.editor = new Editor(0, this.config);

    // create the color palette for the color window
    window_config = {
      title: "Palette",
      left: 50,
      top: 180
    };
    this.window_colors = new Window_Palette(window_config);
    this.palette = new Palette(1, this.config, this.sprite.get_colors());

    window_config = {
      title: "Preview",
      left: 650,
      top: 180
    };
    this.window_preview = new Window_Preview(window_config);
    this.preview = new Preview(2, this.config);

    window_config = {
      title: "Sprite List",
      left: 820,
      top: 360
    };
    this.window_preview = new Window_List(window_config);
    this.list = new List(3, this.config);

    this.update_ui();
    this.is_drawing = false;
    this.user_interaction();
  }

  _createClass(App, [{
    key: "draw_pixel",
    value: function draw_pixel(e) {
      var color = this.palette.get_color();

      if (e.shiftKey) color = this.sprite.get_delete_color();

      // draw pixels
      var gridpos = this.editor.get_pixel(e); // returns the pixel grid position of the clicked pixel
      this.sprite.set_pixel(gridpos.x, gridpos.y, color); // updates the sprite array at the grid position with the color chosen on the palette
      this.update_ui();
      this.is_drawing = true; // needed for mousemove drawing
    }
  }, {
    key: "update_ui",
    value: function update_ui() {
      this.editor.update(this.sprite.get_current_sprite());
      this.preview.update(this.sprite.get_current_sprite());
      this.list.update(this.sprite.get_all_sprites(), this.sprite.get_current_sprite_number());
    }
  }, {
    key: "init_ui_fade",
    value: function init_ui_fade(element) {
      $("#" + element).css({ opacity: 0.7 });
      $('#' + element).mouseenter(function (e) {
        $('#' + element).fadeTo("fast", 1);
      });
      $('#' + element).mouseleave(function (e) {
        $('#' + element).fadeTo("fast", 0.70);
      });
    }
  }, {
    key: "user_interaction",
    value: function user_interaction() {
      var _this = this;

      // init hover effects for all menu items
      this.init_ui_fade("icon-grid");
      this.init_ui_fade("icon-shift-left");
      this.init_ui_fade("icon-shift-right");
      this.init_ui_fade("icon-shift-up");
      this.init_ui_fade("icon-shift-down");
      this.init_ui_fade("icon-flip-horizontal");
      this.init_ui_fade("icon-flip-vertical");
      this.init_ui_fade("icon-multicolor");
      this.init_ui_fade("icon-fill");
      this.init_ui_fade("icon-list-new");

      this.init_ui_fade("icon-undo");

      // floppy is inactive
      $('#icon-floppy').css({ opacity: 0.20 });

      // trash can is a bit different
      $('#icon-trash').css({ opacity: 0.20 });
      $('#icon-trash').mouseenter(function (e) {
        if (!_this.sprite.only_one_sprite()) $('#icon-trash').fadeTo("fast", 1);
      });
      $('#icon-trash').mouseleave(function (e) {
        if (!_this.sprite.only_one_sprite()) $('#icon-trash').fadeTo("fast", 0.70);
      });

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
          _this.sprite.flip_horizontal();
          _this.update_ui();
        }

        if (e.key == "D") {
          _this.sprite.flip_vertical();
          _this.update_ui();
        }

        if (e.key == "f") {
          // fill sprite with active color
          _this.sprite.fill(_this.palette.get_color());
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
        _this.sprite.save_backup();
      });

      $('#palette').mouseup(function (e) {
        _this.palette.set_active_color(e);
      });

      $('#icon-shift-right').mouseup(function (e) {
        _this.sprite.shift_horizontal("right");
        _this.update_ui();
      });

      $('#icon-shift-left').mouseup(function (e) {
        _this.sprite.shift_horizontal("left");
        _this.update_ui();
      });

      $('#icon-shift-up').mouseup(function (e) {
        _this.sprite.shift_vertical("up");
        _this.update_ui();
      });

      $('#icon-shift-down').mouseup(function (e) {
        _this.sprite.shift_vertical("down");
        _this.update_ui();
      });

      $('#icon-flip-horizontal').mouseup(function (e) {
        _this.sprite.flip_horizontal();
        _this.update_ui();
      });

      $('#icon-flip-vertical').mouseup(function (e) {
        _this.sprite.flip_vertical();
        _this.update_ui();
      });

      $('#icon-grid').mouseup(function (e) {
        _this.editor.toggle_grid();
        _this.update_ui();
      });

      $('#icon-fill').mouseup(function (e) {
        _this.sprite.fill(_this.palette.get_color());
        _this.update_ui();
      });

      $('#icon-trash').mouseup(function (e) {
        _this.sprite.delete();
        if (_this.sprite.only_one_sprite()) $('#icon-trash').fadeTo("slow", 0.33);
        _this.update_ui();
      });

      $('#icon-multicolor').mouseup(function (e) {
        _this.sprite.toggle_multicolor();
        _this.update_ui();
      });

      $('#icon-undo').mouseup(function (e) {
        _this.sprite.undo();
        _this.update_ui();
      });

      $('#window-3').mouseup(function (e) {
        // sprite list window
        _this.sprite.set_current_sprite(_this.list.get_clicked_sprite());
        _this.update_ui();
      });

      $('#icon-list-new').mouseup(function (e) {
        e.stopPropagation();
        _this.sprite.new(0, false);
        $('#icon-trash').fadeTo("slow", 0.75);
        _this.update_ui();
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