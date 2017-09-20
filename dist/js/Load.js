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

      if (file.name.match(/\.(spm|json)$/)) {
        var reader = new FileReader();
        reader.onload = function () {
          _this.parse_file(reader.result);
          _this.eventhandler.onLoad();
        };
        reader.readAsText(file);
      } else {
        alert("File not supported, .spm or .json files only");
      }
    }
  }, {
    key: 'parse_file',
    value: function parse_file(file) {
      this.imported_file = JSON.parse(file);
    }
  }, {
    key: 'get_imported_file',
    value: function get_imported_file() {
      return this.imported_file;
    }
  }]);

  return Load;
}();