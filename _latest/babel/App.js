

class App
{
  
  constructor(config)
  {

    this.config = config;
    this.sprite = new Sprite(this.config);

    // init the base windows
    let window_config = 
    {
      title: "Edit Sprite",
      left: 150,
      top: 180
    };
    this.window_editor = new Window_Editor(window_config);
    this.editor = new Editor(0,this.config);

    // create the color palette for the color window
    window_config =
    {
      title: "Palette",
      left: 50,
      top: 180
    };
    this.window_colors = new Window_Palette(window_config);
    this.palette = new Palette(1,this.config,this.sprite.get_colors());

    window_config = 
    {
      title: "Preview",
      left: 650,
      top: 180
    };
    this.window_preview = new Window_Preview(window_config);
    this.preview = new Preview(2,this.config);

    window_config = 
    {
      title: "Sprite List",
      left: 820,
      top: 360
    };
    this.window_preview = new Window_List(window_config);
    this.list = new List(3,this.config);

    this.update_ui();
    this.is_drawing = false;
    this.user_interaction();
  }

  draw_pixel(e)
  {
    let color = this.palette.get_color();
      
    if (e.shiftKey)
    {
      color = this.sprite.get_delete_color();
    }

    // draw pixels
    let gridpos = this.editor.get_pixel(e); // returns the pixel grid position of the clicked pixel
    this.sprite.set_pixel(gridpos.x,gridpos.y,color); // updates the sprite array at the grid position with the color chosen on the palette
    this.update_ui();
    this.is_drawing = true; // needed for mousemove drawing
  }

  update_ui()
  {
    this.editor.update(this.sprite.get_current_sprite());
    this.preview.update(this.sprite.get_current_sprite());
    this.list.update(this.sprite.get_all_sprites());
  }


  user_interaction()
  {

    $(document).keydown((e) =>
    {
 
      if (e.key == "a")
      {
        // toggle hires or multicolor
        this.sprite.shift_horizontal("right");
        this.update_ui();
      }

      if (e.key == "A")
      {
        // toggle hires or multicolor
        this.sprite.shift_horizontal("left");
        this.update_ui();
      }

      if (e.key == "c")
      {
        // clear sprite
        this.sprite.clear();
        this.update_ui();
      }

      if (e.key == "d")
      {
        this.sprite.flip_horizontal();
        this.update_ui();
      }

      if (e.key == "D")
      {
        this.sprite.flip_vertical();
        this.update_ui();
      }

      if (e.key == "f")
      {
        // fill sprite with active color
        this.sprite.fill(this.palette.get_color());
        this.update_ui();
      }

      if (e.key == "g")
      {
        // toggle grid display
        this.editor.toggle_grid();
        this.update_ui();
      }

      if (e.key == "m")
      {
        // toggle hires or multicolor
        this.sprite.toggle_multicolor();
        this.update_ui();
      }

      if (e.key == "s")
      {
        // toggle hires or multicolor
        this.sprite.shift_vertical("down");
        this.update_ui();
      }

      if (e.key == "S")
      {
        // toggle hires or multicolor
        this.sprite.shift_vertical("up");
        this.update_ui();
      }

    });

    $('#editor').mousedown((e) =>
    {
     this.draw_pixel(e);
    });

    $('#editor').mousemove((e) =>
    {
      if (this.is_drawing)
      {
        this.draw_pixel(e);   
      }
    });


    $('#editor').mouseup((e) =>
    {
      // stop drawing pixels
      this.is_drawing = false;
    });

    $('#palette').mouseup((e) =>
    {
      this.palette.set_active_color(e);
    });


    $('#icon-shift-right').mouseup((e) =>
    {
      this.sprite.shift_horizontal("right");
      this.update_ui();
    });

    $('#icon-shift-left').mouseup((e) =>
    {
      this.sprite.shift_horizontal("left");
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

    $('#icon-grid').mouseup((e) =>
    {
      this.editor.toggle_grid();
      this.update_ui();
    });

    $('#icon-fill').mouseup((e) =>
    {
      this.sprite.fill(this.palette.get_color());
      this.update_ui();
    });

    $('#icon-trash').mouseup((e) =>
    {
      this.sprite.set_current_sprite();
      this.update_ui();
    });

    $('#icon-multicolor').mouseup((e) =>
    {
      this.sprite.toggle_multicolor();
      this.update_ui();
    });
  }




  get_pos_window(obj,e)
  // returns the x and y position in pixels of the clicked window
  {
    let curleft = 0, curtop = 0;
    if (obj.offsetParent)
    {
      do 
      {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);

      let x = e.pageX - curleft;
      let y = e.pageY - curtop; // TODO: the -2 is a hack, no idea why is isn't exact otherwise
      
      return { x: x, y: y }; 
    }
  return undefined;
  }


}