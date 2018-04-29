

class Playfield
{

  constructor(window,config)
  {
    this.config = config;
    this.window = window;
    
    this.zoom = this.config.window_playfield.zoom; 
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.config.window_playfield.canvas_x;
    this.height = this.pixels_y * this.config.window_playfield.canvas_y;
    
    let template = `
      <div class="window_menu">
        <div class="icons-zoom-area">
          <img src="img/icon3/icon-zoom-in.png" id="icon-playfield-zoom-in" title="zoom in">
          <img src="img/icon3/icon-zoom-out.png" id="icon-playfield-zoom-out" title="zoom out">
        </div>
      </div>
      <div id="playfield-container">
        <div id="playfield"></div>
      </div>
    `;

    $("#window-"+this.window).append(template);

  }


  zoom_in()
  {
    if (this.zoom <= 16)
    {
      this.zoom ++;
    } 
  }

  zoom_out()
  {
    if (this.zoom >= 2)
    {
     this.zoom --;
    }
  }

  get_zoom()
  {
    return this.zoom;
  }

  is_min_zoom()
  {
    if (this.zoom < 2) return true;
  }

  is_max_zoom()
  {
    if (this.zoom > 16) return true;
  }

  update(all_data)
  {
    $("#playfield").empty();
    $("#playfield").css('background-color',this.config.colors[all_data.colors["t"]] );


    for (let i=0; i<all_data.sprites.length;i++)
    {
      this.create_single_sprite_canvas(all_data.sprites[i],all_data.colors,i);    
    }
    
  }

  create_single_sprite_canvas(sprite_data,colors,id)
  {

    let sprite_canvas = document.createElement('canvas');
    sprite_canvas.width = this.pixels_x * this.zoom;
    sprite_canvas.height = this.pixels_y * this.zoom;
    sprite_canvas.context = sprite_canvas.getContext('2d');
    sprite_canvas.id = "playfield-sprite-"+id;
    sprite_canvas.context.scale(this.zoom,this.zoom);

    let x_grid_step = 1;
    if (sprite_data.multicolor) x_grid_step = 2;
    
    for (let i=0; i<this.pixels_x; i=i+x_grid_step)
    {
      for (let j=0; j<this.pixels_y; j++)
      {
        let array_entry = sprite_data.pixels[j][i];

        if (array_entry != "t")
        {
          let color = sprite_data.color;
          if (array_entry != "i" && sprite_data.multicolor) color = colors[array_entry];
          sprite_canvas.context.fillStyle = this.config.colors[color] ;
          sprite_canvas.context.fillRect(i, j, x_grid_step, 1);  
        }
      }
    }



    $("#playfield").append( sprite_canvas );

    $('#playfield-sprite-'+id).mousedown((e) => { console.log("mousedown on sprite "+ id);});
    
    $('#playfield-sprite-'+id).draggable(
    {
      cursor: "crosshair",
      addClasses: false,
      grid: [ this.pixels_x * this.zoom, this.pixels_y * this.zoom ]
    });
    
    $('#playfield-sprite-'+id).mouseup((e) => 
    { 
        console.log("mouseup on sprite "+ id);
    });


  }



}


