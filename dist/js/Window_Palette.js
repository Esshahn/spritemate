
/*

    Class Window

 */

class Window_Palette {
    constructor(config) {
        this.id = "window-" + $('div[id^="window-"]').length;
        this.title = config.title;
        this.type = "colors";
        this.left = config.left;
        this.top = config.top;
        this.width = config.width;
        this.height = config.height;
        this.resizable = false;
        this.position = { at: "left+" + this.left + " top+" + this.top };
        this.create_window();
    }

    create_window() {
        $("#app").append("<div id='" + this.id + "' class='" + this.type + "' title='" + this.title + "'></div>");
        $("#" + this.id).dialog({
            width: this.width,
            height: this.height,
            dialogClass: "no-close",
            position: this.position,
            resizable: this.resizable,
            buttons: this.buttons
        });

        let template = `
        <div id="palette_all_colors"></div>
        <div id="palette_spritecolors">
            <div id="palette_spritecolor">
                <p>Individual</p>
                <div class="palette_color_item" id="color_spritecolor"></div>
            </div>
            <div id="palette_transparent">
                <p>Transparent</p>
                <div class="palette_color_item" id="color_transparent"></div>
            </div>
            <div id="palette_multicolor_1">
                <p>Multicolor 1</p>
                <div class="palette_color_item" id="color_multicolor_1"></div>
            </div>
            <div id="palette_multicolor_2">
                <p>Multicolor 2</p>
                <div class="palette_color_item" id="color_multicolor_2"></div>
            </div>
        </div>

        `;

        $("#" + this.id).append(template);
    }
}