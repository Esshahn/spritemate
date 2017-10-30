"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// handles writing and reading of the local html5 storage in the browser

var Storage = function () {
  function Storage(config) {
    _classCallCheck(this, Storage);

    this.config = config;
    this.is_new_version = false; // will be true if the storage config has an older version number
    this.init();
  }

  _createClass(Storage, [{
    key: "init",
    value: function init() {
      if (typeof Storage !== "undefined") {
        if (localStorage.getItem("spritemate_config") == null) {
          // there is no local config, so we're creating one
          console.log("creating local storage file...");
          localStorage.setItem('spritemate_config', JSON.stringify(this.config));
          this.is_new_version = true;
        }

        // now we can safely read in the storage
        this.storage = JSON.parse(localStorage.getItem("spritemate_config"));

        if (this.config.version > this.storage.version) {
          // is the config newer than the storage version?
          // then update the storage
          this.storage = jQuery.extend(true, {}, this.config);
          this.write(this.storage);
          this.is_new_version = true;
          console.log("updating storage");
        }

        this.config = jQuery.extend(true, {}, this.storage);
      } else {
        // can't access storage on the browser
      }
    }
  }, {
    key: "write",
    value: function write(data) {
      if (typeof Storage !== "undefined") {
        localStorage.setItem('spritemate_config', JSON.stringify(data));
      } else {
        status("I can't write to local web storage.");
      }
    }
  }, {
    key: "read",
    value: function read() {
      if (typeof Storage !== "undefined") {
        return JSON.parse(localStorage.getItem("spritemate_config"));
      } else {
        status("I can't read from web storage.");
        this.storage = this.config;
      }
    }
  }, {
    key: "is_updated_version",
    value: function is_updated_version() {
      return this.is_new_version;
    }
  }, {
    key: "get_config",
    value: function get_config() {
      return this.config;
    }
  }]);

  return Storage;
}();