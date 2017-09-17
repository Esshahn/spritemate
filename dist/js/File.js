"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var File = function () {
  function File(window, config) {
    var _this = this;

    _classCallCheck(this, File);

    this.config = config;
    this.window = window;

    var template = "\n    <div id=\"window-save\">\n      <h1 autofocus>Save Data</h1>\n      <h2>The file will be saved to your default download location</h2>\n      <fieldset>\n        <legend>Spritemate // *.spm</legend>\n        <button id=\"button-save-spm\">Save as Spritemate *.spm</button>\n        <p>The natural format for Spritemate. Recommended as long as you are not done working on the sprites.</p>\n      </fieldset>\n    <!--\n      <fieldset>\n        <legend>Spritepad // *.spr</legend>\n        <button id=\"button-save\">Save as Spritepad *.spr</button>\n        <p>Most common Sprite editing software on Windows.</p>\n      </fieldset>\n\n      <fieldset>\n        <legend>Binary // *.bin</legend>\n        <button id=\"button-save\">Save as Binary *.bin</button>\n        <p>Ready to use binary data.</p>\n      </fieldset>\n\n      <fieldset>\n        <legend>ACME Source // *.asm</legend>\n        <button id=\"button-save\">Save as ACME *.asm</button>\n        <p>Compilable source code for ACME assembler.</p>  \n      </fieldset>\n    -->\n      <div id=\"button-row\">\n        <button id=\"button-save-cancel\" class=\"button-cancel\">Cancel</button>\n      </div>\n    </div>\n\n    \n    ";
    $("#window-" + this.window).append(template);

    $("#window-" + this.window).dialog({ show: 'fade', hide: 'fade' });
    $('#button-save-cancel').mouseup(function (e) {
      return $("#window-" + _this.window).dialog("close");
    });
    $('#button-save-spm').mouseup(function (e) {
      return _this.save_spm(_this.config, 'myfilename.spm', 'text/plain');
    });
  }

  // https://stackoverflow.com/questions/13405129/javascript-create-and-save-file


  _createClass(File, [{
    key: "save_spm",
    value: function save_spm(text, name, type) {
      var a = document.getElementById("a");
      var file = new Blob([text], { type: type });
      a.href = URL.createObjectURL(file);
      a.download = name;
    }
  }]);

  return File;
}();