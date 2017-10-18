

class Editor
{

  constructor(window,config)
  {
    this.config = config;
    this.grid = this.config.display_grid;
    this.window = window;
    this.canvas_element = document.createElement('canvas');
    this.zoom = this.config.zoom_editor;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;
    
    this.canvas_element.id = "editor";
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;

    let template = `
      <div class="window_menu">
        <img src="img/icon3/icon-multicolor.png" title="toggle single- & multicolor" id="icon-multicolor">
        <img src="img/icon3/icon-shift-left.png" title="shift left" id="icon-shift-left">
        <img src="img/icon3/icon-shift-right.png" title="shift right" id="icon-shift-right">
        <img src="img/icon3/icon-shift-up.png" title="shift up" id="icon-shift-up">
        <img src="img/icon3/icon-shift-down.png" title="shift down" id="icon-shift-down">
        <img src="img/icon3/icon-flip-horizontal.png" title="flip horizontal" id="icon-flip-horizontal">
        <img src="img/icon3/icon-flip-vertical.png" title="flip vertical" id="icon-flip-vertical">
        
        <div class="right">
          <img src="img/icon3/icon-grid.png" id="icon-editor-grid" title="toggle grid borders">
          <img src="img/icon3/icon-zoom-in.png" id="icon-editor-zoom-in" title="zoom in">
          <img src="img/icon3/icon-zoom-out.png" id="icon-editor-zoom-out" title="zoom out">
        </div>
      </div>
      <div id="editor-canvas"></div>
    `;

    $("#window-"+this.window).append(template);

    $("#editor-canvas").append(this.canvas_element);

    this.canvas = this.canvas_element.getContext('2d');
   
  }

  get_width()
  {
    return this.width;
  }

  get_height()
  {
    return this.height;
  }

  toggle_grid()
  {
    if (this.grid){
      this.grid = false;
    }else{
      this.grid = true;
    }
  }

  update(all_data)
  {
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;

    let sprite_data = all_data.sprites[all_data.current_sprite];
    let x_grid_step = 1;
    if (sprite_data.multicolor) x_grid_step = 2;

    // first fill the whole sprite with the background color
    this.canvas.fillStyle = this.config.colors[all_data.colors["t"]];
    this.canvas.fillRect(0,0,this.width,this.height); 

    // overlay from previous sprite
    if (all_data.current_sprite > 0)
    {
      let previous_sprite = all_data.sprites[all_data.current_sprite-1];
      if (previous_sprite.overlay) this.display_overlay(all_data,"previous");
    }

    // current sprite
    this.fill_canvas(all_data,sprite_data,x_grid_step,1);

    // overlay from next sprite
    if (sprite_data.overlay && all_data.current_sprite < (all_data.sprites.length -1)) this.display_overlay(all_data);
    
    // grid
    if (this.grid) this.display_grid(sprite_data);
  }

  display_overlay(all_data,mode, alpha = 0.2)
  {
    let overlay_sprite_number = 1;
    if (mode == "previous") overlay_sprite_number = -1;
    let sprite_data = all_data.sprites[all_data.current_sprite + overlay_sprite_number];
    let x_grid_step = 1;
    if (sprite_data.multicolor) x_grid_step = 2;

    this.fill_canvas(all_data,sprite_data,x_grid_step,alpha);
  }

  fill_canvas(all_data,sprite_data,x_grid_step,alpha = 1)
  {

    for (let i=0; i<this.pixels_x; i=i+x_grid_step)
    {
      for (let j=0; j<this.pixels_y; j++)
      {
        let array_entry = sprite_data.pixels[j][i];

        // if singlecolor only, replace the multicolor pixels with the individual color
        if (!sprite_data.multicolor && (array_entry == "m1" || array_entry == "m2")) color = sprite_data.color;
  
        let color = sprite_data.color;
        if (array_entry != "i") color = all_data.colors[array_entry];
        
        if (array_entry != "t")
        {
        this.canvas.fillStyle = this.overlay_color(this.config.colors[color],alpha);
        this.canvas.fillRect(i*this.zoom, j*this.zoom, x_grid_step * this.zoom, this.zoom); 
        } 
      }
    }
  }

  overlay_color(hex, alpha) 
  {
    // expects a hex value like "#ff8800" and returns a rbga + alpha value like "rgba (50,20,100,0.5)"
    var bigint = parseInt(hex.slice(-6), 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    var combined = r + "," + g + "," + b;
    var result = "rgba(" + combined + ","+ alpha + ")";
    return result;
  }


  display_grid(sprite_data)
  {
    // show a grid
    this.canvas.strokeStyle = "#666666";
    this.canvas.setLineDash([1, 1]);
    let x_grid_step = 1;
   
    if (sprite_data.multicolor) x_grid_step = 2;

    for (let i=0; i<=this.pixels_x; i=i+x_grid_step)
    {
        this.canvas.beginPath();
        this.canvas.moveTo(i*this.zoom,0);
        this.canvas.lineTo(i*this.zoom,this.height);
        this.canvas.stroke();
    }

    for (let i=0; i<=this.pixels_y; i++)
    {
        this.canvas.beginPath();
        this.canvas.moveTo(0,i*this.zoom);
        this.canvas.lineTo(this.width,i*this.zoom);
        this.canvas.stroke();
    }
  }


  get_pixel(e)
  // input: x,y position of the mouse inside the editor window in pixels
  // output: x,y position in the sprite grid
  {
    let obj = this.canvas_element.getBoundingClientRect();
    let x = e.clientX - obj.left;
    let y = e.clientY - obj.top;
    let x_grid = Math.floor(x/(this.width/this.config.sprite_x));
    let y_grid = Math.floor(y/(this.height/this.config.sprite_y));
    return {x: x_grid, y: y_grid};
  }


 zoom_in()
  {
    if (this.zoom <= 26)
    {
      this.zoom += 2;
      this.update_zoom();
    } 
  }

  zoom_out()
  {
    if (this.zoom >= 10)
    {
     this.zoom -= 2;
     this.update_zoom();
    }
  }

  update_zoom()
  {
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;
  }

}


