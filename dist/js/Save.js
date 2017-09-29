"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Save = function () {
  function Save(window, config) {
    var _this = this;

    _classCallCheck(this, Save);

    this.config = config;
    this.window = window;

    var template = "\n    <div id=\"window-save\">\n      <h1 autofocus>Save Data</h1>\n      <h2>The file will be saved to your default download location</h2>\n      <br/>\n      <fieldset>\n        <legend>Spritemate // *.spm</legend>\n        <button id=\"button-save-spm\">Save as Spritemate *.spm</button>\n        <p>The natural format for Spritemate. Recommended as long as you are not done working on the sprites.</p>\n      </fieldset>\n    \n      <fieldset>\n        <legend>Spritepad // *.spd</legend>\n        <button id=\"button-save-spd\">Save as Spritepad *.spd</button>\n        <p>Most common Sprite editing software on Windows.</p>\n      </fieldset>\n  <!--\n      <fieldset>\n        <legend>Binary // *.bin</legend>\n        <button id=\"button-save\">Save as Binary *.bin</button>\n        <p>Ready to use binary data.</p>\n      </fieldset>\n\n      <fieldset>\n        <legend>ACME Source // *.asm</legend>\n        <button id=\"button-save\">Save as ACME *.asm</button>\n        <p>Compilable source code for ACME assembler.</p>  \n      </fieldset>\n    -->\n      <div id=\"button-row\">\n        <button id=\"button-save-cancel\" class=\"button-cancel\">Cancel</button>\n      </div>\n    </div> \n    ";

    $("#window-" + this.window).append(template);
    $("#window-" + this.window).dialog({ show: 'fade', hide: 'fade' });
    $('#button-save-cancel').mouseup(function (e) {
      return $("#window-" + _this.window).dialog("close");
    });
    $('#button-save-spm').mouseup(function (e) {
      return _this.save_spm(_this.savedata, 'myfilename.spm');
    });
    $('#button-save-spd').mouseup(function (e) {
      return _this.save_spd('myfilename.spd');
    });
  }

  // https://stackoverflow.com/questions/13405129/javascript-create-and-save-file

  _createClass(Save, [{
    key: "save_spm",
    value: function save_spm(data, filename, type) {

      var file = new Blob([JSON.stringify(data)], { type: "text/plain" });
      if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);else {
        // Others
        var a = document.createElement("a"),
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

      $("#window-" + this.window).dialog("close");
    }
  }, {
    key: "save_spd",
    value: function save_spd(filename) {
      var hexdata = this.create_spd_array();

      var bytes = new Uint8Array(hexdata);

      var file = new Blob([bytes], { type: "application/octet-stream" });

      if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);else {
        // Others
        var a = document.createElement("a"),
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

      $("#window-" + this.window).dialog("close");
    }
  }, {
    key: "create_spd_array",
    value: function create_spd_array() {

      // WIZBALL!!
      // var data = new Array(83,80,68,1,0,16,0,11,1,0,0,0,0,255,0,3,254,192,3,105,128,13,20,224,13,52,224,14,235,208,62,190,168,59,215,232,45,65,120,52,0,28,45,65,116,43,215,212,58,189,84,10,150,80,10,169,80,14,150,80,2,169,64,2,85,64,0,149,0,0,0,0,133,0,24,40,125,72,104,68,56,43,88,48,64,62,108,112,59,84,39,39,42,127,83,107,70,58,46,92,53,67,63,111,122,61,87,2,2,2,3,3,3,3,3,2,2,4,5,8,3,8,3,3,128,128,128,128,128,144,128,128,128,144,128,128,128,144,128,128,128);

      // SPD file format information
      // bytes 00,01,02 = "SPD"
      // byte 03 = 
      // byte 04 = number of sprites
      // byte 05 =
      // byte 06 = color transparent
      // byte 07 = color multicolor 1
      // byte 08 = color multicolor 2
      // byte 09 = start of sprite data
      // byte 73 = multicolor (high nibble) and color individual (low nibble)

      var data = [];
      data.push(83, 80, 68); // the "SPD" header that identifies SPD files apparently
      data.push(0, this.savedata.sprites.length - 1, 0); // what do these bytes do in Spritepad?
      data.push(this.savedata.colors.t, this.savedata.colors.m1, this.savedata.colors.m2);
      for (var i = 0; i < 63; i++) {
        data.push(Math.floor(Math.random() * 255)); // 63 bytes of sprite data
      }
      data.push(4); // should be the individual color

      return data;
    }
  }, {
    key: "set_save_data",
    value: function set_save_data(savedata) {
      this.savedata = savedata;
    }
  }]);

  return Save;
}();