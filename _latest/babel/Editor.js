

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

    for (var i=0; i<this.pixels_x; i++)
    {
      for (var j=0; j<this.pixels_y; j++)
      {
        this.canvas.fillStyle = sprite_data[j][i];
        this.canvas.fillRect(i*this.zoom, j*this.zoom, this.pixels_x, this.pixels_y);  
      }
    }

    if (this.config.display_grid) this.display_grid();

  }

  display_grid()
  {
    // show a grid
    this.canvas.strokeStyle = "#aaaaaa";
    this.canvas.setLineDash([1, 1]);
    for (var i=0; i<=this.pixels_x; i++)
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


  get_pixel(x,y)
  // input: x,y position of the mouse inside the editor window in pixels
  // output: x,y position in the sprite grid
  {
    var x_grid = Math.floor(x/(this.width/this.config.sprite_x));
    var y_grid = Math.floor(y/(this.height/this.config.sprite_y));
    return {x: x_grid, y: y_grid};
  }

}


