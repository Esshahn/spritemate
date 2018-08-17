// ASCII text: http://patorjk.com/software/taag/#p=display&h=2&f=Doh&t=TOOLS



/*

  To switch to photoshop style layers:
  - load "List_layerstyle.js" instead of "List.js" in index.html
  - comment & uncomment 2 lines of code in update_ui in this file

*/

import $ from "jquery";
import jQuery from "jquery";
import '../css/jquery-ui.css';
import '../css/stylesheet.css';

import List from "./List";
import Info from "./Info";
import Help from "./Help";
import Menu from "./Menu";
import Load from "./Load";
import Save from "./Save";
import Settings from "./Settings";
import Editor from "./Editor";
import Palette from "./Palette";
import Preview from "./Preview";
import Sprite from "./Sprite";
import Storage from "./Storage";
import Window from "./Window";
import { get_config } from "./config.js";
import { tipoftheday, status, toggle_fullscreen } from './helper'
import { menubar } from './menubar'


class App
{

  constructor(config)
  { 
  
    this.storage = new Storage(config);
    this.config = this.storage.get_config();
    this.config.colors = this.config.palettes[this.config.selected_palette];

    this.sprite = new Sprite(this.config);

    // editor
    let window_config = {name:"window_editor", title: "Editor", type: "sprite", resizable: false, left: this.config.window_editor.left, top: this.config.window_editor.top, width: "auto", height: "auto" };
    this.window_editor = new Window(window_config, this.store_window.bind(this));
    this.editor = new Editor(0,this.config);

    // palette
    window_config = {name:"window_palette", title: "Colors", type: "colors", resizable: false, left: this.config.window_palette.left, top: this.config.window_palette.top, width: "auto", height: "auto" };
    this.window_palette = new Window(window_config, this.store_window.bind(this));
    this.palette = new Palette(1,this.config);

    // preview
    window_config = {name:"window_preview", title: "Preview", type: "preview", resizable: false, left: this.config.window_preview.left, top: this.config.window_preview.top, width: "auto", height: "auto" };
    this.window_preview = new Window(window_config, this.store_window.bind(this));
    this.preview = new Preview(2,this.config);

    // sprite list
    window_config = {name:"window_list", title: "Sprite List", type: "list", resizable: true, left: this.config.window_list.left, top: this.config.window_list.top, width: this.config.window_list.width, height: this.config.window_list.height };
    this.window_list = new Window(window_config, this.store_window.bind(this));
    this.list = new List(3,this.config);

    // info
    window_config = {name:"window_info", title: "Spritemate", type: "info", escape: true, modal: true, resizable: false, autoOpen: false, width: 680, height: "auto" };
    this.window_info = new Window(window_config);
    this.info = new Info(4,this.config, { onLoad: this.regain_keyboard_controls.bind(this) });

    // save
    window_config = {name:"window_save", title: "Save", type: "file", escape: true, modal: true, resizable: false, autoOpen: false, width: 580, height: "auto" };
    this.window_save = new Window(window_config);
    this.save = new Save(5,this.config, { onLoad: this.regain_keyboard_controls.bind(this) });

    // settings
    window_config = {name:"window_settings,", title: "Settings", type: "settings", modal: true, escape: true, resizable: false, autoOpen: false, width: 760, height: "auto" };
    this.window_settings = new Window(window_config);
    this.settings = new Settings(7,this.config, { onLoad: this.update_config.bind(this) });

    // help
    window_config = {name:"window_help", title: "Help", type: "info", escape: true, modal: true, resizable: false, autoOpen: false, width: 680, height: "auto" };
    this.window_help = new Window(window_config);
    this.help = new Help(8,this.config, { onLoad: this.regain_keyboard_controls.bind(this) });

    // menu
    window_config = {name:"window_menu", title: "Tools", type: "menu", resizable: false, left: this.config.window_menu.left, top: this.config.window_menu.top, width: "auto", height: "auto" };
    this.window_menu = new Window(window_config, this.store_window.bind(this));
    this.menu = new Menu(9,this.config);
 
    this.load = new Load(this.config, { onLoad: this.update_loaded_file.bind(this) });

    this.is_drawing = false;
    this.oldpos = {x: 0, y: 0}; // used when drawing and moving the mouse in editor
    this.sprite.new_sprite(this.palette.get_color());

    this.mode = "draw"; // modes can be "draw" and "fill"
    this.allow_keyboard_shortcuts = true;

    $( document ).tooltip({show: {delay: 1000}}); // initializes tooltip handling in jquery
     
    tipoftheday();
    menubar();
    
    this.list.update_all(this.sprite.get_all());
    this.update();
    this.user_interaction();

    if (this.storage.is_updated_version()) $("#window-4").dialog( "open");

  }



