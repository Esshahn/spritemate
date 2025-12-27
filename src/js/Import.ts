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

      dom.html("#menubar-filename-name", file.name);

      // automatically open the snapshot window if not already open
      const snapshotWindow = this.app.window_snapshot.get_window_id();
      if (!$(snapshotWindow).dialog("isOpen")) {
        $(snapshotWindow).dialog("open");
      }
    } else {
      alert("File not supported, .vsf files only");
    }
  }
}
