



class App
{
  
  constructor(config)
  {

    this.config = config;

    if (this.config.computer  == "charset")
    {
      this.config.sprite_x = 8;
      this.config.sprite_y = 8;
    }

    // init the base windows
    this.window_editor = new WindowEditor("Edit Sprite",10);
    this.window_colors = new WindowColors("Color palette",this.config.colors);

    // create the sprite editor
    this.sprite = new Sprite(this.config);
    this.editor = new Editor(0,this.config);
    
    // create the color palette for the color window
    this.palette = new Color(1,this.config);

    this.editor.draw_sprite(this.sprite.get_current_sprite());
    this.is_drawing = false;
    this.mouse();
  }



  mouse()
  {
  var that = this;

  $('#editor').mousedown(function(e)
    {
        var pos = that.get_pos(this,e); // returns the x,y position of the mouse in the window in pixels
        var gridpos = that.editor.get_pixel(pos.x,pos.y); // returns the pixel grid position of the clicked pixel
        that.sprite.set_pixel(gridpos.x,gridpos.y,that.palette.get_color()); // updates the sprite array at the grid position with the color chosen on the palette
        that.editor.draw_sprite(that.sprite.get_current_sprite()); // redraws the sprite in the editor window
        that.is_drawing = true; // needed for mousemove drawing
    });

  $('#editor').mousemove(function(e)
    {
      if (that.is_drawing)
      {
        var pos = that.get_pos(this,e);
        var gridpos = that.editor.get_pixel(pos.x,pos.y);
        that.sprite.set_pixel(gridpos.x,gridpos.y,that.palette.get_color());
        that.editor.draw_sprite(that.sprite.get_current_sprite());
      }

    });


  $('#editor').mouseup(function(e)
    {
       that.is_drawing = false;

    });
  }


  get_pos(obj,e)
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