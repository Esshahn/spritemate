
/*

    Class Window

 */

class Window
{
    constructor(config)
    {
        config.id = "window-" + $('div[id^="window-"]').length;
        config.position = { at: "left+"+config.left+" top+"+config.top }; 
        if (config.top == undefined) config.position = undefined;
        if (config.modal == undefined) config.modal = false;
        if (config.escape == undefined) config.escape = false;
        
        $( "#app" ).append( "<div id='"+config.id+"' class='"+config.type+"' title='"+config.title+"'></div>" );
        $("#" + config.id).dialog({
            width: config.width,
            height: config.height,
            dialogClass: "no-close",
            modal: config.modal,
            closeOnEscape: config.escape,
            autoOpen: config.autoOpen,
            position: config.position,
            resizable: config.resizable,
            buttons: config.buttons
        });
    }         
    
}
