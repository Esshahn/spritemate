"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

  WINDOW CONTROLS
  Provides basic functionality for windows, mostly canvas & zoom related

  Inherited e.g. from Editor, List, Preview


 */
var Window_Controls = function () {
  function Window_Controls() {
    _classCallCheck(this, Window_Controls);
  }

  _createClass(Window_Controls, [{
    key: "get_width",
    value: function get_width() {
      return this.width;
    }
  }, {
    key: "get_height",
    value: function get_height() {
      return this.height;
    }
  }, {
    key: "is_min_zoom",
    value: function is_min_zoom() {
      if (this.zoom < this.zoom_min) return true;
    }
  }, {
    key: "is_max_zoom",
    value: function is_max_zoom() {
      if (this.zoom > this.zoom_max) return true;
    }
  }, {
    key: "get_zoom",
    value: function get_zoom() {
      return this.zoom;
    }
  }, {
    key: "zoom_in",
    value: function zoom_in() {
      if (this.zoom <= this.zoom_max) {
        this.zoom += 2;
        this.update_zoom();
      }
    }
  }, {
    key: "zoom_out",
    value: function zoom_out() {
      if (this.zoom >= this.zoom_min) {
        this.zoom -= 2;
        this.update_zoom();
      }
    }
  }, {
    key: "update_zoom",
    value: function update_zoom() {
      this.width = this.pixels_x * this.zoom;
      this.height = this.pixels_y * this.zoom;
    }
  }]);

  return Window_Controls;
}();