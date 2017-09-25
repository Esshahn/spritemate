

class Load
{

  constructor(config,eventhandler)
  {
    this.config = config;
    this.eventhandler = eventhandler;
    this.setup_load_input();
  }

  setup_load_input()
  {
    let element = document.createElement('div');
    element.innerHTML = '<input type="file" id="input-load" style="display: none">';
    let fileInput = element.firstChild;
    document.body.append(fileInput);
    var that = this;
    fileInput.addEventListener('change',function() {  that.read_file_data(fileInput); });
  }

  read_file_data(fileInput)
  {
    var file = fileInput.files[0];
 
      if (file.name.match(/\.(spm|spd|spr)$/)) 
      {
        var reader = new FileReader();
        reader.onload = () => 
        {
          if (file.name.match(/\.(spm)$/)) 
          {
            this.parse_file_spritemate(reader.result);
          }
          if (file.name.match(/\.(spd|spr)$/)) 
          {
            this.parse_file_spritepad(reader.result);
          }
          this.eventhandler.onLoad();
          $('#input-load').remove();    // by removing the input field and reassigning it, reloading the same file will work
          this.setup_load_input();
        };

        if (file.name.match(/\.(spm)$/))
        {
          reader.readAsText(file);
        } 

        if (file.name.match(/\.(spd|spr)$/)) 
        {
          reader.readAsBinaryString(file);
        } 
            
      } else {
          alert("File not supported, .spm or .spd files only");
      }
  }


  parse_file_spritemate(file) 
  {
    this.imported_file = JSON.parse(file);
  }

 parse_file_spritepad(file) 
  {
    
    this.sprite_count = Math.floor( file.length / 64 );
    console.log("Number of sprites: "+ this.sprite_count);
    console.log("bytes left: "+ file.length % 64);

    this.imported_file = {};
    this.imported_file.colors = {"t": 11, "m1": 8, "m2": 3};
    this.imported_file.sprites = [];
    this.imported_file.current_sprite = 0;
    this.imported_file.pen = "i"; // can be individual = i, transparent = t, multicolor_1 = m1, multicolor_2 = m2
    
    let sprite = {
      color: 1,
      multicolor: false,
      double_x : false,
      double_y : false,
      pixels: []
    };

    var binary = ""; 
    for(let i=9; i<65 + 7; i++)
    {
     // convert data in SPR file into binary
     binary += ( "0000000" + file.charCodeAt(i).toString(2) ).slice(-8);
    }

    binary = binary.replace(/0/g,"t");
    binary = binary.replace(/1/g,"i");
    binary = binary.match(/.{1,24}/g);

    for(let i=0; i<binary.length; i++)
    {
      binary[i] = binary[i].split("");
      sprite.pixels.push(binary[i]);
    }
    
    this.imported_file.sprites.push(sprite);
    console.log(this.imported_file);

  }

  get_imported_file()
  {
    return this.imported_file;
  }

}


