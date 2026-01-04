
import { dom } from "./helper";
import Window_Controls from "./Window_Controls";
import { Sortable } from "./Sortable";

export default class List extends Window_Controls {
  clicked_sprite: number;
  sorted_array: any = [];
  grid: boolean;
  info_overlay: boolean;
  private sortable: Sortable | null = null;
  private onSortCallback: ((sortedArray: string[]) => void) | null = null;
  private onSortStartCallback: (() => void) | null = null;

  constructor(public window: number, public config) {
    super();
    this.config = config;
    this.window = window;
    this.zoom = this.config.window_list.zoom;
    this.zoom_min = this.config.zoom_limits.list.min;
    this.zoom_max = this.config.zoom_limits.list.max;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;
    this.clicked_sprite = 0;
    this.sorted_array = [];
    this.grid = true;
    this.info_overlay = false;

    const template = `
      <div class="window_menu">
      <div class="window_menu_icon_area">
          <img src="ui/icon-zoom-in.png" class="icon-hover" id="icon-list-zoom-in" title="zoom in">
          <img src="ui/icon-zoom-out.png" class="icon-hover" id="icon-list-zoom-out" title="zoom out">
          <img src="ui/icon-grid.png" class="icon-hover" id="icon-list-grid" title="toggle sprite borders">
          <img src="ui/icon-info.png" class="icon-hover" id="icon-list-info" title="toggle info overlay">
      </div>
      <div class="window_menu_icon_area">
        <img src="ui/icon-list-new.png" class="icon-hover" id="icon-list-new" title="new sprite (ctrl + n)">
        <img src="ui/icon-list-copy.png" class="icon-hover" id="icon-list-copy" title="copy sprite (ctrl + c)">
        <img src="ui/icon-list-paste.png" class="icon-hover" id="icon-list-paste" title="paste sprite (ctrl + v)">
        <img src="ui/icon-list-duplicate.png" class="icon-hover" id="icon-list-duplicate" title="duplicate sprite (ctrl + d)">
        </div>
        <img src="ui/icon-playfield.png" class="icon-hover" id="icon-list-send-to-playfield" title="send sprite to playfield">
        
        <img src="ui/icon-list-trash.png" class="icon-right icon-hover" id="icon-list-delete" title="delete sprite (ctrl + x)">
        
      </div>
      <div id="spritelist"></div>
    `;

    dom.append("#window-" + this.window, template);

    // Initialize native sortable
    const spritelistElement = document.querySelector("#spritelist") as HTMLElement;
    if (spritelistElement) {
      this.sortable = new Sortable(spritelistElement, {
        onSortStart: () => {
          if (this.onSortStartCallback) {
            this.onSortStartCallback();
          }
        },
        onSort: (oldIndex: number, newIndex: number) => {
          // Get sorted array of IDs
          const sortedIds = Array.from(spritelistElement.children).map(
            (child) => child.id
          );
          if (this.onSortCallback) {
            this.onSortCallback(sortedIds);
          }
        },
      });
    }

    // TODO: needs to go away with new/better sorting and zooming
    // this line is ridiculous, but apparently it is needed for the sprite sorting to not screw up
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style id="zoom-sort-fix" type='text/css'>.list-sprite-size{ width: ${this.width}px; height:${this.height}px;} </style>`
    );
  }

  get_clicked_sprite() {
    return this.clicked_sprite;
  }

  setSortCallback(callback: (sortedArray: string[]) => void) {
    this.onSortCallback = callback;
  }

  setSortStartCallback(callback: () => void) {
    this.onSortStartCallback = callback;
  }

  toggle_grid() {
    this.grid = !this.grid;
  }

  toggle_info_overlay() {
    this.info_overlay = !this.info_overlay;
  }

  is_info_overlay(): boolean {
    return this.info_overlay;
  }

  update_zoom() {
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;

    // TODO: needs to go away with new/better sorting and zooming
    const boo = document.getElementById("zoom-sort-fix") as any;
    boo.parentNode.removeChild(boo);
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style id="zoom-sort-fix" type='text/css'>.list-sprite-size{ width: ${this.width}px; height:${this.height}px;} </style>`
    );
  }

  update(all_data) {
    // this one gets called during drawing in the editor
    // because the normal update method gets too slow
    // when the sprite list is becoming longer

    // Update dialog title via the dialog element
    const dialogElement = document.querySelector(`#dialog-window-${this.window}`) as HTMLDialogElement;
    if (dialogElement) {
      const titleElement = dialogElement.querySelector(".dialog-title");
      if (titleElement) {
        titleElement.textContent = `sprite ${all_data.current_sprite + 1} of ${all_data.sprites.length}`;
      }
    }

    const container = document.getElementById(String(all_data.current_sprite));
    if (!container) return;

    const c = container.querySelector("canvas");
    if (!c) return;

    const canvas = c.getContext("2d", { alpha: false });
    const sprite_data = all_data.sprites[all_data.current_sprite];

    this.draw_sprite(canvas, sprite_data, all_data);
    this.updateAnimationBadge(container, sprite_data);
  }

  private updateAnimationBadge(container: HTMLElement, sprite_data: any) {
    const existingBadge = container.querySelector(".sprite_animation_badge");

    if (sprite_data.animation && !existingBadge) {
      // Add badge if sprite has animation but badge doesn't exist
      this.createAnimationBadge(container);
    } else if (!sprite_data.animation && existingBadge) {
      // Remove badge if sprite no longer has animation
      existingBadge.remove();
    }
  }

  private createAnimationBadge(container: HTMLElement) {
    const badge = document.createElement("div");
    badge.className = "sprite_animation_badge";
    badge.textContent = "A";
    badge.title = "Animation";
    container.appendChild(badge);
  }

  update_all(all_data) {
    dom.remove_all_elements(".sprite_in_list_container");
    const length = all_data.sprites.length;
    for (let i = 0; i < length; i++) {
      // Create container for sprite + overlay
      const sprite_container = document.createElement("div");
      sprite_container.id = String(i);
      sprite_container.className = "sprite_in_list_container";

      const canvas_element: any = document.createElement("canvas");
      canvas_element.width = this.width;
      canvas_element.height = this.height;
      canvas_element.draggable = false; // Prevent canvas from being draggable, only container should be

      sprite_container.appendChild(canvas_element);
      dom.append_element("#spritelist", sprite_container);
      dom.add_class(canvas_element, "sprite_in_list");

      canvas_element.setAttribute("title", all_data.sprites[i].name);
      dom.add_class(canvas_element, "list-sprite-size"); // see comment in constructor

      if (this.grid) dom.add_class(canvas_element, "sprite_in_list_border");

      canvas_element.addEventListener("click", (e: MouseEvent) => {
        const container = (e.target as HTMLElement).closest(".sprite_in_list_container");
        if (container && container.id) {
          this.clicked_sprite = parseInt(container.id);
        }
      });

      const canvas = canvas_element.getContext("2d", { alpha: false });
      const sprite_data = all_data.sprites[i];

      this.draw_sprite(canvas, sprite_data, all_data);

      // Add info overlay if enabled
      if (this.info_overlay) {
        const info_overlay = document.createElement("div");
        info_overlay.className = "sprite_info_overlay";

        // Sprite info (number and name)
        const sprite_info = document.createElement("div");
        sprite_info.className = "sprite_info_text";
        sprite_info.innerHTML = `${i + 1}<br/>${all_data.sprites[i].name}`;

        info_overlay.appendChild(sprite_info);
        sprite_container.appendChild(info_overlay);
      }

      // Add animation badge if sprite has animation data
      if (sprite_data.animation) {
        this.createAnimationBadge(sprite_container);
      }
    }

    // Refresh sortable after adding new elements
    if (this.sortable) {
      this.sortable.refresh();
    }
  }

  draw_sprite(canvas, sprite_data, all_data) {
    // first fill the whole sprite with the background color
    canvas.fillStyle = this.config.colors[all_data.colors[0]]; // transparent
    canvas.fillRect(0, 0, this.width, this.height);

    // Temporarily set canvas for rendering
    const originalCanvas = this.canvas;
    this.canvas = canvas;

    // Use shared render_pixels method
    this.render_pixels(sprite_data, all_data);

    // Restore original canvas
    this.canvas = originalCanvas;
  }
} // end class
