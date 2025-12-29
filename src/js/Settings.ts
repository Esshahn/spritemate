
import { dom } from "./helper";

export default class Settings {
  tempSelectedPalette: string;
  tempColors: string[];
  tempCustomColors: string[];

  constructor(public window: number, public config, public eventhandler) {
    this.config = config;
    this.window = window;
    this.eventhandler = eventhandler;

    // Initialize temp state (will be reset on dialog open)
    this.tempSelectedPalette = this.config.selected_palette;
    this.tempColors = [...this.config.palettes[this.config.selected_palette]];
    this.tempCustomColors = [...this.config.palettes.custom];

    const template = `
    <div id="modal">
        <h2 autofocus>Your settings will be saved locally to your browser storage</h2>
        <fieldset>
            <legend>Color palette</legend>
            
            <select id="colorpalette">
              <option>colodore</option>
              <option>palette</option>
              <option>pepto</option>
              <option>custom</option>
            </select>

            <br/>
            <br/>
            <div id="settings_fieldset">
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

    dom.append("#window-" + this.window, template);

    // Add close button to the dialog title bar
    // Wait for next tick to ensure dialog is created
    setTimeout(() => {
      const dialogElement = document.querySelector(`#dialog-window-${this.window}`) as HTMLDialogElement;
      if (dialogElement) {
        const titleBar = dialogElement.querySelector(".dialog-titlebar");
        if (titleBar) {
          const closeButton = document.createElement("div");
          closeButton.className = "window-close-button";
          titleBar.appendChild(closeButton);

          closeButton.addEventListener("click", () => {
            dialogElement.close();
            this.eventhandler.onLoad();
          });
        }

        // Listen for dialog open events to reset state
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.attributeName === 'open' && dialogElement.open) {
              this.reset_to_saved_state();
            }
          });
        });
        observer.observe(dialogElement, { attributes: true });
      }
    }, 0);

    dom.val("#colorpalette", this.tempSelectedPalette);

    this.init_inputfields(this.tempColors);
    this.selection_change();
    this.update_colors();

    dom.sel("#button-apply").onclick = (e) => this.apply_changes();
  }

  update_colors() {
    for (let i = 0; i < this.tempColors.length; i++) {
      dom.val("#colval-" + i, this.tempColors[i]);
      dom.css("#col-" + i, "backgroundColor", this.tempColors[i]);
    }
  }

  init_inputfields(colors) {
    const that = this;
    for (let i = 0; i < colors.length; i++) {
      dom.sel("#colval-" + i).onchange = function () {
        that.update_custom_colors(i);
      };
    }

    if (this.tempSelectedPalette != "custom") {
      dom.disabled(".settings_colorvalue", true);
      dom.fade(".settings_colorvalue", 1, 0.33);
    } else {
      dom.disabled(".settings_colorvalue", false);
      dom.fade(".settings_colorvalue", 0.33, 1);
    }
  }

  selection_change() {
    const that = this;
    dom.sel("#colorpalette").onchange = function () {
      const palette: any = dom.val("#colorpalette");

      that.tempSelectedPalette = palette;
      that.tempColors = [...that.config.palettes[palette]];

      if (palette != "custom") {
        dom.disabled(".settings_colorvalue", true);
        dom.fade(".settings_colorvalue", 1, 0.33);
      } else {
        dom.disabled(".settings_colorvalue", false);
        dom.fade(".settings_colorvalue", 0.33, 1);
      }
      that.update_colors();
    };
  }

  update_custom_colors(color) {
    // takes the value of the input field and updates both the color and the input field

    let colvalue: any = dom.val("#colval-" + color);
    colvalue = "#" + ("000000" + colvalue.replace(/#/g, "")).slice(-6);
    this.tempColors[color] = colvalue;
    this.tempCustomColors[color] = colvalue;
    this.update_colors();
  }

  apply_changes() {
    // Apply the temporary changes to the actual config
    this.config.selected_palette = this.tempSelectedPalette;
    this.config.colors = this.config.palettes[this.tempSelectedPalette];
    this.config.palettes.custom = [...this.tempCustomColors];

    this.close_window();
  }

  reset_to_saved_state() {
    // Reset temporary state to match the saved config
    this.tempSelectedPalette = this.config.selected_palette;
    this.tempColors = [...this.config.palettes[this.config.selected_palette]];
    this.tempCustomColors = [...this.config.palettes.custom];

    // Update UI to reflect saved state
    dom.val("#colorpalette", this.tempSelectedPalette);
    this.update_colors();

    // Update input field state
    if (this.tempSelectedPalette != "custom") {
      dom.disabled(".settings_colorvalue", true);
      dom.fade(".settings_colorvalue", 1, 0.33);
    } else {
      dom.disabled(".settings_colorvalue", false);
      dom.fade(".settings_colorvalue", 0.33, 1);
    }
  }

  close_window() {
    const dialogElement = document.querySelector(`#dialog-window-${this.window}`) as HTMLDialogElement;
    if (dialogElement) {
      dialogElement.close();
    }
    this.eventhandler.onLoad(); // calls "regain_keyboard_controls" method in app.js
  }

  get_config() {
    return this.config;
  }
}
