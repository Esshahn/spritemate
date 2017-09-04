


class Sprite
{

  constructor(config)
  {
    
    this.config = config;
    this.width = config.sprite_x;
    this.height = config.sprite_y;

    this.all = {};
    this.all.colors = [5,7];
    this.all.sprites = [];
    this.all.current_sprite = 0;


    this.backup = [];
    this.backup_position = -1;
    
    this.new(6,false);
    
  }

  new(color,multicolor)
  {
    color = Math.floor(Math.random()*15);

    const sprite =
    {
      "color" : color,      
      "multicolor" : multicolor,
      "double_x" : false,
      "double_y" : false,
      "pixels": []
    };

    for(let i=0; i<this.height; i++)
    {
      let line = [];
      for(let j=0; j<this.width; j++) line.push(sprite.color);
      sprite.pixels.push(line);
    }
    this.all.sprites.push(sprite);
    this.all.current_sprite = this.all.sprites.length -1;
    this.save_backup();
  }

  clear()
  {
    // fills the sprite data with the default color
    // generate a bitmap array
    let pixels = [];

    for(let i=0; i<this.height; i++)
    {
      let line = [];
      for(let j=0; j<this.width; j++) line.push(this.all.colors[0]);
      pixels.push(line);
    }
    this.all.sprites[this.all.current_sprite].pixels = pixels;
    this.save_backup();
  }


  fill(color)
  {
    // fills the sprite data with the default color
    // generate a bitmap array
    let pixels = [];

    for(let i=0; i<this.height; i++)
    {
      let line = [];
      for(let j=0; j<this.width; j++) line.push(color);
      pixels.push(line);
    }
    this.all.sprites[this.all.current_sprite].pixels = pixels;
    this.save_backup();
  }

  flip_vertical()
  {
    this.all.sprites[this.all.current_sprite].pixels.reverse();
    this.save_backup();
  }

  flip_horizontal()
  {
    const s = this.all.sprites[this.all.current_sprite];
    for(let i=0; i<this.height; i++) s.pixels[i].reverse(); 

    if(s.multicolor)
    {
      for(let i=0; i<this.height; i++) s.pixels[i].push(s.pixels[i].shift());
    }

    this.all.sprites[this.all.current_sprite] = s; 
    this.save_backup();
  }

  shift_vertical(direction)
  {
    const s = this.all.sprites[this.all.current_sprite];
    if (direction == "down")
     {
       s.pixels.unshift(s.pixels.pop());
     }else{
       s.pixels.push(s.pixels.shift());
     }
    this.all.sprites[this.all.current_sprite] = s;
    this.save_backup();
  }


  shift_horizontal(direction)
  {
    const s = this.all.sprites[this.all.current_sprite];
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
    this.all.sprites[this.all.current_sprite] = s;
    this.save_backup();
  }

  get_pixel(x,y)
  {
    return this.all.sprites[this.all.current_sprite].pixels[y][x];
  }

  get_colors()
  {
    return this.all.colors;
  }

  get_delete_color()
  {
    return this.all.colors[0];
  }

  is_multicolor(){
    return this.all.sprites[this.all.current_sprite].multicolor;
  }

  is_double_x()
  {
    return this.all.sprites[this.all.current_sprite].double_x;
  }

  is_double_y()
  {
    return this.all.sprites[this.all.current_sprite].double_y;
  }

  toggle_multicolor()
  {
    if (this.all.sprites[this.all.current_sprite].multicolor){
      this.all.sprites[this.all.current_sprite].multicolor = false;
    }else{
      this.all.sprites[this.all.current_sprite].multicolor = true;
    }
    this.save_backup();
  }


  set_pixel(x,y,color)
  {
    // writes a pixel to the sprite pixel array
    
    // multicolor check
    if(this.all.sprites[this.all.current_sprite].multicolor && x%2 !== 0) x=x-1;

    this.all.sprites[this.all.current_sprite].pixels[y][x] = color;  
  }

  get_current_sprite()
  {
    return this.all.sprites[this.all.current_sprite];
  }

  get_current_sprite_number()
  {
    return this.all.current_sprite;
  }

  only_one_sprite()
  {
    if (this.all.sprites.length == 1) return true;
  }


  get_all_sprites()
  {
    if (this.all.sprites)
    {
      return this.all.sprites;
    }else{
      return false;
    }
  }

  set_current_sprite(spritenumber)
  {
    this.all.current_sprite = spritenumber;
  }

  get_last_sprite()
  {
    return this.all.sprites.length - 1;
  }

  delete()
  {
    if (this.all.sprites.length > 1)
    {
      this.all.sprites.splice(this.all.current_sprite,1);
      if (this.all.current_sprite == this.all.sprites.length) this.all.current_sprite --; 
      this.save_backup();
    }
   
  }

  save_backup()
  {
    this.backup_position ++;
    this.backup[this.backup_position] = jQuery.extend(true, {}, this.all); 
  }



  undo()
  {

    if (this.backup_position > 0)
    {
      this.backup_position --;
      this.all = jQuery.extend(true, {}, this.backup[this.backup_position]);
    }

  }


  
}