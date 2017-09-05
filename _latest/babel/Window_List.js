
/*

    Class Window

 */

class Window_List
{
    constructor(config)
    {
        this.id = "window-" + $('div[id^="window-"]').length;
        this.title = config.title;  
        this.type = "list";
        this.left = config.left;
        this.top = config.top;
        this.width = 400; //24 * this.zoomFactor;
        this.height = 180; //21 * this.zoomFactor;
        this.resizable = true;
        this.position = { at: "left+"+this.left+" top+"+this.top };
        this.create_window(); 
    }
             
       
    create_window()
    {
        $( "#app" ).append( `<div id='${this.id}' class='${this.type}' title='${this.title}'></div>`);
        $("#" + this.id).dialog({
            width: this.width,
            height: this.height,
            dialogClass: "no-close",
            position: this.position,
            resizable: this.resizable,
            buttons: this.buttons
        });
        $("#" + this.id).append( '<img src="img/icon3/icon-list-new.png" id="icon-list-new">' );
       // $("#" + this.id).append(`<div class="iconset" id="icon-trash"><img src="img/icon3/icon-trash.png" class="icon" title="clear"></div>`);
        $("#" + this.id).append(`<div id="spritelist"></div>`);

    }
}
