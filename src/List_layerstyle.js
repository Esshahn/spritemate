

class List extends Window_Controls
{

  constructor(window,config)
  {
    super();
    this.config = config;
    this.window = window;
    this.zoom = this.config.window_list.zoom;
    this.zoom_min = 2;
    this.zoom_max = 16;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;
    this.clicked_sprite = 0;
    this.sorted_array = [];
    this.grid = true;

    let template = `
      <div class="window_menu">
        <div class="icons-zoom-area">
          <img src="img/icon3/icon-zoom-in.png" id="icon-list-zoom-in" title="zoom in">
          <img src="img/icon3/icon-zoom-out.png" id="icon-list-zoom-out" title="zoom out">
          <img src="img/icon3/icon-grid.png" id="icon-editor-grid" title="toggle grid borders">
        </div>
        <img src="img/icon3/icon-list-new.png" id="icon-list-new" title="new sprite">
        <img src="img/icon3/icon-list-delete.png" id="icon-list-delete" title="remove sprite">
        <img src="img/icon3/icon-list-copy.png" id="icon-list-copy" title="copy sprite">
        <img src="img/icon3/icon-list-paste.png" id="icon-list-paste" title="paste sprite">
      </div>
      <div id="spritelist"></div>
    `;

    $("#window-"+this.window).append(template);

    
    $("#spritelist").sortable({
      cursor:"move",
      tolerance: "pointer",
      revert: 'invalid'
    });


    $("#spritelist").disableSelection();
  }

  get_clicked_sprite() { return this.clicked_sprite; }

  toggle_grid() { this.grid = !this.grid; }

  update(all_data)
  {
    
    // this one gets called during drawing in the editor
    // because the normal update method gets too slow
    // when the sprite list is becoming longer
    
    $('#window-'+this.window).dialog('option', 'title', 'sprite ' + (all_data.current_sprite + 1) + " of " + all_data.sprites.length);

    let sprite_data = all_data.sprites[all_data.current_sprite];
    let canvas = document.getElementById("canvas-"+all_data.current_sprite).getContext('2d');

    let x_grid_step = 1;
    if (sprite_data.multicolor) x_grid_step = 2;

    // first fill the whole sprite with the background color
    canvas.fillStyle = this.config.colors[all_data.colors[0]];
    canvas.fillRect(0,0,this.width,this.height);

    for (let i=0; i<this.pixels_x; i=i+x_grid_step)
    {
      for (let j=0; j<this.pixels_y; j++)
      {

        let array_entry = sprite_data.pixels[j][i];

        if (array_entry != 0) // transparent
        {
          let color = sprite_data.color;
          if (array_entry != 1 && sprite_data.multicolor) color = all_data.colors[array_entry];
          canvas.fillStyle = this.config.colors[color] ;
          canvas.fillRect(i*this.zoom, j*this.zoom, x_grid_step * this.zoom, this.zoom);  
        }
      }
    }
  }

  update_all(all_data)
  {
    $(".sprite_layer").remove();

    let length = all_data.sprites.length;
    for (let i=0; i<length; i++)
    {
      let canvas_element = document.createElement('canvas');
      canvas_element.id =  "canvas-"+i;
      canvas_element.width = this.width;
      canvas_element.height = this.height;

      let template = `
      <div class="sprite_layer" id="${i}">
        <div class="sprite_layer_canvas"></div>
        <div class="sprite_layer_info">
          ID: #${i}<br/>
          NAME: #${i}
        </div>
        <div style="clear:both;"></div>
      </div>`;

      $("#spritelist").append(template);
      $("#"+i+" .sprite_layer_canvas").append(canvas_element);       
      $("#"+i).mouseup((e) => this.clicked_sprite = i);

      let canvas = canvas_element.getContext('2d');
      let sprite_data = all_data.sprites[i];
      let x_grid_step = 1;
      if (sprite_data.multicolor) x_grid_step = 2;

      // first fill the whole sprite with the background color
      canvas.fillStyle = this.config.colors[all_data.colors[0]];
      canvas.fillRect(0,0,this.width,this.height);

      for (let i=0; i<this.pixels_x; i=i+x_grid_step)
      {
        for (let j=0; j<this.pixels_y; j++)
        {
          let array_entry = sprite_data.pixels[j][i];

          if (array_entry != 0) // transparent
          {
            let color = sprite_data.color;
            if (array_entry != 1 && sprite_data.multicolor) color = all_data.colors[array_entry];
            canvas.fillStyle = this.config.colors[color];
            canvas.fillRect(i*this.zoom, j*this.zoom, x_grid_step * this.zoom, this.zoom);  
          }
        }
      }
    }
  }


}


