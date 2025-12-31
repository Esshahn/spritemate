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

    // Check if config version is in date format (YY.MM.DD or YY.MM.DD.patch)
    const isDateFormat = /^\d{2}\.\d{2}\.\d{2}(\.\d+)?$/.test(configStr);

    if (isDateFormat) {
      // If storage is old numeric format (e.g., 1.51), config is definitely newer
      if (typeof storageVersion === 'number' || /^\d+\.\d+$/.test(storageStr)) {
        return true;
      }

      // Both are date format, compare as dates
      // Format: YY.MM.DD.patch -> convert to YYMMDDpatch for numeric comparison
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
        // Read stored config (if it exists)
        const storedConfigString = localStorage.getItem("spritemate_config");

        if (!storedConfigString) {
          // No stored config exists, save the default
          this.write(this.config);
          this.is_new_version = true;
          return;
        }

        // Parse stored config
        this.storage = JSON.parse(storedConfigString);

        // Check if config version has been updated
        if (this.isNewerVersion(this.config.version, this.storage.version)) {
          this.is_new_version = true;
        }

        // Merge strategy: Start with defaults from code (this.config),
        // then selectively apply user-specific settings from storage

        // Preserve window positions/sizes from storage
        const windowKeys = ['window_tools', 'window_editor', 'window_preview', 'window_list',
                            'window_palette', 'window_snapshot', 'window_animation'];
        windowKeys.forEach(key => {
          if (this.storage[key]) {
            this.config[key] = { ...this.config[key], ...this.storage[key] };
          }
        });

        // Preserve selected palette (if valid)
        if (this.storage.selected_palette && this.config.palettes[this.storage.selected_palette]) {
          this.config.selected_palette = this.storage.selected_palette;
        }

        // Preserve custom palette from storage
        const customPalette = this.storage.palettes?.custom;
        if (customPalette) {
          if (Array.isArray(customPalette) && customPalette.length === 16) {
            // Old format: migrate to new format
            this.config.palettes.custom.values = customPalette;
          } else if (customPalette.values && Array.isArray(customPalette.values) && customPalette.values.length === 16) {
            // New format
            this.config.palettes.custom.values = customPalette.values;
          }
        }

        // Save merged config back to localStorage (adds any new properties from code)
        this.write(this.config);

      } catch (error) {
        console.error("Failed to initialize storage:", error);
        status("Unable to access settings storage. Using defaults.");
        // this.config already has default values from constructor
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

  /**
   * Writes sprite data to local storage for auto-save functionality
   * @param spriteData - The complete sprite data object (same format as .spm files)
   */
  write_sprites(spriteData: any) {
    if (typeof Storage !== "undefined") {
      try {
        const dataToSave = {
          timestamp: new Date().toISOString(),
          data: spriteData
        };
        localStorage.setItem("spritemate_autosave", JSON.stringify(dataToSave));
      } catch (error) {
        console.error("Failed to auto-save sprite data:", error);
        // Don't show status message for auto-save failures to avoid spamming user
      }
    }
  }

  /**
   * Reads auto-saved sprite data from local storage
   * @returns The sprite data object or null if none exists
   */
  read_sprites() {
    if (typeof Storage !== "undefined") {
      try {
        const saved = localStorage.getItem("spritemate_autosave");
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed.data; // Return just the sprite data, not the timestamp wrapper
        }
        return null;
      } catch (error) {
        console.error("Failed to read auto-saved sprite data:", error);
        return null;
      }
    }
    return null;
  }

  /**
   * Clears the auto-saved sprite data (used when creating a new file)
   */
  clear_sprites() {
    if (typeof Storage !== "undefined") {
      try {
        localStorage.removeItem("spritemate_autosave");
      } catch (error) {
        console.error("Failed to clear auto-saved sprite data:", error);
      }
    }
  }

  /**
   * Gets the timestamp of the last auto-save
   * @returns ISO timestamp string or null if no auto-save exists
   */
  get_autosave_timestamp() {
    if (typeof Storage !== "undefined") {
      try {
        const saved = localStorage.getItem("spritemate_autosave");
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed.timestamp;
        }
      } catch (error) {
        console.error("Failed to read auto-save timestamp:", error);
      }
    }
    return null;
  }
}
