
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
        this.width = config.width; 
        this.height = config.height; 
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

        let template = `
        <div id="list_menu">
        <img src="img/icon3/icon-list-new.png" id="icon-list-new">
        <img src="img/icon3/icon-list-delete.png" id="icon-list-delete">
        <div id="spritelist"></div>
        </div>
        `;

        $("#" + this.id).append(template);

    }
}
