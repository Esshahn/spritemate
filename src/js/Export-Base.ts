import { dom, status } from "./helper";

/**
 * Base class for all export functionality
 * Contains shared methods for file saving and data conversion
 */
export default class ExportBase {
  savedata: any;
  app: any;
  config: any;
  eventhandler: any;

  constructor(app: any, config: any, eventhandler: any) {
    this.app = app;
    this.config = config;
    this.eventhandler = eventhandler;
  }

  // https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
  save_file_to_disk(file: Blob, filename: string): void {
    if ((window.navigator as any).msSaveOrOpenBlob) {
      // IE10+
      (window.navigator as any).msSaveOrOpenBlob(file, filename);
    } else {
      // Others
      const a = document.createElement("a");
      const url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }

    status("File has been saved.");
  }

  set_save_data(savedata: any): void {
    this.savedata = savedata;
  }

  get_filename(): string {
    return this.app.get_filename();
  }

  renderSpriteToCanvas(sprite: any, all_data: any): HTMLCanvasElement {
    const zoom = 1; // Export at 1:1 pixel ratio (no zoom)
    const pixels_x = this.config.sprite_x;
    const pixels_y = this.config.sprite_y;
    const width = pixels_x * zoom;
    const height = pixels_y * zoom;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return canvas;
    }

    let x_grid_step = 1;
    if (sprite.multicolor) x_grid_step = 2;

    // Fill with background color
    ctx.fillStyle = this.config.colors[all_data.colors[0]];
    ctx.fillRect(0, 0, width, height);

    // Draw sprite pixels
    for (let i = 0; i < pixels_x; i = i + x_grid_step) {
      for (let j = 0; j < pixels_y; j++) {
        const array_entry = sprite.pixels[j][i];

        if (array_entry != 0) {
          let color = sprite.color;
          if (array_entry != 1 && sprite.multicolor) {
            color = all_data.colors[array_entry];
          }
          ctx.fillStyle = this.config.colors[color];
          ctx.fillRect(i * zoom, j * zoom, x_grid_step * zoom, zoom);
        }
      }
    }

