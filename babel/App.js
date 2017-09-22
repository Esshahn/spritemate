

class App
{
  
  constructor(config)
  { 
  
    this.config = config;
    this.sprite = new Sprite(this.config);

    // init the base windows
    let window_config = { title: "Edit Sprite", type: "sprite", resizable: false, left: 150, top: 180, width: "auto", height: "auto" };
    this.window_editor = new Window(window_config);
    this.editor = new Editor(0,this.config);

    // create the color palette for the color window
    window_config = { title: "Palette", type: "colors", resizable: false, left: 50, top: 180, width: "auto", height: "auto" };
    this.window_colors = new Window(window_config);
    this.palette = new Palette(1,this.config);

    window_config = { title: "Preview", type: "preview", resizable: false, left: 650, top: 180, width: "auto", height: "auto" };
    this.window_preview = new Window(window_config);
    this.preview = new Preview(2,this.config);

    window_config = { title: "Sprite List", type: "list", resizable: true, left: 880, top: 420, width: 330, height: 200 };
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
    this.update_ui();
    this.user_interaction();

  }









  update_ui()
  {
    this.editor.update(   this.sprite.get_all());
    this.preview.update(  this.sprite.get_all());
    this.list.update(     this.sprite.get_all());
    this.palette.update(  this.sprite.get_all());
    console.log("ui refresh: " + Date());
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
    this.init_ui_fade("icon-preview-x");
    this.init_ui_fade("icon-preview-y");
    

    // trash can is a bit different
    $('#icon-trash').css({ opacity: 0.20 });
    $('#icon-trash').mouseenter((e) => { if (!this.sprite.only_one_sprite()) $('#icon-trash').animate({backgroundColor: 'rgba(0,0,0,0.5)'}, 'fast');});
    $('#icon-trash').mouseleave((e) => { if (!this.sprite.only_one_sprite()) $('#icon-trash').animate({backgroundColor: 'transparent'}, 'fast');});
    $('#icon-list-delete').css({ opacity: 0.20 });
    $('#icon-list-delete').mouseenter((e) => { if (!this.sprite.only_one_sprite()) $('#icon-list-delete').animate({backgroundColor: 'rgba(0,0,0,0.5)'}, 'fast');});
    $('#icon-list-delete').mouseleave((e) => { if (!this.sprite.only_one_sprite()) $('#icon-list-delete').animate({backgroundColor: 'transparent'}, 'fast');});


/*



  //////////////////  KEYBOARD COMMANDS



*/


    $(document).keydown((e) =>
    {
 
      if (e.key == "a")
      {
        this.update_ui();
      }

      if (e.key == "A")
      {
        // toggle hires or multicolor
        this.sprite.toggle_double_y();
        this.update_ui();
      }

    });


/* 



  //////////////////  EDITOR WINDOW



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
    });


/*



  //////////////////  TOP MENU



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

    $('#icon-grid').mouseup((e) =>
    {
      this.editor.toggle_grid();
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

    $('#icon-trash').mouseup((e) =>
    {
      this.sprite.delete();
      if (this.sprite.only_one_sprite()) $('#icon-trash').fadeTo( "slow", 0.33 );
      if (this.sprite.only_one_sprite()) $('#icon-list-delete').fadeTo( "slow", 0.33 );
      this.update_ui();  
    });

    $('#icon-fill').mouseup((e) =>
    {
      this.sprite.fill();
      this.update_ui();
    });

    $('#icon-info').mouseup((e) =>
    {
      $("#window-4").dialog( "open");
    });

/*



  //////////////////  LIST WINDOW



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



  //////////////////  PREVIEW WINDOW



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

/*



  //////////////////  PALETTE WINDOW



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
        
  }

}


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