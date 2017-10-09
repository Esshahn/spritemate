// ASCII text: http://patorjk.com/software/taag/#p=display&h=2&f=Doh&t=KEYS

class App
{
  
  constructor(config)
  { 
  
    this.config = config;
    
    this.sprite = new Sprite(this.config);

    // init the base windows
    let window_config = { title: "Edit Sprite", type: "sprite", resizable: false, left: 210, top: 100, width: "auto", height: "auto" };
    this.window_editor = new Window(window_config);
    this.editor = new Editor(0,this.config);

    // create the color palette for the color window
    window_config = { title: "Palette", type: "colors", resizable: false, left: 110, top: 100, width: "auto", height: "auto" };
    this.window_colors = new Window(window_config);
    this.palette = new Palette(1,this.config);

    window_config = { title: "Preview", type: "preview", resizable: false, left: 680, top: 100, width: "auto", height: "auto" };
    this.window_preview = new Window(window_config);
    this.preview = new Preview(2,this.config);

    window_config = { title: "Sprite List", type: "list", resizable: true, left: 880, top: 320, width: 440, height: 200 };
    this.window_preview = new Window(window_config);
    this.list = new List(3,this.config);

    window_config = { title: "Spritemate", type: "info", resizable: false, autoOpen: false, width: "auto", height: "auto" };
    this.window_info = new Window(window_config);
    this.info = new Info(4,this.config);

    window_config = { title: "Save", type: "file", resizable: false, autoOpen: false, width: 580, height: "auto" };
    this.window_info = new Window(window_config);
    this.save = new Save(5,this.config);

    this.load = new Load(this.config, { onLoad: this.update_loaded_file.bind(this) });

    this.is_drawing = false;

    this.sprite.new(this.palette.get_color());

    this.mode = "draw";
    status("Welcome to spritemate!");
    this.update_ui();
    this.user_interaction();

  }