  update()
  {
    let all = this.sprite.get_all();

    this.editor.update(   all);
    this.preview.update(  all);
    this.list.update(     all);
    this.palette.update(  all);
    this.update_ui();
  }

  update_ui()
  {

    if (this.sprite.get_number_of_sprites() > 1)
    {
      $('#icon-list-delete').fadeTo( "fast", 1 );
    } else {
      $('#icon-list-delete').fadeTo( "fast", 0.33 );
    }

    if (this.sprite.is_copy_empty())
    {
      $('#icon-list-paste').fadeTo( "fast", 0.33 );
    } else {
      $('#icon-list-paste').fadeTo( "fast", 1 );
    }

    if (this.sprite.can_undo())
    {
      $('#icon-undo').fadeTo( "fast", 1 );
    } else {
      $('#icon-undo').fadeTo( "fast", 0.33 );
    }

    if (this.sprite.can_redo())
    {
      $('#icon-redo').fadeTo( "fast", 1 );
    } else {
      $('#icon-redo').fadeTo( "fast", 0.33 );
    }

    if (this.sprite.is_overlay())
    {
      $('#icon-preview-overlay').attr("src","img/ui/icon-preview-overlay-hi.png");
    } else {
      $('#icon-preview-overlay').attr("src","img/ui/icon-preview-overlay.png");
    }

    if (this.preview.is_min_zoom())
    {
      $('#icon-preview-zoom-out').fadeTo("fast", 0.33);
    } else {
      $('#icon-preview-zoom-out').fadeTo("fast", 1);
    }

    if (this.preview.is_max_zoom())
    {
      $('#icon-preview-zoom-in').fadeTo("fast", 0.33);
    } else {
      $('#icon-preview-zoom-in').fadeTo("fast", 1);
    }

    if (this.editor.is_min_zoom())
    {
      $('#icon-editor-zoom-out').fadeTo("fast", 0.33);
    } else {
      $('#icon-editor-zoom-out').fadeTo("fast", 1);
    }

    if (this.editor.is_max_zoom())
    {
      $('#icon-editor-zoom-in').fadeTo("fast", 0.33);
    } else {
      $('#icon-editor-zoom-in').fadeTo("fast", 1);
    }

    if (this.list.is_min_zoom())
    {
      $('#icon-list-zoom-out').fadeTo("fast", 0.33);
    } else {
      $('#icon-list-zoom-out').fadeTo("fast", 1);
    }

    if (this.list.is_max_zoom())
    {
      $('#icon-list-zoom-in').fadeTo("fast", 0.33);
    } else {
      $('#icon-list-zoom-in').fadeTo("fast", 1);
    }

    // photoshop style layer
    //$('.sprite_layer').removeClass("sprite_layer_selected");
    //$('#spritelist').find('#'+this.sprite.get_current_sprite_number()).addClass("sprite_layer_selected");
    
   
    // spritepad style layer
    $('.sprite_in_list').removeClass("sprite_in_list_selected");
    $('#spritelist').find('#'+this.sprite.get_current_sprite_number()).addClass("sprite_in_list_selected");
  }

  store_window(obj)
  {
    // check which data is in the object, compare with config data of that window
    // and replace the data in the config if matching
    // then save to storage
    for (var key in obj.data)
    {
      if( this.config[obj.name].hasOwnProperty(key) ) this.config[obj.name][key] = obj.data[key];
    }
    this.storage.write(this.config);
  }

  update_config()
  {
    // this gets called after the settings modal has been closed
    this.palette.set_colors(this.config.colors);
    this.storage.write(this.config);
    this.list.update_all(this.sprite.get_all());
    this.update();
    this.regain_keyboard_controls();
    status("Configuration updated.");
  }

