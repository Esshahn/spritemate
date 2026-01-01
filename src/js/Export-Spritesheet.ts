
import ExportBase from "./Export-Base";
import { dom, status } from "./helper";
import JSZip from "jszip";

export default class Export extends ExportBase {
  window: number;

  constructor(window: number, config: any, eventhandler: any, app: any) {
    super(app, config, eventhandler);
    this.window = window;

    const template = `
    <div id="window-export">

        <p id="spritesheet-info">Export 0 sprites as a single spritesheet image. Sprites are arranged in rows with optional 1 pixel spacing.
        </p>
        <p>
          Rows: <input type="number" id="spritesheet-rows" name="rows" value="1" min="1">
          <span id="spritesheet-layout"></span>
        </p>
        <p>
          <label>
          <input type="checkbox" id="spritesheet-border" name="border">Apply a 1 pixel border
          </label>
        </p>

      <div id="button-row">
        <button id="button-export-cancel" class="button-cancel">Cancel</button>
        <button id="button-export-spritesheet">Export</button>
      </div>
    </div>
    `;

    dom.append("#window-" + this.window, template);

    // Add close button to the dialog title bar
    // Wait for next tick to ensure dialog is created
    setTimeout(() => {
      const dialogElement = document.querySelector(`#dialog-window-${this.window}`) as HTMLDialogElement;
      if (dialogElement) {
        const titleBar = dialogElement.querySelector(".dialog-titlebar");
        if (titleBar) {
          const closeButton = document.createElement("div");
          closeButton.className = "window-close-button";
          titleBar.appendChild(closeButton);

          closeButton.addEventListener("click", () => {
            dialogElement.close();
            this.eventhandler.onLoad();
          });
        }
      }
    }, 0);

    dom.sel("#button-export-cancel").onclick = () => this.close_window();
    dom.sel("#button-export-spritesheet").onclick = () => this.save_spritesheet();

    // Spritesheet controls
    dom.sel("#spritesheet-rows").oninput = () => this.update_spritesheet_info();
    dom.sel("#spritesheet-border").onchange = () => this.update_spritesheet_info();
  }

  save_assembly(format: string, encode_as_binary: boolean): void {
    const filename = this.app.get_filename() + ".txt";
    const data = this.create_assembly(format, encode_as_binary);
    const file = new Blob([data], { type: "text/plain" });
    this.save_file_to_disk(file, filename);
  }

  save_basic(): void {
    const filename = this.app.get_filename() + ".bas";
    const data = this.create_basic();
    const file = new Blob([data], { type: "text/plain" });
    this.save_file_to_disk(file, filename);
  }

  save_png_current(): void {
    const sprite_index = this.savedata.current_sprite;
    const sprite = this.savedata.sprites[sprite_index];
    const filename = `${this.app.get_filename()}_sprite_${sprite_index + 1}.png`;

    const canvas = this.renderSpriteToCanvas(sprite, this.savedata);
    canvas.toBlob((blob) => {
      if (blob) {
        this.save_file_to_disk(blob, filename);
      }
    });
  }

  async save_png_all(): Promise<void> {
    const sprites = this.savedata.sprites;
    const zip = new JSZip();

    const promises = sprites.map((sprite, index) => {
      return new Promise<void>((resolve) => {
        const filename = `sprite_${index + 1}.png`;
        const canvas = this.renderSpriteToCanvas(sprite, this.savedata);

        canvas.toBlob((blob) => {
          if (blob) {
            zip.file(filename, blob);
          }
          resolve();
        });
      });
    });

    await Promise.all(promises);

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const zipFilename = `${this.app.get_filename()}_all_sprites.zip`;
    this.save_file_to_disk(zipBlob, zipFilename);
  }

  update_spritesheet_info(): void {
    if (!this.savedata) return;

    const totalSprites = this.savedata.sprites.length;
    const rowsValue = dom.val("#spritesheet-rows");
    const rows = Math.max(1, parseInt(rowsValue || "1") || 1);
    const spritesPerRow = Math.ceil(totalSprites / rows);

    dom.html("#spritesheet-info", `Export ${totalSprites} sprite${totalSprites !== 1 ? 's' : ''} as a single spritesheet image. Sprites are arranged in rows with optional 1 pixel spacing.`);

    let layoutText = "";
    if (totalSprites > 0) {
      const fullRows = Math.floor(totalSprites / spritesPerRow);
      const lastRowSprites = totalSprites % spritesPerRow;

      if (rows === 1) {
        layoutText = `1*${totalSprites} sprites`;
      } else {
        if (lastRowSprites === 0) {
          layoutText = `${rows}*${spritesPerRow} sprites`;
        } else {
          layoutText = `${fullRows}*${spritesPerRow} sprites, 1*${lastRowSprites} sprites`;
        }
      }
    }

    dom.html("#spritesheet-layout", layoutText);
  }

  save_spritesheet(): void {
    const sprites = this.savedata.sprites;
    const totalSprites = sprites.length;

    if (totalSprites === 0) {
      status("No sprites to export.");
      return;
    }

    const rowsValue = dom.val("#spritesheet-rows");
    const rows = Math.max(1, parseInt(rowsValue || "1") || 1);
    const hasBorder = (dom.sel("#spritesheet-border") as HTMLInputElement).checked;
    const borderSize = hasBorder ? 1 : 0;

    const spritesPerRow = Math.ceil(totalSprites / rows);
    const spriteWidth = this.config.sprite_x;
    const spriteHeight = this.config.sprite_y;

    const canvasWidth = spritesPerRow * spriteWidth + (spritesPerRow - 1) * borderSize;
    const canvasHeight = rows * spriteHeight + (rows - 1) * borderSize;

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      status("Failed to create spritesheet canvas.");
      return;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    sprites.forEach((sprite: any, index: number) => {
      const row = Math.floor(index / spritesPerRow);
      const col = index % spritesPerRow;

      const x = col * (spriteWidth + borderSize);
      const y = row * (spriteHeight + borderSize);

      const spriteCanvas = this.renderSpriteToCanvas(sprite, this.savedata);
      ctx.drawImage(spriteCanvas, x, y);
    });

    const filename = `${this.app.get_filename()}_spritesheet.png`;
    canvas.toBlob((blob) => {
      if (blob) {
        this.save_file_to_disk(blob, filename);
      }
    });

    this.close_window();
  }

  set_save_data(savedata): void {
    this.savedata = savedata;
    this.update_spritesheet_info();
  }

  close_window(): void {
    const dialogElement = document.querySelector(`#dialog-window-${this.window}`) as HTMLDialogElement;
    if (dialogElement && dialogElement.open) {
      dialogElement.close();
      this.eventhandler.onLoad();
    }
  }
}
