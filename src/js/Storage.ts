import { status } from "./helper";

// handles writing and reading of the local html5 storage in the browser

export default class Storage {
  is_new_version: boolean;
  storage: any = {};

  constructor(public config) {
    this.config = config;
    this.is_new_version = false; // will be true if the storage config has an older version number
    this.init();
  }

  init() {
    if (typeof Storage !== "undefined") {
      if (localStorage.getItem("spritemate_config") == null) {
        // there is no local config, so we're creating one
        console.log("creating local storage file...");
        localStorage.setItem("spritemate_config", JSON.stringify(this.config));
        this.is_new_version = true;
      }

      // now we can safely read in the storage
      this.storage = JSON.parse(
        localStorage.getItem("spritemate_config") || "{}"
      );

      if (this.config.version > this.storage.version) {
        // is the config newer than the storage version?
        // then update the storage
        this.storage = JSON.parse(JSON.stringify(this.config)); // this.storage = $.extend(true, {}, this.config);
        this.write(this.storage);
        this.is_new_version = true;
        console.log("updating storage");
      }
      this.config = JSON.parse(JSON.stringify(this.storage)); // this.config = $.extend(true, {}, this.storage);
    } else {
      // can't access storage on the browser
    }
  }

  write(data) {
    if (typeof Storage !== "undefined") {
      localStorage.setItem("spritemate_config", JSON.stringify(data));
    } else {
      status("I can't write to local web storage.");
    }
  }

  read() {
    if (typeof Storage !== "undefined") {
      return JSON.parse(localStorage.getItem("spritemate_config") || "{}");
    } else {
      status("I can't read from web storage.");
      this.storage = this.config;
    }
  }

  is_updated_version() {
    return this.is_new_version;
  }

  get_config() {
    return this.config;
  }
}
