"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
  function App(config) {
    _classCallCheck(this, App);

    this.config = config;
    this.sprite = new Sprite(this.config);

    // init the base windows
    var window_config = { title: "Edit Sprite", left: 150, top: 180, width: "auto", height: "auto" };
    this.window_editor = new Window_Editor(window_config);
    this.editor = new Editor(0, this.config);

    // create the color palette for the color window
    window_config = { title: "Palette", left: 50, top: 180, width: "auto", height: "auto" };
    this.window_colors = new Window_Palette(window_config);
    this.palette = new Palette(1, this.config);

    window_config = { title: "Preview", left: 650, top: 180, width: "auto", height: "auto" };
    this.window_preview = new Window_Preview(window_config);
    this.preview = new Preview(2, this.config);

    window_config = { title: "Sprite List", left: 880, top: 420, width: 520, height: "240" };
    this.window_preview = new Window_List(window_config);
    this.list = new List(3, this.config);

    window_config = { title: "Spritemate", left: 300, top: 380, width: "auto", height: "auto" };
    this.window_info = new Window_Info(window_config);

    this.is_drawing = false;
    this.update_ui();
    this.user_interaction();
  }

  _createClass(App, [{
    key: "update_ui",
    value: function update_ui() {
      this.editor.update(this.sprite.get_current_sprite());
      this.preview.update(this.sprite.get_current_sprite());
      this.list.update(this.sprite.get_all_sprites(), this.sprite.get_current_sprite_number());
      this.palette.update(this.sprite.get_colors());
      console.log("ui refresh: " + Date());
    }
  }, {
    key: "draw_pixel",
    value: function draw_pixel(e) {
      var color = this.palette.get_color();

      if (e.shiftKey) color = this.sprite.get_delete_color();

      // draw pixels
      var gridpos = this.editor.get_pixel(e); // returns the pixel grid position of the clicked pixel
      this.sprite.set_pixel(gridpos.x, gridpos.y, color); // updates the sprite array at the grid position with the color chosen on the palette
      this.is_drawing = true; // needed for mousemove drawing
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
      this.init_ui_fade("icon-undo");
      this.init_ui_fade("icon-grid");
      this.init_ui_fade("icon-shift-left");
      this.init_ui_fade("icon-shift-right");
      this.init_ui_fade("icon-shift-up");
      this.init_ui_fade("icon-shift-down");
      this.init_ui_fade("icon-flip-horizontal");
      this.init_ui_fade("icon-flip-vertical");
      this.init_ui_fade("icon-multicolor");
      this.init_ui_fade("icon-fill");
      this.init_ui_fade("icon-info");

      // init hover effect for list and preview
      this.init_ui_fade("icon-list-new");
      this.init_ui_fade("icon-preview-x");
      this.init_ui_fade("icon-preview-y");

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
      $('#icon-list-delete').css({ opacity: 0.20 });
      $('#icon-list-delete').mouseenter(function (e) {
        if (!_this.sprite.only_one_sprite()) $('#icon-list-delete').fadeTo("fast", 1);
      });
      $('#icon-list-delete').mouseleave(function (e) {
        if (!_this.sprite.only_one_sprite()) $('#icon-list-delete').fadeTo("fast", 0.70);
      });

      /*
      
      
      
        //////////////////  KEYBOARD COMMANDS
      
      
      
      */

      $(document).keydown(function (e) {

        if (e.key == "a") {
          // toggle hires or multicolor
          _this.sprite.toggle_double_x();
          _this.update_ui();
        }

        if (e.key == "A") {
          // toggle hires or multicolor
          _this.sprite.toggle_double_y();
          _this.update_ui();
        }
      });

      /* 
      
      
      
        //////////////////  EDITOR WINDOW
      
      
      
      */

      $('#editor').mousedown(function (e) {
        _this.draw_pixel(e);
        _this.update_ui();
      });

      $('#editor').mousemove(function (e) {
        if (_this.is_drawing) {
          _this.draw_pixel(e);
          _this.update_ui();
        }
      });

      $('#editor').mouseup(function (e) {
        // stop drawing pixels
        _this.is_drawing = false;
        _this.sprite.save_backup();
      });

      /*
      
      
      
        //////////////////  TOP MENU
      
      
      
      */

      $('#icon-undo').mouseup(function (e) {
        _this.sprite.undo();
        _this.update_ui();
      });

      $('#icon-grid').mouseup(function (e) {
        _this.editor.toggle_grid();
        _this.update_ui();
      });

      $('#icon-shift-left').mouseup(function (e) {
        _this.sprite.shift_horizontal("left");
        _this.update_ui();
      });

      $('#icon-shift-right').mouseup(function (e) {
        _this.sprite.shift_horizontal("right");
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

      $('#icon-multicolor').mouseup(function (e) {
        _this.sprite.toggle_multicolor();
        _this.update_ui();
      });

      $('#icon-trash').mouseup(function (e) {
        _this.sprite.delete();
        if (_this.sprite.only_one_sprite()) $('#icon-trash').fadeTo("slow", 0.33);
        if (_this.sprite.only_one_sprite()) $('#icon-list-delete').fadeTo("slow", 0.33);
        _this.update_ui();
      });

      $('#icon-fill').mouseup(function (e) {
        _this.sprite.fill(_this.palette.get_color());
        _this.update_ui();
      });

      $('#icon-info').mouseup(function (e) {
        $("#window-4").dialog("open");
      });

      /*
      
      
      
        //////////////////  LIST WINDOW
      
      
      
      */

      $('#spritelist').mouseup(function (e) {
        if (!_this.dragging) {
          _this.sprite.set_current_sprite(_this.list.get_clicked_sprite());
          _this.update_ui();
        }
      });

      $("#spritelist").sortable({ stop: function stop(e, ui) {
          _this.sprite.sort_spritelist($("#spritelist").sortable("toArray"));
          _this.dragging = false;
          _this.update_ui();
        }
      });

      $("#spritelist").sortable({ start: function start(e, ui) {
          _this.dragging = true;
        }
      });

      $('#icon-list-new').mouseup(function (e) {
        _this.sprite.new(0, false);
        $('#icon-trash').fadeTo("slow", 0.75);
        $('#icon-list-delete').fadeTo("slow", 0.75);
        _this.update_ui();
      });

      $('#icon-list-delete').mouseup(function (e) {
        _this.sprite.delete();
        if (_this.sprite.only_one_sprite()) $('#icon-list-delete').fadeTo("slow", 0.33);
        if (_this.sprite.only_one_sprite()) $('#icon-trash').fadeTo("slow", 0.33);
        _this.update_ui();
      });

      /*
      
      
      
        //////////////////  PREVIEW WINDOW
      
      
      
      */

      $('#icon-preview-x').mouseup(function (e) {
        _this.sprite.toggle_double_x();
        $('#icon-preview-x').toggleClass('icon-preview-x2-hi');
        _this.update_ui();
      });

      $('#icon-preview-y').mouseup(function (e) {
        _this.sprite.toggle_double_y();
        $('#icon-preview-y').toggleClass('icon-preview-y2-hi');
        _this.update_ui();
      });

      /*
      
      
      
        //////////////////  PALETTE WINDOW
      
      
      
      */

      $('#palette').mouseup(function (e) {
        _this.palette.set_active_color(e);
      });

      $('#palette_spritecolor').mouseup(function (e) {
        $('#palette_spritecolors div').removeClass("palette_color_item_selected");
        $('#palette_spritecolors p').removeClass("palette_highlight_text");
        $('#color_spritecolor').addClass("palette_color_item_selected");
        $('#palette_spritecolor p').addClass("palette_highlight_text");
      });

      $('#palette_transparent').mouseup(function (e) {
        $('#palette_spritecolors div').removeClass("palette_color_item_selected");
        $('#palette_spritecolors p').removeClass("palette_highlight_text");
        $('#color_transparent').addClass("palette_color_item_selected");
        $('#palette_transparent p').addClass("palette_highlight_text");
      });

      $('#palette_multicolor_1').mouseup(function (e) {
        $('#palette_spritecolors div').removeClass("palette_color_item_selected");
        $('#palette_spritecolors p').removeClass("palette_highlight_text");
        $('#color_multicolor_1').addClass("palette_color_item_selected");
        $('#palette_multicolor_1 p').addClass("palette_highlight_text");
      });

      $('#palette_multicolor_2').mouseup(function (e) {
        $('#palette_spritecolors div').removeClass("palette_color_item_selected");
        $('#palette_spritecolors p').removeClass("palette_highlight_text");
        $('#color_multicolor_2').addClass("palette_color_item_selected");
        $('#palette_multicolor_2 p').addClass("palette_highlight_text");
      });
    }
  }]);

  return App;
}();