
import { dom, status } from "./helper";
import JSZip from "jszip";

export default class Export {
  default_filename: any;
  savedata: any;

  constructor(public window: number, public config, public eventhandler) {
    this.config = config;
    this.window = window;
    this.default_filename = "mysprites";
    this.eventhandler = eventhandler;

    const template = `
    <div id="window-export">

      <div class="center">
        Filename: <input autofocus type="text" id="export-filename" name="filename" value="${this.default_filename}">
        <p>The file will be saved to your browser's default download location.</p>
      </div>
      <br/>
      <fieldset>
        <legend>Assembly code (*.txt)</legend>
        <div class="fieldset right">
          <button id="button-export-source-kick">KICK ASS (hex)</button>
          <button id="button-export-source-kick-binary">KICK ASS (binary)</button>
          <button id="button-export-source-acme">ACME (hex)</button>
          <button id="button-export-source-acme-binary">ACME (binary)</button>
        </div>
        <p>A text file containing the sprite data in assembly language. KICK ASS and ACME are compilers with slightly different syntax. Choose "hex" to save a byte like $01 or "binary" for %00000001.</p>
      </fieldset>

      <fieldset>
        <legend>BASIC (*.bas)</legend>
        <button id="button-export-basic">Save as BASIC 2.0</button>
        <p>A BASIC 2.0 text file that you can copy & paste into VICE.</p>
      </fieldset>

      <fieldset>
        <legend>Image (*.png)</legend>
        <div class="fieldset right">
          <button id="button-export-png-current">Save current sprite</button>
          <button id="button-export-png-all">Save all sprites</button>
        </div>
        <p>Export sprites as PNG images. "Current sprite" saves the selected sprite, "All sprites" saves all sprites in a ZIP file.</p>
      </fieldset>

      <fieldset>
        <legend>Spritesheet (*.png)</legend>
        <div class="center">
          <span id="spritesheet-info">0 sprites</span><br/>
          Rows: <input type="number" id="spritesheet-rows" name="rows" value="1" min="1" style="width: 60px;">
          <span id="spritesheet-layout"></span><br/>
          <label><input type="checkbox" id="spritesheet-border" name="border"> 1 pixel border</label>
        </div>
        <button id="button-export-spritesheet">Save as Spritesheet</button>
        <p>Export all sprites as a single spritesheet image. Sprites are arranged in rows with optional 1 pixel spacing.</p>
      </fieldset>

      <div id="button-row">
        <button id="button-export-cancel" class="button-cancel">Cancel</button>
      </div>
    </div>
    `;

    dom.append("#window-" + this.window, template);
    dom.sel("#button-export-cancel").onclick = () => this.close_window();
    dom.sel("#button-export-source-kick").onclick = () =>
      this.save_assembly("kick", false);
    dom.sel("#button-export-source-kick-binary").onclick = () =>
      this.save_assembly("kick", true);
    dom.sel("#button-export-source-acme").onclick = () =>
      this.save_assembly("acme", false);
    dom.sel("#button-export-source-acme-binary").onclick = () =>
      this.save_assembly("acme", true);
    dom.sel("#button-export-basic").onclick = () => this.save_basic();
    dom.sel("#button-export-png-current").onclick = () => this.save_png_current();
    dom.sel("#button-export-png-all").onclick = () => this.save_png_all();
    dom.sel("#button-export-spritesheet").onclick = () => this.save_spritesheet();

    // Spritesheet controls
    dom.sel("#spritesheet-rows").oninput = () => this.update_spritesheet_info();
    dom.sel("#spritesheet-border").onchange = () => this.update_spritesheet_info();

    dom.sel("#export-filename").onkeyup = () => {
      this.default_filename = dom.val("#export-filename");
      if (this.default_filename.length < 1) {
        dom.add_class("#export-filename", "error");

        dom.disabled("#button-export-source-kick", true);
        dom.add_class("#button-export-source-kick", "error");

        dom.disabled("#button-export-source-kick-binary", true);
        dom.add_class("#button-export-source-kick-binary", "error");

        dom.disabled("#button-export-source-acme", true);
        dom.add_class("#button-export-source-acme", "error");

        dom.disabled("#button-export-source-acme-binary", true);
        dom.add_class("#button-export-source-acme-binary", "error");

        dom.disabled("#button-export-basic", true);
        dom.add_class("#button-export-basic", "error");

        dom.disabled("#button-export-png-current", true);
        dom.add_class("#button-export-png-current", "error");

        dom.disabled("#button-export-png-all", true);
        dom.add_class("#button-export-png-all", "error");

        dom.disabled("#button-export-spritesheet", true);
        dom.add_class("#button-export-spritesheet", "error");
      } else {
        dom.remove_class("#export-filename", "error");

        dom.disabled("#button-export-source-kick", false);
        dom.remove_class("#button-export-source-kick", "error");

        dom.disabled("#button-export-source-kick-binary", false);
        dom.remove_class("#button-export-source-kick-binary", "error");

        dom.disabled("#button-export-source-acme", false);
        dom.remove_class("#button-export-source-acme", "error");

        dom.disabled("#button-export-source-acme-binary", false);
        dom.remove_class("#button-export-source-acme-binary", "error");

        dom.disabled("#button-export-basic", false);
        dom.remove_class("#button-export-basic", "error");

        dom.disabled("#button-export-png-current", false);
        dom.remove_class("#button-export-png-current", "error");

        dom.disabled("#button-export-png-all", false);
        dom.remove_class("#button-export-png-all", "error");

        dom.disabled("#button-export-spritesheet", false);
        dom.remove_class("#button-export-spritesheet", "error");
      }
    };
  }

