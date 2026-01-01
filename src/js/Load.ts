import { dom, status } from "./helper";
import { App } from './App';

export default class Load {
  imported_file: any;
  file: any;
  start_of_sprite_data: any;
  old_format: any;
  sprite_size: any;
  number_of_sprites: any;
  color_trans: any;
  color_multi1: any;
  color_multi2: any;
  multicolor: any;
  pencolor: any;
  overlay: any;
  app: App | null;

  constructor(public config, public eventhandler) {
    this.app = null;
    this.config = config;
    this.eventhandler = eventhandler;
    this.setup_load_input();
  }    

  setup_load_input() {
    this.app = (window as any).app;
    const element: any = document.createElement("div");
    element.innerHTML =
      '<input type="file" id="input-load" style="display: none">';
    const fileInput = element.firstChild;
    document.body.appendChild(fileInput);
    const that = this;
    fileInput.addEventListener("change", function () {
      that.read_file_data(fileInput);
    });
  }

  read_file_data(fileInput) {
    this.app = window.app;
    const file = fileInput.files[0];

    if (file.name.match(/\.(spm|spd|spr)$/)) {
      const reader = new FileReader();
      reader.onload = () => {
        if (file.name.match(/\.(spm)$/)) {
          this.parse_file_spm(reader.result);
        }
        if (file.name.match(/\.(spd|spr)$/)) {
          this.parse_file_spd(reader.result);
        }
        this.eventhandler.onLoad();
        // by removing the input field and reassigning it, reloading the same file will work
        document.querySelector("#input-load")?.remove();
        this.setup_load_input();
      };

      if (file.name.match(/\.(spm)$/)) {
        reader.readAsText(file);
      }

      if (file.name.match(/\.(spd|spr)$/)) {
        reader.readAsBinaryString(file);
      }

      // Extract filename without extension and update the menubar input
      const filenameWithoutExt = file.name.replace(/\.(spm|spd|spr)$/i, '');
      if (this.app) {
        this.app.set_filename(filenameWithoutExt);
      }
    } else {
      alert("File not supported, .spm, .spd or .spr files only");
    }
  }

  get_imported_file() {
    return this.imported_file;
  }

  parse_file_spm(file) {
    // the replaces are to support the older file format with t,i,m1,m2
    file = file.replace(/"t":/g, '"0":');
    file = file.replace(/"i":/g, '"1":');
    file = file.replace(/"m1":/g, '"2":');
    file = file.replace(/"m2":/g, '"3":');
    file = file.replace(/"t"/g, "0");
    file = file.replace(/"i"/g, "1");
    file = file.replace(/"m1"/g, "2");
    file = file.replace(/"m2"/g, "3");

    this.imported_file = JSON.parse(file);
    this.imported_file = this.convert_legacy_formats(this.imported_file);

    // If the file doesn't have a filename property (old format), it will be set from file.name later
    // If it does have a filename, that will be used when set_all is called
  }

  parse_file_spd(file) {
    this.file = file;

    // Detect file format based on "SPD" header
    const isNewFormat = this.file.startsWith("SPD");
    this.old_format = !isNewFormat;
    this.start_of_sprite_data = isNewFormat ? 6 : 0;

    this.sprite_size = 64;

    this.create_sprite_data_object();
    for (let i = 0; i < this.number_of_sprites; i++)
      this.convert_sprite_data_to_internal_format(i);
  }

  create_sprite_data_object() {
    // colors for transparent, multicolor 1 and multicolor 2
    this.color_trans = this.file.charCodeAt(this.start_of_sprite_data + 0);
    this.color_multi1 = this.file.charCodeAt(this.start_of_sprite_data + 1);
    this.color_multi2 = this.file.charCodeAt(this.start_of_sprite_data + 2);

    // check for number of sprites
    if (this.old_format) {
      this.number_of_sprites = (this.file.length - 3) / 64; // calculate the number
    } else {
      this.number_of_sprites = parseInt(this.file.charCodeAt(4), 10) + 1; // new format has the number stored here
    }

    if (this.number_of_sprites === 1) {
      status(this.number_of_sprites + " sprite imported successfully.");
    } else {
      status(this.number_of_sprites + " sprites imported successfully.");
    }

    this.imported_file = {};
    this.imported_file.colors = {
      0: this.color_trans,
      2: this.color_multi1,
      3: this.color_multi2,
    };
    this.imported_file.sprites = [];
    this.imported_file.current_sprite = 0;
    this.imported_file.pen = this.config.sprite_defaults.pen;
  }

  convert_sprite_data_to_internal_format(sprite_number) {
    // check byte 64 which is the indidual color (low nibble) and the multicolor state (high nibble)
    const colorpos =
      this.start_of_sprite_data + 2 + (sprite_number + 1) * this.sprite_size;

    // this is actually a good way to identify a bit
    const bits = (
      "00000000" + this.file.charCodeAt(colorpos).toString(2)
    ).slice(-8);

    this.multicolor = false;

    if (parseInt(bits[0]) === 1) this.multicolor = true;

    this.overlay = false;

    if (parseInt(bits[3]) === 1) this.overlay = true;

    // this reads in the lower nibble of the byte and converts it do decimal.
    this.pencolor = parseInt(
      this.file.charCodeAt(colorpos).toString(2).slice(-4),
      2
    );

    const sprite = {
      name: "sprite" + (sprite_number + 1),
      color: this.pencolor,
      multicolor: this.multicolor,
      double_x: false,
      double_y: false,
      overlay: this.overlay,
      pixels: [],
    };

    const binary = [] as any;

    const begin_of_sprite_data =
      this.start_of_sprite_data + 3 + sprite_number * this.sprite_size;
    const end_of_sprite_data =
      (sprite_number + 1) * this.sprite_size + this.start_of_sprite_data + 3;

    for (let i = begin_of_sprite_data; i < end_of_sprite_data; i++) {
      // convert data in SPR file into binary
      const byte: any = ("0000000" + this.file.charCodeAt(i).toString(2))
        .slice(-8)
        .match(/.{1,2}/g);
      for (let j = 0; j < byte.length; j++) {
        let pen = 0;

        if (this.multicolor) {
          if (byte[j] === "00") pen = 0;
          if (byte[j] === "10") pen = 1;
          if (byte[j] === "01") pen = 2;
          if (byte[j] === "11") pen = 3;

          binary.push(pen);
          binary.push(pen);
        }

        if (!this.multicolor) {
          pen = 1;
          if (byte[j][0] === "0") pen = 0;
          binary.push(pen);

          pen = 1;
          if (byte[j][1] === "0") pen = 0;
          binary.push(pen);
        }
      }
    }

    let spritedata = [] as any;
    let line = 0;
    for (let i = 0; i < binary.length; i++) {
      spritedata.push(binary[i]);
      line++;

      if (line === 24) {
        (sprite.pixels as any).push(spritedata);
        line = 0;
        spritedata = [];
      }
    }

    this.imported_file.sprites.push(sprite);
  }

  convert_legacy_formats(file_data) {
    // this should be called after a file has been loaded
    // it checks for older formats that might miss features
    // and adds them, so that the file is still valid

    // first will be the custom name labels

    // check if sprite object has no "name" key
    // and add it if not
    if (!file_data.sprites[0].name) {
      const number_of_sprites = file_data.sprites.length;

      for (let i = 0; i < number_of_sprites; i++) {
        file_data.sprites[i].name = "sprite" + (i + 1);
      }
    }

    // add version number to file
    // or update to latest version number
    if (!file_data.version) file_data.version = this.config.version;
    file_data.version = this.config.version;

    return file_data;
  }
}