  toggle_fullscreen() 
  {
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


  update_ui()
  {
    this.editor.update(   this.sprite.get_all());
    this.preview.update(  this.sprite.get_all());
    this.list.update(     this.sprite.get_all());
    this.palette.update(  this.sprite.get_all());
    //console.log("ui refresh: " + Date());
  }


  update_loaded_file()
  {
    // called as a callback event from the load class
    // after a file got loaded in completely
    this.sprite.set_all(this.load.get_imported_file());
    this.update_ui();
  }


  init_ui_fade(element)
  {
    $('#' + element).mouseenter((e) => {$('#' + element).animate({backgroundColor: 'rgba(0,0,0,0.5)'}, 'fast');});
    $('#' + element).mouseleave((e) => {$('#' + element).animate({backgroundColor: 'transparent'}, 'fast');});
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
    this.init_ui_fade("icon-select");
    this.init_ui_fade("icon-fill");
    this.init_ui_fade("icon-fullscreen");
    this.init_ui_fade("icon-info");
    
    // init hover effect for list and preview
    this.init_ui_fade("icon-list-new");
    this.init_ui_fade("icon-list-grid");
    this.init_ui_fade("icon-editor-zoom-in");
    this.init_ui_fade("icon-editor-zoom-out");
    this.init_ui_fade("icon-list-zoom-in");
    this.init_ui_fade("icon-list-zoom-out");
    this.init_ui_fade("icon-preview-zoom-in");
    this.init_ui_fade("icon-preview-zoom-out");
    this.init_ui_fade("icon-preview-x");
    this.init_ui_fade("icon-preview-y");
    

    // delete is a bit different
    $('#icon-list-delete').css({ opacity: 0.20 });
    $('#icon-list-delete').mouseenter((e) => { if (!this.sprite.only_one_sprite()) $('#icon-list-delete').animate({backgroundColor: 'rgba(0,0,0,0.5)'}, 'fast');});
    $('#icon-list-delete').mouseleave((e) => { if (!this.sprite.only_one_sprite()) $('#icon-list-delete').animate({backgroundColor: 'transparent'}, 'fast');});

    
    $('#icon-select').css({ opacity: 0.20 });
    $('#icon-fill').css({ opacity: 0.20 });


/*

KKKKKKKKK    KKKKKKKEEEEEEEEEEEEEEEEEEEEEEYYYYYYY       YYYYYYY   SSSSSSSSSSSSSSS 
K:::::::K    K:::::KE::::::::::::::::::::EY:::::Y       Y:::::Y SS:::::::::::::::S
K:::::::K    K:::::KE::::::::::::::::::::EY:::::Y       Y:::::YS:::::SSSSSS::::::S
K:::::::K   K::::::KEE::::::EEEEEEEEE::::EY::::::Y     Y::::::YS:::::S     SSSSSSS
KK::::::K  K:::::KKK  E:::::E       EEEEEEYYY:::::Y   Y:::::YYYS:::::S            
  K:::::K K:::::K     E:::::E                Y:::::Y Y:::::Y   S:::::S            
  K::::::K:::::K      E::::::EEEEEEEEEE       Y:::::Y:::::Y     S::::SSSS         
  K:::::::::::K       E:::::::::::::::E        Y:::::::::Y       SS::::::SSSSS    
  K:::::::::::K       E:::::::::::::::E         Y:::::::Y          SSS::::::::SS  
  K::::::K:::::K      E::::::EEEEEEEEEE          Y:::::Y              SSSSSS::::S 
  K:::::K K:::::K     E:::::E                    Y:::::Y                   S:::::S
KK::::::K  K:::::KKK  E:::::E       EEEEEE       Y:::::Y                   S:::::S
K:::::::K   K::::::KEE::::::EEEEEEEE:::::E       Y:::::Y       SSSSSSS     S:::::S
K:::::::K    K:::::KE::::::::::::::::::::E    YYYY:::::YYYY    S::::::SSSSSS:::::S
K:::::::K    K:::::KE::::::::::::::::::::E    Y:::::::::::Y    S:::::::::::::::SS 
KKKKKKKKK    KKKKKKKEEEEEEEEEEEEEEEEEEEEEE    YYYYYYYYYYYYY     SSSSSSSSSSSSSSS  

*/

/*
    $(document).keydown((e) =>
    {
 
      if (e.key == "a")
      {
        console.log(this.sprite.get_all());
        this.toggleFullScreen();
        this.update_ui();
      }

      if (e.key == "A")
      {
        // toggle hires or multicolor
        this.sprite.toggle_double_y();
        this.update_ui();
      }

      if (e.key == "f")
      {
        // toggle fullscreen
        this.toggle_fullscreen();
      }

    });
*/

/*

MMMMMMMM               MMMMMMMMEEEEEEEEEEEEEEEEEEEEEENNNNNNNN        NNNNNNNNUUUUUUUU     UUUUUUUU
M:::::::M             M:::::::ME::::::::::::::::::::EN:::::::N       N::::::NU::::::U     U::::::U
M::::::::M           M::::::::ME::::::::::::::::::::EN::::::::N      N::::::NU::::::U     U::::::U
M:::::::::M         M:::::::::MEE::::::EEEEEEEEE::::EN:::::::::N     N::::::NUU:::::U     U:::::UU
M::::::::::M       M::::::::::M  E:::::E       EEEEEEN::::::::::N    N::::::N U:::::U     U:::::U 
M:::::::::::M     M:::::::::::M  E:::::E             N:::::::::::N   N::::::N U:::::D     D:::::U 
M:::::::M::::M   M::::M:::::::M  E::::::EEEEEEEEEE   N:::::::N::::N  N::::::N U:::::D     D:::::U 
M::::::M M::::M M::::M M::::::M  E:::::::::::::::E   N::::::N N::::N N::::::N U:::::D     D:::::U 
M::::::M  M::::M::::M  M::::::M  E:::::::::::::::E   N::::::N  N::::N:::::::N U:::::D     D:::::U 
M::::::M   M:::::::M   M::::::M  E::::::EEEEEEEEEE   N::::::N   N:::::::::::N U:::::D     D:::::U 
M::::::M    M:::::M    M::::::M  E:::::E             N::::::N    N::::::::::N U:::::D     D:::::U 
M::::::M     MMMMM     M::::::M  E:::::E       EEEEEEN::::::N     N:::::::::N U::::::U   U::::::U 
M::::::M               M::::::MEE::::::EEEEEEEE:::::EN::::::N      N::::::::N U:::::::UUU:::::::U 
M::::::M               M::::::ME::::::::::::::::::::EN::::::N       N:::::::N  UU:::::::::::::UU  
M::::::M               M::::::ME::::::::::::::::::::EN::::::N        N::::::N    UU:::::::::UU    
MMMMMMMM               MMMMMMMMEEEEEEEEEEEEEEEEEEEEEENNNNNNNN         NNNNNNN      UUUUUUUUU  



*/

    $('#icon-load').mouseup((e) =>
    {
      $("#input-load").trigger("click");
    });

    $('#icon-save').mouseup((e) =>
    {
      $("#window-5").dialog( "open");
      this.save.set_save_data(this.sprite.get_all());
    });


    $('#icon-undo').mouseup((e) =>
    {
      this.sprite.undo();
      this.update_ui();
    });

    $('#icon-redo').mouseup((e) =>
    {
      this.sprite.redo();
      this.update_ui();
    });

    $('#icon-draw').mouseup((e) =>
    {
      this.mode = "draw";
      status("Draw mode");
    });

    $('#icon-select').mouseup((e) =>
    {
      this.mode = "select";
      status("Select mode");
    });
  
    $('#icon-fill').mouseup((e) =>
    {
      this.mode = "draw";
      status("Fill mode");
      this.sprite.fill();
      this.update_ui();
    });

    $('#icon-fullscreen').mouseup((e) =>
    {
      this.toggle_fullscreen();
    });

    $('#icon-info').mouseup((e) =>
    {
      $("#window-4").dialog( "open");
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

    $('#palette').mouseup((e) =>
    {
      this.palette.set_active_color(e);
      this.sprite.set_pen_color(this.palette.get_color());
      this.update_ui(); 
    });

    $('#palette_i').mouseup((e) =>
    {     
      this.sprite.set_pen("i");
      this.update_ui();
    });

    $('#palette_t').mouseup((e) =>
    {     
      this.sprite.set_pen("t");
      this.update_ui();
    });

    $('#palette_m1').mouseup((e) =>
    {  
        this.sprite.set_pen("m1");
        this.update_ui();
    });

    $('#palette_m2').mouseup((e) =>
    {    
        this.sprite.set_pen("m2");
        this.update_ui();
    });
        

/* 

EEEEEEEEEEEEEEEEEEEEEEDDDDDDDDDDDDD      IIIIIIIIIITTTTTTTTTTTTTTTTTTTTTTT     OOOOOOOOO     RRRRRRRRRRRRRRRRR   
E::::::::::::::::::::ED::::::::::::DDD   I::::::::IT:::::::::::::::::::::T   OO:::::::::OO   R::::::::::::::::R  
E::::::::::::::::::::ED:::::::::::::::DD I::::::::IT:::::::::::::::::::::T OO:::::::::::::OO R::::::RRRRRR:::::R 
EE::::::EEEEEEEEE::::EDDD:::::DDDDD:::::DII::::::IIT:::::TT:::::::TT:::::TO:::::::OOO:::::::ORR:::::R     R:::::R
  E:::::E       EEEEEE  D:::::D    D:::::D I::::I  TTTTTT  T:::::T  TTTTTTO::::::O   O::::::O  R::::R     R:::::R
  E:::::E               D:::::D     D:::::DI::::I          T:::::T        O:::::O     O:::::O  R::::R     R:::::R
  E::::::EEEEEEEEEE     D:::::D     D:::::DI::::I          T:::::T        O:::::O     O:::::O  R::::RRRRRR:::::R 
  E:::::::::::::::E     D:::::D     D:::::DI::::I          T:::::T        O:::::O     O:::::O  R:::::::::::::RR  
  E:::::::::::::::E     D:::::D     D:::::DI::::I          T:::::T        O:::::O     O:::::O  R::::RRRRRR:::::R 
  E::::::EEEEEEEEEE     D:::::D     D:::::DI::::I          T:::::T        O:::::O     O:::::O  R::::R     R:::::R
  E:::::E               D:::::D     D:::::DI::::I          T:::::T        O:::::O     O:::::O  R::::R     R:::::R
  E:::::E       EEEEEE  D:::::D    D:::::D I::::I          T:::::T        O::::::O   O::::::O  R::::R     R:::::R
EE::::::EEEEEEEE:::::EDDD:::::DDDDD:::::DII::::::II      TT:::::::TT      O:::::::OOO:::::::ORR:::::R     R:::::R
E::::::::::::::::::::ED:::::::::::::::DD I::::::::I      T:::::::::T       OO:::::::::::::OO R::::::R     R:::::R
E::::::::::::::::::::ED::::::::::::DDD   I::::::::I      T:::::::::T         OO:::::::::OO   R::::::R     R:::::R
EEEEEEEEEEEEEEEEEEEEEEDDDDDDDDDDDDD      IIIIIIIIII      TTTTTTTTTTT           OOOOOOOOO     RRRRRRRR     RRRRRRR

*/

    $('#editor').mousedown((e) => {
      this.sprite.set_pixel(this.editor.get_pixel(e),e.shiftKey); // updates the sprite array at the grid position with the color chosen on the palette
      this.is_drawing = true; // needed for mousemove drawing
      this.update_ui();
    });

    $('#editor').mousemove((e) => {
      if (this.is_drawing){
        this.sprite.set_pixel(this.editor.get_pixel(e),e.shiftKey); // updates the sprite array at the grid position with the color chosen on the palette
        this.update_ui(); 
      }    
    });

    $('#editor').mouseup((e) =>
    {
      // stop drawing pixels
      this.is_drawing = false;
      this.sprite.save_backup();
      this.update_ui();
    });

    $('#icon-shift-left').mouseup((e) =>
    {
      this.sprite.shift_horizontal("left");
      this.update_ui();
    });

    $('#icon-shift-right').mouseup((e) =>
    {
      this.sprite.shift_horizontal("right");
      this.update_ui();
    });

    $('#icon-shift-up').mouseup((e) =>
    {
      this.sprite.shift_vertical("up");
      this.update_ui();
    });

    $('#icon-shift-down').mouseup((e) =>
    {
      this.sprite.shift_vertical("down");
      this.update_ui();
    });

    $('#icon-flip-horizontal').mouseup((e) =>
    {
      this.sprite.flip_horizontal();
      this.update_ui();
    });

    $('#icon-flip-vertical').mouseup((e) =>
    {
      this.sprite.flip_vertical();
      this.update_ui();
    });

    $('#icon-multicolor').mouseup((e) =>
    {
      this.sprite.toggle_multicolor();
      this.update_ui();
    });


    $('#icon-editor-zoom-in').mouseup((e) =>
    {     
      this.editor.zoom_in();
      this.update_ui();
    });

    $('#icon-editor-zoom-out').mouseup((e) =>
    {     
      this.editor.zoom_out();
      this.update_ui();
    });

    $('#icon-editor-grid').mouseup((e) =>
    {
      this.editor.toggle_grid();
      this.update_ui();
    });


/*

LLLLLLLLLLL             IIIIIIIIII   SSSSSSSSSSSSSSS TTTTTTTTTTTTTTTTTTTTTTT
L:::::::::L             I::::::::I SS:::::::::::::::ST:::::::::::::::::::::T
L:::::::::L             I::::::::IS:::::SSSSSS::::::ST:::::::::::::::::::::T
LL:::::::LL             II::::::IIS:::::S     SSSSSSST:::::TT:::::::TT:::::T
  L:::::L                 I::::I  S:::::S            TTTTTT  T:::::T  TTTTTT
  L:::::L                 I::::I  S:::::S                    T:::::T        
  L:::::L                 I::::I   S::::SSSS                 T:::::T        
  L:::::L                 I::::I    SS::::::SSSSS            T:::::T        
  L:::::L                 I::::I      SSS::::::::SS          T:::::T        
  L:::::L                 I::::I         SSSSSS::::S         T:::::T        
  L:::::L                 I::::I              S:::::S        T:::::T        
  L:::::L         LLLLLL  I::::I              S:::::S        T:::::T        
LL:::::::LLLLLLLLL:::::LII::::::IISSSSSSS     S:::::S      TT:::::::TT      
L::::::::::::::::::::::LI::::::::IS::::::SSSSSS:::::S      T:::::::::T      
L::::::::::::::::::::::LI::::::::IS:::::::::::::::SS       T:::::::::T      
LLLLLLLLLLLLLLLLLLLLLLLLIIIIIIIIII SSSSSSSSSSSSSSS         TTTTTTTTTTT  

*/

    $('#spritelist').mouseup((e) =>
    {
      if (!this.dragging)
      {
        this.sprite.set_current_sprite(this.list.get_clicked_sprite());
        if (!this.sprite.is_multicolor() &&  this.sprite.is_pen_multicolor())
        {
          this.sprite.set_pen("i");
        }
        this.update_ui();
      } 
    });

    $( "#spritelist" ).sortable({stop: ( e, ui ) => 
      {
        this.sprite.sort_spritelist($( "#spritelist" ).sortable( "toArray" ));
        this.dragging = false;
        this.update_ui();
      }
    });

    $( "#spritelist" ).sortable({start: ( e, ui ) => 
      {
        this.dragging = true;
      }
    });

   $('#icon-list-new').mouseup((e) =>
    {      
      this.sprite.new(this.palette.get_color());
      $('#icon-trash').fadeTo( "slow", 0.75 );
      $('#icon-list-delete').fadeTo( "slow", 0.75 );
      this.update_ui();
    });

   $('#icon-list-delete').mouseup((e) =>
    {     
      this.sprite.delete();
      if (this.sprite.only_one_sprite()) $('#icon-list-delete').fadeTo( "slow", 0.33 );
      if (this.sprite.only_one_sprite()) $('#icon-trash').fadeTo( "slow", 0.33 );
      this.update_ui(); 
    });

   $('#icon-list-grid').mouseup((e) =>
    {     
      this.list.toggle_grid();
      this.update_ui();
    });

    $('#icon-list-zoom-in').mouseup((e) =>
    {     
      this.list.zoom_in();
      this.update_ui();
    });

    $('#icon-list-zoom-out').mouseup((e) =>
    {     
      this.list.zoom_out();
      this.update_ui();
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

   $('#icon-preview-x').mouseup((e) =>
    {     
      this.sprite.toggle_double_x();
      $('#icon-preview-x').toggleClass('icon-preview-x2-hi');
      this.update_ui();
    });

   $('#icon-preview-y').mouseup((e) =>
    {     
      this.sprite.toggle_double_y();
      $('#icon-preview-y').toggleClass('icon-preview-y2-hi');
      this.update_ui();
    });

    $('#icon-preview-zoom-in').mouseup((e) =>
    {     
      this.preview.zoom_in();
      this.update_ui();
    });

    $('#icon-preview-zoom-out').mouseup((e) =>
    {     
      this.preview.zoom_out();
      this.update_ui();
    });

  }

}


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


function status(text)
{
  $("#statustext").text(text).fadeIn(500).delay(3000).fadeOut(1500);
}


