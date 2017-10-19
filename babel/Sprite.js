


class Sprite
{

  constructor(config)
  {
    
    this.config = config;
    this.width = config.sprite_x;
    this.height = config.sprite_y;
    this.all = {};
    this.all.colors = {"t": 11, "m1": 8, "m2": 6};

    this.all.sprites = [];
    this.all.current_sprite = 0;
    this.all.pen = "i"; // can be individual = i, transparent = t, multicolor_1 = m1, multicolor_2 = m2
    this.backup = [];
    this.backup_position = -1; 
    this.copy_sprite = {};   
  }

  new(color = 1,multicolor = false)
  {
    
    const sprite =
    {
      "color" : color,      
      "multicolor" : multicolor,
      "double_x" : false,
      "double_y" : false,
      "overlay" : false,
      "pixels": []
    };

    for(let i=0; i<this.height; i++)
    {
      let line = [];
      for(let j=0; j<this.width; j++) line.push("t");
      sprite.pixels.push(line);
    }
    this.all.sprites.push(sprite);
    this.all.current_sprite = this.all.sprites.length -1;

    if (!multicolor && this.is_pen_multicolor()) this.set_pen("i");

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
      for(let j=0; j<this.width; j++) line.push("t");
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
      "i": this.all.sprites[this.all.current_sprite].color,
      "t": this.all.colors.t,
      "m1": this.all.colors.m1,
      "m2": this.all.colors.m2
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
    if (this.all.sprites[this.all.current_sprite].multicolor)
    {
      this.all.sprites[this.all.current_sprite].multicolor = false;
      if (this.is_pen_multicolor()) this.set_pen("i");
    }else{
      this.all.sprites[this.all.current_sprite].multicolor = true;
    }
    this.save_backup();
  }


  set_pixel(pos,shiftkey)
  {
    // writes a pixel to the sprite pixel array
    
    // multicolor check
    if(this.all.sprites[this.all.current_sprite].multicolor && pos.x%2 !== 0) pos.x=pos.x-1;
    
    if (!shiftkey)
    {
      // draw with selected pen
      this.all.sprites[this.all.current_sprite].pixels[pos.y][pos.x] = this.all.pen; 
    } else {
      // shift is hold down, so we delete with transparent color
      this.all.sprites[this.all.current_sprite].pixels[pos.y][pos.x] = "t";
    }
  }

  get_current_sprite()
  {
    return this.all.sprites[this.all.current_sprite];
  }

  get_number_of_sprites()
  {
    return this.all.sprites.length;
  }

  only_one_sprite()
  {
    if (this.all.sprites.length == 1) return true;
  }

  get_pen()
  {
    return this.all.pen;
  }

  is_pen_multicolor()
  {
    if (this.all.pen === "m1" || this.all.pen === "m2")
    {
      return true;
    } else {
      return false;
    }
  }

  set_pen(pen)
  {
    this.all.pen = pen;
  }

  set_pen_color(pencolor)
  {
    if (this.all.pen == "i")
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

  set_all(all)
  {
    this.all = all;
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
    if (spritenumber == "right" && (this.all.current_sprite < this.all.sprites.length-1))
    {
      spritenumber = this.all.current_sprite + 1;
    } 

    if (spritenumber == "left" && (this.all.current_sprite > 0 ) )
    {
      spritenumber = this.all.current_sprite - 1;
    } 

    if (typeof(spritenumber) == "number") this.all.current_sprite = spritenumber;
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

  redo()
  {

    if (this.backup_position < this.backup.length -1)
    {
      this.backup_position ++;
      this.all = jQuery.extend(true, {}, this.backup[this.backup_position]);
    }
  }

  rotate_right()
  {
    // TODO: currently unused
    // leaving this in for now but it will likely be hard to do right
    // for multicolor and 24x21 non-square arrays.
    
    var grid = [
      ["i"], ["t"], ["m1"], ["m2"],
      ["t"], ["t"], ["t"], ["t"],
      ["m1"], ["m2"], ["m2"], ["m2"],
      ["m2"], ["t"], ["i"], ["t"],
      ["m1"], ["m1"], ["i"], ["t"]
    ]; 

    var newGrid = [];
    var rowLength = Math.sqrt(grid.length);
    newGrid.length = grid.length

    for (var i = 0; i < grid.length; i++)
    {
        //convert to x/y
        var x = i % rowLength;
        var y = Math.floor(i / rowLength);

        //find new x/y
        var newX = rowLength - y - 1;
        var newY = x;

        //convert back to index
        var newPosition = newY * rowLength + newX;
        newGrid[newPosition] = grid[i];
    }

        console.log(newGrid);
  }

  floodfill(pos)
  {
    // https://stackoverflow.com/questions/22053759/multidimensional-array-fill
    // get target value
    let x = pos.x;
    let y = pos.y;
    var data = this.all.sprites[this.all.current_sprite].pixels;
    

    // multicolor check
    var stepping = 1;
    var is_multi = this.all.sprites[this.all.current_sprite].multicolor;
    if (is_multi) stepping = 2;

    if (is_multi && x%2 !== 0) x=x-1;
    var target = data[y][x];
    
    function flow(x,y,pen) 
    {
       
        // bounds check what we were passed
        if (y >= 0 && y < data.length && x >= 0 && x < data[y].length) 
        {
            if (is_multi && x%2 !== 0) x=x-1;
            if (data[y][x] === target && data[y][x] != pen) 
            {
                data[y][x] = pen;
                flow(x-stepping, y, pen);    // check up
                flow(x+stepping, y, pen);    // check down
                flow(x, y-1, pen);    // check left
                flow(x, y+1, pen);    // check right
            }
        }
    }

    flow(x,y,this.all.pen);
    this.all.sprites[this.all.current_sprite].pixels = data;
  }

  copy()
  {
    this.copy_sprite = jQuery.extend(true, {}, this.all.sprites[this.all.current_sprite]);
  }

  is_copy_empty()
  {
    if (Object.keys(this.copy_sprite).length === 0)
    {
      return true;
    } else {
      return false;
    }
  }

  paste()
  {
    this.all.sprites[this.all.current_sprite] = jQuery.extend(true, {}, this.copy_sprite);
    this.save_backup();
  }

  can_undo()
  {
    if (this.backup_position < 1)
    {
      return false;
    } else {
      return true;
    }
  }

  can_redo()
  {
    if (this.backup_position < this.backup.length-1)
    {
      return true;
    } else {
      return false;
    }
  }

  toggle_overlay()
  {
    if (this.all.sprites[this.all.current_sprite].overlay)
    {
      this.all.sprites[this.all.current_sprite].overlay = false;
    } else {
      this.all.sprites[this.all.current_sprite].overlay = true;
    }
  }

  is_overlay()
  {
    return this.all.sprites[this.all.current_sprite].overlay;
  }



}