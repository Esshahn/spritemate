

class List
{

  constructor(window,config)
  {
    this.config = config;
    this.window = window;
    this.zoom = this.config.zoom_list; 
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;
    this.clicked_sprite = 0;
    this.sorted_array = [];
    this.grid = true;

    let template = `
      <div class="window_menu">
        <img src="img/icon3/icon-list-new.png" id="icon-list-new" title="new sprite">
        <img src="img/icon3/icon-list-delete.png" id="icon-list-delete" title="remove sprite">
        <img src="img/icon3/icon-list-copy.png" id="icon-list-copy" title="copy sprite">
        <img src="img/icon3/icon-list-paste.png" id="icon-list-paste" title="paste sprite">
        
        <div class="right">
          <img src="img/icon3/icon-grid.png" id="icon-list-grid" title="toggle grid borders">
          <img src="img/icon3/icon-zoom-in.png" id="icon-list-zoom-in" title="zoom in"><img src="img/icon3/icon-zoom-out.png" id="icon-list-zoom-out" title="zoom out">
        </div>
      </div>
      <div id="spritelist"></div>
    `;

    $("#window-"+this.window).append(template);
    
    $("#spritelist").sortable({
      cursor:"move",
      tolerance: "pointer",
      revert: 'invalid'
    });

    // this line is ridiculous, but apparently it is needed for the sprite sorting to not screw up
    $("<style type='text/css'> .list-sprite-size{ width:"+this.width+"px; height:"+this.height+"px;} </style>").appendTo("head");

    $("#spritelist").disableSelection();
  }

  create_canvas(id,current_sprite)
  {
    let canvas_element = document.createElement('canvas');
    canvas_element.id =  id;
    canvas_element.width = this.width;
    canvas_element.height = this.height;

    /*
    var sprite_div = `<div id="sprite-${id}" class="sprite"></div>`;
    $("#spritelist").append(sprite_div);
    $("#sprite-"+id).append(canvas_element);
    */

    $("#spritelist").append(canvas_element);
    $(canvas_element).addClass("sprite_in_list");
    $(canvas_element).addClass("list-sprite-size"); // see comment in constructor
    
    if (current_sprite == id) $(canvas_element).addClass("sprite_in_list_selected");  
    if (this.grid) $(canvas_element).addClass("sprite_in_list_border");   

    $(canvas_element).mouseup((e) => {
      this.clicked_sprite = id;
    });

    $(canvas_element).mouseenter((e) => $(canvas_element).addClass("sprite_in_list_hover"));
    $(canvas_element).mouseleave((e) => $(canvas_element).removeClass("sprite_in_list_hover"));
  }


  get_clicked_sprite()
  {
    return this.clicked_sprite;
  }


  toggle_grid()
  {
    if (this.grid)
    {
      this.grid = false;
    } else {
      this.grid = true;
    }
  }


  zoom_in()
  {
    if (this.zoom <= 16)
    {
      this.zoom ++;
      this.update_zoom();
    } 
  }

  zoom_out()
  {
    if (this.zoom >= 2)
    {
     this.zoom --;
     this.update_zoom();
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

  update_zoom()
  {
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;
    $('head style:last').remove();
    $("<style type='text/css'> .list-sprite-size{ width:"+this.width+"px; height:"+this.height+"px;} </style>").appendTo("head");
  }

  update_current_sprite(all_data)
  {
    
    // this one gets called during drawing in the editor
    // because the normal update method gets too slow
    // when the sprite list is becoming longer
    let sprite_data = all_data.sprites[all_data.current_sprite];
    let canvas = document.getElementById(all_data.current_sprite).getContext('2d');

    let x_grid_step = 1;
    if (sprite_data.multicolor) x_grid_step = 2;

    // first fill the whole sprite with the background color
    canvas.fillStyle = this.config.colors[all_data.colors["t"]];
    canvas.fillRect(0,0,this.width,this.height);

    for (let i=0; i<this.pixels_x; i=i+x_grid_step)
    {
      for (let j=0; j<this.pixels_y; j++)
      {

        let array_entry = sprite_data.pixels[j][i];

        if (array_entry != "t")
        {
          let color = sprite_data.color;
          if (array_entry != "i" && sprite_data.multicolor) color = all_data.colors[array_entry];
          canvas.fillStyle = this.config.colors[color] ;
          canvas.fillRect(i*this.zoom, j*this.zoom, x_grid_step * this.zoom, this.zoom);  
        }
      }
    }
  }

  update(all_data)
  {
    $('#window-'+this.window).dialog('option', 'title', 'sprite ' + (all_data.current_sprite + 1) + " of " + all_data.sprites.length);
    $(".sprite_in_list").remove();

    let length = all_data.sprites.length;
    for (let i=0; i<length; i++)
    {
      this.create_canvas(i,all_data.current_sprite);

      let canvas = document.getElementById(i).getContext('2d');
      let sprite_data = all_data.sprites[i];
      let x_grid_step = 1;
      if (sprite_data.multicolor) x_grid_step = 2;

      // first fill the whole sprite with the background color
      canvas.fillStyle = this.config.colors[all_data.colors["t"]];
      canvas.fillRect(0,0,this.width,this.height);

      for (let i=0; i<this.pixels_x; i=i+x_grid_step)
      {
        for (let j=0; j<this.pixels_y; j++)
        {

          let array_entry = sprite_data.pixels[j][i];

          if (array_entry != "t")
          {
            let color = sprite_data.color;
            if (array_entry != "i" && sprite_data.multicolor) color = all_data.colors[array_entry];
            canvas.fillStyle = this.config.colors[color] ;
            canvas.fillRect(i*this.zoom, j*this.zoom, x_grid_step * this.zoom, this.zoom);  
          }
        }
      }
    }
  }

}


