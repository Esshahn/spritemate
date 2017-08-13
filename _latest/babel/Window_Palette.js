
/*

    Class Window

 */

class Window_Palette
{
    constructor(config)
    {
        this.id = "window-" + $('div[id^="window-"]').length;
        this.title = config.title; 
        this.resizable = false; 
        this.type="colors";
        this.left = config.left;
        this.top = config.top;
        this.width = "auto";
        this.height = "auto";
        this.position = { at: "left+"+this.left+" top+"+this.top };
        this.resizable = true;
        this.create_window();  
    }
             
       
    create_window()
    {
        $( "#app" ).append( "<div id='"+this.id+"' class='"+this.type+"' title='"+this.title+"'></div>" );
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