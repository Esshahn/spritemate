

class List
{

  constructor(window,config)
  {
    this.config = config;
    this.window = window;
    this.zoom = 2; // this.config.zoom;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;
    this.clicked_sprite = 0;
    
    // $("#spritelist").sortable();
    // $("#spritelist").disableSelection();
  }

  create_canvas(id,current_sprite)
  {
    let canvas_element = document.createElement('canvas');
    canvas_element.id = "list-" + id;
    canvas_element.width = this.pixels_x * this.zoom;
    canvas_element.height = this.pixels_y * this.zoom;
 
    $("#spritelist").append(canvas_element);
    $(canvas_element).addClass("sprite_in_list");
    
    if (current_sprite == id) $(canvas_element).addClass("sprite_in_list_selected");    

    $(canvas_element).mouseup((e) => this.clicked_sprite = id);
    $(canvas_element).mouseenter((e) => $(canvas_element).addClass("sprite_in_list_hover"));
    $(canvas_element).mouseleave((e) => $(canvas_element).removeClass("sprite_in_list_hover"));

  }


  get_clicked_sprite()
  {
    return this.clicked_sprite;
  }



  update(spritelist,current_sprite)
  {

    $(".sprite_in_list").remove();

    for (let i=0; i<spritelist.length; i++){
      this.create_canvas(i,current_sprite);

      let canvas = document.getElementById("list-" + i).getContext('2d');
      let sprite_data = spritelist[i];
      let x_grid_step = 1;
      if (sprite_data.multicolor) x_grid_step = 2;

      for (let i=0; i<this.pixels_x; i=i+x_grid_step)
      {
        for (let j=0; j<this.pixels_y; j++)
        {
          canvas.fillStyle = this.config.colors[sprite_data.pixels[j][i]];
          canvas.fillRect(i*this.zoom, j*this.zoom, this.pixels_x * x_grid_step, this.pixels_y);  
        }
      }
    }
  }



}


