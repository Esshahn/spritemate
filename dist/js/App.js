"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
  function App(config) {
    _classCallCheck(this, App);

    this.config = config;
    this.sprite = new Sprite(this.config);

    // init the base windows
    var window_config = { title: "Edit Sprite", type: "sprite", resizable: false, left: 150, top: 180, width: "auto", height: "auto" };
    this.window_editor = new Window(window_config);
    this.editor = new Editor(0, this.config);

    // create the color palette for the color window
    window_config = { title: "Palette", type: "colors", resizable: false, left: 50, top: 180, width: "auto", height: "auto" };
    this.window_colors = new Window(window_config);
    this.palette = new Palette(1, this.config);

    window_config = { title: "Preview", type: "preview", resizable: false, left: 600, top: 180, width: "auto", height: "auto" };
    this.window_preview = new Window(window_config);
    this.preview = new Preview(2, this.config);

    window_config = { title: "Sprite List", type: "list", resizable: true, left: 790, top: 400, width: 440, height: 200 };
    this.window_preview = new Window(window_config);
    this.list = new List(3, this.config);

    window_config = { title: "Spritemate", type: "info", resizable: false, autoOpen: false, width: "auto", height: "auto" };
    this.window_info = new Window(window_config);
    this.info = new Info(4, this.config);

    window_config = { title: "Save", type: "file", resizable: false, autoOpen: false, width: 580, height: "auto" };
    this.window_info = new Window(window_config);
    this.save = new Save(5, this.config);

    this.load = new Load(this.config, { onLoad: this.update_loaded_file.bind(this) });

    this.is_drawing = false;

    this.sprite.new(this.palette.get_color());
    this.update_ui();
    this.user_interaction();
  }

  _createClass(App, [{
    key: "update_ui",
    value: function update_ui() {
      this.editor.update(this.sprite.get_all());
      this.preview.update(this.sprite.get_all());
      this.list.update(this.sprite.get_all());
      this.palette.update(this.sprite.get_all());
      //console.log("ui refresh: " + Date());
    }
  }, {
    key: "update_loaded_file",
    value: function update_loaded_file() {
      // called as a callback event from the load class
      // after a file got loaded in completely
      this.sprite.set_all(this.load.get_imported_file());
      this.update_ui();
    }
  }, {
    key: "init_ui_fade",
    value: function init_ui_fade(element) {
      $('#' + element).mouseenter(function (e) {
        $('#' + element).animate({ backgroundColor: 'rgba(0,0,0,0.5)' }, 'fast');
      });
      $('#' + element).mouseleave(function (e) {
        $('#' + element).animate({ backgroundColor: 'transparent' }, 'fast');
      });
    }
  }, {
    key: "user_interaction",
    value: function user_interaction() {
      var _this = this;

      // init hover effects for all menu items
      this.init_ui_fade("icon-load");
      this.init_ui_fade("icon-save");
      this.init_ui_fade("icon-undo");
      this.init_ui_fade("icon-redo");
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
      this.init_ui_fade("icon-list-grid");
      this.init_ui_fade("icon-list-zoom-in");
      this.init_ui_fade("icon-list-zoom-out");
      this.init_ui_fade("icon-preview-zoom-in");
      this.init_ui_fade("icon-preview-zoom-out");
      this.init_ui_fade("icon-preview-x");
      this.init_ui_fade("icon-preview-y");

      // trash can is a bit different
      $('#icon-trash').css({ opacity: 0.20 });
      $('#icon-trash').mouseenter(function (e) {
        if (!_this.sprite.only_one_sprite()) $('#icon-trash').animate({ backgroundColor: 'rgba(0,0,0,0.5)' }, 'fast');
      });
      $('#icon-trash').mouseleave(function (e) {
        if (!_this.sprite.only_one_sprite()) $('#icon-trash').animate({ backgroundColor: 'transparent' }, 'fast');
      });
      $('#icon-list-delete').css({ opacity: 0.20 });
      $('#icon-list-delete').mouseenter(function (e) {
        if (!_this.sprite.only_one_sprite()) $('#icon-list-delete').animate({ backgroundColor: 'rgba(0,0,0,0.5)' }, 'fast');
      });
      $('#icon-list-delete').mouseleave(function (e) {
        if (!_this.sprite.only_one_sprite()) $('#icon-list-delete').animate({ backgroundColor: 'transparent' }, 'fast');
      });

      /*
      
      
      
        //////////////////  KEYBOARD COMMANDS
      
      
      
      */

      $(document).keydown(function (e) {

        if (e.key == "a") {
          console.log(_this.sprite.get_all());
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
        _this.sprite.set_pixel(_this.editor.get_pixel(e), e.shiftKey); // updates the sprite array at the grid position with the color chosen on the palette
        _this.is_drawing = true; // needed for mousemove drawing
        _this.update_ui();
      });

      $('#editor').mousemove(function (e) {
        if (_this.is_drawing) {
          _this.sprite.set_pixel(_this.editor.get_pixel(e), e.shiftKey); // updates the sprite array at the grid position with the color chosen on the palette
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

      $('#icon-load').mouseup(function (e) {
        $("#input-load").trigger("click");
      });

      $('#icon-save').mouseup(function (e) {
        $("#window-5").dialog("open");
        _this.save.set_save_data(_this.sprite.get_all());
      });

      $('#icon-undo').mouseup(function (e) {
        _this.sprite.undo();
        _this.update_ui();
      });

      $('#icon-redo').mouseup(function (e) {
        _this.sprite.redo();
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
        _this.sprite.fill();
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
          if (!_this.sprite.is_multicolor() && _this.sprite.is_pen_multicolor()) {
            _this.sprite.set_pen("i");
          }
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
        _this.sprite.new(_this.palette.get_color());
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

      $('#icon-list-grid').mouseup(function (e) {
        _this.list.toggle_grid();
        _this.update_ui();
      });

      $('#icon-list-zoom-in').mouseup(function (e) {
        _this.list.zoom_in();
        _this.update_ui();
      });

      $('#icon-list-zoom-out').mouseup(function (e) {
        _this.list.zoom_out();
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

      $('#icon-preview-zoom-in').mouseup(function (e) {
        _this.preview.zoom_in();
        _this.update_ui();
      });

      $('#icon-preview-zoom-out').mouseup(function (e) {
        _this.preview.zoom_out();
        _this.update_ui();
      });

      /*
      
      
      
        //////////////////  PALETTE WINDOW
      
      
      
      */

      $('#palette').mouseup(function (e) {
        _this.palette.set_active_color(e);
        _this.sprite.set_pen_color(_this.palette.get_color());
        _this.update_ui();
      });

      $('#palette_i').mouseup(function (e) {
        _this.sprite.set_pen("i");
        _this.update_ui();
      });

      $('#palette_t').mouseup(function (e) {
        _this.sprite.set_pen("t");
        _this.update_ui();
      });

      $('#palette_m1').mouseup(function (e) {
        _this.sprite.set_pen("m1");
        _this.update_ui();
      });

      $('#palette_m2').mouseup(function (e) {
        _this.sprite.set_pen("m2");
        _this.update_ui();
      });
    }
  }]);

  return App;
}();

/*
function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}
*/