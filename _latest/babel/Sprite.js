


class Sprite
{

  constructor(config)
  {

    // basic sprite setup
    // has to become more flexible later on
    this.width = config.sprite_x;
    this.height = config.sprite_y;
   
    this.pixels = [];
    this.stretch_x = 0;
    this.stretch_y = 0;
    this.multicolor = true;
    this.colors = [0,1,2];

    // generate a bitmap array
    var line = [];
    for(var i=0; i<this.height; i++)
    {
      line = [];
      for(var j=0; j<this.width; j++)
      {
        line.push("#000000");
      }
      this.pixels.push(line);
    }
  }

  get_pixel(x,y)
  {
    return this.pixels[y][x];
  }


  set_pixel(x,y,color)
  {
    // writes a pixel to the sprite pixel array
    
    if(this.multicolor && x%2 != 0)
    {
      // in multicolor the pixels are wider, so we have to substract 1 to make it work
      this.pixels[y][x-1] = color; 
    }else{
      // normal 1 pixel singlecolor mode
      this.pixels[y][x] = color;  
    }
    
  }

  get_current_sprite()
  {
    return this;
  }

  
}