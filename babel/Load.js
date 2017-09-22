

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
    var file_array = [];
    
    for(let i=0; i<file.length; i++)
    {
      file_array.push(("0" + file.charCodeAt(i).toString(16)).slice(-2));
    }

    console.log (file_array);


  
  }

  get_imported_file()
  {
    return this.imported_file;
  }

}


