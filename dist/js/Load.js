'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Load = function () {
  function Load(config, eventhandler) {
    _classCallCheck(this, Load);

    this.config = config;
    this.eventhandler = eventhandler;
    this.setup_load_input();
  }

  _createClass(Load, [{
    key: 'setup_load_input',
    value: function setup_load_input() {
      var element = document.createElement('div');
      element.innerHTML = '<input type="file" id="input-load" style="display: none">';
      var fileInput = element.firstChild;
      document.body.append(fileInput);
      var that = this;
      fileInput.addEventListener('change', function () {
        that.read_file_data(fileInput);
      });
    }
  }, {
    key: 'read_file_data',
    value: function read_file_data(fileInput) {
      var _this = this;

      var file = fileInput.files[0];

      if (file.name.match(/\.(spm|spd|spr)$/)) {
        var reader = new FileReader();
        reader.onload = function () {
          if (file.name.match(/\.(spm)$/)) {
            _this.parse_file_spm(reader.result);
          }
          if (file.name.match(/\.(spd|spr)$/)) {
            _this.parse_file_spd(reader.result);
          }
          _this.eventhandler.onLoad();
          $('#input-load').remove(); // by removing the input field and reassigning it, reloading the same file will work
          _this.setup_load_input();
        };

        if (file.name.match(/\.(spm)$/)) {
          reader.readAsText(file);
        }

        if (file.name.match(/\.(spd|spr)$/)) {
          reader.readAsBinaryString(file);
        }
      } else {
        alert("File not supported, .spm or .spd files only");
      }
    }
  }, {
    key: 'parse_file_spm',
    value: function parse_file_spm(file) {
      this.imported_file = JSON.parse(file);
    }
  }, {
    key: 'parse_file_spd',
    value: function parse_file_spd(file, format) {
      this.file = file;

      this.start_of_sprite_data = 0;
      this.old_format = true;

      // is this the new format?
      if (this.file[0] == "S" && this.file[1] == "P" && this.file[2] == "D") {
        this.start_of_sprite_data = 6;
        this.old_format = false;
      }

      this.sprite_size = 64;

      this.create_sprite_data_object();
      for (var i = 0; i < this.number_of_sprites; i++) {
        this.convert_sprite_data_to_internal_format(i);
      }
    }
  }, {
    key: 'create_sprite_data_object',
    value: function create_sprite_data_object() {
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

      if (this.number_of_sprites == 1) {
        status(this.number_of_sprites + " sprite imported successfully.");
      } else {
        status(this.number_of_sprites + " sprites imported successfully.");
      }

      this.imported_file = {};
      this.imported_file.colors = { "t": this.color_trans, "m1": this.color_multi1, "m2": this.color_multi2 };
      this.imported_file.sprites = [];
      this.imported_file.current_sprite = 0;
      this.imported_file.pen = "i"; // can be individual = i, transparent = t, multicolor_1 = m1, multicolor_2 = m2
    }
  }, {
    key: 'convert_sprite_data_to_internal_format',
    value: function convert_sprite_data_to_internal_format(sprite_number) {

      // check byte 64 which is the indidual color (low nibble) and the multicolor state (high nibble)
      var colorpos = this.start_of_sprite_data + 2 + (sprite_number + 1) * this.sprite_size;

      this.multicolor = false;

      if (this.file.charCodeAt(colorpos) >= 128) this.multicolor = true;

      // this reads in the lower nibble of the byte and converts it do decimal. 
      this.pencolor = parseInt(this.file.charCodeAt(colorpos).toString(2).slice(-4), 2);

      var sprite = {
        color: this.pencolor,
        multicolor: this.multicolor,
        double_x: false,
        double_y: false,
        pixels: []
      };

      var binary = [];

      var begin_of_sprite_data = this.start_of_sprite_data + 3 + sprite_number * this.sprite_size;
      var end_of_sprite_data = (sprite_number + 1) * this.sprite_size + this.start_of_sprite_data + 3;

      for (var i = begin_of_sprite_data; i < end_of_sprite_data; i++) {
        // convert data in SPR file into binary
        var byte = ("0000000" + this.file.charCodeAt(i).toString(2)).slice(-8).match(/.{1,2}/g);
        for (var j = 0; j < byte.length; j++) {
          var pen = void 0;

          if (this.multicolor) {
            if (byte[j] == "00") pen = "t";
            if (byte[j] == "10") pen = "i";
            if (byte[j] == "01") pen = "m1";
            if (byte[j] == "11") pen = "m2";

            binary.push(pen);
            binary.push(pen);
          }

          if (!this.multicolor) {
            pen = "i";
            if (byte[j][0] == "0") pen = "t";
            binary.push(pen);

            pen = "i";
            if (byte[j][1] == "0") pen = "t";
            binary.push(pen);
          }
        }
      }

      var spritedata = [];
      var line = 0;
      for (var _i = 0; _i < binary.length; _i++) {
        spritedata.push(binary[_i]);
        line++;

        if (line == 24) {
          sprite.pixels.push(spritedata);
          line = 0;
          spritedata = [];
        }
      }

      this.imported_file.sprites.push(sprite);
    }
  }, {
    key: 'get_imported_file',
    value: function get_imported_file() {
      return this.imported_file;
    }
  }]);

  return Load;
}();