

class File
{

  constructor(window,config)
  {
    this.config = config;
    this.window = window;

    let template = `
    <div id="window-save">
      <h1 autofocus>Save Data</h1>
      <h2>The file will be saved to your default download location</h2>
      <fieldset>
        <legend>Spritemate // *.spm</legend>
        <button id="button-save-spm">Save as Spritemate *.spm</button>
        <p>The natural format for Spritemate. Recommended as long as you are not done working on the sprites.</p>
      </fieldset>
    <!--
      <fieldset>
        <legend>Spritepad // *.spr</legend>
        <button id="button-save">Save as Spritepad *.spr</button>
        <p>Most common Sprite editing software on Windows.</p>
      </fieldset>

      <fieldset>
        <legend>Binary // *.bin</legend>
        <button id="button-save">Save as Binary *.bin</button>
        <p>Ready to use binary data.</p>
      </fieldset>

      <fieldset>
        <legend>ACME Source // *.asm</legend>
        <button id="button-save">Save as ACME *.asm</button>
        <p>Compilable source code for ACME assembler.</p>  
      </fieldset>
    -->
      <div id="button-row">
        <button id="button-save-cancel" class="button-cancel">Cancel</button>
      </div>
    </div>

    
    `;
    $("#window-"+this.window).append(template);

    $("#window-"+this.window).dialog({ show: 'fade', hide: 'fade' });
    $('#button-save-cancel').mouseup((e) => $("#window-"+this.window).dialog( "close" ));
    $('#button-save-spm').mouseup((e) => this.save_spm(this.config, 'myfilename.spm', 'text/plain'));
   
  }

  // https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
  save_spm(text, name, type)
  {
    let a = document.getElementById("a");
    let file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
  }


}


