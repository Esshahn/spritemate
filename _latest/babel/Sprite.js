


class Sprite
{

  constructor(config)
  {

    // basic sprite setup
    // has to become more flexible later on
    this.config = config;
    this.width = config.sprite_x;
    this.height = config.sprite_y;
    this.double_x = false;
    this.double_y = false;
    this.multicolor = false;
    this.colors = [5,7,2];
    this.clear();

    // TODO: delete these below
    this.pixels[3][3] = this.colors[1];
    this.pixels[4][3] = this.colors[1];
    this.pixels[3][5] = this.colors[2];

  }

  clear()
  {
    // fills the sprite data with the default color
    // generate a bitmap array
    this.pixels = [];
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
  }


  fill(color)
  {
    // fills the sprite data with the default color
    // generate a bitmap array
    this.pixels = [];
    let line = [];
    for(let i=0; i<this.height; i++)
    {
      line = [];
      for(let j=0; j<this.width; j++)
      {
        line.push(color);
      }
      this.pixels.push(line);
    }
  }

  mirror_vertical()
  {
    this.pixels.reverse();
  }

  mirror_horizontal()
  {
    for(let i=0; i<this.height; i++)
    {
      this.pixels[i].reverse();
    } 
  }

  shift_vertical(direction)
  {
    if (direction == "down")
     {
       this.pixels.unshift(this.pixels.pop());
     }else{
       this.pixels.push(this.pixels.shift());
     }  
  }


  shift_horizontal(direction)
  {
    for(let i=0; i<this.height; i++)
    {
      if (direction == "right")
      {
        
        if (this.multicolor)
        {
          this.pixels[i].unshift(this.pixels[i].pop());
          this.pixels[i].unshift(this.pixels[i].pop());
        }else{
          this.pixels[i].unshift(this.pixels[i].pop());
        }
        
      }else{

        if (this.multicolor)
        {
          this.pixels[i].push(this.pixels[i].shift());
          this.pixels[i].push(this.pixels[i].shift());
        }else{
          this.pixels[i].push(this.pixels[i].shift());
        }
        
      }
    } 
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

  toggle_multicolor()
  {
    if (this.multicolor){
      this.multicolor = false;
    }else{
      this.multicolor = true;
    }
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