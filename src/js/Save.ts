
import { dom, status } from "./helper";

export default class Save {
  default_filename: any;
  savedata: any;

  constructor(public window: number, public config, public eventhandler) {
    this.config = config;
    this.window = window;
    this.default_filename = "mysprites";
    this.eventhandler = eventhandler;

    const template = `
    <div id="window-save">

      <div class="center">
        Filename: <input autofocus type="text" id="filename" name="filename" value="${this.default_filename}">
        <p>The file will be saved to your browser's default download location.</p>
      </div>
      <br/>
      <fieldset>
        <legend>Spritemate (*.spm)</legend>
        <button id="button-save-spm">Save as Spritemate</button>
        <p>JSON file format for spritemate. Recommended as long as you are not done working on the sprites.</p>
      </fieldset>
    
      <fieldset>
        <legend>Spritepad (*.spd)</legend>
        <div class="fieldset right">
          <button id="button-save-spd">Save as 2.0</button>
          <button id="button-save-spd-old">Save as 1.8.1</button>
        </div>
        <p>Choose between the 2.0 beta or the older 1.8.1 file format, which is recommended if you want to import the data in your C64 project.</p>
      </fieldset>

      <div id="button-row">
        <button id="button-save-cancel" class="button-cancel">Cancel</button>
      </div>
    </div> 
    `;

    dom.append("#window-" + this.window, template);
    $("#window-" + this.window).dialog({ show: "fade", hide: "fade" });
    dom.sel("#button-save-cancel").onclick = () => this.close_window();
    dom.sel("#button-save-spm").onclick = () => this.save_spm();
    dom.sel("#button-save-spd").onclick = () => this.save_spd("new");
    dom.sel("#button-save-spd-old").onclick = () => this.save_spd("old");

    dom.sel("#filename").onkeyup = () => {
      this.default_filename = dom.val("#filename");
      if (this.default_filename.length < 1) {
        dom.add_class("#filename", "error");

        dom.disabled("#button-save-spm", true);
        dom.add_class("#button-save-spm", "error");

        dom.disabled("#button-save-spd", true);
        dom.add_class("#button-save-spd", "error");

        dom.disabled("#button-save-spd-old", true);
        dom.add_class("#button-save-spd-old", "error");
      } else {
        dom.remove_class("#filename", "error");

        dom.disabled("#button-save-spm", false);
        dom.remove_class("#button-save-spm", "error");

        dom.disabled("#button-save-spd", false);
        dom.remove_class("#button-save-spd", "error");

        dom.disabled("#button-save-spd-old", false);
        dom.remove_class("#button-save-spd-old", "error");
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

  save_spm(): void {
    const filename = this.default_filename + ".spm";
    let data = JSON.stringify(this.savedata);
    // these regular expressions are used to make the outpult file
    // easier to read with line breaks
    data = data
      .replace(/],/g, "],\n")
      .replace(/\[\[/g, "[\n[")
      .replace(/]]/g, "]\n]");
    const file = new Blob([data], { type: "text/plain" });
    this.save_file_to_disk(file, filename);
    this.close_window();
  }

  save_spd(format): void {
    const filename = this.default_filename + ".spd";
    const hexdata = this.create_spd_array(format);
    const bytes = new Uint8Array(hexdata);
    const file = new Blob([bytes], { type: "application/octet-stream" });
    this.save_file_to_disk(file, filename);
    this.close_window();
  }

  /*

   SSSSSSSSSSSSSSS PPPPPPPPPPPPPPPPP   DDDDDDDDDDDDD        
 SS:::::::::::::::SP::::::::::::::::P  D::::::::::::DDD     
S:::::SSSSSS::::::SP::::::PPPPPP:::::P D:::::::::::::::DD   
S:::::S     SSSSSSSPP:::::P     P:::::PDDD:::::DDDDD:::::D  
S:::::S              P::::P     P:::::P  D:::::D    D:::::D 
S:::::S              P::::P     P:::::P  D:::::D     D:::::D
 S::::SSSS           P::::PPPPPP:::::P   D:::::D     D:::::D
  SS::::::SSSSS      P:::::::::::::PP    D:::::D     D:::::D
    SSS::::::::SS    P::::PPPPPPPPP      D:::::D     D:::::D
       SSSSSS::::S   P::::P              D:::::D     D:::::D
            S:::::S  P::::P              D:::::D     D:::::D
            S:::::S  P::::P              D:::::D    D:::::D 
SSSSSSS     S:::::SPP::::::PP          DDD:::::DDDDD:::::D  
S::::::SSSSSS:::::SP::::::::P          D:::::::::::::::DD   
S:::::::::::::::SS P::::::::P          D::::::::::::DDD     
 SSSSSSSSSSSSSSS   PPPPPPPPPP          DDDDDDDDDDDDD        

 */

  create_spd_array(format) {
    // SPD file format information
    // bytes 00,01,02 = "SPD"
    // byte 03 = version number of spritepad
    // byte 04 = number of sprites
    // byte 05 = number of animations
    // byte 06 = color transparent
    // byte 07 = color multicolor 1
    // byte 08 = color multicolor 2
    // byte 09 = start of sprite data
    // byte 73 = 0-3 color, 4 overlay, 7 multicolor/singlecolor
    // bytes xx = "00", "00", "01", "00" added at the end of file (SpritePad animation info)

    const data = [] as any;

    if (format == "new") {
      data.push(83, 80, 68); // the "SPD" header that identifies SPD files apparently
      data.push(1, this.savedata.sprites.length - 1, 0); // number of sprites
    }

    data.push(
      this.savedata.colors[0],
      this.savedata.colors[2],
      this.savedata.colors[3]
    ); // colors

    let byte = "";
    let bit = "";

    for (
      let j = 0;
      j < this.savedata.sprites.length;
      j++ // iterate through all sprites
    ) {
      const spritedata = [].concat.apply([], this.savedata.sprites[j].pixels); // flatten 2d array

      const is_multicolor = this.savedata.sprites[j].multicolor;
      const is_overlay = this.savedata.sprites[j].overlay;

      let stepping = 1;
      if (is_multicolor) stepping = 2; // for multicolor, half of the array data can be ignored

      // iterate through the pixel data array
      // and create a hex values based on multicolor or singlecolor
      for (let i = 0; i < spritedata.length; i = i + 8) {
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

        const hex = parseInt(byte, 2);
        data.push(hex);
        byte = "";
      }

      // finally, we add multicolor, overlay and color info for byte 64

      // bit 7 of the high nibble stands for multicolor
      let multicolor = "00";
      if (is_multicolor) multicolor = "10";

      // bit 4 of the high nibble stands for overlay
      let overlay = "00";
      if (is_overlay) overlay = "01";

      const high_nibble = multicolor + overlay;

      const low_nibble = (
        "000" + (this.savedata.sprites[j].color >>> 0).toString(2)
      ).slice(-4);

      const color_byte = parseInt(high_nibble + low_nibble, 2);
      data.push(color_byte); // should be the individual color
    }

    if (format == "new") {
      // almost done, just add some animation data crap at the end
      data.push(0, 0, 1, 0); // SpritePad animation info (currently unused)
    }

    return data;
  }

  set_save_data(savedata): void {
    this.savedata = savedata;
  }

  close_window(): void {
    $("#window-" + this.window).dialog("close");
    this.eventhandler.onLoad(); // calls "regain_keyboard_controls" method in app.js
  }
}
