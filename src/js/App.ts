// ASCII text: http://patorjk.com/software/taag/#p=display&h=2&f=Doh&t=TOOLS


import List from "./List";
import About from "./About";
import Tools from "./Tools";
import Snapshot from "./Snapshot";
import Load from "./Load";
import Import from "./Import";
import ImportPNG from "./ImportPNG";
import Save from "./Save";
import Export from "./Export-Spritesheet";
import Settings from "./Settings";
import Editor from "./Editor";
import Palette from "./Palette";
import Preview from "./Preview";
import Animation from "./Animation";
import Playfield from "./Playfield";
import Sprite from "./Sprite";
import Storage from "./Storage";
import Window from "./Window";
import Tooltip from "./Tooltip";
import { get_config } from "./config";
import { dom, tipoftheday, status, toggle_fullscreen } from "./helper";

declare global {
  interface Window {
    app: App;
  }
}

export class App {
  storage: any = {};
  sprite!: Sprite;
  editor: any;
  window_editor: any;
  window_palette: any;
  palette: any;
  window_preview: any;
  preview: any;
  window_animation: any;
  animation: any;
  window_playfield: any;
  playfield: any;
  window_list: any;
  window_snapshot: any;
  list!: List;
  window_about: any;
  about: any;
  window_save: any;
  save: any;
  window_export: any;
  export: any;
  import: any;
  importPNG: any;
  window_settings: any;
  settings: any;
  window_tools: any;
  window_help: any;
  window_confirm: any;
  tools: any;
  snapshot!: Snapshot;
  load: any;
  is_drawing!: boolean;
  oldpos: any;
  mode: any;
  allow_keyboard_shortcuts!: boolean;
  move_start: any;
  move_start_pos: any;
  dragging: any;
  selection!: {
    active: boolean;
    start: { x: number; y: number } | null;
    end: { x: number; y: number } | null;
    bounds: { x1: number; y1: number; x2: number; y2: number } | null;
  } | null;
  marquee_drawing!: boolean;
  move_selection_backup!: number[][] | null;

  constructor(public config) {
    this.initializeConfig();
    this.initializeWindows();
    this.initializeState();
    this.restoreWindowStates();
  }

  private initializeConfig(): void {
    this.storage = new Storage(this.config);
    this.config = this.storage.get_config();
    this.config.colors = this.config.palettes[this.config.selected_palette].values;

    // Initialize custom tooltip system
    new Tooltip();

    // Ensure window_animation config exists (for backwards compatibility)
    if (!this.config.window_animation) {
      this.config.window_animation = {
        top: 280,
        left: 210,
        zoom: 6,
        autoOpen: false,
        closeable: true,
        isOpen: false,
      };
    }

    // Ensure autoOpen, closeable, and isOpen fields exist for all windows (for backwards compatibility)
    const ensureWindowDefaults = (windowConfig: any, defaults: any) => {
      if (!windowConfig) return;
      if (windowConfig.autoOpen === undefined) windowConfig.autoOpen = defaults.autoOpen;
      if (windowConfig.closeable === undefined) windowConfig.closeable = defaults.closeable;
      if (windowConfig.isOpen === undefined) windowConfig.isOpen = defaults.isOpen ?? !defaults.autoOpen;
    };

    ensureWindowDefaults(this.config.window_tools, { autoOpen: true, closeable: false });
    ensureWindowDefaults(this.config.window_editor, { autoOpen: true, closeable: false });
    ensureWindowDefaults(this.config.window_preview, { autoOpen: true, closeable: false, isOpen: true });
    ensureWindowDefaults(this.config.window_list, { autoOpen: true, closeable: false });
    ensureWindowDefaults(this.config.window_palette, { autoOpen: true, closeable: false });
    ensureWindowDefaults(this.config.window_snapshot, { autoOpen: false, closeable: true, isOpen: false });
    ensureWindowDefaults(this.config.window_animation, { autoOpen: false, closeable: true, isOpen: false });
    ensureWindowDefaults(this.config.window_playfield, { autoOpen: false, closeable: true, isOpen: false });

    this.sprite = new Sprite(this.config, this.storage);
  }

  private initializeWindows(): void {

    // editor
    const editor_config = this.createWindowConfig("window_editor", "Editor", "sprite", 0, {
      closeable: this.config.window_editor.closeable,
      left: this.config.window_editor.left,
      top: this.config.window_editor.top,
    });
    this.window_editor = new Window(editor_config, this.store_window.bind(this));
    this.editor = new Editor(editor_config.window_id, this.config);

    // palette
    const palette_config = this.createWindowConfig("window_palette", "Colors", "colors", 1, {
      closeable: this.config.window_palette.closeable,
      left: this.config.window_palette.left,
      top: this.config.window_palette.top,
    });
    this.window_palette = new Window(palette_config, this.store_window.bind(this));
    this.palette = new Palette(palette_config.window_id, this.config);

    // preview
    const preview_config = this.createWindowConfig("window_preview", "Preview", "preview", 2, {
      closeable: this.config.window_preview.closeable,
      left: this.config.window_preview.left,
      top: this.config.window_preview.top,
    });
    this.window_preview = new Window(preview_config, this.store_window.bind(this));
    this.preview = new Preview(preview_config.window_id, this.config);

    // animation
    const animation_config = {
      name: "window_animation",
      title: "Animation",
      type: "animation",
      autoOpen: this.config.window_animation.autoOpen,
      closeable: this.config.window_animation.closeable,
      resizable: false,
      left: this.config.window_animation?.left ?? 210,
      top: this.config.window_animation?.top ?? 280,
      width: this.config.window_animation?.width ?? 440,
      height: "auto",
      window_id: 11,
    };
    this.window_animation = new Window(
      animation_config,
      this.store_window.bind(this)
    );
    this.animation = new Animation(animation_config.window_id, this.config);

    // sprite list
    const list_config = {
      name: "window_list",
      title: "Sprite List",
      type: "list",
      resizable: true,
      closeable: this.config.window_list.closeable,
      left: this.config.window_list.left,
      top: this.config.window_list.top,
      width: this.config.window_list.width,
      height: this.config.window_list.height,
      window_id: 3,
    };
    this.window_list = new Window(list_config, this.store_window.bind(this));
    this.list = new List(list_config.window_id, this.config);

    // about
    const about_config = this.createWindowConfig("window_about", "Spritemate", "info", 4, {
      escape: true,
      modal: true,
      autoOpen: false,
      width: "680",
    });
    this.window_about = new Window(about_config);
    this.about = new About(about_config.window_id, this.config, {
      onLoad: this.regain_keyboard_controls.bind(this),
    });

    // save
    const save_config = this.createWindowConfig("window_save", "Save", "file", 5, {
      escape: true,
      modal: true,
      autoOpen: false,
      width: "580",
    });
    this.window_save = new Window(save_config);
    this.save = new Save(save_config.window_id, this.config, {
      onLoad: this.regain_keyboard_controls.bind(this),
    }, this);

    // export
    const export_config = this.createWindowConfig("window_export", "Export Spritesheet", "file", 7, {
      escape: true,
      modal: true,
      autoOpen: false,
      width: "580",
    });
    this.window_export = new Window(export_config);
    this.export = new Export(export_config.window_id, this.config, {
      onLoad: this.regain_keyboard_controls.bind(this),
    }, this);

    // import
    this.import = new Import(this.config, {
      onLoad: this.regain_keyboard_controls.bind(this),
    });

    // import PNG
    this.importPNG = new ImportPNG(this.config, {
      onLoad: this.update_imported_png.bind(this),
    });

    // settings
    const settings_config = this.createWindowConfig("window_settings,", "Settings", "settings", 6, {
      modal: true,
      escape: true,
      autoOpen: false,
      width: "760",
    });
    this.window_settings = new Window(settings_config);
    this.settings = new Settings(settings_config.window_id, this.config, {
      onLoad: this.update_config.bind(this),
    });

    // tools
    const tools_config = this.createWindowConfig("window_tools", "Tools", "tools", 8, {
      closeable: this.config.window_tools.closeable,
      left: this.config.window_tools.left,
      top: this.config.window_tools.top,
    });
    this.window_tools = new Window(tools_config, this.store_window.bind(this));
    this.tools = new Tools(tools_config.window_id, this.config);


    const snapshot_config = {
      name: "window_snapshot",
      title: "Snapshot",
      type: "tools",
      autoOpen: this.config.window_snapshot.autoOpen,
      closeable: this.config.window_snapshot.closeable,
      resizable: true,
      left: this.config.window_snapshot.left,
      top: this.config.window_snapshot.top,
      width: this.config.window_snapshot.width,
      height: this.config.window_snapshot.height,
      window_id: 9,
    }
    this.window_snapshot = new Window(
      snapshot_config,
      this.store_window.bind(this),
      this.regain_keyboard_controls.bind(this) // onClose callback
    );
    this.snapshot = new Snapshot(snapshot_config.window_id, this.config, {
      onLoad: this.regain_keyboard_controls.bind(this),
    });

    // playfield
    const playfield_config = {
      name: "window_playfield",
      title: "Playfield",
      type: "playfield",
      autoOpen: this.config.window_playfield.autoOpen,
      closeable: this.config.window_playfield.closeable,
      resizable: false,
      left: this.config.window_playfield.left,
      top: this.config.window_playfield.top,
      window_id: 12,
    };
    this.window_playfield = new Window(
      playfield_config,
      this.store_window.bind(this),
      this.regain_keyboard_controls.bind(this) // onClose callback
    );
    this.playfield = new Playfield(playfield_config.window_id, this.config);

    this.load = new Load(this.config, {
      onLoad: this.update_loaded_file.bind(this),
    });

    // Confirmation dialog for "New File"
    const confirm_config = this.createWindowConfig("window_confirm", "New File", "confirm", 10, {
      modal: true,
      escape: false,
      autoOpen: false,
      width: 400,
    });
    this.window_confirm = new Window(confirm_config);
  }

