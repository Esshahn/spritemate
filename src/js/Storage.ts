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

  /**
   * Compares two version strings/numbers safely.
   * Handles both old numeric versions (e.g., 1.51) and new date-based versions (e.g., "25.12.27").
   * @param configVersion - The version from the config (current version)
   * @param storageVersion - The version from localStorage (stored version)
   * @returns true if configVersion is newer than storageVersion
   */
  private isNewerVersion(configVersion: string | number, storageVersion: string | number): boolean {
    // If storage version is undefined or null, config is newer
    if (storageVersion === undefined || storageVersion === null) {
      return true;
    }

    // Convert both to strings for consistent comparison
    const configStr = String(configVersion);
    const storageStr = String(storageVersion);

    // Check if config version is in date format (YY.MM.DD or similar)
    const isDateFormat = /^\d{2}\.\d{2}\.\d{2}$/.test(configStr);

    if (isDateFormat) {
      // If storage is old numeric format (e.g., 1.51), config is definitely newer
      if (typeof storageVersion === 'number' || /^\d+\.\d+$/.test(storageStr)) {
        return true;
      }

      // Both are date format, compare as dates
      // Format: YY.MM.DD -> convert to YYMMDD for numeric comparison
      const configDate = parseInt(configStr.replace(/\./g, ''), 10);
      const storageDate = parseInt(storageStr.replace(/\./g, ''), 10);

      return configDate > storageDate;
    } else {
      // Fallback to numeric comparison for legacy versions
      const configNum = parseFloat(configStr);
      const storageNum = parseFloat(storageStr);

      return configNum > storageNum;
    }
  }

  init() {
    if (typeof Storage !== "undefined") {
      try {
        if (localStorage.getItem("spritemate_config") == null) {
          // there is no local config, so we're creating one
          localStorage.setItem("spritemate_config", JSON.stringify(this.config));
          this.is_new_version = true;
        }

        // now we can safely read in the storage
        this.storage = JSON.parse(
          localStorage.getItem("spritemate_config") || "{}"
        );

        if (this.isNewerVersion(this.config.version, this.storage.version)) {
          // is the config newer than the storage version?
          // then update the storage
          this.storage = JSON.parse(JSON.stringify(this.config)); // this.storage = $.extend(true, {}, this.config);
          this.write(this.storage);
          this.is_new_version = true;
        }
        this.config = JSON.parse(JSON.stringify(this.storage)); // this.config = $.extend(true, {}, this.storage);
      } catch (error) {
        console.error("Failed to initialize storage:", error);
        status("Unable to access settings storage. Using defaults.");
        this.config = this.config; // Use default config
      }
    } else {
      // can't access storage on the browser
      status("Local storage is not available in your browser.");
    }
  }

  write(data) {
    if (typeof Storage !== "undefined") {
      try {
        localStorage.setItem("spritemate_config", JSON.stringify(data));
      } catch (error) {
        console.error("Failed to save settings:", error);
        status("Unable to save settings. Storage may be full or disabled.");
      }
    } else {
      status("I can't write to local web storage.");
    }
  }

  read() {
    if (typeof Storage !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("spritemate_config") || "{}");
      } catch (error) {
        console.error("Failed to read settings:", error);
        status("Unable to load settings. Using defaults.");
        return {};
      }
    } else {
      status("I can't read from web storage.");
      this.storage = this.config;
      return this.config;
    }
  }

  is_updated_version() {
    return this.is_new_version;
  }

  get_config() {
    return this.config;
  }
}
