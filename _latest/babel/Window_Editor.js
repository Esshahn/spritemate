
/*

    Class Window_Editor

 */

class Window_Editor
{
    constructor(config)
    {
        this.id = "window-" + $('div[id^="window-"]').length;
        this.title = config.title; 
        this.resizable = false; 
        this.type = "sprite";
        this.left = config.left;
        this.top = config.top;
        this.width = "auto"; //24 * this.zoomFactor;
        this.height = "auto"; //21 * this.zoomFactor;
        this.resizable = false;
        this.position = { at: "left+"+this.left+" top+"+this.top }; 
        this.create_window();
        $("#" + this.id).append( "<div class='editor_ui'>moin</div>" ); 
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
