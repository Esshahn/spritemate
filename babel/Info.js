

class Info
{

  constructor(window,config)
  {
    this.config = config;
    this.window = window;

    let template = `
    <div id="info">
        <img autofocus src="img/logo.png" id="logo">
        <p>version 0.10 - 2017-09-13</p>
        <p>Created by Ingo Hinterding // <a target="_blank" href="http://csdb.dk/scener/?id=27239">awsm</a> of <a target="_blank" href="http://csdb.dk/group/?id=7228">Mayday!</a></p>
        <p>This software is free.<br/>Everything happens in your browser locally.<br/>No data of any kind is leaving your computer.</p>
        <p>Fork me on Github:<br/><a target="_blank" href="https://github.com/Esshahn/spritemate">https://github.com/Esshahn/spritemate</a></p>
        <p>Follow me on Twitter<br/><a target="_blank" href="http://www.twitter.com/awsm9000/">http://www.twitter.com/awsm9000/</a><p>
        <p>Visit my website<br/><a target="_blank" href="http://www.awsm.de">http://www.awsm.de</a></p>
        <button id="button-info">You're awesome. No, really.</button>
    </div>
    `;
    $("#window-"+this.window).append(template);

    $("#window-"+this.window).dialog({ show: 'fade', hide: 'fade' });
    $('#button-info').mouseup((e) => $("#window-"+this.window).dialog( "close" ));

   
  }



}


