

class Preview
{

  constructor(window,config)
  {
    this.config = config;
    this.window = window;
    this.canvas_element = document.createElement('canvas');
    this.zoom = this.config.zoom_preview; // this.config.zoom;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;
    
    this.canvas_element.id = "preview";
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    this.canvas = this.canvas_element.getContext('2d');

    let template = `
      <div class="window_menu">
        <div class="icon-preview-x2" id="icon-preview-x"></div>
        <div class="icon-preview-y2" id="icon-preview-y"></div>
        <div class="right">
          <img src="img/icon3/icon-zoom-in.png" id="icon-preview-zoom-in" title="zoom in">
          <img src="img/icon3/icon-zoom-out.png" id="icon-preview-zoom-out" title="zoom out">
        </div>
      </div>
      <div id="preview-canvas"></div>
    `;

    $("#window-"+this.window).append(template);
    $("#preview-canvas").append(this.canvas_element);
   
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
    if (this.zoom <= 16)
    {
      this.zoom += 2;
      this.update_zoom();
    } 
  }

  zoom_out()
  {
    if (this.zoom >= 2)
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

  update(all_data)
  {
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    let sprite_data = all_data.sprites[all_data.current_sprite];
    let x_grid_step = 1;
    if (sprite_data.multicolor) x_grid_step = 2;

    for (let i=0; i<this.pixels_x; i=i+x_grid_step)
    {
      for (let j=0; j<this.pixels_y; j++)
      {

        let array_entry = sprite_data.pixels[j][i];
        if (array_entry == "i"){
          var color = sprite_data.color;
        }else{
          var color = all_data.colors[array_entry];
          
          // if singlecolor only, replace the multicolor pixels with the individual color
          if (!sprite_data.multicolor && (array_entry == "m1" || array_entry == "m2")) color = sprite_data.color;
        }

        this.canvas.fillStyle = this.config.colors[color] ;
        this.canvas.fillRect(i*this.zoom, j*this.zoom, this.pixels_x * x_grid_step, this.pixels_y); 
      }
    }

    // set the preview window x and y stretch
    if(sprite_data.double_x){
      var double_x = 2;
      $('#icon-preview-x').addClass('icon-preview-x2-hi');
    }else{
      var double_x = 1;
      $('#icon-preview-x').removeClass('icon-preview-x2-hi');
    }

    if(sprite_data.double_y){
      var double_y = 2;
      $('#icon-preview-y').addClass('icon-preview-y2-hi');
    }else{
      var double_y = 1;
      $('#icon-preview-y').removeClass('icon-preview-y2-hi');
    }
    
    $('#preview').css('width',this.width * double_x);
    $('#preview').css('height',this.height * double_y);

    
  }



}


