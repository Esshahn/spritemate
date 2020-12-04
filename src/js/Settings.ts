import $ from "jquery";

export default class Settings {
  config: any = {};
  window: any = {};
  eventhandler: any = {};

  constructor(window, config, eventhandler) {
    this.config = config;
    this.window = window;
    this.eventhandler = eventhandler;

    let template = `
    <div id="modal">
        <h2 autofocus>Your settings will be saved locally to your browser storage</h2>
        <fieldset>
            <legend>Color palette</legend>
            
            <select id="colorpalette">
              <option>colodore</option>
              <option>pepto</option>
              <option>custom</option>
            </select>

            <br/>
            <br/>

            <div class="settings_colorfield">
                <div class="settings_color" id="col-0"></div>
                <input type="text" class="settings_colorvalue" id="colval-0" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-1"></div>
                <input type="text" class="settings_colorvalue" id="colval-1" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-2"></div>
                <input type="text" class="settings_colorvalue" id="colval-2" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-3"></div>
                <input type="text" class="settings_colorvalue" id="colval-3" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-4"></div>
                <input type="text" class="settings_colorvalue" id="colval-4" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-5"></div>
                <input type="text" class="settings_colorvalue" id="colval-5" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-6"></div>
                <input type="text" class="settings_colorvalue" id="colval-6" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-7"></div>
                <input type="text" class="settings_colorvalue" id="colval-7" name="" value="">
            </div>

            <div class="settings_colorfield">
                <div class="settings_color" id="col-8"></div>
                <input type="text" class="settings_colorvalue" id="colval-8" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-9"></div>
                <input type="text" class="settings_colorvalue" id="colval-9" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-10"></div>
                <input type="text" class="settings_colorvalue" id="colval-10" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-11"></div>
                <input type="text" class="settings_colorvalue" id="colval-11" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-12"></div>
                <input type="text" class="settings_colorvalue" id="colval-12" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-13"></div>
                <input type="text" class="settings_colorvalue" id="colval-13" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-14"></div>
                <input type="text" class="settings_colorvalue" id="colval-14" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-15"></div>
                <input type="text" class="settings_colorvalue" id="colval-15" name="" value="">
            </div>

        </fieldset>

        <!--
        <fieldset>
            <legend>Window settings</legend>
            <div class="fieldset right">
                <button id="button-save">Save now</button>
                <button id="button-reset">Reset to defaults</button>
            </div>
            <p>Saves the window layout and zoom levels</p>
        </fieldset>
        -->
        <div id="button-row">
          <button id="button-apply">Apply</button>
        </div>

    </div>
    `;
    $("#window-" + this.window).append(template);

    this.config.colors = this.config.palettes[this.config.selected_palette];

    $("#colorpalette").val(this.config.selected_palette);

    this.init_inputfields(this.config.colors);
    this.selection_change();
    this.update_colors();

    $("#window-" + this.window).dialog({ show: "fade", hide: "fade" });

    $("#button-apply").mouseup((e) => this.close_window());
  }

  update_colors() {
    for (let i = 0; i < this.config.colors.length; i++) {
      $("#colval-" + i).val(this.config.colors[i]);
      $("#col-" + i).animate(
        { backgroundColor: this.config.colors[i] },
        "fast"
      );
    }
  }

  init_inputfields(colors) {
    let that = this;
    for (let i = 0; i < colors.length; i++) {
      $("#colval-" + i).change(function () {
        that.update_custom_colors(i);
      });
    }

    if (this.config.selected_palette != "custom") {
      $(".settings_colorvalue").prop("disabled", true).fadeTo("fast", 0.33);
    } else {
      $(".settings_colorvalue").prop("disabled", false).fadeTo("fast", 1);
    }
  }

  selection_change() {
    let that = this;
    $("#colorpalette").change(function () {
      let palette: any = $("#colorpalette").val();

      that.config.colors = that.config.palettes[palette];
      that.config.selected_palette = palette;

      if (palette != "custom") {
        $(".settings_colorvalue").prop("disabled", true).fadeTo("fast", 0.33);
      } else {
        $(".settings_colorvalue").prop("disabled", false).fadeTo("fast", 1);
      }

      that.update_colors();
    });
  }

  update_custom_colors(color) {
    // takes the value of the input field and updates both the color and the input field
    let colvalue: any = $("#colval-" + color).val();
    colvalue = "#" + ("000000" + colvalue.replace(/#/g, "")).slice(-6);
    this.config.palettes.custom[color] = colvalue;
    this.config.colors = this.config.palettes.custom;
    this.update_colors();
  }

  close_window() {
    $("#window-" + this.window).dialog("close");
    this.eventhandler.onLoad(); // calls "regain_keyboard_controls" method in app.js
  }

  get_config() {
    return this.config;
  }
}
