



class App
{
  
  constructor(config)
  {

    this.config = config;
    this.sprite = new Sprite(this.config);

// init the base windows
    var window_config = 
    {
      title: "Edit Sprite",
      left: 250,
      top: 150
    };
    this.window_editor = new Window_Editor(window_config);
    this.editor = new Editor(0,this.config);

// create the color palette for the color window
    window_config =
    {
      title: "Palette",
      left: 100,
      top: 150
    };
    this.window_colors = new Window_Palette(window_config);
    this.palette = new Palette(1,this.config,this.sprite.get_colors());

    window_config = 
    {
      title: "Preview",
      left: 750,
      top: 150
    };
    this.window_preview = new Window_Preview(window_config);
    this.preview = new Preview(2,this.config);
    
    this.editor.draw_sprite(this.sprite.get_current_sprite());
    this.preview.draw_sprite(this.sprite.get_current_sprite());
    this.is_drawing = false;
    this.mouse();
  }



  mouse()
  {
  var that = this;

  $('#editor').mousedown(function(e)
    {
      var color = that.palette.get_color();
      
      if (e.shiftKey)
      {
        color = that.sprite.get_delete_color();
      }

      // draw pixels
      var gridpos = that.editor.get_pixel(e); // returns the pixel grid position of the clicked pixel
      that.sprite.set_pixel(gridpos.x,gridpos.y,color); // updates the sprite array at the grid position with the color chosen on the palette
      that.editor.draw_sprite(that.sprite.get_current_sprite()); // redraws the sprite in the editor window
      that.preview.draw_sprite(that.sprite.get_current_sprite());
      that.is_drawing = true; // needed for mousemove drawing
    });

  $('#editor').mousemove(function(e)
    {
      if (that.is_drawing)
      {

        var color = that.palette.get_color();
        
        if (e.shiftKey)
        {
          color = that.sprite.get_delete_color();
        }

      // draw pixels
        var gridpos = that.editor.get_pixel(e);
        that.sprite.set_pixel(gridpos.x,gridpos.y,color);
        that.editor.draw_sprite(that.sprite.get_current_sprite());
        that.preview.draw_sprite(that.sprite.get_current_sprite());     
      }

    });


  $('#editor').mouseup(function(e)
    {
        // stop drawing pixels
        that.is_drawing = false;
    });
  }


  get_pos_window(obj,e)
  // returns the x and y position in pixels of the clicked window
  {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent)
    {
      do 
      {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);

      var x = e.pageX - curleft;
      var y = e.pageY - curtop; // TODO: the -2 is a hack, no idea why is isn't exact otherwise
      
      return { x: x, y: y }; 
    }
  return undefined;
  }


}