
/*

    Class Window

 */

class Window
{
    constructor(title)
    {
        this.id = "window-" + $('div[id^="window-"]').length;
        this.title = title; 
        this.resizable = false;   
    }
             
       
    create_window()
    {
        $( "#app" ).append( "<div id='"+this.id+"' class='"+this.type+"' title='"+this.title+"'></div>" );
        $("#" + this.id).dialog({
            width: this.width,
            height: this.height,
            dialogClass: "no-close",
            position: this.position,
            resizable: this.resizable
            /*
            buttons: [
                {
                    text: 'Create',
                    click: function() {
                        alert('Yay, clicked the button')
                    }
                }
            ]
            */
        });

    }
}

class WindowEditor extends Window
{
    constructor(title,zoomFactor)
    {
        super(title);
        this.type = "sprite";
        this.zoomFactor = zoomFactor;
        this.width = "auto"; //24 * this.zoomFactor;
        this.height = "auto"; //21 * this.zoomFactor;
        this.resizable = false;
        this.position = { at: "left+100 top+150" };
        this.create_window();
    }
}

class WindowColors extends Window
{
    constructor(title)
    {
        super(title);
        this.type="colors";
        this.width = "auto";
        this.height = "auto";
        this.position = { at: "center+100 top+150" };
        this.resizable = true;
        this.create_window();
    }
}