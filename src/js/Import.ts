import { dom } from "./helper";
import { App } from './App';

export default class Import {
  app: App | null;

  constructor(public config, public eventhandler) {
    this.app = null;
    this.config = config;
    this.eventhandler = eventhandler;
    this.setup_import_input();
  }

  setup_import_input() {
    this.app = (window as any).app;
    const element: any = document.createElement("div");
    element.innerHTML =
      '<input type="file" id="input-import" style="display: none" accept=".vsf">';
    const fileInput = element.firstChild;
    document.body.appendChild(fileInput);
    const that = this;
    fileInput.addEventListener("change", function () {
      that.read_file_data(fileInput);
    });
  }

  read_file_data(fileInput) {
    this.app = window.app;
    const file = fileInput.files[0];

    if (file.name.match(/\.(vsf)$/)) {
      this.app.snapshot.load_snapshot(file, file.name);
      this.eventhandler.onLoad();

      // by removing the input field and reassigning it, reloading the same file will work
      document.querySelector("#input-import")?.remove();
      this.setup_import_input();

      // Extract filename without extension and update the menubar input
      const filenameWithoutExt = file.name.replace(/\.vsf$/i, '');
      if (this.app) {
        this.app.set_filename(filenameWithoutExt);
      }

      // automatically open the snapshot window if not already open
      if (!this.app.window_snapshot.isOpen()) {
        this.app.window_snapshot.open();
      }
    } else {
      alert("File not supported, .vsf files only");
    }
  }
}