  private initializeState(): void {
    this.is_drawing = false;
    this.oldpos = { x: 0, y: 0 }; // used when drawing and moving the mouse in editor

    // Try to load auto-saved sprite data
    try {
      const savedSprites = this.storage.read_sprites();
      if (savedSprites?.sprites?.length > 0) {
        this.sprite.set_all(savedSprites);
        status("Restored previous work session");
      } else {
        this.sprite.new_sprite(this.palette.get_color());
      }
    } catch (error) {
      console.error("Failed to restore sprite data, clearing corrupt data:", error);
      this.storage.clear_sprites();
      this.sprite.new_sprite(this.palette.get_color());
    }

    this.mode = "draw"; // modes can be "draw" and "fill"
    this.allow_keyboard_shortcuts = true;
    this.selection = null;
    this.marquee_drawing = false;
    this.move_selection_backup = null;

    tipoftheday();

    this.list.update_all(this.sprite.get_all());
    this.update();
    this.user_interaction();

    // Sync filename to UI after initialization (important for auto-restore)
    const filenameInput = dom.sel("#menubar-filename-input") as HTMLInputElement;
    if (filenameInput) {
      filenameInput.value = this.sprite.get_filename();
    }
  }

  private restoreWindowStates(): void {
    // Restore window open states from config (for closeable windows)
    // Only restore if window is closeable and should be open
    if (this.config.window_animation.closeable && this.config.window_animation.isOpen) {
      this.window_animation.open();
    }
    if (this.config.window_snapshot.closeable && this.config.window_snapshot.isOpen) {
      this.window_snapshot.open();
    }
    if (this.config.window_playfield.closeable && this.config.window_playfield.isOpen) {
      this.window_playfield.open();
    }

    if (this.storage.is_updated_version())
      this.window_about.open();
  }

  /**
   * Helper to create window config with common defaults
   * Reduces repetitive window configuration code
   */
  private createWindowConfig(
    name: string,
    title: string,
    type: string,
    windowId: number,
    options: {
      resizable?: boolean;
      closeable?: boolean;
      left?: number;
      top?: number;
      width?: number | string;
      height?: number | string;
      autoOpen?: boolean;
      modal?: boolean;
      escape?: boolean;
    } = {}
  ) {
    return {
      name,
      title,
      type,
      window_id: windowId,
      resizable: options.resizable ?? false,
      closeable: options.closeable,
      left: options.left,
      top: options.top,
      width: options.width ?? "auto",
      height: options.height ?? "auto",
      autoOpen: options.autoOpen,
      modal: options.modal,
      escape: options.escape,
    };
  }

