

class Editor
{

  constructor(window,config)
  {
    this.config = config;
    this.window = window;
    this.canvas_element = document.createElement('canvas');
    this.zoom = this.config.zoom;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;
    
    this.canvas_element.id = "editor";
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;

    $("#window-"+this.window).append(this.canvas_element);

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

  draw_sprite(sprite_data)
  {

    var x_grid_step = 1;
    if (sprite_data.multicolor) x_grid_step = 2;

    for (var i=0; i<this.pixels_x; i=i+x_grid_step)
    {
      for (var j=0; j<this.pixels_y; j++)
      {
        this.canvas.fillStyle = this.config.colors[sprite_data.pixels[j][i]];
        this.canvas.fillRect(i*this.zoom, j*this.zoom, this.pixels_x * x_grid_step, this.pixels_y);  
      }
    }

    if (this.config.display_grid) this.display_grid(sprite_data);

  }

  display_grid(sprite_data)
  {
    // show a grid
    this.canvas.strokeStyle = "#666666";
    this.canvas.setLineDash([1, 1]);
    var x_grid_step = 1;
   
    if (sprite_data.multicolor) x_grid_step = 2;

    for (var i=0; i<=this.pixels_x; i=i+x_grid_step)
    {
        this.canvas.beginPath();
        this.canvas.moveTo(i*this.zoom,0);
        this.canvas.lineTo(i*this.zoom,this.height);
        this.canvas.stroke();
    }

    for (var i=0; i<=this.pixels_y; i++)
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
    var obj = this.canvas_element.getBoundingClientRect();
    var x = e.clientX - obj.left;
    var y = e.clientY - obj.top;
    var x_grid = Math.floor(x/(this.width/this.config.sprite_x));
    var y_grid = Math.floor(y/(this.height/this.config.sprite_y));
    return {x: x_grid, y: y_grid};
  }

}


