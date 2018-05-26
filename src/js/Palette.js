

class Palette
{
  

  constructor(window,config)
  {

    this.colors = config.colors;
    this.active_color = 3; // 1 = white on the c64
    this.window = window;
    
    let template = `
      <div id="palette_all_colors"></div>
      <div id="palette_spritecolors">
          <div id="palette_0">
              <p>Transparent</p>
              <div class="palette_color_item_active_colors" id="color_0" title="transparent&nbsp;(2)"></div>
          </div>
          <div id="palette_1">
              <p>Individual</p>
              <div class="palette_color_item_active_colors" id="color_1" title="individual&nbsp;color&nbsp;(1)"></div>
          </div>
          <div id="palette_2">
              <p>Multicolor 1</p>
              <div class="palette_color_item_active_colors" id="color_2" title="multicolor&nbsp;1&nbsp;(3)"></div>
          </div>
          <div id="palette_3">
              <p>Multicolor 2</p>
              <div class="palette_color_item_active_colors" id="color_3" title="multicolor&nbsp;2&nbsp;(4)"></div>
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
    $("#color_0").css("background-color",this.colors[all_data.colors[0]]);
    $("#color_1").css("background-color",this.colors[all_data.sprites[all_data.current_sprite].color]);
    $("#color_2").css("background-color",this.colors[all_data.colors[2]]);
    $("#color_3").css("background-color",this.colors[all_data.colors[3]]);

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
      $('#palette_2').show(); 
      $('#palette_3').show();  
    } else {
      $('#palette_2').hide(); 
      $('#palette_3').hide();  
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