  /**
   * Handle navigation keys (arrow keys)
   */
  private handleNavigationKeys(e: KeyboardEvent): void {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      this.sprite.set_current_sprite(this.sprite.get_current_sprite_number() - 1);
      this.list.update_all(this.sprite.get_all());
      this.update();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.sprite.set_current_sprite(this.sprite.get_current_sprite_number() + 1);
      this.list.update_all(this.sprite.get_all());
      this.update();
    }
    if (e.key === "ArrowLeft") {
      this.sprite.shift_horizontal("left");
      this.update();
    }
    if (e.key === "ArrowRight") {
      this.sprite.shift_horizontal("right");
      this.update();
    }
  }

  /**
   * Handle tool shortcuts (m, d, e, f, s, Escape, c)
   */
  private handleToolShortcuts(e: KeyboardEvent, isCtrl: boolean): void {
    if (e.key === "m") {
      this.setDrawMode("move");
    }
    if (e.key === "d") {
      this.setDrawMode("draw");
    }
    if (e.key === "e") {
      this.setDrawMode("erase");
    }
    if (e.key === "f") {
      this.setDrawMode("fill");
    }
    if (e.key === "s" && !isCtrl) {
      e.preventDefault();
      // Toggle behavior: if in select mode or has selection, clear and switch to draw
      if (this.mode === "select" || this.selection?.active) {
        this.clearSelection();
        this.setDrawMode("draw");
      } else {
        this.setDrawMode("select");
      }
    }
    if (e.key === "Escape") {
      this.clearSelection();
      this.setDrawMode("draw");
    }
    if (e.key === "c" && !isCtrl) {
      this.sprite.toggle_multicolor();
      this.update();
    }
  }

  /**
   * Handle color shortcuts (1-4 keys)
   */
  private handleColorShortcuts(e: KeyboardEvent): void {
    if (e.key === "1") {
      this.sprite.set_pen(0);
      this.update();
    }
    if (e.key === "2") {
      this.sprite.set_pen(1);
      this.update();
    }
    if (e.key === "3") {
      this.sprite.set_pen(2);
      this.update();
    }
    if (e.key === "4") {
      this.sprite.set_pen(3);
      this.update();
    }
  }

  /**
   * Handle edit shortcuts (Ctrl+Z, N, C, V, D, Delete, I)
   */
  private handleEditShortcuts(e: KeyboardEvent, isCtrl: boolean): void {
    if (e.key === "z" && isCtrl) {
      e.preventDefault();
      if (e.shiftKey) {
        this.sprite.redo();
      } else {
        this.sprite.undo();
      }
      this.list.update_all(this.sprite.get_all());
      this.update();
    }
    if (e.key === "n" && isCtrl) {
      e.preventDefault();
      this.sprite.new_sprite(this.palette.get_color(), this.sprite.is_multicolor());
      this.list.update_all(this.sprite.get_all());
      this.update();
    }
    if (e.key === "c" && isCtrl) {
      e.preventDefault();
      this.sprite.copy();
      this.update_ui();
      status("Sprite copied.");
    }
    if (e.key === "v" && isCtrl) {
      e.preventDefault();
      if (!this.sprite.is_copy_empty()) {
        this.sprite.paste();
        this.update();
        status("Sprite pasted.");
      }
    }
    if (e.key === "d" && isCtrl) {
      e.preventDefault();
      this.sprite.duplicate();
      this.list.update_all(this.sprite.get_all());
      this.update_ui();
      status("Sprite duplicated.");
    }
    if (e.key === "Delete") {
      this.sprite.delete();
      this.list.update_all(this.sprite.get_all());
      this.update();
    }
    if (e.key === "i" && isCtrl) {
      e.preventDefault();
      this.sprite.invert();
      this.update();
    }
  }

  // Helper method to set drawing mode and update UI icons
  setDrawMode(mode: "move" | "draw" | "erase" | "fill" | "select"): void {
    this.mode = mode;
    const modeNames = {
      move: "Move",
      draw: "Draw",
      erase: "Erase",
      fill: "Fill",
      select: "Select"
    };
    status(`${modeNames[mode]} mode`);

    // Update all icon states using CSS classes
    const modes = ["move", "draw", "erase", "fill", "select"];
    modes.forEach(m => {
      const iconElement = dom.sel(`#icon-${m}`);
      if (iconElement) {
        // Special handling for select icon: keep it active if there's an active selection
        if (m === "select" && this.selection?.active) {
          iconElement.classList.add("icon-active");
        } else if (m === mode) {
          iconElement.classList.add("icon-active");
        } else {
          iconElement.classList.remove("icon-active");
        }
      }
    });
  }

  // Helper method to clear selection
  clearSelection(): void {
    this.selection = null;
    this.marquee_drawing = false;

    // Remove active state from select icon when clearing selection
    const selectIcon = dom.sel("#icon-select");
    if (selectIcon && this.mode !== "select") {
      selectIcon.classList.remove("icon-active");
    }

    this.update();
  }

  // Helper method to normalize selection bounds
  normalizeSelection(): void {
    if (!this.selection || !this.selection.start || !this.selection.end) return;

    let x1 = this.selection.start.x;
    let y1 = this.selection.start.y;
    let x2 = this.selection.end.x;
    let y2 = this.selection.end.y;

    // Normalize coordinates (ensure x1 <= x2, y1 <= y2)
    if (x1 > x2) [x1, x2] = [x2, x1];
    if (y1 > y2) [y1, y2] = [y2, y1];

    // Snap to multicolor grid if needed
    const step = this.sprite.is_multicolor() ? 2 : 1;
    x1 = Math.floor(x1 / step) * step;
    x2 = Math.floor(x2 / step) * step;

    // Constrain to sprite boundaries [0, sprite_x-1] × [0, sprite_y-1]
    x1 = Math.max(0, Math.min(x1, this.config.sprite_x - 1));
    x2 = Math.max(0, Math.min(x2, this.config.sprite_x - 1));
    y1 = Math.max(0, Math.min(y1, this.config.sprite_y - 1));
    y2 = Math.max(0, Math.min(y2, this.config.sprite_y - 1));

    // Store normalized bounds
    this.selection.bounds = { x1, y1, x2, y2 };
    this.selection.active = true;
  }

  // Helper method to check if pixel is inside selection
  isPixelInSelection(x: number, y: number): boolean {
    if (!this.selection?.active || !this.selection.bounds) return true;
    const { x1, y1, x2, y2 } = this.selection.bounds;
    return x >= x1 && x <= x2 && y >= y1 && y <= y2;
  }

  // Helper method to update selection bounds during drag (doesn't modify sprite data)
  moveSelectedArea(dx: number, dy: number): void {
    if (!this.selection?.active || !this.selection.bounds || !this.move_selection_backup) return;

    const { x1, y1, x2, y2 } = this.selection.bounds;

    // Update selection bounds - keep original size, allow going outside canvas
    this.selection.bounds = {
      x1: x1 + dx,
      y1: y1 + dy,
      x2: x2 + dx,
      y2: y2 + dy
    };
  }

  // Helper method to apply the final move operation (called on mouse release)
  applyMoveSelection(): void {
    if (!this.selection?.active || !this.selection.bounds || !this.move_selection_backup) return;

    const step = this.sprite.is_multicolor() ? 2 : 1;
    const currentSprite = this.sprite.get_current_sprite();

    // Paste backup data at new position (cut behavior - source was cleared on mousedown)
    // Only paste pixels that are within canvas bounds
    const { x1, y1, x2, y2 } = this.selection.bounds;
    let backupY = 0;
    for (let y = y1; y <= y2; y++) {
      let backupX = 0;
      for (let x = x1; x <= x2; x += step) {
        // Only paste if within canvas bounds
        if (y >= 0 && y < this.config.sprite_y && x >= 0 && x < this.config.sprite_x) {
          if (backupY < this.move_selection_backup.length && backupX < this.move_selection_backup[backupY].length) {
            const pixel = this.move_selection_backup[backupY][backupX];
            currentSprite.pixels[y][x] = pixel;
          }
        }
        backupX++; // Increment by 1, not by step
      }
      backupY++;
    }
  }

  // Helper method to handle zoom and grid controls for editor, preview, and list
  handleZoomGrid(component: "editor" | "preview" | "list" | "playfield", action: "zoom-in" | "zoom-out" | "toggle-grid"): void {
    const comp = this[component];

    if (action === "zoom-in") {
      comp.zoom_in();
      this.config[`window_${component}`].zoom = comp.get_zoom();
      this.storage.write(this.config);
    } else if (action === "zoom-out") {
      comp.zoom_out();
      this.config[`window_${component}`].zoom = comp.get_zoom();
      this.storage.write(this.config);
    } else if (action === "toggle-grid") {
      comp.toggle_grid();
      if (component === "editor") {
        this.config.window_editor.grid = comp.get_grid();
        this.storage.write(this.config);
      }
    }

    // Update list if needed
    if (component === "list") {
      this.list.update_all(this.sprite.get_all());
    }

    this.update();
  }

  // Helper method to bind multiple selectors to the same handler
  bindEvents(selectors: string, handler: () => void): void {
    selectors.split(',').forEach(selector => {
      const el = dom.sel(selector.trim());
      if (el) el.onclick = handler;
    });
  }

  update() {
    const all = this.sprite.get_all();
    this.editor.update(all);
    this.preview.update(all);
    this.animation.update(all);
    this.list.update(all);
    this.palette.update(all);
    this.snapshot.update(all);
    this.playfield.update(all);
    this.update_ui();
  }

  update_ui() {
    if (this.sprite.get_number_of_sprites() > 1) {
      dom.fade("#icon-list-delete", 0.33, 1);
    } else {
      dom.fade("#icon-list-delete", 1, 0.33);
    }

    if (this.sprite.is_copy_empty()) {
      dom.fade("#icon-list-paste", 1, 0.33);
    } else {
      dom.fade("#icon-list-paste", 0.33, 1);
    }

    if (this.sprite.can_undo()) {
      dom.fade("#icon-undo", 0.33, 1);
    } else {
      dom.fade("#icon-undo", 1, 0.33);
    }

    if (this.sprite.can_redo()) {
      dom.fade("#icon-redo", 0.33, 1);
    } else {
      dom.fade("#icon-redo", 1, 0.33);
    }

    if (this.sprite.is_overlay()) {
      dom.attr(
        "#icon-preview-overlay",
        "src",
        "ui/icon-preview-overlay-hi.png"
      );
    } else {
      dom.attr(
        "#icon-preview-overlay",
        "src",
        "ui/icon-preview-overlay.png"
      );
    }

    if (this.sprite.is_double_x()) {
      dom.attr("#icon-preview-x", "src", "ui/icon-preview-x2-hi.png");
    } else {
      dom.attr("#icon-preview-x", "src", "ui/icon-preview-x2.png");
    }

    if (this.sprite.is_double_y()) {
      dom.attr("#icon-preview-y", "src", "ui/icon-preview-y2-hi.png");
    } else {
      dom.attr("#icon-preview-y", "src", "ui/icon-preview-y2.png");
    }

    if (this.preview.is_min_zoom()) {
      dom.fade("#icon-preview-zoom-out", 1, 0.33);
    } else {
      dom.fade("#icon-preview-zoom-out", 0.33, 1);
    }

    if (this.preview.is_max_zoom()) {
      dom.fade("#icon-preview-zoom-in", 1, 0.33);
    } else {
      dom.fade("#icon-preview-zoom-in", 0.33, 1);
    }

    if (this.editor.is_min_zoom()) {
      dom.fade("#icon-editor-zoom-out", 1, 0.33);
    } else {
      dom.fade("#icon-editor-zoom-out", 0.33, 1);
    }

    if (this.editor.is_max_zoom()) {
      dom.fade("#icon-editor-zoom-in", 1, 0.33);
    } else {
      dom.fade("#icon-editor-zoom-in", 0.33, 1);
    }

    if (this.list.is_min_zoom()) {
      dom.fade("#icon-list-zoom-out", 1, 0.33);
    } else {
      dom.fade("#icon-list-zoom-out", 0.33, 1);
    }

    if (this.list.is_max_zoom()) {
      dom.fade("#icon-list-zoom-in", 1, 0.33);
    } else {
      dom.fade("#icon-list-zoom-in", 0.33, 1);
    }

    if (this.playfield.is_min_zoom()) {
      dom.fade("#icon-playfield-zoom-out", 1, 0.33);
    } else {
      dom.fade("#icon-playfield-zoom-out", 0.33, 1);
    }

    if (this.playfield.is_max_zoom()) {
      dom.fade("#icon-playfield-zoom-in", 1, 0.33);
    } else {
      dom.fade("#icon-playfield-zoom-in", 0.33, 1);
    }

    // spritepad style layer
    dom.remove_all_class(".sprite_in_list", "sprite_in_list_selected");
    const container = document.getElementById(this.sprite.get_current_sprite_number().toString());
    const canvas = container?.querySelector(".sprite_in_list");
    if (canvas) {
      canvas.classList.add("sprite_in_list_selected");
    }
  }

  /** 
  check which data is in the object, compare with config data of that window
  and replace the data in the config if matching
  then save to storage 
  */
  store_window(obj) {
    for (const key in obj.data) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.config[obj.name]?.hasOwnProperty(key))
        this.config[obj.name][key] = obj.data[key];
    }
    this.storage.write(this.config);
  }

  update_config() {
    // this gets called after the settings modal has been closed
    this.palette.set_colors(this.config.colors);
    this.storage.write(this.config);
    this.list.update_all(this.sprite.get_all());
    this.update();
    this.regain_keyboard_controls();
    status("Configuration updated.");
  }

  update_loaded_file() {
    // called as a callback event from the load class
    // after a file got loaded in completely
    this.sprite.set_all(this.load.get_imported_file());

    // Sync filename to UI (will use filename from sprite data if it exists)
    const input = dom.sel("#menubar-filename-input") as HTMLInputElement;
    if (input) {
      input.value = this.sprite.get_filename();
    }

    this.list.update_all(this.sprite.get_all());

    // Stop animation when loading a new file, then update all views
    this.animation.update(this.sprite.get_all(), true);
    this.update();
  }

  update_imported_png() {
    // called as a callback event from the importPNG class
    // after a PNG image got imported
    const importedData = this.importPNG.get_imported_file();

    // If multiple sprites were imported (spritesheet), load all of them
    if (importedData.sprites.length > 1) {
      // Use the same approach as loading a file
      this.sprite.set_all(importedData);

      // Sync filename to UI
      const input = dom.sel("#menubar-filename-input") as HTMLInputElement;
      if (input) {
        input.value = this.sprite.get_filename();
      }

      this.list.update_all(this.sprite.get_all());
      this.animation.stop();
      this.animation.update(this.sprite.get_all(), true);
      this.update();
    } else {
      // Single sprite import - create a new sprite
      const importedSprite = importedData.sprites[0];

      // Create a new sprite with the imported properties
      this.sprite.new_sprite(importedSprite.color, importedSprite.multicolor);

      // Get the newly created sprite (it's now the current sprite)
      const currentSprite = this.sprite.get_current_sprite();

      // Update its pixels and properties
      currentSprite.pixels = importedSprite.pixels;
      currentSprite.double_x = importedSprite.double_x;
      currentSprite.double_y = importedSprite.double_y;
      currentSprite.overlay = importedSprite.overlay;

      // Update the global colors if they're from a multicolor sprite
      if (importedSprite.multicolor) {
        const allData = this.sprite.get_all();
        allData.colors[2] = importedData.colors[2]; // multicolor1
        allData.colors[3] = importedData.colors[3]; // multicolor2
      }

      this.list.update_all(this.sprite.get_all());
      this.animation.update(this.sprite.get_all(), true);
      this.update();
    }
  }

  regain_keyboard_controls() {
    // this will be called whenever keyboard controls have been deactivated, e.g. for input fields
    // currently used as callback after the save dialog
    this.allow_keyboard_shortcuts = true;
  }

  update_sprite_name() {
    // checks the sprite name input box for the name
    // and updates the sprite name
    this.allow_keyboard_shortcuts = true;
    let sprite_name: string = dom.val("#input-sprite-name") || "";
    sprite_name = sprite_name.replace(/[^A-Za-z0-9-_]+/g, ""); // allowed chars are characters, number, -, _
    this.sprite.set_sprite_name(sprite_name);
    this.list.update_all(this.sprite.get_all());
    this.update();
  }

  user_interaction() {
    /*

KKKKKKKKK    KKKKKKK   EEEEEEEEEEEEEEEEEEEEEE   YYYYYYY       YYYYYYY      SSSSSSSSSSSSSSS 
K:::::::K    K:::::K   E::::::::::::::::::::E   Y:::::Y       Y:::::Y    SS:::::::::::::::S
K:::::::K    K:::::K   E::::::::::::::::::::E   Y:::::Y       Y:::::Y   S:::::SSSSSS::::::S
K:::::::K   K::::::K   EE::::::EEEEEEEEE::::E   Y::::::Y     Y::::::Y   S:::::S     SSSSSSS
KK::::::K  K:::::KKK     E:::::E       EEEEEE   YYY:::::Y   Y:::::YYY   S:::::S            
  K:::::K K:::::K        E:::::E                   Y:::::Y Y:::::Y      S:::::S            
  K::::::K:::::K         E::::::EEEEEEEEEE          Y:::::Y:::::Y        S::::SSSS         
  K:::::::::::K          E:::::::::::::::E           Y:::::::::Y          SS::::::SSSSS    
  K:::::::::::K          E:::::::::::::::E            Y:::::::Y             SSS::::::::SS  
  K::::::K:::::K         E::::::EEEEEEEEEE             Y:::::Y                 SSSSSS::::S 
  K:::::K K:::::K        E:::::E                       Y:::::Y                      S:::::S
KK::::::K  K:::::KKK     E:::::E       EEEEEE          Y:::::Y                      S:::::S
K:::::::K   K::::::K   EE::::::EEEEEEEE:::::E          Y:::::Y          SSSSSSS     S:::::S
K:::::::K    K:::::K   E::::::::::::::::::::E       YYYY:::::YYYY       S::::::SSSSSS:::::S
K:::::::K    K:::::K   E::::::::::::::::::::E       Y:::::::::::Y       S:::::::::::::::SS 
KKKKKKKKK    KKKKKKK   EEEEEEEEEEEEEEEEEEEEEE       YYYYYYYYYYYYY        SSSSSSSSSSSSSSS  

*/

    document.addEventListener("keydown", (e) => {
      if (!this.allow_keyboard_shortcuts) return;

      const isCtrl = e.ctrlKey;

      // Performance test (debug only)
      if (e.key === "a") {
        console.time("performance");
        for (let i = 0; i <= 1000; i++) this.update();
        console.timeEnd("performance");
        return;
      }

      // Handle different key categories
      this.handleNavigationKeys(e);
      this.handleToolShortcuts(e, isCtrl);
      this.handleColorShortcuts(e);
      this.handleEditShortcuts(e, isCtrl);
    });

    /*

MMMMMMMM               MMMMMMMMEEEEEEEEEEEEEEEEEEEEEENNNNNNNN        NNNNNNNNUUUUUUUU     UUUUUUU  
M:::::::M             M:::::::ME::::::::::::::::::::EN:::::::N       N::::::NU::::::U     U:::::U 
M::::::::M           M::::::::ME::::::::::::::::::::EN::::::::N      N::::::NU::::::U     U:::::U
M:::::::::M         M:::::::::MEE::::::EEEEEEEEE::::EN:::::::::N     N::::::NUU:::::U     U:::::U
M::::::::::M       M::::::::::M  E:::::E       EEEEEEN::::::::::N    N::::::N U:::::U     U:::::U  
M:::::::::::M     M:::::::::::M  E:::::E             N:::::::::::N   N::::::N U:::::D     D:::::U
M:::::::M::::M   M::::M:::::::M  E::::::EEEEEEEEEE   N:::::::N::::N  N::::::N U:::::D     D:::::U
M::::::M M::::M M::::M M::::::M  E:::::::::::::::E   N::::::N N::::N N::::::N U:::::D     D:::::U
M::::::M  M::::M::::M  M::::::M  E:::::::::::::::E   N::::::N  N::::N:::::::N U:::::D     D:::::U
M::::::M   M:::::::M   M::::::M  E::::::EEEEEEEEEE   N::::::N   N:::::::::::N U:::::D     D:::::U
M::::::M    M:::::M    M::::::M  E:::::E             N::::::N    N::::::::::N U:::::D     D:::::U
M::::::M     MMMMM     M::::::M  E:::::E       EEEEEEN::::::N     N:::::::::N U::::::U   U::::::U
M::::::M               M::::::MEE::::::EEEEEEEE:::::EN::::::N      N::::::::N U:::::::UUU:::::::U
M::::::M               M::::::ME::::::::::::::::::::EN::::::N       N:::::::N  UU:::::::::::::UU
M::::::M               M::::::ME::::::::::::::::::::EN::::::N        N::::::N    UU:::::::::UU
MMMMMMMM               MMMMMMMMEEEEEEEEEEEEEEEEEEEEEENNNNNNNN         NNNNNNN      UUUUUUUUU


 */

    /*

  SPRITEMATE

*/

    dom.sel("#menubar-info").onclick = () => {
      this.allow_keyboard_shortcuts = false;
      this.window_about.open();
    };

    dom.sel("#menubar-settings").onclick = () => {
      this.allow_keyboard_shortcuts = false;
      this.window_settings.open();
    };

    /*

  FILE

*/

    dom.sel("#menubar-load").onclick = () => {
      dom.sel("#input-load").click();
    };

    dom.sel("#menubar-import").onclick = () => {
      dom.sel("#input-import").click();
    };

    dom.sel("#menubar-import-png").onclick = () => {
      dom.sel("#input-import-png").click();
    };

    // Direct save handlers
    this.setupDirectSaveHandler("#menubar-save-spm", () => this.save.save_spm());
    this.setupDirectSaveHandler("#menubar-save-spd", () => this.save.save_spd("new"));
    this.setupDirectSaveHandler("#menubar-save-spd-old", () => this.save.save_spd("old"));

    // Direct export handlers for nested submenus
    this.setupDirectExportHandler("#menubar-export-kick-hex", () => this.export.save_assembly("kick", false));
    this.setupDirectExportHandler("#menubar-export-kick-binary", () => this.export.save_assembly("kick", true));
    this.setupDirectExportHandler("#menubar-export-acme-hex", () => this.export.save_assembly("acme", false));
    this.setupDirectExportHandler("#menubar-export-acme-binary", () => this.export.save_assembly("acme", true));
    this.setupDirectExportHandler("#menubar-export-basic", () => this.export.save_basic());
    this.setupDirectExportHandler("#menubar-export-png-current", () => this.export.save_png_current());
    this.setupDirectExportHandler("#menubar-export-png-all", () => this.export.save_png_all());

    const exportSpritesheetBtn = dom.sel("#menubar-export-spritesheet");
    if (exportSpritesheetBtn) {
      exportSpritesheetBtn.onclick = () => {
        this.allow_keyboard_shortcuts = false;
        this.window_export.open();
        this.export.set_save_data(this.sprite.get_all());
      };
    }

    dom.sel("#menubar-new").onclick = () => {
      // Add confirm dialog content
      const confirmContent = this.window_confirm.getDialog().getContent();
      confirmContent.innerHTML = `
        <p>All current data will be erased. Are you sure?</p>
        <div style="text-align: right; margin-top: 20px;">
          <button id="confirm-ok" class="confirm-button">Ok</button>
          <button id="confirm-cancel" class="confirm-button">Cancel</button>
        </div>
      `;

      // Setup button handlers
      dom.sel("#confirm-ok").onclick = () => {
        this.sprite = new Sprite(this.config, this.storage);
        this.sprite.new_sprite(this.palette.get_color());
        this.storage.clear_sprites(); // Clear auto-saved data

        // Reset filename to default in UI
        const filenameInput = dom.sel("#menubar-filename-input") as HTMLInputElement;
        if (filenameInput) {
          filenameInput.value = this.sprite.get_filename();
        }

        this.list.update_all(this.sprite.get_all());
        this.update();
        this.window_confirm.close();
        status("New file created.");
      };

      dom.sel("#confirm-cancel").onclick = () => {
        this.window_confirm.close();
      };

      this.window_confirm.open();
    };

    dom.sel("#menubar-animation").onclick = () => {
      if (this.window_animation.isOpen()) {
        this.window_animation.close();
        this.config.window_animation.isOpen = false;
      } else {
        this.window_animation.open();
        this.config.window_animation.isOpen = true;
      }
      this.storage.write(this.config);
    };

    dom.sel("#menubar-playfield").onclick = () => {
      if (this.window_playfield.isOpen()) {
        this.window_playfield.close();
        this.config.window_playfield.isOpen = false;
      } else {
        this.window_playfield.open();
        this.config.window_playfield.isOpen = true;
      }
      this.storage.write(this.config);
    };

    dom.sel("#menubar-monitor").onclick = () => {
      if (this.window_snapshot.isOpen()) {
        this.window_snapshot.close();
        this.config.window_snapshot.isOpen = false;
      } else {
        this.window_snapshot.open();
        this.config.window_snapshot.isOpen = true;
      }
      this.storage.write(this.config);
    };

    /*

  EDIT

*/

    this.bindEvents("#menubar-undo, #icon-undo", () => {
      this.sprite.undo();
      this.list.update_all(this.sprite.get_all());
      this.update();
    });

    this.bindEvents("#menubar-redo, #icon-redo", () => {
      this.sprite.redo();
      this.list.update_all(this.sprite.get_all());
      this.update();
    });

    dom.sel("#menubar-new-sprite").onclick = () => {
      this.sprite.new_sprite(
        this.palette.get_color(),
        this.sprite.is_multicolor()
      );
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#menubar-kill").onclick = () => {
      this.sprite.delete();
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#menubar-copy").onclick = () => {
      this.sprite.copy();
      this.update_ui();
      status("Sprite copied.");
    };

    dom.sel("#menubar-paste").onclick = () => {
      if (!this.sprite.is_copy_empty()) {
        this.sprite.paste();
        this.update();
        status("Sprite pasted.");
      } else {
        status("Nothing to copy.", "error");
      }
    };

    dom.sel("#menubar-duplicate").onclick = () => {
      this.sprite.duplicate();
      this.list.update_all(this.sprite.get_all());
      this.update_ui();
      status("Sprite duplicated.");
    };

    /*

  SPRITE

*/

    dom.sel("#menubar-shift-left").onclick = () => {
      this.sprite.shift_horizontal("left");
      this.update();
    };

    dom.sel("#menubar-shift-right").onclick = () => {
      this.sprite.shift_horizontal("right");
      this.update();
    };

    dom.sel("#menubar-shift-up").onclick = () => {
      this.sprite.shift_vertical("up");
      this.update();
    };

    dom.sel("#menubar-shift-down").onclick = () => {
      this.sprite.shift_vertical("down");
      this.update();
    };

    dom.sel("#menubar-flip-horizontal").onclick = () => {
      this.sprite.flip_horizontal();
      this.update();
    };

    dom.sel("#menubar-flip-vertical").onclick = () => {
      this.sprite.flip_vertical();
      this.update();
    };

    dom.sel("#menubar-colormode").onclick = () => {
      this.sprite.toggle_multicolor();
      this.update();
    };

    dom.sel("#menubar-stretch-x").onclick = () => {
      this.sprite.toggle_double_x();
      this.update();
    };

    dom.sel("#menubar-stretch-y").onclick = () => {
      this.sprite.toggle_double_y();
      this.update();
    };

    dom.sel("#menubar-invert").onclick = () => {
      this.sprite.invert();
      this.update();
    };

    dom.sel("#menubar-overlay").onclick = () => {
      this.sprite.toggle_overlay();
      this.update();
    };

    /*

  VIEW

*/

    dom.sel("#menubar-fullscreen").onclick = () => {
      toggle_fullscreen();
    };

    /*

    PREVIEW

*/

    dom.sel("#icon-preview-zoom-in").onclick = () => this.handleZoomGrid("preview", "zoom-in");
    dom.sel("#icon-preview-zoom-out").onclick = () => this.handleZoomGrid("preview", "zoom-out");

    dom.sel("#icon-preview-x").onclick = () => {
      this.sprite.toggle_double_x();
      this.update();
    };

    dom.sel("#icon-preview-y").onclick = () => {
      this.sprite.toggle_double_y();
      this.update();
    };

    dom.sel("#icon-preview-overlay").onclick = () => {
      this.sprite.toggle_overlay();
      this.update();
    };

    /*

    ANIMATION

*/

    const animZoomIn = dom.sel("#icon-animation-zoom-in");
    if (animZoomIn) {
      animZoomIn.onclick = () => {
        this.animation.zoom_in();
        this.config.window_animation.zoom = this.animation.get_zoom();
        this.storage.write(this.config);
        this.update();
      };
    }

    const animZoomOut = dom.sel("#icon-animation-zoom-out");
    if (animZoomOut) {
      animZoomOut.onclick = () => {
        this.animation.zoom_out();
        this.config.window_animation.zoom = this.animation.get_zoom();
        this.storage.write(this.config);
        this.update();
      };
    }

    const animXButton = dom.sel("#icon-animation-x");
    if (animXButton) {
      animXButton.onclick = () => {
        this.animation.toggleDoubleX();
      };
    }

    const animYButton = dom.sel("#icon-animation-y");
    if (animYButton) {
      animYButton.onclick = () => {
        this.animation.toggleDoubleY();
      };
    }

    /*


    

TTTTTTTTTTTTTTTTTTTTTTT      OOOOOOOOO         OOOOOOOOO      LLLLLLLLLLL                 SSSSSSSSSSSSSSS 
T:::::::::::::::::::::T    OO:::::::::OO     OO:::::::::OO    L:::::::::L               SS:::::::::::::::S
T:::::::::::::::::::::T  OO:::::::::::::OO OO:::::::::::::OO  L:::::::::L              S:::::SSSSSS::::::S
T:::::TT:::::::TT:::::T O:::::::OOO:::::::O:::::::OOO:::::::O LL:::::::LL              S:::::S     SSSSSSS
TTTTTT  T:::::T  TTTTTT O::::::O   O::::::O::::::O   O::::::O   L:::::L                S:::::S            
        T:::::T         O:::::O     O:::::O:::::O     O:::::O   L:::::L                S:::::S            
        T:::::T         O:::::O     O:::::O:::::O     O:::::O   L:::::L                 S::::SSSS         
        T:::::T         O:::::O     O:::::O:::::O     O:::::O   L:::::L                  SS::::::SSSSS    
        T:::::T         O:::::O     O:::::O:::::O     O:::::O   L:::::L                    SSS::::::::SS  
        T:::::T         O:::::O     O:::::O:::::O     O:::::O   L:::::L                       SSSSSS::::S 
        T:::::T         O:::::O     O:::::O:::::O     O:::::O   L:::::L                            S:::::S
        T:::::T         O::::::O   O::::::O::::::O   O::::::O   L:::::L         LLLLLL             S:::::S
      TT:::::::TT       O:::::::OOO:::::::O:::::::OOO:::::::O LL:::::::LLLLLLLLL:::::L SSSSSSS     S:::::S
      T:::::::::T        OO:::::::::::::OO OO:::::::::::::OO  L::::::::::::::::::::::L S::::::SSSSSS:::::S
      T:::::::::T          OO:::::::::OO     OO:::::::::OO    L::::::::::::::::::::::L S:::::::::::::::SS 
      TTTTTTTTTTT            OOOOOOOOO         OOOOOOOOO      LLLLLLLLLLLLLLLLLLLLLLLL  SSSSSSSSSSSSSSS  



*/

    dom.sel("#icon-move").onclick = () => this.setDrawMode("move");
    dom.sel("#icon-draw").onclick = () => this.setDrawMode("draw");
    dom.sel("#icon-erase").onclick = () => this.setDrawMode("erase");
    dom.sel("#icon-fill").onclick = () => this.setDrawMode("fill");
    dom.sel("#icon-select").onclick = () => {
      // Toggle behavior: if there's an active selection OR in select mode, clear and switch to draw
      if (this.selection?.active || this.mode === "select") {
        this.clearSelection();
        this.setDrawMode("draw");
      } else {
        this.setDrawMode("select");
      }
    };

    /*

        CCCCCCCCCCCCC     OOOOOOOOO     LLLLLLLLLLL                  OOOOOOOOO     RRRRRRRRRRRRRRRRR      SSSSSSSSSSSSSSS 
     CCC::::::::::::C   OO:::::::::OO   L:::::::::L                OO:::::::::OO   R::::::::::::::::R   SS:::::::::::::::S
   CC:::::::::::::::C OO:::::::::::::OO L:::::::::L              OO:::::::::::::OO R::::::RRRRRR:::::R S:::::SSSSSS::::::S
  C:::::CCCCCCCC::::CO:::::::OOO:::::::OLL:::::::LL             O:::::::OOO:::::::ORR:::::R     R:::::RS:::::S     SSSSSSS
 C:::::C       CCCCCCO::::::O   O::::::O  L:::::L               O::::::O   O::::::O  R::::R     R:::::RS:::::S            
C:::::C              O:::::O     O:::::O  L:::::L               O:::::O     O:::::O  R::::R     R:::::RS:::::S            
C:::::C              O:::::O     O:::::O  L:::::L               O:::::O     O:::::O  R::::RRRRRR:::::R  S::::SSSS         
C:::::C              O:::::O     O:::::O  L:::::L               O:::::O     O:::::O  R:::::::::::::RR    SS::::::SSSSS    
C:::::C              O:::::O     O:::::O  L:::::L               O:::::O     O:::::O  R::::RRRRRR:::::R     SSS::::::::SS  
C:::::C              O:::::O     O:::::O  L:::::L               O:::::O     O:::::O  R::::R     R:::::R       SSSSSS::::S 
C:::::C              O:::::O     O:::::O  L:::::L               O:::::O     O:::::O  R::::R     R:::::R            S:::::S
 C:::::C       CCCCCCO::::::O   O::::::O  L:::::L         LLLLLLO::::::O   O::::::O  R::::R     R:::::R            S:::::S
  C:::::CCCCCCCC::::CO:::::::OOO:::::::OLL:::::::LLLLLLLLL:::::LO:::::::OOO:::::::ORR:::::R     R:::::RSSSSSSS     S:::::S
   CC:::::::::::::::C OO:::::::::::::OO L::::::::::::::::::::::L OO:::::::::::::OO R::::::R     R:::::RS::::::SSSSSS:::::S
     CCC::::::::::::C   OO:::::::::OO   L::::::::::::::::::::::L   OO:::::::::OO   R::::::R     R:::::RS:::::::::::::::SS 
        CCCCCCCCCCCCC     OOOOOOOOO     LLLLLLLLLLLLLLLLLLLLLLLL     OOOOOOOOO     RRRRRRRR     RRRRRRR SSSSSSSSSSSSSSS   

*/

    dom.sel("#palette_all_colors").onclick = (e) => {
      this.palette.set_active_color(e);
      this.sprite.set_pen_color(this.palette.get_color());
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#palette_1").onclick = () => {
      this.sprite.set_pen(1);
      this.update();
    };

    dom.sel("#palette_0").onclick = () => {
      this.sprite.set_pen(0);
      this.update();
    };

    dom.sel("#palette_2").onclick = () => {
      this.sprite.set_pen(2);
      this.update();
    };

    dom.sel("#palette_3").onclick = () => {
      this.sprite.set_pen(3);
      this.update();
    };

    /* 

EEEEEEEEEEEEEEEEEEEEEE   DDDDDDDDDDDDD         IIIIIIIIII   TTTTTTTTTTTTTTTTTTTTTTT    
E::::::::::::::::::::E   D::::::::::::DDD      I::::::::I   T:::::::::::::::::::::T 
E::::::::::::::::::::E   D:::::::::::::::DD    I::::::::I   T:::::::::::::::::::::T
EE::::::EEEEEEEEE::::E   DDD:::::DDDDD:::::D   II::::::II   T:::::TT:::::::TT:::::T
  E:::::E       EEEEEE     D:::::D    D:::::D    I::::I     TTTTTT  T:::::T  TTTTTT
  E:::::E                  D:::::D     D:::::D   I::::I             T:::::T        
  E::::::EEEEEEEEEE        D:::::D     D:::::D   I::::I             T:::::T        
  E:::::::::::::::E        D:::::D     D:::::D   I::::I             T:::::T         
  E:::::::::::::::E        D:::::D     D:::::D   I::::I             T:::::T        
  E::::::EEEEEEEEEE        D:::::D     D:::::D   I::::I             T:::::T        
  E:::::E                  D:::::D     D:::::D   I::::I             T:::::T       
  E:::::E       EEEEEE     D:::::D    D:::::D    I::::I             T:::::T       
EE::::::EEEEEEEE:::::E   DDD:::::DDDDD:::::D   II::::::II         TT:::::::TT     
E::::::::::::::::::::E   D:::::::::::::::DD    I::::::::I         T:::::::::T     
E::::::::::::::::::::E   D::::::::::::DDD      I::::::::I         T:::::::::T      
EEEEEEEEEEEEEEEEEEEEEE   DDDDDDDDDDDDD         IIIIIIIIII         TTTTTTTTTTT        

*/

    dom.sel("#icon-editor-zoom-in").onclick = () => this.handleZoomGrid("editor", "zoom-in");
    dom.sel("#icon-editor-zoom-out").onclick = () => this.handleZoomGrid("editor", "zoom-out");
    dom.sel("#icon-editor-grid").onclick = () => this.handleZoomGrid("editor", "toggle-grid");

    dom.sel("#icon-flip-horizontal").onclick = () => {
      this.sprite.flip_horizontal();
      this.update();
    };

    dom.sel("#icon-flip-vertical").onclick = () => {
      this.sprite.flip_vertical();
      this.update();
    };

    dom.sel("#icon-multicolor").onclick = () => {
      this.sprite.toggle_multicolor();
      this.update();
    };

    dom.sel("#input-sprite-name").onfocus = () => {
      this.allow_keyboard_shortcuts = false;
    };

    dom.sel("#snapshot-console").onfocus = () => {
      this.allow_keyboard_shortcuts = false;
    };

    dom.sel("#snapshot-console").onblur = () => {
      this.allow_keyboard_shortcuts = true;
    };

    dom.sel("#input-sprite-name").onkeyup = (e) => {
      if (e.key === "Enter") {
        this.update_sprite_name();
        dom.sel("#input-sprite-name").blur();
      }
    };

    dom.sel("#input-sprite-name").onblur = () => {
      this.update_sprite_name();
    };

    // Shared handler for pointer down (mouse/touch)
    const handlePointerDown = (e: MouseEvent | TouchEvent, shiftKey: boolean) => {
      if (this.mode === "select") {
        const pixel = this.editor.get_pixel(e);
        this.marquee_drawing = true;
        this.selection = {
          active: false,
          start: pixel,
          end: pixel,
          bounds: null
        };
        this.update();
        return;
      }

      if (this.mode === "draw") {
        this.sprite.set_pixel(this.editor.get_pixel(e), shiftKey);
        this.is_drawing = true;
      }

      if (this.mode === "erase") {
        this.sprite.set_pixel(this.editor.get_pixel(e), true);
        this.is_drawing = true;
      }

      if (this.mode === "fill") {
        this.sprite.floodfill(this.editor.get_pixel(e));
      }

      if (this.mode === "move") {
        this.move_start = true;
        this.move_start_pos = this.editor.get_pixel(e);

        // If there's an active selection, backup the selected pixels and clear the source
        if (this.selection?.active && this.selection.bounds) {
          const { x1, y1, x2, y2 } = this.selection.bounds;
          const step = this.sprite.is_multicolor() ? 2 : 1;
          const currentSprite = this.sprite.get_current_sprite();

          // Backup selected area (cut, not copy)
          this.move_selection_backup = [];
          for (let y = y1; y <= y2; y++) {
            const row: number[] = [];
            for (let x = x1; x <= x2; x += step) {
              row.push(currentSprite.pixels[y][x]);
              // Clear the source pixel (cut behavior)
              currentSprite.pixels[y][x] = 0;
            }
            this.move_selection_backup.push(row);
          }
        }
      }
      this.update();
    };

    // Shared handler for pointer move (mouse/touch)
    const handlePointerMove = (e: MouseEvent | TouchEvent, shiftKey: boolean) => {
      if (this.marquee_drawing && this.mode === "select") {
        const newpos = this.editor.get_pixel(e);
        if (this.selection) {
          this.selection.end = newpos;
          this.normalizeSelection();
        }
        this.update();
        return;
      }

      if (this.is_drawing && (this.mode === "draw" || this.mode === "erase")) {
        const newpos = this.editor.get_pixel(e);
        // only draw if the pointer has entered a new pixel area (just for performance)
        if (newpos.x != this.oldpos.x || newpos.y != this.oldpos.y) {
          const all = this.sprite.get_all();
          let delete_trigger = shiftKey;
          if (this.mode === "erase") delete_trigger = true;
          this.sprite.set_pixel(newpos, delete_trigger);
          this.editor.update(all);
          this.preview.update(all);
          this.list.update(all);
          this.oldpos = newpos;
        }
      }

      if (this.move_start) {
        const currentPos = this.editor.get_pixel(e);
        const x_diff = currentPos.x - this.move_start_pos.x;
        const y_diff = currentPos.y - this.move_start_pos.y;

        if (this.selection?.active && this.move_selection_backup) {
          // Move selection content
          const step = this.sprite.is_multicolor() ? 2 : 1;

          // Only move when accumulated movement reaches step threshold
          const dx = Math.abs(x_diff) >= step ? Math.sign(x_diff) * step : 0;
          const dy = Math.abs(y_diff) >= 1 ? Math.sign(y_diff) : 0;

          if (dx !== 0 || dy !== 0) {
            this.moveSelectedArea(dx, dy);
            this.move_start_pos.x += dx;
            this.move_start_pos.y += dy;
            this.update();
          }
        } else {
          // Move entire sprite
          if (x_diff > 0) {
            this.sprite.shift_horizontal("right");
          }
          if (x_diff < 0) {
            this.sprite.shift_horizontal("left");
          }
          if (y_diff > 0) {
            this.sprite.shift_vertical("down");
          }
          if (y_diff < 0) {
            this.sprite.shift_vertical("up");
          }

          if (x_diff || y_diff) {
            this.move_start_pos = currentPos;
            this.update();
          }
        }
      }
    };

    // Shared handler for pointer up (mouse/touch)
    const handlePointerUp = () => {
      // Finalize selection
      if (this.marquee_drawing) {
        this.marquee_drawing = false;
        if (this.selection) {
          this.normalizeSelection();
        }
        // Don't save backup (selection isn't a mutation)
        this.update();
        return;
      }

      // stop drawing pixels
      this.is_drawing = false;

      // Finalize move operation
      if (this.move_start) {
        this.move_start = false;

        // Apply the move if there was a selection
        if (this.move_selection_backup) {
          this.applyMoveSelection();
          this.move_selection_backup = null;
        }

        this.sprite.save_backup();
        this.update();
        return;
      }

      this.sprite.save_backup();
      this.update();
    };

    // Touch event handlers
    dom.sel("#editor").ontouchstart = (e: TouchEvent) => {
      e.preventDefault();
      handlePointerDown(e, false);
    };

    dom.sel("#editor").ontouchmove = (e: TouchEvent) => {
      e.preventDefault();
      handlePointerMove(e, false);
    };

    dom.sel("#editor").ontouchend = (e: TouchEvent) => {
      e.preventDefault();
      handlePointerUp();
    };

    // Mouse event handlers
    dom.sel("#editor").onmousedown = (e) => {
      handlePointerDown(e, e.shiftKey);
    };

    dom.sel("#editor").onmousemove = (e) => {
      handlePointerMove(e, e.shiftKey);
    };

    dom.sel("#editor").onclick = () => {
      handlePointerUp();
    };

    /*

LLLLLLLLLLL                IIIIIIIIII      SSSSSSSSSSSSSSS    TTTTTTTTTTTTTTTTTTTTTTT
L:::::::::L                I::::::::I    SS:::::::::::::::S   T:::::::::::::::::::::T
L:::::::::L                I::::::::I   S:::::SSSSSS::::::S   T:::::::::::::::::::::T
LL:::::::LL                II::::::II   S:::::S     SSSSSSS   T:::::TT:::::::TT:::::T
  L:::::L                    I::::I     S:::::S               TTTTTT  T:::::T  TTTTTT
  L:::::L                    I::::I     S:::::S                       T:::::T        
  L:::::L                    I::::I      S::::SSSS                    T:::::T        
  L:::::L                    I::::I       SS::::::SSSSS               T:::::T        
  L:::::L                    I::::I         SSS::::::::SS             T:::::T        
  L:::::L                    I::::I            SSSSSS::::S            T:::::T        
  L:::::L                    I::::I                 S:::::S           T:::::T        
  L:::::L         LLLLLL     I::::I                 S:::::S           T:::::T        
LL:::::::LLLLLLLLL:::::L   II::::::II   SSSS        S:::::S         TT:::::::TT      
L::::::::::::::::::::::L   I::::::::I   S::::::SSSSSS:::::S         T:::::::::T      
L::::::::::::::::::::::L   I::::::::I   S:::::::::::::::SS          T:::::::::T      
LLLLLLLLLLLLLLLLLLLLLLLL   IIIIIIIIII    SSSSSSSSSSSSSSS            TTTTTTTTTTT  

*/

    dom.sel("#icon-list-grid").onclick = () => this.handleZoomGrid("list", "toggle-grid");
    dom.sel("#icon-list-zoom-in").onclick = () => this.handleZoomGrid("list", "zoom-in");
    dom.sel("#icon-list-zoom-out").onclick = () => this.handleZoomGrid("list", "zoom-out");

    dom.sel("#icon-list-info").onclick = () => {
      this.list.toggle_info_overlay();
      this.list.update_all(this.sprite.get_all());
    };

    dom.sel("#icon-list-new").onclick = () => {
      this.sprite.new_sprite(
        this.palette.get_color(),
        this.sprite.is_multicolor()
      );
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#icon-list-delete").onclick = () => {
      this.sprite.delete();
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#icon-list-copy").onclick = () => {
      this.sprite.copy();
      this.update_ui();
      status("Sprite copied.");
    };

    dom.sel("#icon-list-paste").onclick = () => {
      if (!this.sprite.is_copy_empty()) {
        this.sprite.paste();
        this.update();
        status("Sprite pasted.");
      } else {
        status("Nothing to copy.", "error");
      }
    };

    dom.sel("#icon-list-duplicate").onclick = () => {
      this.sprite.duplicate();
      this.list.update_all(this.sprite.get_all());
      this.update_ui();
      status("Sprite duplicated.");
    };

    const playfieldButton = dom.sel("#icon-list-send-to-playfield");
    if (playfieldButton) {
      playfieldButton.onclick = () => {
        const currentSpriteIndex = this.sprite.get_current_sprite_number();
        const all = this.sprite.get_all();

        if (!all || !all.sprites || !all.sprites[currentSpriteIndex]) {
          status("No sprite selected.", "error");
          return;
        }

        const spriteData = all.sprites[currentSpriteIndex];
        const spriteName = spriteData.name || `Sprite ${currentSpriteIndex + 1}`;

        // Open playfield window if not already open
        if (!this.window_playfield.isOpen()) {
          this.window_playfield.open();
          this.config.window_playfield.isOpen = true;
          this.storage.write(this.config);
        }

        // Add sprite to playfield
        this.playfield.addSprite(currentSpriteIndex, spriteName, spriteData);
        status("Sprite sent to playfield.");
      };
    } else {
      console.error("Playfield button not found!");
    }

    // Playfield zoom controls
    dom.sel("#icon-playfield-zoom-in").onclick = () => this.handleZoomGrid("playfield", "zoom-in");
    dom.sel("#icon-playfield-zoom-out").onclick = () => this.handleZoomGrid("playfield", "zoom-out");

    dom.sel("#spritelist").onclick = () => {
      if (!this.dragging) {
        this.sprite.set_current_sprite(this.list.get_clicked_sprite());
        if (!this.sprite.is_multicolor() && this.sprite.is_pen_multicolor()) {
          this.sprite.set_pen(1);
        }
        this.clearSelection();
        this.update();
      }
    };

    // Setup sortable callbacks
    this.list.setSortStartCallback(() => {
      this.dragging = true;
    });

    this.list.setSortCallback((sortedIds: string[]) => {
      this.sprite.sort_spritelist(sortedIds);
      this.dragging = false;
      this.list.update_all(this.sprite.get_all());
      this.update();
    });

    // Setup filename input in menubar
    const filenameInput = dom.sel("#menubar-filename-input");
    if (filenameInput) {
      filenameInput.oninput = () => {
        const value = dom.val("#menubar-filename-input");
        if (value && value.length > 0) {
          // Valid filename - sync to sprite data
          dom.remove_class("#menubar-filename-input", "error");
          this.sprite.set_filename(value);
        } else {
          // Invalid filename
          dom.add_class("#menubar-filename-input", "error");
        }
      };

      // Disable keyboard shortcuts when typing in filename input
      filenameInput.onfocus = () => {
        this.allow_keyboard_shortcuts = false;
      };

      filenameInput.onblur = () => {
        this.allow_keyboard_shortcuts = true;
      };
    }
  }

  get_filename(): string {
    // Get filename from sprite data (single source of truth)
    return this.sprite.get_filename();
  }

  set_filename(filename: string): void {
    // Set filename in sprite data and sync to UI
    this.sprite.set_filename(filename);
    const input = dom.sel("#menubar-filename-input") as HTMLInputElement;
    if (input) {
      input.value = filename;
    }
  }

  private setupDirectSaveHandler(selector: string, handler: () => void): void {
    const btn = dom.sel(selector);
    if (btn) {
      btn.onclick = () => {
        this.save.set_save_data(this.sprite.get_all());
        handler();
      };
    }
  }

  private setupDirectExportHandler(selector: string, handler: () => void): void {
    const btn = dom.sel(selector);
    if (btn) {
      btn.onclick = () => {
        this.export.set_save_data(this.sprite.get_all());
        handler();
      };
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  window.app = new App(get_config());
});
