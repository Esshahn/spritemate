

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
 
      if (file.name.match(/\.(spm|json)$/)) 
      {
        var reader = new FileReader();
        reader.onload = () => 
        {
          this.parse_file(reader.result);
          this.eventhandler.onLoad();
          $('#input-load').remove();    // by removing the input field and reassigning it, reloading the same file will work
          this.setup_load_input();
        };
        reader.readAsText(file);    
      } else {
          alert("File not supported, .spm or .json files only");
      }
  }


  parse_file(file) 
  {
    this.imported_file = JSON.parse(file);
  }

  get_imported_file()
  {
    return this.imported_file;
  }

}


