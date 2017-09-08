
/*

    Class Window

 */

class Window_Info
{
    constructor(config)
    {
        this.id = "window-" + $('div[id^="window-"]').length;
        this.title = config.title;  
        this.type = "info";
        this.left = config.left;
        this.top = config.top;
        this.width = config.width ;
        this.height = config.height;
        this.resizable = false;
        this.position = { at: "left+"+this.left+" top+"+this.top };
        this.create_window(); 
    }
             
       
    create_window()
    {
        $( "#app" ).append( `<div id='${this.id}' class='${this.type}' title='${this.title}'></div>`);
        $("#" + this.id).dialog({
            width: this.width,
            height: this.height,
            autoOpen : false,
            dialogClass: "no-close",
            //position: this.position,
            resizable: this.resizable,
            buttons: this.buttons
        });

        let template = `
        <div id="info">
            <img autofocus src="img/logo.png" id="logo">
            <p>version 0.02 - 2017-09-07</p>
            <p>Created by Ingo Hinterding // awsm of Mayday!</p>
            <p>This software is free.<br/>Everything happens in your browser locally.<br/>No data of any kind is leaving your computer.</p>
            <p>Fork me on Github:<br/><a href="https://github.com/Esshahn/spritemate">https://github.com/Esshahn/spritemate</a></p>
            <p>Follow me on Twitter<br/><a href="http://www.twitter.com/awsm9000/">http://www.twitter.com/awsm9000/</a><p>
            <p>Visit my website<br/><a href="http://www.awsm.de">http://www.awsm.de</a></p>
            <button id="button-info">You're awesome. No, really.</button>
        `;
        $("#" + this.id).append( template );

        $("#" + this.id).dialog({ show: 'fade', hide: 'fade' });
        $('#button-info').mouseup((e) => $("#" + this.id).dialog( "close" ));

    }
}
