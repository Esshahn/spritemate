

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
        <br/>
        <p>This is the closed beta $02.<br/>Please do not share this link publicly yet. </p>
        <p>Check out the documentation on Github:<br/><a target="_blank" href="https://github.com/Esshahn/spritemate">https://github.com/Esshahn/spritemate</a></p>
        <p>Report bugs, ideas & requests to ingo (at) awsm (dot) de</p>
        <br/>
        <p>Thank you for testing!</p>
        <p>Ingo Hinterding // <a target="_blank" href="http://csdb.dk/scener/?id=27239">awsm</a> of <a target="_blank" href="http://csdb.dk/group/?id=7228">Mayday!</a></p>
        <p>Website: <a target="_blank" href="http://www.awsm.de">www.awsm.de</a> | Twitter: <a target="_blank" href="http://www.twitter.com/awsm9000/">@awsm9000</a></p>
        <br/>
        <button id="button-info">Let's go!</button>
    </div>
    `;
    $("#window-"+this.window).append(template);

    $("#window-"+this.window).dialog({ show: 'fade', hide: 'fade' });
    $('#button-info').mouseup((e) => $("#window-"+this.window).dialog( "close" ));

   
  }



}