    return canvas;
  }

  /*

               AAA                 SSSSSSSSSSSSSSS MMMMMMMM               MMMMMMMM
              A:::A              SS:::::::::::::::SM:::::::M             M:::::::M
             A:::::A            S:::::SSSSSS::::::SM::::::::M           M::::::::M
            A:::::::A           S:::::S     SSSSSSSM:::::::::M         M:::::::::M
           A:::::::::A          S:::::S            M::::::::::M       M::::::::::M
          A:::::A:::::A         S:::::S            M:::::::::::M     M:::::::::::M
         A:::::A A:::::A         S::::SSSS         M:::::::M::::M   M::::M:::::::M
        A:::::A   A:::::A         SS::::::SSSSS    M::::::M M::::M M::::M M::::::M
       A:::::A     A:::::A          SSS::::::::SS  M::::::M  M::::M::::M  M::::::M
      A:::::AAAAAAAAA:::::A            SSSSSS::::S M::::::M   M:::::::M   M::::::M
     A:::::::::::::::::::::A                S:::::SM::::::M    M:::::M    M::::::M
    A:::::AAAAAAAAAAAAA:::::A               S:::::SM::::::M     MMMMM     M::::::M
   A:::::A             A:::::A  SSSSSSS     S:::::SM::::::M               M::::::M
  A:::::A               A:::::A S::::::SSSSSS:::::SM::::::M               M::::::M
 A:::::A                 A:::::AS:::::::::::::::SS M::::::M               M::::::M
AAAAAAA                   AAAAAAASSSSSSSSSSSSSSS   MMMMMMMM               MMMMMMMM


 */

  create_assembly(format: string, encode_as_binary: boolean): string {
    let comment = "; ";
    let prefix = "!";
    let label_suffix = "";

    if (format === "kick") {
      comment = "// ";
      prefix = ".";
      label_suffix = ":";
    }

    let data = "";

    data +=
      "\n" +
      comment +
      this.savedata.sprites.length +
      " sprites generated with spritemate on " +
      new Date().toLocaleString();
    if (!encode_as_binary)
      data +=
        "\n" +
        comment +
        "Byte 64 of each sprite contains multicolor (high nibble) & color (low nibble) information";

    data +=
      "\n\nLDA #$" +
      ("0" + this.savedata.colors[2].toString(16)).slice(-2) +
      " " +
      comment +
      "sprite multicolor 1";
    data += "\nSTA $D025";
    data +=
      "\nLDA #$" +
      ("0" + this.savedata.colors[3].toString(16)).slice(-2) +
      " " +
      comment +
      "sprite multicolor 2";
    data += "\nSTA $D026";
    data += "\n";

    let byte = "";
    let bit = "";

    for (
      let j = 0;
      j < this.savedata.sprites.length;
      j++ // iterate through all sprites
    ) {
      const spritedata = [].concat.apply([], this.savedata.sprites[j].pixels); // flatten 2d array
      const is_multicolor = this.savedata.sprites[j].multicolor;
      let stepping = 1;
      if (is_multicolor) stepping = 2; // for multicolor, half of the array data can be ignored
      const line_breaks_after = encode_as_binary ? 24 : 64;

      data += "\n\n" + comment + "sprite " + (j + 1);
      if (is_multicolor) {
        data += " / " + "multicolor";
      } else {
        data += " / " + "singlecolor";
      }

      data +=
        " / color: " +
        "$" +
        ("0" + this.savedata.sprites[j].color.toString(16)).slice(-2);
      data += "\n" + this.savedata.sprites[j].name + label_suffix + "\n";

      // iterate through the pixel data array
      // and create a hex or binary values based on multicolor or singlecolor
      for (let i = 0; i < spritedata.length; i = i + 8) {
        if (i % line_breaks_after === 0) {
          data = data.substring(0, data.length - 1);
          data += "\n" + prefix + "byte ";
        }

        for (let k = 0; k < 8; k = k + stepping) {
          const pen = spritedata[i + k];

          if (is_multicolor) {
            if (pen === 0) bit = "00";
            if (pen === 1) bit = "10";
            if (pen === 2) bit = "01";
            if (pen === 3) bit = "11";
          }

          if (!is_multicolor) {
            bit = "1";
            if (pen === 0) bit = "0";
          }

          byte = byte + bit;
        }

        if (encode_as_binary) {
          data += "%" + byte + ",";
        } else {
          const hex = parseInt(byte, 2).toString(16);
          data += "$" + ("0" + hex).slice(-2) + ",";
        }
        byte = "";
      }

      if (encode_as_binary) {
        data = data.substring(0, data.length - 1);
      } else {
        // finally, we add multicolor and color info for byte 64
        let high_nibble = "0000";
        if (is_multicolor) high_nibble = "1000";

        const low_nibble = (
          "000" + (this.savedata.sprites[j].color >>> 0).toString(2)
        ).slice(-4);

        const color_byte =
          "$" +
          ("0" + parseInt(high_nibble + low_nibble, 2).toString(16)).slice(-2);
        data += color_byte; // should be the individual color
      }
    }

    return data;
  }

  /*

BBBBBBBBBBBBBBBBB               AAA                 SSSSSSSSSSSSSSS IIIIIIIIII      CCCCCCCCCCCCC
B::::::::::::::::B             A:::A              SS:::::::::::::::SI::::::::I   CCC::::::::::::C
B::::::BBBBBB:::::B           A:::::A            S:::::SSSSSS::::::SI::::::::I CC:::::::::::::::C
BB:::::B     B:::::B         A:::::::A           S:::::S     SSSSSSSII::::::IIC:::::CCCCCCCC::::C
  B::::B     B:::::B        A:::::::::A          S:::::S              I::::I C:::::C       CCCCCC
  B::::B     B:::::B       A:::::A:::::A         S:::::S              I::::IC:::::C
  B::::BBBBBB:::::B       A:::::A A:::::A         S::::SSSS           I::::IC:::::C
  B:::::::::::::BB       A:::::A   A:::::A         SS::::::SSSSS      I::::IC:::::C
  B::::BBBBBB:::::B     A:::::A     A:::::A          SSS::::::::SS    I::::IC:::::C
  B::::B     B:::::B   A:::::AAAAAAAAA:::::A            SSSSSS::::S   I::::IC:::::C
  B::::B     B:::::B  A:::::::::::::::::::::A                S:::::S  I::::IC:::::C
  B::::B     B:::::B A:::::AAAAAAAAAAAAA:::::A               S:::::S  I::::I C:::::C       CCCCCC
BB:::::BBBBBB::::::BA:::::A             A:::::A  SSSSSSS     S:::::SII::::::IIC:::::CCCCCCCC::::C
B:::::::::::::::::BA:::::A               A:::::A S::::::SSSSSS:::::SI::::::::I CC:::::::::::::::C
B::::::::::::::::BA:::::A                 A:::::AS:::::::::::::::SS I::::::::I   CCC::::::::::::C
BBBBBBBBBBBBBBBBBAAAAAAA                   AAAAAAASSSSSSSSSSSSSSS   IIIIIIIIII      CCCCCCCCCCCCC

 */

  create_basic(): string {
    let line_number = 10;
    const line_inc = 10;
    let data = "";
    const max_sprites = Math.min(8, this.savedata.sprites.length); // display up to 8 sprites

    data += line_number + " print chr$(147)";
    line_number += line_inc;
    data += "\n" + line_number + ' print "generated with spritemate"';
    line_number += line_inc;
    data +=
      "\n" +
      line_number +
      ' print "' +
      max_sprites +
      " of " +
      this.savedata.sprites.length +
      ' sprites displayed."';
    line_number += line_inc;
    data +=
      "\n" +
      line_number +
      " poke 53285," +
      this.savedata.colors[2] +
      ": rem multicolor 1";
    line_number += line_inc;
    data +=
      "\n" +
      line_number +
      " poke 53286," +
      this.savedata.colors[3] +
      ": rem multicolor 2";
    line_number += line_inc;
    data +=
      "\n" + line_number + " poke 53269,255 : rem set all 8 sprites visible";
    line_number += line_inc;
    data +=
      "\n" +
      line_number +
      " for x=12800 to 12800+" +
      (this.savedata.sprites.length * 64 - 1) +
      ": read y: poke x,y: next x: rem sprite generation";
    line_number += line_inc;

    let multicolor_byte = 0;
    let double_x_byte = 0;
    let double_y_byte = 0;

    for (
      let j = 0;
      j < max_sprites;
      j++ // iterate through all sprites
    ) {
      data += "\n" + line_number + " :: rem " + this.savedata.sprites[j].name;
      line_number += line_inc;
      data +=
        "\n" +
        line_number +
        " poke " +
        (53287 + j) +
        "," +
        this.savedata.sprites[j].color +
        ": rem color = " +
        this.savedata.sprites[j].color;
      line_number += line_inc;

      data +=
        "\n" +
        line_number +
        " poke " +
        (2040 + j) +
        "," +
        (200 + j) +
        ": rem pointer";
      line_number += line_inc;

      let xpos = j * 48 + 24 + 20;
      let ypos = 120;

      if (j >= 4) {
        xpos -= 4 * 48;
        ypos += 52;
      }

      data +=
        "\n" +
        line_number +
        " poke " +
        (53248 + j * 2) +
        ", " +
        xpos +
        ": rem x pos";
      line_number += line_inc;

      data +=
        "\n" +
        line_number +
        " poke " +
        (53249 + j * 2) +
        ", " +
        ypos +
        ": rem y pos";
      line_number += line_inc;

      // this bit manipulation is brilliant Ingo
      if (this.savedata.sprites[j].multicolor)
        multicolor_byte = multicolor_byte | (1 << j);
      if (this.savedata.sprites[j].double_x)
        double_x_byte = double_x_byte | (1 << j);
      if (this.savedata.sprites[j].double_y)
        double_y_byte = double_y_byte | (1 << j);
    }

    data +=
      "\n" +
      line_number +
      " poke 53276, " +
      multicolor_byte +
      ": rem multicolor";
    line_number += line_inc;
    data +=
      "\n" + line_number + " poke 53277, " + double_x_byte + ": rem width";
    line_number += line_inc;
    data +=
      "\n" + line_number + " poke 53271, " + double_y_byte + ": rem height";
    line_number += line_inc;

    let byte = "";
    let bit = "";

    line_number = 1000;
    for (
      let j = 0;
      j < this.savedata.sprites.length;
      j++ // iterate through all sprites
    ) {
      const spritedata = [].concat.apply([], this.savedata.sprites[j].pixels); // flatten 2d array
      const is_multicolor = this.savedata.sprites[j].multicolor;
      let stepping = 1;
      if (is_multicolor) stepping = 2; // for multicolor, half of the array data can be ignored

      data += "\n" + line_number + " :: rem " + this.savedata.sprites[j].name;
      line_number += line_inc;

      if (is_multicolor) {
        data += " / " + "multicolor";
      } else {
        data += " / " + "singlecolor";
      }

      data += " / color: " + this.savedata.sprites[j].color;

      // iterate through the pixel data array
      // and create a hex values based on multicolor or singlecolor
      for (let i = 0; i < spritedata.length; i = i + 8) {
        if (i % 128 === 0) {
          data += "\n" + line_number + " data ";
          line_number += line_inc;
        }

        for (let k = 0; k < 8; k = k + stepping) {
          const pen = spritedata[i + k];

          if (is_multicolor) {
            if (pen === 0) bit = "00";
            if (pen === 1) bit = "10";
            if (pen === 2) bit = "01";
            if (pen === 3) bit = "11";
          }

          if (!is_multicolor) {
            bit = "1";
            if (pen === 0) bit = "0";
          }

          byte = byte + bit;
        }

        const hex = parseInt(byte, 2).toString(10);
        data += hex + ",";
        byte = "";
      }

      // finally, we add multicolor and color info for byte 64
      let high_nibble = "0000";
      if (is_multicolor) high_nibble = "1000";

      const low_nibble = (
        "000" + (this.savedata.sprites[j].color >>> 0).toString(2)
      ).slice(-4);

      const color_byte = parseInt(high_nibble + low_nibble, 2).toString(10);
      data += color_byte; // should be the individual color
    }

    data += "\n";
    data = data.replace(/,\n/g, "\n"); // removes all commas at the end of a DATA line

    return data;
  }
}
