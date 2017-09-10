
/*

    Class Window_Editor

 */

class Window_Editor {
    constructor(config) {
        this.id = "window-" + $('div[id^="window-"]').length;
        this.title = config.title;
        this.type = "sprite";
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
    }
}