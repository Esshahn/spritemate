
/*

    Class Window

 */

class Window
{
    constructor(config)
    {

        this.id = "window-" + $('div[id^="window-"]').length;
        this.title = config.title; 
        this.type = config.type;
        this.left = config.left;
        this.top = config.top;
        this.width = config.width; 
        this.height = config.height; 
        this.resizable = config.resizable;
        this.position = { at: "left+"+this.left+" top+"+this.top }; 
        this.autoOpen = true;
        if (config.autoOpen == "false") this.autoOpen = false;
        this.create_window();
    }
             
       
    create_window()
    {
        $( "#app" ).append( "<div id='"+this.id+"' class='"+this.type+"' title='"+this.title+"'></div>" );
        $("#" + this.id).dialog({
            width: this.width,
            height: this.height,
            dialogClass: "no-close",
            autoOpen: this.autoOpen,
            position: this.position,
            resizable: this.resizable,
            buttons: this.buttons
        });

    }
}