  // https://stackoverflow.com/questions/13405129/javascript-create-and-save-file

  save_file_to_disk(file, filename): void {
    if ((window.navigator as any).msSaveOrOpenBlob)
      // IE10+
      (window.navigator as any).msSaveOrOpenBlob(file, filename);
    else {
      // Others
      const a = document.createElement("a"),
        url = URL.createObjectURL(file);
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
    dom.html("#menubar-filename-name", filename);
  }

  save_assembly(format, encode_as_binary): void {
    const filename = this.default_filename + ".txt";
    const data = this.create_assembly(format, encode_as_binary);
    const file = new Blob([data], { type: "text/plain" });
    this.save_file_to_disk(file, filename);
    this.close_window();
  }

  save_basic(): void {
    const filename = this.default_filename + ".bas";
    const data = this.create_basic();
    const file = new Blob([data], { type: "text/plain" });
    this.save_file_to_disk(file, filename);
    this.close_window();
  }

  save_png_current(): void {
    const sprite_index = this.savedata.current_sprite;
    const sprite = this.savedata.sprites[sprite_index];
    const filename = `${this.default_filename}_sprite_${sprite_index}.png`;

    const canvas = this.renderSpriteToCanvas(sprite, this.savedata);
    canvas.toBlob((blob) => {
      if (blob) {
        this.save_file_to_disk(blob, filename);
      }
    });
    this.close_window();
  }

  async save_png_all(): Promise<void> {
    const sprites = this.savedata.sprites;
    const zip = new JSZip();

    // Create a promise for each sprite to be added to the ZIP
    const promises = sprites.map((sprite, index) => {
      return new Promise<void>((resolve) => {
        const filename = `sprite_${index}.png`;
        const canvas = this.renderSpriteToCanvas(sprite, this.savedata);

        canvas.toBlob((blob) => {
          if (blob) {
            zip.file(filename, blob);
          }
          resolve();
        });
      });
    });

    // Wait for all sprites to be processed
    await Promise.all(promises);

    // Generate the ZIP file and download it
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const zipFilename = `${this.default_filename}_all_sprites.zip`;
    this.save_file_to_disk(zipBlob, zipFilename);

    this.close_window();
  }

  update_spritesheet_info(): void {
    if (!this.savedata) return;

    const totalSprites = this.savedata.sprites.length;
    const rowsValue = dom.val("#spritesheet-rows");
    const rows = Math.max(1, parseInt(rowsValue || "1") || 1);
    const spritesPerRow = Math.ceil(totalSprites / rows);

    // Update sprite count
    dom.html("#spritesheet-info", `${totalSprites} sprite${totalSprites !== 1 ? 's' : ''}`);

    // Calculate actual layout
    let layoutText = "";
    if (totalSprites > 0) {
      const fullRows = Math.floor(totalSprites / spritesPerRow);
      const lastRowSprites = totalSprites % spritesPerRow;

      if (rows === 1) {
        layoutText = ` (${totalSprites} columns)`;
      } else {
        if (lastRowSprites === 0) {
          layoutText = ` (${rows} rows × ${spritesPerRow} columns)`;
        } else {
          layoutText = ` (${fullRows} rows × ${spritesPerRow} columns, 1 row × ${lastRowSprites} columns)`;
        }
      }
    }

    dom.html("#spritesheet-layout", layoutText);
  }

  save_spritesheet(): void {
    const sprites = this.savedata.sprites;
    const totalSprites = sprites.length;

    if (totalSprites === 0) {
      status("No sprites to export.");
      return;
    }

    const rowsValue = dom.val("#spritesheet-rows");
    const rows = Math.max(1, parseInt(rowsValue || "1") || 1);
    const hasBorder = (dom.sel("#spritesheet-border") as HTMLInputElement).checked;
    const borderSize = hasBorder ? 1 : 0;

    const spritesPerRow = Math.ceil(totalSprites / rows);

    const spriteWidth = this.config.sprite_x;
    const spriteHeight = this.config.sprite_y;

    // Calculate canvas dimensions
    const canvasWidth = spritesPerRow * spriteWidth + (spritesPerRow - 1) * borderSize;
    const canvasHeight = rows * spriteHeight + (rows - 1) * borderSize;

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      status("Failed to create spritesheet canvas.");
      return;
    }

    // Fill with transparent background
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Render each sprite onto the spritesheet
    sprites.forEach((sprite: any, index: number) => {
      const row = Math.floor(index / spritesPerRow);
      const col = index % spritesPerRow;

      const x = col * (spriteWidth + borderSize);
      const y = row * (spriteHeight + borderSize);

      const spriteCanvas = this.renderSpriteToCanvas(sprite, this.savedata);
      ctx.drawImage(spriteCanvas, x, y);
    });

    const filename = `${this.default_filename}_spritesheet.png`;
    canvas.toBlob((blob) => {
      if (blob) {
        this.save_file_to_disk(blob, filename);
      }
    });

    this.close_window();
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
          ctx.fillRect(
            i * zoom,
            j * zoom,
            x_grid_step * zoom,
            zoom
          );
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

  create_assembly(format, encode_as_binary) {
    let comment = "; ";
    let prefix = "!";
    let label_suffix = "";

    if (format == "kick") {
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

      data += "\n\n" + comment + "sprite " + j;
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
        if (i % line_breaks_after == 0) {
          data = data.substring(0, data.length - 1);
          data += "\n" + prefix + "byte ";
        }

        for (let k = 0; k < 8; k = k + stepping) {
          const pen = spritedata[i + k];

          if (is_multicolor) {
            if (pen == 0) bit = "00";
            if (pen == 1) bit = "10";
            if (pen == 2) bit = "01";
            if (pen == 3) bit = "11";
          }

          if (!is_multicolor) {
            bit = "1";
            if (pen == 0) bit = "0";
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

  create_basic() {
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
        if (i % 128 == 0) {
          data += "\n" + line_number + " data ";
          line_number += line_inc;
        }

        for (let k = 0; k < 8; k = k + stepping) {
          const pen = spritedata[i + k];

          if (is_multicolor) {
            if (pen == 0) bit = "00";
            if (pen == 1) bit = "10";
            if (pen == 2) bit = "01";
            if (pen == 3) bit = "11";
          }

          if (!is_multicolor) {
            bit = "1";
            if (pen == 0) bit = "0";
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

  set_save_data(savedata): void {
    this.savedata = savedata;
    this.update_spritesheet_info();
  }

  close_window(): void {
    const dialogElement = document.querySelector(`#dialog-window-${this.window}`) as HTMLDialogElement;
    if (dialogElement) {
      dialogElement.close();
    }
    this.eventhandler.onLoad(); // calls "regain_keyboard_controls" method in app.js
  }
}
