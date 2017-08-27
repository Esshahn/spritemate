


class Sprite
{

  constructor(config)
  {

    // basic sprite setup
    // has to become more flexible later on
    this.config = config;
    this.width = config.sprite_x;
    this.height = config.sprite_y;
   
    this.pixels = [];
    this.double_x = false;
    this.double_y = false;
    this.multicolor = false;
    this.colors = [5,7,2];

    // generate a bitmap array
    let line = [];
    for(let i=0; i<this.height; i++)
    {
      line = [];
      for(let j=0; j<this.width; j++)
      {
        line.push(this.colors[0]);
      }
      this.pixels.push(line);
    }

    // TODO: delete these below
    this.pixels[3][3] = this.colors[1];
    this.pixels[4][3] = this.colors[1];
    this.pixels[3][5] = this.colors[2];

  }

  get_pixel(x,y)
  {
    return this.pixels[y][x];
  }

  get_colors()
  {
    return this.colors;
  }

  get_delete_color()
  {
    return this.colors[0];
  }

  is_multicolor(){
    return this.multicolor;
  }

  is_double_x()
  {
    return this.double_x;
  }

  is_double_y()
  {
    return this.double_y;
  }


  set_pixel(x,y,color)
  {
    // writes a pixel to the sprite pixel array
    
    // multicolor check
    if(this.multicolor && x%2 !== 0) x=x-1;

    this.pixels[y][x] = color;  
  }

  get_current_sprite()
  {
    return this;
  }

  
}