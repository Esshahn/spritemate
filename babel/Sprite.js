


class Sprite
{

  constructor(config)
  {
    
    this.config = config;
    this.width = config.sprite_x;
    this.height = config.sprite_y;
    this.all = {};
    this.all.colors = {"transparent": 0, "multicolor_1": 8, "multicolor_2": 3};
    this.all.sprites = [];
    this.all.current_sprite = 0;
    this.all.pen = "individual"; // can be individual =0, transparent=1, multicolor_1=2, multicolor_2=3
    this.backup = [];
    this.backup_position = -1;    
  }

  new(color = 1,multicolor = false)
  {
    
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
      for(let j=0; j<this.width; j++) line.push("transparent");
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
      for(let j=0; j<this.width; j++) line.push("transparent");
      pixels.push(line);
    }
    this.all.sprites[this.all.current_sprite].pixels = pixels;
    this.save_backup();
  }


  fill()
  {

    // fills the sprite data with the default color
    // generate a bitmap array

    let pixels = [];

    for(let i=0; i<this.height; i++)
    {
      let line = [];
      for(let j=0; j<this.width; j++) line.push(this.all.pen);
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

  get_colors()
  // used to update the palette with the right colors
  {
    let sprite_colors = {
      "individual": this.all.sprites[this.all.current_sprite].color,
      "transparent": this.all.colors.transparent,
      "multicolor_1": this.all.colors.multicolor_1,
      "multicolor_2": this.all.colors.multicolor_2
    }
    return sprite_colors;
  }

  get_delete_color()
  {
    return this.all.colors.transparent;
  }

  is_multicolor()
  {
    return this.all.sprites[this.all.current_sprite].multicolor;
  }


  toggle_double_x()
  {
    if (this.all.sprites[this.all.current_sprite].double_x){
      this.all.sprites[this.all.current_sprite].double_x = false;
    }else{
      this.all.sprites[this.all.current_sprite].double_x = true;
    }
    this.save_backup();
  }

  toggle_double_y()
  {
    if (this.all.sprites[this.all.current_sprite].double_y){
      this.all.sprites[this.all.current_sprite].double_y = false;
    }else{
      this.all.sprites[this.all.current_sprite].double_y = true;
    }
    this.save_backup();
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
    this.all.sprites[this.all.current_sprite].pixels[y][x] = this.all.pen; 
  }

  get_current_sprite()
  {
    return this.all.sprites[this.all.current_sprite];
  }

  only_one_sprite()
  {
    if (this.all.sprites.length == 1) return true;
  }

  get_pen()
  {
    return this.all.pen;
  }

  set_pen(pen)
  {
    this.all.pen = pen;
  }

  set_pen_color(pencolor)
  {
    if (this.all.pen == "individual")
    {
      this.all.sprites[this.all.current_sprite].color = pencolor;
    } else {
      this.all.colors[this.all.pen] = pencolor;
    }
  }

  get_all()
  {
    return this.all;
  }

  sort_spritelist(sprite_order_from_dom)
  {
    let sorted_list = sprite_order_from_dom.map(function(x){ return parseInt(x); });
    let new_sprite_list = [];

    for(let i=0; i<sorted_list.length;i++)
    {
      new_sprite_list.push(this.all.sprites[sorted_list[i]]);
      if (sorted_list[i]==this.all.current_sprite) var temp_current_sprite = i; 
    }

    this.all.sprites = new_sprite_list;
    this.all.current_sprite = temp_current_sprite;
    this.save_backup();
  }


  set_current_sprite(spritenumber)
  {
    this.all.current_sprite = spritenumber;
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

/*
  get_pixel(x,y)
  {

    return this.all.sprites[this.all.current_sprite].pixels[y][x];

  }
*/

/*
  get_last_sprite()
  {
    return this.all.sprites.length - 1;
  }
*/

/*
  get_all_sprites()
  {
    if (this.all.sprites)
    {
      return this.all.sprites;
    }else{
      return false;
    }
  }
*/

/*
  get_current_sprite_number()
  {
    console.log("woppo");
    return this.all.current_sprite;
  }
*/

}