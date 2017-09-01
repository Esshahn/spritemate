


class Sprite
{

  constructor(config)
  {

    // basic sprite setup
    // has to become more flexible later on
    this.config = config;
    this.width = config.sprite_x;
    this.height = config.sprite_y;
    this.colors = [5,7];
    this.spritelist = [];
    this.current_sprite = 0;
    this.new(6,false);
    this.new(3,true);
    this.new(2,false);

    
  }

  new(color,multicolor)
  {
    let sprite =
    {
      "color" : color,      
      "multicolor" : multicolor,
      "double_x" : false,
      "double_y" : false
    };

    sprite.pixels = [];
    let line = [];
    for(let i=0; i<this.height; i++)
    {
      line = [];
      for(let j=0; j<this.width; j++)
      {
        line.push(sprite.color);
      }
      sprite.pixels.push(line);
    }
    this.spritelist.push(sprite);
  }

  clear()
  {
    // fills the sprite data with the default color
    // generate a bitmap array
    let pixels = [];
    let line = [];
    for(let i=0; i<this.height; i++)
    {
      line = [];
      for(let j=0; j<this.width; j++)
      {
        line.push(this.colors[0]);
      }
      pixels.push(line);
    }
    this.spritelist[this.current_sprite].pixels = pixels;
  }


  fill(color)
  {
    // fills the sprite data with the default color
    // generate a bitmap array
    let pixels = [];
    let line = [];
    for(let i=0; i<this.height; i++)
    {
      line = [];
      for(let j=0; j<this.width; j++)
      {
        line.push(color);
      }
      pixels.push(line);
    }
    this.spritelist[this.current_sprite].pixels = pixels;
  }

  flip_vertical()
  {
    this.spritelist[this.current_sprite].pixels.reverse();
  }

  flip_horizontal()
  {
    for(let i=0; i<this.height; i++)
    {
      this.spritelist[this.current_sprite].pixels[i].reverse();
    } 
  }

  shift_vertical(direction)
  {
    let s = this.spritelist[this.current_sprite];
    if (direction == "down")
     {
       s.pixels.unshift(s.pixels.pop());
     }else{
       s.pixels.push(s.pixels.shift());
     }
    this.spritelist[this.current_sprite] = s;
  }


  shift_horizontal(direction)
  {
    let s = this.spritelist[this.current_sprite];
    for(let i=0; i<this.height; i++)
    {
      if (direction == "right")
      {
        
        if (s.multicolor)
        {
          s.pixels[i].unshift(s.pixels[i].pop());
          s.pixels[i].unshift(s.pixels[i].pop());
        }else{
          s.pixels[i].unshift(s.pixels[i].pop());
        }
        
      }else{

        if (s.multicolor)
        {
          s.pixels[i].push(s.pixels[i].shift());
          s.pixels[i].push(s.pixels[i].shift());
        }else{
          s.pixels[i].push(s.pixels[i].shift());
        }
        
      }
    }
    this.spritelist[this.current_sprite] = s;
  }

  get_pixel(x,y)
  {
    return this.spritelist[this.current_sprite].pixels[y][x];
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
    return this.spritelist[this.current_sprite].multicolor;
  }

  is_double_x()
  {
    return this.spritelist[this.current_sprite].double_x;
  }

  is_double_y()
  {
    return this.spritelist[this.current_sprite].double_y;
  }

  toggle_multicolor()
  {
    if (this.spritelist[this.current_sprite].multicolor){
      this.spritelist[this.current_sprite].multicolor = false;
    }else{
      this.spritelist[this.current_sprite].multicolor = true;
    }
  }


  set_pixel(x,y,color)
  {
    // writes a pixel to the sprite pixel array
    
    // multicolor check
    if(this.spritelist[this.current_sprite].multicolor && x%2 !== 0) x=x-1;

    this.spritelist[this.current_sprite].pixels[y][x] = color;  
  }

  get_current_sprite()
  {
    return this.spritelist[this.current_sprite];
  }

  get_all_sprites()
  {
    if (this.spritelist)
    {
      return this.spritelist;
    }else{
      return false;
    }
  }

  set_current_sprite(spritenumber)
  {
    this.current_sprite = spritenumber;
  }

  
}