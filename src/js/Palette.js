
import $ from 'jquery'

export default class Palette
{
  

  constructor(window,config)
  {

    this.colors = config.colors;
    this.active_color = 3; // 1 = white on the c64
    this.window = window;
    
    let template = `
      <div id="palette_all_colors"></div>
      <div id="palette_spritecolors">
          <div id="palette_t">
              <p>Transparent</p>
              <div class="palette_color_item_active_colors" id="color_t" title="transparent&nbsp;(2)"></div>
          </div>
          <div id="palette_i">
              <p>Individual</p>
              <div class="palette_color_item_active_colors" id="color_i" title="individual&nbsp;color&nbsp;(1)"></div>
          </div>
          <div id="palette_m1">
              <p>Multicolor 1</p>
              <div class="palette_color_item_active_colors" id="color_m1" title="multicolor&nbsp;1&nbsp;(3)"></div>
          </div>
          <div id="palette_m2">
              <p>Multicolor 2</p>
              <div class="palette_color_item_active_colors" id="color_m2" title="multicolor&nbsp;2&nbsp;(4)"></div>
          </div>
      </div>

    `;

    $("#window-"+this.window).append(template);
 
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

    // now set the right pen active
    $('#palette_spritecolors div').removeClass("palette_color_item_selected");
    $('#palette_spritecolors p').removeClass("palette_highlight_text");

    $('#color_'+all_data.pen).addClass("palette_color_item_selected");
    $('#palette_'+all_data.pen +' p').addClass("palette_highlight_text");

    this.set_multicolor(sprite_is_multicolor);
  }


  draw_palette()
  {
    /* 

    draws the colors from the config as DIVs 

    */
   
    $("#palette_all_colors").empty(); // clear all color items in case there are already some (e.g. when switching palettes)
    let x = 0;

    for (let i=0; i<this.colors.length; i++)
    {
      let picker_div = `<div class="palette_color_item" id="palette_color_`+this.colors[i]+`" title="`+this.colors[i]+`" style="background-color:`+this.colors[i]+`;"></div>`; 
      
      x++; 
      if (x == 2)
      {
        x = 0;
        picker_div += `<div style="clear:both;"></div>`; // after two colors, break to next line
      }

      $("#palette_all_colors").append(picker_div);
    }  
  }

  set_multicolor(is_multicolor)
  {
    if (is_multicolor)
    {
      $('#palette_m1').show(); 
      $('#palette_m2').show();  
    } else {
      $('#palette_m1').hide(); 
      $('#palette_m2').hide();  
    }
  }


  set_active_color(e)
  {
    let picked_color = $(e.target).prop('id').replace('palette_color_','');
    this.active_color = this.colors.indexOf(picked_color);
  }

  get_color() { return this.active_color; }

  set_colors(colors)
  {
    this.colors = colors;
    this.draw_palette();
  }

}