  update_loaded_file()
  {
    // called as a callback event from the load class
    // after a file got loaded in completely
    this.sprite.set_all(this.load.get_imported_file());
    this.list.update_all(this.sprite.get_all());
    this.update();
  }

  regain_keyboard_controls()
  {
    // this will be called whenever keyboard controls have been deactivated, e.g. for input fields
    // currently used as callback after the save dialog
    this.allow_keyboard_shortcuts = true;
  }


  init_ui_fade(element)
  {
    $('#' + element).mouseenter((e) => {$('#' + element).stop(true,true).animate({backgroundColor: 'rgba(90,90,90,0.5)'}, 'fast');});
    $('#' + element).mouseleave((e) => {$('#' + element).stop(true,true).animate({backgroundColor: 'transparent'}, 'fast');});
  }


  user_interaction()
  {

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
    this.init_ui_fade("icon-fill");
    this.init_ui_fade("icon-fullscreen");
    this.init_ui_fade("icon-info");
    this.init_ui_fade("icon-help");
    this.init_ui_fade("icon-settings");
    this.init_ui_fade("icon-list-new");
    this.init_ui_fade("icon-list-copy");
    this.init_ui_fade("icon-list-paste");
    this.init_ui_fade("icon-list-grid");
    this.init_ui_fade("icon-list-zoom-in");
    this.init_ui_fade("icon-list-zoom-out");
    this.init_ui_fade("icon-editor-zoom-in");
    this.init_ui_fade("icon-editor-zoom-out");
    this.init_ui_fade("icon-preview-zoom-in");
    this.init_ui_fade("icon-preview-zoom-out");
    this.init_ui_fade("icon-preview-overlay");
    this.init_ui_fade("icon-preview-x");
    this.init_ui_fade("icon-preview-y");
    

    // delete is a bit different
    $('#icon-list-delete').css({ opacity: 0.20 });
    $('#icon-list-delete').mouseenter((e) => { if (!this.sprite.only_one_sprite()) $('#icon-list-delete').animate({backgroundColor: 'rgba(0,0,0,0.5)'}, 'fast');});
    $('#icon-list-delete').mouseleave((e) => { if (!this.sprite.only_one_sprite()) $('#icon-list-delete').animate({backgroundColor: 'transparent'}, 'fast');});

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


    $(document).keydown((e) =>
    {
      //console.log(e.key);
      if ( this.allow_keyboard_shortcuts )
      {
        if (e.key == "a")
        {
          console.time('performance');
          for(let i=0; i<=1000;i++) this.update();
          console.timeEnd('performance');
        
        }

        if (e.key == "ArrowRight")
        {
          this.sprite.set_current_sprite("right");
          this.update();
        }
        if (e.key == "ArrowLeft")
        {
          this.sprite.set_current_sprite("left");
          this.update();
        }

        if (e.key == "f")
        {
          toggle_fullscreen();
        }

        /*
        if (e.key == "q")
        {
          this.sprite.set_all(example_sprite);
          // example sprite is defined in the config.js
          this.list.update_all(this.sprite.get_all());
          this.update();
        }
        */

        if (e.key == "d")
        {
          // toggle between draw and fill modes
          if (this.mode == "draw")
          {
            this.mode = "fill";
            status("Fill mode");
            $("#image-icon-draw").attr("src","img/ui/icon-draw.png");
            $("#image-icon-select").attr("src","img/ui/icon-select.png");
            $("#image-icon-fill").attr("src","img/ui/icon-fill-hi.png");
          } else {
            this.mode = "draw";
            status("Draw mode");
            $("#image-icon-draw").attr("src","img/ui/icon-draw-hi.png");
            $("#image-icon-select").attr("src","img/ui/icon-select.png");
            $("#image-icon-fill").attr("src","img/ui/icon-fill.png");
          }
        }

        if (e.key == "1")
        {     
          this.sprite.set_pen(0);
          this.update();
        }

        if (e.key == "2")
        {     
          this.sprite.set_pen(1);
          this.update();
        }

        if (e.key == "3" && this.sprite.is_multicolor())
        {  
          this.sprite.set_pen(2);
          this.update();
        }

        if (e.key == "4" && this.sprite.is_multicolor())
        {    
          this.sprite.set_pen(3);
          this.update();
        }

        if (e.key == "z")
        {    
          this.sprite.undo();
          this.update();
        }

        if (e.key == "Z")
        {    
          this.sprite.redo();
          this.update();
        }

        if (e.key == "m")
        { 
          this.sprite.toggle_multicolor();
          this.update();
        }

      }
    });





/*

MMMMMMMM               MMMMMMMMEEEEEEEEEEEEEEEEEEEEEENNNNNNNN        NNNNNNNNUUUUUUUU     UUUUUUUUBBBBBBBBBBBBBBBBB               AAA               RRRRRRRRRRRRRRRRR   
M:::::::M             M:::::::ME::::::::::::::::::::EN:::::::N       N::::::NU::::::U     U::::::UB::::::::::::::::B             A:::A              R::::::::::::::::R  
M::::::::M           M::::::::ME::::::::::::::::::::EN::::::::N      N::::::NU::::::U     U::::::UB::::::BBBBBB:::::B           A:::::A             R::::::RRRRRR:::::R 
M:::::::::M         M:::::::::MEE::::::EEEEEEEEE::::EN:::::::::N     N::::::NUU:::::U     U:::::UUBB:::::B     B:::::B         A:::::::A            RR:::::R     R:::::R
M::::::::::M       M::::::::::M  E:::::E       EEEEEEN::::::::::N    N::::::N U:::::U     U:::::U   B::::B     B:::::B        A:::::::::A             R::::R     R:::::R
M:::::::::::M     M:::::::::::M  E:::::E             N:::::::::::N   N::::::N U:::::D     D:::::U   B::::B     B:::::B       A:::::A:::::A            R::::R     R:::::R
M:::::::M::::M   M::::M:::::::M  E::::::EEEEEEEEEE   N:::::::N::::N  N::::::N U:::::D     D:::::U   B::::BBBBBB:::::B       A:::::A A:::::A           R::::RRRRRR:::::R 
M::::::M M::::M M::::M M::::::M  E:::::::::::::::E   N::::::N N::::N N::::::N U:::::D     D:::::U   B:::::::::::::BB       A:::::A   A:::::A          R:::::::::::::RR  
M::::::M  M::::M::::M  M::::::M  E:::::::::::::::E   N::::::N  N::::N:::::::N U:::::D     D:::::U   B::::BBBBBB:::::B     A:::::A     A:::::A         R::::RRRRRR:::::R 
M::::::M   M:::::::M   M::::::M  E::::::EEEEEEEEEE   N::::::N   N:::::::::::N U:::::D     D:::::U   B::::B     B:::::B   A:::::AAAAAAAAA:::::A        R::::R     R:::::R
M::::::M    M:::::M    M::::::M  E:::::E             N::::::N    N::::::::::N U:::::D     D:::::U   B::::B     B:::::B  A:::::::::::::::::::::A       R::::R     R:::::R
M::::::M     MMMMM     M::::::M  E:::::E       EEEEEEN::::::N     N:::::::::N U::::::U   U::::::U   B::::B     B:::::B A:::::AAAAAAAAAAAAA:::::A      R::::R     R:::::R
M::::::M               M::::::MEE::::::EEEEEEEE:::::EN::::::N      N::::::::N U:::::::UUU:::::::U BB:::::BBBBBB::::::BA:::::A             A:::::A   RR:::::R     R:::::R
M::::::M               M::::::ME::::::::::::::::::::EN::::::N       N:::::::N  UU:::::::::::::UU  B:::::::::::::::::BA:::::A               A:::::A  R::::::R     R:::::R
M::::::M               M::::::ME::::::::::::::::::::EN::::::N        N::::::N    UU:::::::::UU    B::::::::::::::::BA:::::A                 A:::::A R::::::R     R:::::R
MMMMMMMM               MMMMMMMMEEEEEEEEEEEEEEEEEEEEEENNNNNNNN         NNNNNNN      UUUUUUUUU      BBBBBBBBBBBBBBBBBAAAAAAA                   AAAAAAARRRRRRRR     RRRRRRR


 */

/*

  SPRITEMATE

*/

    $('#menubar-info').mouseup((e) =>
    {
      this.allow_keyboard_shortcuts = false;
      $("#window-4").dialog( "open");
    });

    $('#menubar-settings').mouseup((e) =>
    {
      this.allow_keyboard_shortcuts = false;
      $("#window-7").dialog( "open");
    });

/*

  FILE

*/

    $('#menubar-load,#icon-load').mouseup((e) =>
    {
      $("#input-load").trigger("click");
    });

    $('#menubar-save,#icon-save').mouseup((e) =>
    {
      this.allow_keyboard_shortcuts = false;
      $("#window-5").dialog( "open");
      this.save.set_save_data(this.sprite.get_all());
    });

    $('#menubar-new').mouseup((e) =>
    {
      confirm("Are you sure?");
      this.sprite = new Sprite(this.config);
      this.sprite.new_sprite(this.palette.get_color());
      this.list.update_all(this.sprite.get_all());
      this.update();
    });

/*

  EDIT

*/

    $('#menubar-undo,#icon-undo').mouseup((e) =>
    {
      this.sprite.undo();
      this.list.update_all(this.sprite.get_all());
      this.update();
    });

    $('#menubar-redo,#icon-redo').mouseup((e) =>
    {
      this.sprite.redo();
      this.list.update_all(this.sprite.get_all());
      this.update();
    });

    $('#menubar-new-sprite,#icon-list-new').mouseup((e) =>
    {      
      this.sprite.new_sprite(this.palette.get_color(), this.sprite.is_multicolor());
      this.list.update_all(this.sprite.get_all());
      this.update();
    });

   $('#menubar-kill,#icon-list-delete').mouseup((e) =>
    {     
      this.sprite.delete();
      this.list.update_all(this.sprite.get_all());
      this.update(); 
    });

   $('#menubar-copy,#icon-list-copy').mouseup((e) =>
    {  
      this.sprite.copy();
      this.update_ui();
      status("Sprite copied.");
    });

   $('#menubar-paste,#icon-list-paste').mouseup((e) =>
    {   
      if (!this.sprite.is_copy_empty())
      {
        this.sprite.paste(); 
        this.update();
        status("Sprite pasted.");
      } else {
        status("Nothing to copy.","error");
      }
    });

/*

  SPRITE

*/

    $('#menubar-shift-left,#icon-shift-left').mouseup((e) =>
    {
      this.sprite.shift_horizontal("left");
      this.update();
    });

    $('#menubar-shift-right,#icon-shift-right').mouseup((e) =>
    {
      this.sprite.shift_horizontal("right");
      this.update();
    });

    $('#menubar-shift-up,#icon-shift-up').mouseup((e) =>
    {
      this.sprite.shift_vertical("up");
      this.update();
    });

    $('#menubar-shift-down,#icon-shift-down').mouseup((e) =>
    {
      this.sprite.shift_vertical("down");
      this.update();
    });

    $('#menubar-flip-horizontal,#icon-flip-horizontal').mouseup((e) =>
    {
      this.sprite.flip_horizontal();
      this.update();
    });

    $('#menubar-flip-vertical,#icon-flip-vertical').mouseup((e) =>
    {
      this.sprite.flip_vertical();
      this.update();
    });

    $('#menubar-colormode,#icon-multicolor').mouseup((e) =>
    {
      this.sprite.toggle_multicolor();
      this.update();
    });

   $('#menubar-stretch-x,#icon-preview-x').mouseup((e) =>
    {     
      this.sprite.toggle_double_x();
      $('#icon-preview-x').toggleClass('icon-preview-x2-hi');
      this.update();
    });

   $('#menubar-stretch-y,#icon-preview-y').mouseup((e) =>
    {     
      this.sprite.toggle_double_y();
      $('#icon-preview-y').toggleClass('icon-preview-y2-hi');
      this.update();
    });

    $('#menubar-overlay,#icon-preview-overlay').mousedown((e) =>
    {     
      this.sprite.toggle_overlay();
      this.update();
    });

/*

  VIEW

*/

    $('#menubar-fullscreen').mouseup((e) =>
    {
      toggle_fullscreen();
    });

    $('#menubar-editor-zoom-in,#icon-editor-zoom-in').mouseup((e) =>
    {     
      this.editor.zoom_in();
      this.config.window_editor.zoom = this.editor.get_zoom();
      this.storage.write(this.config);
      this.update();
    });

    $('#menubar-editor-zoom-out,#icon-editor-zoom-out').mouseup((e) =>
    {     
      this.editor.zoom_out();
      this.config.window_editor.zoom = this.editor.get_zoom();
      this.storage.write(this.config);
      this.update();
    });

    $('#menubar-editor-grid,#icon-editor-grid').mouseup((e) =>
    {
      this.editor.toggle_grid();
      this.config.window_editor.grid = this.editor.get_grid();
      this.storage.write(this.config);
      this.update();
    });

    $('#menubar-preview-zoom-in,#icon-preview-zoom-in').mouseup((e) =>
    {     
      this.preview.zoom_in();
      this.config.window_preview.zoom = this.preview.get_zoom();
      this.storage.write(this.config);
      this.update();
    });

    $('#menubar-preview-zoom-out,#icon-preview-zoom-out').mouseup((e) =>
    {     
      this.preview.zoom_out();
      this.config.window_preview.zoom = this.preview.get_zoom();
      this.storage.write(this.config);
      this.update();
    });

    $('#menubar-list-grid,#icon-list-grid').mouseup((e) =>
    {     
      this.list.toggle_grid();
      this.list.update_all(this.sprite.get_all());
      this.update();
    });

    $('#menubar-list-zoom-in,#icon-list-zoom-in').mouseup((e) =>
    {     
      this.list.zoom_in();
      this.config.window_list.zoom = this.list.get_zoom();
      this.storage.write(this.config);
      this.list.update_all(this.sprite.get_all());
      this.update();
    });

    $('#menubar-list-zoom-out,#icon-list-zoom-out').mouseup((e) =>
    {     
      this.list.zoom_out();
      this.config.window_list.zoom = this.list.get_zoom();
      this.storage.write(this.config);
      this.list.update_all(this.sprite.get_all());
      this.update();
    });

/* 

  HELP

*/


    $('#menubar-help').mouseup((e) =>
    {
      this.allow_keyboard_shortcuts = false;
      $("#window-8").dialog( "open");
    });



/*

TTTTTTTTTTTTTTTTTTTTTTT      OOOOOOOOO         OOOOOOOOO      LLLLLLLLLLL                 SSSSSSSSSSSSSSS 
T:::::::::::::::::::::T    OO:::::::::OO     OO:::::::::OO    L:::::::::L               SS:::::::::::::::S
T:::::::::::::::::::::T  OO:::::::::::::OO OO:::::::::::::OO  L:::::::::L              S:::::SSSSSS::::::S
T:::::TT:::::::TT:::::T O:::::::OOO:::::::O:::::::OOO:::::::O LL:::::::LL              S:::::S     SSSSSSS
TTTTTT  T:::::T  TTTTTT O::::::O   O::::::O::::::O   O::::::O   L:::::L                S:::::S            
        T:::::T         O:::::O     O:::::O:::::O     O:::::O   L:::::L                S:::::S            
        T:::::T         O:::::O     O:::::O:::::O     O:::::O   L:::::L                 S::::SSSS         
        T:::::T         O:::::O     O:::::O:::::O     O:::::O   L:::::L                  SS::::::SSSSS    
        T:::::T         O:::::O     O:::::O:::::O     O:::::O   L:::::L                    SSS::::::::SS  
        T:::::T         O:::::O     O:::::O:::::O     O:::::O   L:::::L                       SSSSSS::::S 
        T:::::T         O:::::O     O:::::O:::::O     O:::::O   L:::::L                            S:::::S
        T:::::T         O::::::O   O::::::O::::::O   O::::::O   L:::::L         LLLLLL             S:::::S
      TT:::::::TT       O:::::::OOO:::::::O:::::::OOO:::::::O LL:::::::LLLLLLLLL:::::L SSSSSSS     S:::::S
      T:::::::::T        OO:::::::::::::OO OO:::::::::::::OO  L::::::::::::::::::::::L S::::::SSSSSS:::::S
      T:::::::::T          OO:::::::::OO     OO:::::::::OO    L::::::::::::::::::::::L S:::::::::::::::SS 
      TTTTTTTTTTT            OOOOOOOOO         OOOOOOOOO      LLLLLLLLLLLLLLLLLLLLLLLL  SSSSSSSSSSSSSSS  



*/


    $('#icon-draw').mouseup((e) =>
    {
      this.mode = "draw";
      status("Draw mode");
      $("#image-icon-draw").attr("src","img/ui/icon-draw-hi.png");
      $("#image-icon-select").attr("src","img/ui/icon-select.png");
      $("#image-icon-fill").attr("src","img/ui/icon-fill.png");
    });

 
    $('#icon-fill').mouseup((e) =>
    {
      this.mode = "fill";
      status("Fill mode");
      $("#image-icon-draw").attr("src","img/ui/icon-draw.png");
      $("#image-icon-select").attr("src","img/ui/icon-select.png");
      $("#image-icon-fill").attr("src","img/ui/icon-fill-hi.png");
    });

    /*
    $('#icon-fullscreen').mouseup((e) =>
    {
      toggle_fullscreen();
    });

    $('#icon-settings').mouseup((e) =>
    {
      $("#window-7").dialog( "open");
      this.allow_keyboard_shortcuts = false;
    });

    $('#icon-info').mouseup((e) =>
    {
      this.allow_keyboard_shortcuts = false;
      $("#window-4").dialog( "open");
    });

    $('#icon-help').mouseup((e) =>
    {
      this.allow_keyboard_shortcuts = false;
      $("#window-8").dialog( "open");
    });
    */




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

    $('#palette_all_colors').mouseup((e) =>
    {
      this.palette.set_active_color(e);
      this.sprite.set_pen_color(this.palette.get_color());
      this.list.update_all(this.sprite.get_all());
      this.update(); 
    });

    $('#palette_1').mouseup((e) =>
    {     
      this.sprite.set_pen(1);
      this.update();
    });

    $('#palette_0').mouseup((e) =>
    {     
      this.sprite.set_pen(0);
      this.update();
    });

    $('#palette_2').mouseup((e) =>
    {  
      this.sprite.set_pen(2);
      this.update();
    });

    $('#palette_3').mouseup((e) =>
    {    
      this.sprite.set_pen(3);
      this.update();
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

    // prevent scrolling of canvas on mobile
    $('#editor').on('touchmove', function(e)
    {
      e.preventDefault();
    });

    $('#editor').mousedown((e) => {

      if (this.mode == "draw")
      {
        this.sprite.set_pixel(this.editor.get_pixel(e),e.shiftKey); // updates the sprite array at the grid position with the color chosen on the palette
        this.is_drawing = true; // needed for mousemove drawing
      }

      if (this.mode == "fill")
      {
        this.sprite.floodfill(this.editor.get_pixel(e));
      }
      this.update();
    });

    $('#editor').mousemove((e) => {
      
      if (this.is_drawing && this.mode=="draw")
      {
        let newpos = this.editor.get_pixel(e);
        // only draw if the mouse has entered a new pixel area (just for performance)
        if ( (newpos.x != this.oldpos.x) || (newpos.y != this.oldpos.y) )
        {
          let all = this.sprite.get_all();
          this.sprite.set_pixel(newpos,e.shiftKey); // updates the sprite array at the grid position with the color chosen on the palette
          this.editor.update(all); 
          this.preview.update(all);
          this.list.update(all); // only updates the sprite drawn onto
          this.oldpos = newpos;
        }
      }  
      
    });

    $('#editor').mouseup((e) =>
    {
      // stop drawing pixels
      this.is_drawing = false;
      this.sprite.save_backup();
      this.update();
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

    $('#spritelist').mouseup((e) =>
    {
      if (!this.dragging)
      {
        this.sprite.set_current_sprite(this.list.get_clicked_sprite());
        if (!this.sprite.is_multicolor() &&  this.sprite.is_pen_multicolor())
        {
          this.sprite.set_pen(1);
        }
        this.update();
      } 
    });

    $( "#spritelist" ).sortable({stop: ( e, ui ) => 
      {
        this.sprite.sort_spritelist($( "#spritelist" ).sortable( "toArray" ));
        this.dragging = false;
        this.list.update_all(this.sprite.get_all());
        this.update();
      }
    });

    $( "#spritelist" ).sortable({start: ( e, ui ) => 
      {
        this.dragging = true;
      }
    });


  }

}


$(function() {
  new App(get_config());
});

