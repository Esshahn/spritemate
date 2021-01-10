import { dom } from "./helper";

export default class Palette {
  colors: any = {};
  active_color: number;

  constructor(public window: number, public config) {
    this.colors = config.colors;
    this.active_color = 3; // 1 = white on the c64
    this.window = window;

    const template = `
      <div id="palette_all_colors"></div>
      <div id="palette_spritecolors">
          <div id="palette_0">
              <p>Transparent</p>
              <div class="palette_color_item_active_colors" id="color_0" title="transparent&nbsp;(1)"></div>
          </div>
          <div id="palette_1">
              <p>Individual</p>
              <div class="palette_color_item_active_colors" id="color_1" title="individual&nbsp;color&nbsp;(2)"></div>
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

    dom.append("#window-" + this.window, template);
    this.draw_palette();
  }

  update(all_data) {
    const sprite_is_multicolor =
      all_data.sprites[all_data.current_sprite].multicolor;

    // set the colors of the pens

    dom.css("#color_0", "background-color", this.colors[all_data.colors[0]]);
    dom.css(
      "#color_1",
      "background-color",
      this.colors[all_data.sprites[all_data.current_sprite].color]
    );
    dom.css("#color_2", "background-color", this.colors[all_data.colors[2]]);
    dom.css("#color_3", "background-color", this.colors[all_data.colors[3]]);

    // now set the right pen active

    dom.remove_all_class(
      "#palette_spritecolors div",
      "palette_color_item_selected"
    );
    dom.remove_all_class("#palette_spritecolors p", "palette_highlight_text");

    dom.add_class("#color_" + all_data.pen, "palette_color_item_selected");
    dom.add_class("#palette_" + all_data.pen + " p", "palette_highlight_text");

    this.set_multicolor(sprite_is_multicolor);
  }

  draw_palette() {
    /* 

    draws the colors from the config as DIVs 

    */

    // clear all color items in case there are already some (e.g. when switching palettes)
    dom.empty("#palette_all_colors");

    let x = 0;
    let picker = "";

    for (let i = 0; i < this.colors.length; i++) {
      let picker_div =
        `<div class="palette_color_item" id="palette_color_` +
        this.colors[i] +
        `" title="$` +
        i.toString(16) +
        `&nbsp;/&nbsp;` +
        this.colors[i] +
        `" style="background-color:` +
        this.colors[i] +
        `;"></div>`;

      x++;
      if (x == 2) {
        x = 0;
        picker_div += `<div style="clear:both;"></div>`; // after two colors, break to next line
      }

      picker += picker_div;
    }
    dom.html("#palette_all_colors", picker);
  }

  set_multicolor(is_multicolor) {
    if (is_multicolor) {
      dom.show("#palette_2");
      dom.show("#palette_3");
    } else {
      dom.hide("#palette_2");
      dom.hide("#palette_3");
    }
  }

  set_active_color(e) {
    let picked_color = e.target.id.replace("palette_color_", "");
    this.active_color = this.colors.indexOf(picked_color);
  }

  get_color() {
    return this.active_color;
  }

  set_colors(colors) {
    this.colors = colors;
    this.draw_palette();
  }
}
