

class Palette
{
  

  constructor(window,config)
  {

    this.colors = config.colors;
    this.active_color = 3; // 1 = white on the c64
    this.window = window;
  
    this.canvas_element = document.createElement('canvas');
    this.colorsquare_width = 40;
    this.colorsquare_height = 20;
    this.width = this.colorsquare_width * 2;
    this.height = this.colors.length/2 * this.colorsquare_height ;
    
    this.canvas_element.id = "palette";
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;


    let template = `
      <div id="palette_all_colors"></div>
      <div id="palette_spritecolors">
          <div id="palette_i">
              <p>Individual</p>
              <div class="palette_color_item" id="color_i"></div>
          </div>
          <div id="palette_t">
              <p>Transparent</p>
              <div class="palette_color_item" id="color_t"></div>
          </div>
          <div id="palette_m1">
              <p>Multicolor 1</p>
              <div class="palette_color_item" id="color_m1"></div>
          </div>
          <div id="palette_m2">
              <p>Multicolor 2</p>
              <div class="palette_color_item" id="color_m2"></div>
          </div>
      </div>

    `;

    $("#window-"+this.window).append(template);

    $("#palette_all_colors").append(this.canvas_element);

    this.canvas = this.canvas_element.getContext('2d');
 
    this.draw_palette();

  }


  update(all_data)
  {
    let sprite_is_multicolor = all_data.sprites[all_data.current_sprite].multicolor;

    // set the colors of the pens
    $("#color_t").css("background-color",this.colors[all_data.colors.t]);
    $("#color_i").css("background-color",this.colors[all_data.sprites[all_data.current_sprite].color]);
    $("#color_m1").css("background-color",this.colors[all_data.colors.m1]);
    $("#color_m2").css("background-color",this.colors[all_data.colors.m2]);

    // now set the rigt pen active
    $('#palette_spritecolors div').removeClass("palette_color_item_selected");
    $('#palette_spritecolors p').removeClass("palette_highlight_text");

    $('#color_'+all_data.pen).addClass("palette_color_item_selected");
    $('#palette_'+all_data.pen +' p').addClass("palette_highlight_text");

/*
    if (!sprite_is_multicolor && (all_data.pen != "m1" && all_data.pen != "m2"))
    {
      // set the active pen to the individual one when switching to singlecolor
      $('#palette_spritecolors div').removeClass("palette_color_item_selected");
      $('#palette_spritecolors p').removeClass("palette_highlight_text");
      $('#color_individual').addClass("palette_color_item_selected");
      $('#palette_individual p').addClass("palette_highlight_text");
    }
*/
    this.set_multicolor(sprite_is_multicolor);
  }


  draw_palette()
  {
   
    let x = 0;
    let y = 0;

    for (let i=0; i<this.colors.length; i++)
    {
      this.canvas.fillStyle = this.colors[i];
      this.canvas.fillRect(x*this.colorsquare_width, y*this.colorsquare_height, this.colorsquare_width, this.colorsquare_height);
      
      x++;
      if (x == 2){
        x = 0;
        y ++;
      }
    } 
  }

  set_multicolor(is_multicolor)
  {
    if (is_multicolor){
      $('#palette_m1').show(); 
      $('#palette_m2').show();  
    } else {
      $('#palette_m1').hide(); 
      $('#palette_m2').hide();  
    }
  }


  set_active_color(e)
  {
    let pos = this.findPos(this.canvas_element);
    let x = e.pageX - pos.x , y = e.pageY - pos.y;
    let c = this.canvas;
    let p = c.getImageData(x, y, 1, 1).data; 
    let hex = "#" + ("000000" + this.rgbToHex(p[0], p[1], p[2])).slice(-6);
    this.active_color = this.colors.indexOf(hex);
  }

  get_color()
  {
    return this.active_color;
  }


  findPos(obj)
  {
    let curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
  }

  rgbToHex(r, g, b)
  {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
  }

}
