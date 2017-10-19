"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ASCII text: http://patorjk.com/software/taag/#p=display&h=2&f=Doh&t=KEYS

var App = function () {
  function App(config) {
    _classCallCheck(this, App);

    this.config = config;

    this.sprite = new Sprite(this.config);

    // init the base windows
    var window_config = { title: "Edit Sprite", type: "sprite", resizable: false, left: 210, top: 100, width: "auto", height: "auto" };
    this.window_editor = new Window(window_config);
    this.editor = new Editor(0, this.config);

    // create the color palette for the color window
    window_config = { title: "Palette", type: "colors", resizable: false, left: 110, top: 100, width: "auto", height: "auto" };
    this.window_colors = new Window(window_config);
    this.palette = new Palette(1, this.config);

    window_config = { title: "Preview", type: "preview", resizable: false, left: 680, top: 100, width: "auto", height: "auto" };
    this.window_preview = new Window(window_config);
    this.preview = new Preview(2, this.config);

    window_config = { title: "Sprite List", type: "list", resizable: true, left: 880, top: 320, width: 440, height: 200 };
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

    this.mode = "draw"; // modes can be "draw" and "fill"

    status("Welcome to spritemate!");
    this.update();
    this.user_interaction();

    $("#window-4").dialog("open");
  }

  _createClass(App, [{
    key: "toggle_fullscreen",
    value: function toggle_fullscreen() {
      if (!document.fullscreenElement && // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        // current working methods
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
  }, {
    key: "update",
    value: function update() {
      var all = this.sprite.get_all();

      this.editor.update(all);
      this.preview.update(all);
      this.list.update(all);
      this.palette.update(all);
      this.update_ui();
    }
  }, {
    key: "update_ui",
    value: function update_ui() {

      if (this.sprite.get_number_of_sprites() > 1) {
        $('#icon-list-delete').fadeTo("fast", 1);
      } else {
        $('#icon-list-delete').fadeTo("fast", 0.33);
      }

      if (this.sprite.is_copy_empty()) {
        $('#icon-list-paste').fadeTo("fast", 0.33);
      } else {
        $('#icon-list-paste').fadeTo("fast", 1);
      }

      if (this.sprite.can_undo()) {
        $('#icon-undo').fadeTo("fast", 1);
      } else {
        $('#icon-undo').fadeTo("fast", 0.33);
      }

      if (this.sprite.can_redo()) {
        $('#icon-redo').fadeTo("fast", 1);
      } else {
        $('#icon-redo').fadeTo("fast", 0.33);
      }

      if (this.sprite.is_overlay()) {
        $('#icon-preview-overlay').attr("src", "img/icon3/icon-preview-overlay-hi.png");
      } else {
        $('#icon-preview-overlay').attr("src", "img/icon3/icon-preview-overlay.png");
      }

      if (this.preview.is_min_zoom()) {
        $('#icon-preview-zoom-out').fadeTo("fast", 0.33);
      } else {
        $('#icon-preview-zoom-out').fadeTo("fast", 1);
      }

      if (this.preview.is_max_zoom()) {
        $('#icon-preview-zoom-in').fadeTo("fast", 0.33);
      } else {
        $('#icon-preview-zoom-in').fadeTo("fast", 1);
      }

      if (this.editor.is_min_zoom()) {
        $('#icon-editor-zoom-out').fadeTo("fast", 0.33);
      } else {
        $('#icon-editor-zoom-out').fadeTo("fast", 1);
      }

      if (this.editor.is_max_zoom()) {
        $('#icon-editor-zoom-in').fadeTo("fast", 0.33);
      } else {
        $('#icon-editor-zoom-in').fadeTo("fast", 1);
      }

      if (this.list.is_min_zoom()) {
        $('#icon-list-zoom-out').fadeTo("fast", 0.33);
      } else {
        $('#icon-list-zoom-out').fadeTo("fast", 1);
      }

      if (this.list.is_max_zoom()) {
        $('#icon-list-zoom-in').fadeTo("fast", 0.33);
      } else {
        $('#icon-list-zoom-in').fadeTo("fast", 1);
      }
    }
  }, {
    key: "update_loaded_file",
    value: function update_loaded_file() {
      // called as a callback event from the load class
      // after a file got loaded in completely
      this.sprite.set_all(this.load.get_imported_file());
      this.update();
    }
  }, {
    key: "init_ui_fade",
    value: function init_ui_fade(element) {
      $('#' + element).mouseenter(function (e) {
        $('#' + element).stop(true, true).animate({ backgroundColor: 'rgba(90,90,90,0.5)' }, 'fast');
      });
      $('#' + element).mouseleave(function (e) {
        $('#' + element).stop(true, true).animate({ backgroundColor: 'transparent' }, 'fast');
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
      this.init_ui_fade("icon-editor-grid");
      this.init_ui_fade("icon-shift-left");
      this.init_ui_fade("icon-shift-right");
      this.init_ui_fade("icon-shift-up");
      this.init_ui_fade("icon-shift-down");
      this.init_ui_fade("icon-flip-horizontal");
      this.init_ui_fade("icon-flip-vertical");
      this.init_ui_fade("icon-multicolor");
      this.init_ui_fade("icon-draw");
      // this.init_ui_fade("icon-select");
      this.init_ui_fade("icon-fill");
      this.init_ui_fade("icon-fullscreen");
      this.init_ui_fade("icon-info");

      this.init_ui_fade("icon-list-new");
      this.init_ui_fade("icon-list-copy");
      this.init_ui_fade("icon-list-paste");
      this.init_ui_fade("icon-list-grid");
      this.init_ui_fade("icon-editor-zoom-in");
      this.init_ui_fade("icon-editor-zoom-out");
      this.init_ui_fade("icon-list-zoom-in");
      this.init_ui_fade("icon-list-zoom-out");
      this.init_ui_fade("icon-preview-zoom-in");
      this.init_ui_fade("icon-preview-zoom-out");
      this.init_ui_fade("icon-preview-overlay");
      this.init_ui_fade("icon-preview-x");
      this.init_ui_fade("icon-preview-y");

      // delete is a bit different
      $('#icon-list-delete').css({ opacity: 0.20 });
      $('#icon-list-delete').mouseenter(function (e) {
        if (!_this.sprite.only_one_sprite()) $('#icon-list-delete').animate({ backgroundColor: 'rgba(0,0,0,0.5)' }, 'fast');
      });
      $('#icon-list-delete').mouseleave(function (e) {
        if (!_this.sprite.only_one_sprite()) $('#icon-list-delete').animate({ backgroundColor: 'transparent' }, 'fast');
      });

      $('#icon-select').css({ opacity: 0.20 });

      /*
      
      KKKKKKKKK    KKKKKKK   EEEEEEEEEEEEEEEEEEEEEE   YYYYYYY       YYYYYYY      SSSSSSSSSSSSSSS 
      K:::::::K    K:::::K   E::::::::::::::::::::E   Y:::::Y       Y:::::Y    SS:::::::::::::::S
      K:::::::K    K:::::K   E::::::::::::::::::::E   Y:::::Y       Y:::::Y   S:::::SSSSSS::::::S
      K:::::::K   K::::::K   EE::::::EEEEEEEEE::::E   Y::::::Y     Y::::::Y   S:::::S     SSSSSSS
      KK::::::K  K:::::KKK     E:::::E       EEEEEE   YYY:::::Y   Y:::::YYY   S:::::S            
        K:::::K K:::::K        E:::::E                   Y:::::Y Y:::::Y      S:::::S            
        K::::::K:::::K         E::::::EEEEEEEEEE          Y:::::Y:::::Y        S::::SSSS         
        K:::::::::::K          E:::::::::::::::E           Y:::::::::Y          SS::::::SSSSS    
        K:::::::::::K          E:::::::::::::::E            Y:::::::Y             SSS::::::::SS  
        K::::::K:::::K         E::::::EEEEEEEEEE             Y:::::Y                 SSSSSS::::S 
        K:::::K K:::::K        E:::::E                       Y:::::Y                      S:::::S
      KK::::::K  K:::::KKK     E:::::E       EEEEEE          Y:::::Y                      S:::::S
      K:::::::K   K::::::K   EE::::::EEEEEEEE:::::E          Y:::::Y          SSSSSSS     S:::::S
      K:::::::K    K:::::K   E::::::::::::::::::::E       YYYY:::::YYYY       S::::::SSSSSS:::::S
      K:::::::K    K:::::K   E::::::::::::::::::::E       Y:::::::::::Y       S:::::::::::::::SS 
      KKKKKKKKK    KKKKKKK   EEEEEEEEEEEEEEEEEEEEEE       YYYYYYYYYYYYY        SSSSSSSSSSSSSSS  
      
      */

      $(document).keydown(function (e) {

        if (e.key == "a") {
          console.time('performance');
          for (var i = 0; i <= 100; i++) {
            _this.update();
          }console.timeEnd('performance');
        }
        /*
              if (e.key == "A")
              {
                // toggle hires or multicolor
                this.sprite.toggle_double_y();
                this.update();
              }
        
              if (e.key == "f")
              {
                // toggle fullscreen
                this.toggle_fullscreen();
              }
        */
      });

      /*
      
      MMMMMMMM               MMMMMMMM   EEEEEEEEEEEEEEEEEEEEEE   NNNNNNNN        NNNNNNNN   UUUUUUUU     UUUUUUUU
      M:::::::M             M:::::::M   E::::::::::::::::::::E   N:::::::N       N::::::N   U::::::U     U::::::U
      M::::::::M           M::::::::M   E::::::::::::::::::::E   N::::::::N      N::::::N   U::::::U     U::::::U
      M:::::::::M         M:::::::::M   EE::::::EEEEEEEEE::::E   N:::::::::N     N::::::N   UU:::::U     U:::::UU
      M::::::::::M       M::::::::::M     E:::::E       EEEEEE   N::::::::::N    N::::::N    U:::::U     U:::::U 
      M:::::::::::M     M:::::::::::M     E:::::E                N:::::::::::N   N::::::N    U:::::D     D:::::U 
      M:::::::M::::M   M::::M:::::::M     E::::::EEEEEEEEEE      N:::::::N::::N  N::::::N    U:::::D     D:::::U 
      M::::::M M::::M M::::M M::::::M     E:::::::::::::::E      N::::::N N::::N N::::::N    U:::::D     D:::::U 
      M::::::M  M::::M::::M  M::::::M     E:::::::::::::::E      N::::::N  N::::N:::::::N    U:::::D     D:::::U 
      M::::::M   M:::::::M   M::::::M     E::::::EEEEEEEEEE      N::::::N   N:::::::::::N    U:::::D     D:::::U 
      M::::::M    M:::::M    M::::::M     E:::::E                N::::::N    N::::::::::N    U:::::D     D:::::U 
      M::::::M     MMMMM     M::::::M     E:::::E       EEEEEE   N::::::N     N:::::::::N    U::::::U   U::::::U 
      M::::::M               M::::::M   EE::::::EEEEEEEE:::::E   N::::::N      N::::::::N    U:::::::UUU:::::::U 
      M::::::M               M::::::M   E::::::::::::::::::::E   N::::::N       N:::::::N     UU:::::::::::::UU  
      M::::::M               M::::::M   E::::::::::::::::::::E   N::::::N        N::::::N       UU:::::::::UU    
      MMMMMMMM               MMMMMMMM   EEEEEEEEEEEEEEEEEEEEEE   NNNNNNNN         NNNNNNN         UUUUUUUUU  
      
      
      
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
        _this.update();
      });

      $('#icon-redo').mouseup(function (e) {
        _this.sprite.redo();
        _this.update();
      });

      $('#icon-draw').mouseup(function (e) {
        _this.mode = "draw";
        status("Draw mode");
        $("#image-icon-draw").attr("src", "img/icon3/icon-draw-hi.png");
        $("#image-icon-select").attr("src", "img/icon3/icon-select.png");
        $("#image-icon-fill").attr("src", "img/icon3/icon-fill.png");
      });

      /*
          $('#icon-select').mouseup((e) =>
          {
            this.mode = "select";
            status("Select mode");
            $("#image-icon-draw").attr("src","img/icon3/icon-draw.png");
            $("#image-icon-select").attr("src","img/icon3/icon-select-hi.png");
            $("#image-icon-fill").attr("src","img/icon3/icon-fill.png");
          });
      */
      $('#icon-fill').mouseup(function (e) {
        _this.mode = "fill";
        status("Fill mode");
        $("#image-icon-draw").attr("src", "img/icon3/icon-draw.png");
        $("#image-icon-select").attr("src", "img/icon3/icon-select.png");
        $("#image-icon-fill").attr("src", "img/icon3/icon-fill-hi.png");
      });

      $('#icon-fullscreen').mouseup(function (e) {
        _this.toggle_fullscreen();
      });

      $('#icon-info').mouseup(function (e) {
        $("#window-4").dialog("open");
      });

      /*
      
              CCCCCCCCCCCCC     OOOOOOOOO     LLLLLLLLLLL                  OOOOOOOOO     RRRRRRRRRRRRRRRRR      SSSSSSSSSSSSSSS 
           CCC::::::::::::C   OO:::::::::OO   L:::::::::L                OO:::::::::OO   R::::::::::::::::R   SS:::::::::::::::S
         CC:::::::::::::::C OO:::::::::::::OO L:::::::::L              OO:::::::::::::OO R::::::RRRRRR:::::R S:::::SSSSSS::::::S
        C:::::CCCCCCCC::::CO:::::::OOO:::::::OLL:::::::LL             O:::::::OOO:::::::ORR:::::R     R:::::RS:::::S     SSSSSSS
       C:::::C       CCCCCCO::::::O   O::::::O  L:::::L               O::::::O   O::::::O  R::::R     R:::::RS:::::S            
      C:::::C              O:::::O     O:::::O  L:::::L               O:::::O     O:::::O  R::::R     R:::::RS:::::S            
      C:::::C              O:::::O     O:::::O  L:::::L               O:::::O     O:::::O  R::::RRRRRR:::::R  S::::SSSS         
      C:::::C              O:::::O     O:::::O  L:::::L               O:::::O     O:::::O  R:::::::::::::RR    SS::::::SSSSS    
      C:::::C              O:::::O     O:::::O  L:::::L               O:::::O     O:::::O  R::::RRRRRR:::::R     SSS::::::::SS  
      C:::::C              O:::::O     O:::::O  L:::::L               O:::::O     O:::::O  R::::R     R:::::R       SSSSSS::::S 
      C:::::C              O:::::O     O:::::O  L:::::L               O:::::O     O:::::O  R::::R     R:::::R            S:::::S
       C:::::C       CCCCCCO::::::O   O::::::O  L:::::L         LLLLLLO::::::O   O::::::O  R::::R     R:::::R            S:::::S
        C:::::CCCCCCCC::::CO:::::::OOO:::::::OLL:::::::LLLLLLLLL:::::LO:::::::OOO:::::::ORR:::::R     R:::::RSSSSSSS     S:::::S
         CC:::::::::::::::C OO:::::::::::::OO L::::::::::::::::::::::L OO:::::::::::::OO R::::::R     R:::::RS::::::SSSSSS:::::S
           CCC::::::::::::C   OO:::::::::OO   L::::::::::::::::::::::L   OO:::::::::OO   R::::::R     R:::::RS:::::::::::::::SS 
              CCCCCCCCCCCCC     OOOOOOOOO     LLLLLLLLLLLLLLLLLLLLLLLL     OOOOOOOOO     RRRRRRRR     RRRRRRR SSSSSSSSSSSSSSS   
      
      */

      $('#palette').mouseup(function (e) {
        _this.palette.set_active_color(e);
        _this.sprite.set_pen_color(_this.palette.get_color());
        _this.update();
      });

      $('#palette_i').mouseup(function (e) {
        _this.sprite.set_pen("i");
        _this.update();
      });

      $('#palette_t').mouseup(function (e) {
        _this.sprite.set_pen("t");
        _this.update();
      });

      $('#palette_m1').mouseup(function (e) {
        _this.sprite.set_pen("m1");
        _this.update();
      });

      $('#palette_m2').mouseup(function (e) {
        _this.sprite.set_pen("m2");
        _this.update();
      });

      /* 
      
      EEEEEEEEEEEEEEEEEEEEEE   DDDDDDDDDDDDD         IIIIIIIIII   TTTTTTTTTTTTTTTTTTTTTTT    
      E::::::::::::::::::::E   D::::::::::::DDD      I::::::::I   T:::::::::::::::::::::T 
      E::::::::::::::::::::E   D:::::::::::::::DD    I::::::::I   T:::::::::::::::::::::T
      EE::::::EEEEEEEEE::::E   DDD:::::DDDDD:::::D   II::::::II   T:::::TT:::::::TT:::::T
        E:::::E       EEEEEE     D:::::D    D:::::D    I::::I     TTTTTT  T:::::T  TTTTTT
        E:::::E                  D:::::D     D:::::D   I::::I             T:::::T        
        E::::::EEEEEEEEEE        D:::::D     D:::::D   I::::I             T:::::T        
        E:::::::::::::::E        D:::::D     D:::::D   I::::I             T:::::T         
        E:::::::::::::::E        D:::::D     D:::::D   I::::I             T:::::T        
        E::::::EEEEEEEEEE        D:::::D     D:::::D   I::::I             T:::::T        
        E:::::E                  D:::::D     D:::::D   I::::I             T:::::T       
        E:::::E       EEEEEE     D:::::D    D:::::D    I::::I             T:::::T       
      EE::::::EEEEEEEE:::::E   DDD:::::DDDDD:::::D   II::::::II         TT:::::::TT     
      E::::::::::::::::::::E   D:::::::::::::::DD    I::::::::I         T:::::::::T     
      E::::::::::::::::::::E   D::::::::::::DDD      I::::::::I         T:::::::::T      
      EEEEEEEEEEEEEEEEEEEEEE   DDDDDDDDDDDDD         IIIIIIIIII         TTTTTTTTTTT        
      
      */

      $('#editor').mousedown(function (e) {
        if (_this.mode == "draw") {
          _this.sprite.set_pixel(_this.editor.get_pixel(e), e.shiftKey); // updates the sprite array at the grid position with the color chosen on the palette
          _this.is_drawing = true; // needed for mousemove drawing
        }

        if (_this.mode == "fill") {
          _this.sprite.floodfill(_this.editor.get_pixel(e));
        }

        _this.update();
      });

      $('#editor').mousemove(function (e) {
        if (_this.is_drawing && _this.mode == "draw") {
          _this.sprite.set_pixel(_this.editor.get_pixel(e), e.shiftKey); // updates the sprite array at the grid position with the color chosen on the palette
          _this.editor.update(_this.sprite.get_all());
          _this.preview.update(_this.sprite.get_all());
          _this.list.update_current_sprite(_this.sprite.get_all()); // only updates the sprite drawn onto
        }
      });

      $('#editor').mouseup(function (e) {
        // stop drawing pixels
        _this.is_drawing = false;
        _this.sprite.save_backup();
        _this.update();
      });

      $('#icon-shift-left').mouseup(function (e) {
        _this.sprite.shift_horizontal("left");
        _this.update();
      });

      $('#icon-shift-right').mouseup(function (e) {
        _this.sprite.shift_horizontal("right");
        _this.update();
      });

      $('#icon-shift-up').mouseup(function (e) {
        _this.sprite.shift_vertical("up");
        _this.update();
      });

      $('#icon-shift-down').mouseup(function (e) {
        _this.sprite.shift_vertical("down");
        _this.update();
      });

      $('#icon-flip-horizontal').mouseup(function (e) {
        _this.sprite.flip_horizontal();
        _this.update();
      });

      $('#icon-flip-vertical').mouseup(function (e) {
        _this.sprite.flip_vertical();
        _this.update();
      });

      $('#icon-multicolor').mouseup(function (e) {
        _this.sprite.toggle_multicolor();
        _this.update();
      });

      $('#icon-editor-zoom-in').mouseup(function (e) {
        _this.editor.zoom_in();
        _this.update();
      });

      $('#icon-editor-zoom-out').mouseup(function (e) {
        _this.editor.zoom_out();
        _this.update();
      });

      $('#icon-editor-grid').mouseup(function (e) {
        _this.editor.toggle_grid();
        _this.update();
      });

      /*
      
      LLLLLLLLLLL                IIIIIIIIII      SSSSSSSSSSSSSSS    TTTTTTTTTTTTTTTTTTTTTTT
      L:::::::::L                I::::::::I    SS:::::::::::::::S   T:::::::::::::::::::::T
      L:::::::::L                I::::::::I   S:::::SSSSSS::::::S   T:::::::::::::::::::::T
      LL:::::::LL                II::::::II   S:::::S     SSSSSSS   T:::::TT:::::::TT:::::T
        L:::::L                    I::::I     S:::::S               TTTTTT  T:::::T  TTTTTT
        L:::::L                    I::::I     S:::::S                       T:::::T        
        L:::::L                    I::::I      S::::SSSS                    T:::::T        
        L:::::L                    I::::I       SS::::::SSSSS               T:::::T        
        L:::::L                    I::::I         SSS::::::::SS             T:::::T        
        L:::::L                    I::::I            SSSSSS::::S            T:::::T        
        L:::::L                    I::::I                 S:::::S           T:::::T        
        L:::::L         LLLLLL     I::::I                 S:::::S           T:::::T        
      LL:::::::LLLLLLLLL:::::L   II::::::II   SSSS        S:::::S         TT:::::::TT      
      L::::::::::::::::::::::L   I::::::::I   S::::::SSSSSS:::::S         T:::::::::T      
      L::::::::::::::::::::::L   I::::::::I   S:::::::::::::::SS          T:::::::::T      
      LLLLLLLLLLLLLLLLLLLLLLLL   IIIIIIIIII    SSSSSSSSSSSSSSS            TTTTTTTTTTT  
      
      */

      $('#spritelist').mouseup(function (e) {
        if (!_this.dragging) {
          _this.sprite.set_current_sprite(_this.list.get_clicked_sprite());
          if (!_this.sprite.is_multicolor() && _this.sprite.is_pen_multicolor()) {
            _this.sprite.set_pen("i");
          }
          _this.update();
        }
      });

      $("#spritelist").sortable({ stop: function stop(e, ui) {
          _this.sprite.sort_spritelist($("#spritelist").sortable("toArray"));
          _this.dragging = false;
          _this.update();
        }
      });

      $("#spritelist").sortable({ start: function start(e, ui) {
          _this.dragging = true;
        }
      });

      $('#icon-list-new').mouseup(function (e) {
        _this.sprite.new(_this.palette.get_color(), _this.sprite.is_multicolor());
        _this.update();
      });

      $('#icon-list-delete').mouseup(function (e) {
        _this.sprite.delete();
        _this.update();
      });

      $('#icon-list-copy').mouseup(function (e) {
        _this.sprite.copy();
        _this.update_ui();
        status("Sprite copied.");
      });

      $('#icon-list-paste').mouseup(function (e) {
        if (!_this.sprite.is_copy_empty()) {
          _this.sprite.paste();
          _this.update();
          status("Sprite pasted.");
        } else {
          status("Nothing to copy.", "error");
        }
      });

      $('#icon-list-grid').mouseup(function (e) {
        _this.list.toggle_grid();
        _this.update();
      });

      $('#icon-list-zoom-in').mouseup(function (e) {
        _this.list.zoom_in();
        _this.update();
      });

      $('#icon-list-zoom-out').mouseup(function (e) {
        _this.list.zoom_out();
        _this.update();
      });

      /*
      
      PPPPPPPPPPPPPPPPP   RRRRRRRRRRRRRRRRR   EEEEEEEEEEEEEEEEEEEEEEVVVVVVVV           VVVVVVVV
      P::::::::::::::::P  R::::::::::::::::R  E::::::::::::::::::::EV::::::V           V::::::V
      P::::::PPPPPP:::::P R::::::RRRRRR:::::R E::::::::::::::::::::EV::::::V           V::::::V
      PP:::::P     P:::::PRR:::::R     R:::::REE::::::EEEEEEEEE::::EV::::::V           V::::::V
        P::::P     P:::::P  R::::R     R:::::R  E:::::E       EEEEEE V:::::V           V:::::V 
        P::::P     P:::::P  R::::R     R:::::R  E:::::E               V:::::V         V:::::V  
        P::::PPPPPP:::::P   R::::RRRRRR:::::R   E::::::EEEEEEEEEE      V:::::V       V:::::V   
        P:::::::::::::PP    R:::::::::::::RR    E:::::::::::::::E       V:::::V     V:::::V    
        P::::PPPPPPPPP      R::::RRRRRR:::::R   E:::::::::::::::E        V:::::V   V:::::V     
        P::::P              R::::R     R:::::R  E::::::EEEEEEEEEE         V:::::V V:::::V      
        P::::P              R::::R     R:::::R  E:::::E                    V:::::V:::::V       
        P::::P              R::::R     R:::::R  E:::::E       EEEEEE        V:::::::::V        
      PP::::::PP          RR:::::R     R:::::REE::::::EEEEEEEE:::::E         V:::::::V         
      P::::::::P          R::::::R     R:::::RE::::::::::::::::::::E          V:::::V          
      P::::::::P          R::::::R     R:::::RE::::::::::::::::::::E           V:::V           
      PPPPPPPPPP          RRRRRRRR     RRRRRRREEEEEEEEEEEEEEEEEEEEEE            VVV           
      
      */

      $('#icon-preview-x').mouseup(function (e) {
        _this.sprite.toggle_double_x();
        $('#icon-preview-x').toggleClass('icon-preview-x2-hi');
        _this.update();
      });

      $('#icon-preview-y').mouseup(function (e) {
        _this.sprite.toggle_double_y();
        $('#icon-preview-y').toggleClass('icon-preview-y2-hi');
        _this.update();
      });

      $('#icon-preview-overlay').mouseup(function (e) {
        _this.sprite.toggle_overlay();
        _this.update();
      });

      $('#icon-preview-zoom-in').mouseup(function (e) {
        _this.preview.zoom_in();
        _this.update();
      });

      $('#icon-preview-zoom-out').mouseup(function (e) {
        _this.preview.zoom_out();
        _this.update();
      });
    }
  }]);

  return App;
}();

/*

HHHHHHHHH     HHHHHHHHHEEEEEEEEEEEEEEEEEEEEEELLLLLLLLLLL             PPPPPPPPPPPPPPPPP   EEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRR   
H:::::::H     H:::::::HE::::::::::::::::::::EL:::::::::L             P::::::::::::::::P  E::::::::::::::::::::ER::::::::::::::::R  
H:::::::H     H:::::::HE::::::::::::::::::::EL:::::::::L             P::::::PPPPPP:::::P E::::::::::::::::::::ER::::::RRRRRR:::::R 
HH::::::H     H::::::HHEE::::::EEEEEEEEE::::ELL:::::::LL             PP:::::P     P:::::PEE::::::EEEEEEEEE::::ERR:::::R     R:::::R
  H:::::H     H:::::H    E:::::E       EEEEEE  L:::::L                 P::::P     P:::::P  E:::::E       EEEEEE  R::::R     R:::::R
  H:::::H     H:::::H    E:::::E               L:::::L                 P::::P     P:::::P  E:::::E               R::::R     R:::::R
  H::::::HHHHH::::::H    E::::::EEEEEEEEEE     L:::::L                 P::::PPPPPP:::::P   E::::::EEEEEEEEEE     R::::RRRRRR:::::R 
  H:::::::::::::::::H    E:::::::::::::::E     L:::::L                 P:::::::::::::PP    E:::::::::::::::E     R:::::::::::::RR  
  H:::::::::::::::::H    E:::::::::::::::E     L:::::L                 P::::PPPPPPPPP      E:::::::::::::::E     R::::RRRRRR:::::R 
  H::::::HHHHH::::::H    E::::::EEEEEEEEEE     L:::::L                 P::::P              E::::::EEEEEEEEEE     R::::R     R:::::R
  H:::::H     H:::::H    E:::::E               L:::::L                 P::::P              E:::::E               R::::R     R:::::R
  H:::::H     H:::::H    E:::::E       EEEEEE  L:::::L         LLLLLL  P::::P              E:::::E       EEEEEE  R::::R     R:::::R
HH::::::H     H::::::HHEE::::::EEEEEEEE:::::ELL:::::::LLLLLLLLL:::::LPP::::::PP          EE::::::EEEEEEEE:::::ERR:::::R     R:::::R
H:::::::H     H:::::::HE::::::::::::::::::::EL::::::::::::::::::::::LP::::::::P          E::::::::::::::::::::ER::::::R     R:::::R
H:::::::H     H:::::::HE::::::::::::::::::::EL::::::::::::::::::::::LP::::::::P          E::::::::::::::::::::ER::::::R     R:::::R
HHHHHHHHH     HHHHHHHHHEEEEEEEEEEEEEEEEEEEEEELLLLLLLLLLLLLLLLLLLLLLLLPPPPPPPPPP          EEEEEEEEEEEEEEEEEEEEEERRRRRRRR     RRRRRRR

*/

function status(text) {
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "normal";

  if (state == "normal") {} else {}

  $("#statustext").stop(true, true);
  $("#statustext").text(text).fadeIn(100).delay(2000).fadeOut(1000);
}