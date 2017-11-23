

class Playfield
{

  constructor(window,config)
  {
    this.config = config;
    this.window = window;
    this.canvas_element = document.createElement('canvas');
    this.zoom = this.config.window_playfield.zoom; 
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.config.window_playfield.canvas_x;
    this.height = this.pixels_y * this.config.window_playfield.canvas_y;
    
    this.canvas_element.id = "playfield";
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    this.canvas = this.canvas_element.getContext('2d');

    let template = `
      <div class="window_menu">
        <div class="right">
          <img src="img/icon3/icon-zoom-in.png" id="icon-preview-zoom-in" title="zoom in"><img src="img/icon3/icon-zoom-out.png" id="icon-preview-zoom-out" title="zoom out">
        </div>
      </div>
      <div id="playfield-canvas"></div>
    `;

    $("#window-"+this.window).append(template);
    $("#playfield-canvas").append(this.canvas_element);
   
  }

  get_width()
  {
    return this.width;
  }

  get_height()
  {
    return this.height;
  }


  zoom_in()
  {
    if (this.zoom <= 24)
    {
      this.zoom += 2;
      this.update_zoom();
    } 
  }

  is_min_zoom()
  {
    if (this.zoom < 2) return true;
  }

  is_max_zoom()
  {
    if (this.zoom >= 24) return true;
  }

  zoom_out()
  {
    if (this.zoom >= 2)
    {
     this.zoom -= 2;
     this.update_zoom();
    }
  }

  get_zoom()
  {
    return this.zoom;
  }

  update_zoom()
  {
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;
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

    for (let i=0; i<this.pixels_x; i=i+x_grid_step)
    {
      for (let j=0; j<this.pixels_y; j++)
      {
        let array_entry = sprite_data.pixels[j][i];

        if (array_entry != "t")
        {
          let color = sprite_data.color;
          if (array_entry != "i" && sprite_data.multicolor) color = all_data.colors[array_entry];
          this.canvas.fillStyle = this.config.colors[color] ;
          this.canvas.fillRect(i, j, x_grid_step, 1);  
        }
      }
    }

    
    $('#playfield').css('width',this.width * this.zoom);
    $('#playfield').css('height',this.height * this.zoom);

  }



}


