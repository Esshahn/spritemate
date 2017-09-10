
/*

    Class Window

 */

class Window_Preview {
    constructor(config) {
        this.id = "window-" + $('div[id^="window-"]').length;
        this.title = config.title;
        this.type = "preview";
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
        <div id="preview_menu">
        <div class="icon-preview-x2" id="icon-preview-x"></div>
        <div class="icon-preview-y2" id="icon-preview-y"></div>
        </div>
        `;

        $("#" + this.id).append(template);
    }
}