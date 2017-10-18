

class Info
{

  constructor(window,config)
  {
    this.config = config;
    this.window = window;

    let template = `
    <div id="info">
        <p>Welcome to</p>
        <img autofocus src="img/logo.png" id="logo">
        <p>A tool to draw sprites for the Commodore 64</p>

        <fieldset>
            <legend>What's new in beta $03</legend>
            <h1>sprite overlays</h1>
            <p>Toggle sprite overlays in preview window. The following sprite will be used as overlay. The preview window shows both sprites and the editor window shows the other sprite with reduced visibility (like onion skinning). Please note that currently sprite overlay information is stored in native spritemate format only.</p>
            <h1>bug fixes and changes</h1>
            <p>
                - spritemate should work again in Firefox
                <br/>- zoom levels for windows have been increased
                <br/>- fixed a crazy stupid thing in pixel display code
                <br/>- huge speed improvements for sprite display
            </p>
        </fieldset>

        <p>Documentation: <a target="_blank" href="https://github.com/Esshahn/spritemate">https://github.com/Esshahn/spritemate</a></p>
        <p>Ingo Hinterding / <a target="_blank" href="http://csdb.dk/scener/?id=27239">awsm</a> of <a target="_blank" href="http://csdb.dk/group/?id=7228">Mayday!</a>
        / <a target="_blank" href="http://www.awsm.de">www.awsm.de</a> / <a target="_blank" href="http://www.twitter.com/awsm9000/">@awsm9000</a></p>
        <br/>
        <p>Report bugs, ideas & requests to ingo (at) awsm (dot) de</p>
        <p>Please do not share this link publicly yet. Thank you for testing!</p>
        <br/>
        <button id="button-info">Let's go!</button>
    </div>
    `;
    $("#window-"+this.window).append(template);

    $("#window-"+this.window).dialog({ show: 'fade', hide: 'fade' });
    $('#button-info').mouseup((e) => $("#window-"+this.window).dialog( "close" ));

   
  }



}


