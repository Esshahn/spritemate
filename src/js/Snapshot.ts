/*
  VICE Snapshot Monitor and Sprite Grabber
  ----------------------------------------

  Provides a retro-style monitor interface where users can issue commands to monitor and modify
  graphical and memory data, essentially helping developers or enthusiasts dive deeper
  into the inner workings of the Commodore 64's VIC-II graphics chip.

  This tool allows users to interact with the emulator's snapshot memory. 
  Users can type commands to explore memory areas (e.g., "mem" for memory inspection), 
  edit specific memory values, manage color settings, and even "grab" sprite data from specific 
  memory locations.
  
  For example, with commands like "grab n" or "grabcols," users can capture and 
  load sprite data and colors into the editor, making it easy to replicate and edit sprites.
*/

import { dom } from "./helper";
import Window_Controls from "./Window_Controls";
import { App } from './App';

const VIC_BASE = 0xD000;
const VIC_MULTICOLOR = 0xd01c; // enable bits 0-7
const VIC_SPRITE_ENABLE = 0xd015; // bits 0-7
const VIC_SPRITE_EXPAND_X = 0xd01d;
const VIC_SPRITE_EXPAND_Y = 0xd017;
const VIC_SPRITE_ADDR = 0xd018; // bits 4-7 for video matrix, and last 64 bytes for sprite addresses
const VIC_SPRITE_MCOLOR_0 = 0xd025; // shared colours
const VIC_SPRITE_MCOLOR_1 = 0xd026; // shared colours
const VIC_SPRITE_COL0 = 0xd027; // individual colours
const VIC_BG_COL0 = 0xd021; // sprite background


const CIA2_VIC_BANK = 0xDD00; // bits 0-2 inverted for bank

export default class Snapshot extends Window_Controls {
  help: string;
  lastCmd: string;
  lastIndex = -1;
  lastSpriteCol = 6;

  fullSnapshot: Uint8Array | null;
  c64mem: Uint8Array | null;
  viciimem: Uint8Array | null;
  cia2mem: Uint8Array | null;

  event: any;
  app: App | null;

  constructor(public window: number, public config, public eventhandler) {
    super();
    this.app = (window as any).app;
    this.event = eventhandler;
    this.config = config;
    this.window = window;
    this.c64mem = null;
    this.viciimem = null;
    this.cia2mem = null;
    this.fullSnapshot = null;
    this.lastCmd = "";
    this.help = `
commands :

mem n
        show memory at n
        eg. mem 0x400

edit n v
        eg. edit 0x400 0x01
        eg. edit 0x400 0x01 0x02 0x03 0x04 0x05 0x06 0x07 0x08 0x09

vic
        show VIC-II memory

vid <bank>
        calc video matrix address
        video matrix nibble*1k + bank*16kB
        eg. vid 0

cia
        show CIA-II memory
        reports bank (last 3 bits inverted)

sprites
        show sprite memory

grabmem <n>
        grab memory at n as a sprite, if n is not specified
        grab next 64 bytes
        eg. grabmem 0x400
        eg. grammem

grab <n>
        grab a sprite (grab 0 default)
        eg. grab 0

grabcols
        grab sprite colors

`;
    const template = `
        <div class="console-container">
            <textarea id="snapshot-console" class="console" spellcheck="false">] </textarea>
        </div>
    `;
    dom.append("#window-" + this.window, template);

    const consoleTextarea = dom.sel("#snapshot-console");

    // Position cursor at the end of the prompt when dialog opens
    // This ensures the textarea is visible and can receive focus (especially in Safari)
    const dialogElement = document.querySelector(`#dialog-window-${this.window}`) as HTMLDialogElement;
    if (dialogElement) {
      // Listen for when the dialog is shown
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'open' && dialogElement.open) {
            // Dialog just opened, now we can position cursor
            const initialLength = consoleTextarea.value.length;
            consoleTextarea.setSelectionRange(initialLength, initialLength);
            consoleTextarea.focus();
          }
        });
      });

      observer.observe(dialogElement, { attributes: true });

      // If dialog is already open, set cursor immediately
      if (dialogElement.open) {
        setTimeout(() => {
          const initialLength = consoleTextarea.value.length;
          consoleTextarea.setSelectionRange(initialLength, initialLength);
          consoleTextarea.focus();
        }, 0);
      }
    }

    consoleTextarea.onkeyup = (e) => {
      if (e.key === "Enter") {
        const command = dom.val("#snapshot-console");
        if (!command) return;
        const lines = command.split("\n");
        const last_line = lines[lines.length - 2];
        const last_line_trimmed_without_prompt = this.removePrompt(last_line);
        this.command(last_line_trimmed_without_prompt);
      }
    };
  }

  removePrompt(line: string): string {
    const prompt = "] ";
    if (line.startsWith(prompt)) {
      return line.slice(prompt.length);
    }
    return line;
  }

  // Helper: Find memory marker in snapshot data
  private findMemoryMarker(data: Uint8Array, marker: string, startOffset = 0): number {
    let letterIndex = 0;
    for (let i = startOffset; i < data.length; i++) {
      if (data[i] === marker.charCodeAt(letterIndex)) {
        letterIndex++;
        if (letterIndex === marker.length) {
          return i;
        }
      } else {
        letterIndex = 0;
      }
    }
    return -1;
  }

  // Helper: Parse address from command arguments
  private parseAddress(args: string[], allowEmpty = false): number | null {
    if (args.length === 0) {
      if (allowEmpty && this.lastIndex !== -1) {
        return this.lastIndex;
      }
      return null;
    }

    const argString = args.join(" ");
    let address = parseInt(argString);
    if (isNaN(address)) {
      address = parseInt(argString, 16);
      if (isNaN(address)) {
        return null;
      }
    }
    return address;
  }

  // Helper: Create new sprite with specified settings
  private createNewSprite(multicolor: boolean, color: number): number[][] | null {
    this.app?.sprite.new_sprite(1, true);
    this.app?.list.update_all(this.app?.sprite.get_all());
    this.app?.update();
    const all = this.app?.sprite.get_all();
    if (!all) return null;

    all.sprites[all.current_sprite].multicolor = multicolor;
    all.sprites[all.current_sprite].color = color;
    return all.sprites[all.current_sprite].pixels;
  }

  // Helper: Format number as hex with specified width
  private formatHex(value: number, width: 2 | 4): string {
    return value.toString(16).padStart(width, "0");
  }

  load_snapshot(file: File, filename: string) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const fileData = reader.result as ArrayBuffer;
      this.message("loading snapshot " + filename);

      const c64mem = new Uint8Array(fileData);

      // Find C64MEM marker
      const c64memIndex = this.findMemoryMarker(c64mem, "C64MEM\0\0\0\0\0\0\0\0\0\0");
      if (c64memIndex === -1) {
        this.message("snapshot not found");
        return;
      }
      this.c64mem = new Uint8Array(c64mem.slice(c64memIndex + 11));

      // Find CIA2 marker
      const cia2Index = this.findMemoryMarker(c64mem, "CIA2\0\0\0\0\0\0\0\0\0\0", c64memIndex);
      if (cia2Index !== -1) {
        this.cia2mem = new Uint8Array(c64mem.slice(cia2Index + 9));
      }

      // Find VIC-II marker
      const vicIndex = this.findMemoryMarker(c64mem, "VIC-II\0\0\0\0\0\0\0\0\0\0", cia2Index !== -1 ? cia2Index : c64memIndex);
      if (vicIndex !== -1) {
        this.viciimem = new Uint8Array(c64mem.slice(vicIndex + 8));
      }

      this.message("snapshot loaded " + c64mem.length + " bytes");
    };
  }

  prompt(): void {
    const currentVal = dom.val("#snapshot-console") || "";
    dom.val("#snapshot-console", currentVal + "] ");
    const textarea = dom.sel("#snapshot-console");
    textarea.scrollTop = textarea.scrollHeight;
  }

  /* Use this for adhoc message to display the prompt */
  message(message: string): void {
    this.println(message);
    this.prompt();
    const textarea = dom.sel("#snapshot-console");
    textarea.scrollTop = textarea.scrollHeight;
  }

  print(message: string): void {
    const currentVal = dom.val("#snapshot-console") || "";
    dom.val("#snapshot-console", currentVal + message);
  }

  println(message: string | number = ""): void {
    const currentVal = dom.val("#snapshot-console") || "";
    dom.val("#snapshot-console", currentVal + message + "\n");
  }

  formatMemory(address: number): string {
    const convertPetsciiToAscii = (byte) => {
      if (byte >= 1 && byte <= 26) {
        return String.fromCharCode(byte + 64);
      }
      if (byte >= 27 && byte <= 63) {
        return String.fromCharCode(byte);
      }
      return ".";
    };

    if (this.c64mem === null) return "";
    const mem = this.c64mem;

    // Add bounds checking
    const endAddress = Math.min(address + 16, mem.length);
    const actualLength = endAddress - address;
    const bytes = Array.from({ length: actualLength }, (_, i) => mem[address + i] || 0);

    const hexAddress = this.formatHex(address, 4);
    const hexBytes = bytes.map((byte) => this.formatHex(byte, 2)).join(" ");
    const ascii = bytes.map((byte) => convertPetsciiToAscii(byte)).join("");
    return `${hexAddress} |${hexBytes}  |${ascii}|`;
  }

  video_matrix_address(address: number, bank = 0): number {
    const range = address >> 4;
    const video_matrix_base = bank * 16384;
    const video_matrix_address = video_matrix_base + range * 1024;
    return video_matrix_address;
  }

  sprite_address(number: number): number {
    if (this.cia2mem === null || this.viciimem === null || this.c64mem === null) {
      return 0;
    }
    const sprite_base = 0x03f8;
    const bank = this.cia2_bank(this.cia2mem[0]);
    const vid = this.viciimem[VIC_SPRITE_ADDR - VIC_BASE];
    const vidAdd = this.video_matrix_address(vid, bank);
    const sprite_address = this.c64mem[sprite_base + vidAdd + number] * 64 + (bank * 16384);
    return sprite_address;
  }

  cia2_bank(val: number): number {
    const bank = val & 0x03;
    return 3-bank;
  }

  command(command: string): void {
    this.connect();
    const command_parts = command.split(" ");
    const command_name = command_parts[0];
    const command_args = command_parts.slice(1);
    const command_args_string = command_args.join(" ");
    const command_args_number = parseInt(command_args_string);
    const command_args_number_hex = parseInt(command_args_string, 16);
    const args: number[] = [];
    for (let i = 1; i < command_parts.length; i++) {
      args.push(parseInt(command_parts[i], 16));
    }
    if (args.length === 0) {
      args.push(0);
    }
    if (command_name === "") {
      if (this.lastCmd === "mem" || this.lastCmd === "grabmem") {
        this.command(this.lastCmd);
        return;
      }
      this.prompt();
      return;
    }
    switch (command_name) {

      case "grabcols": {
        if (this.viciimem === null) {
            this.message("no snapshot loaded");
            return;
          }
        this.grabcols();
        break;
      }

      case "grab": {
        if (this.c64mem === null || this.viciimem === null) {
          this.message("no snapshot loaded");
          return;
        }
        let sprite = 0;

        if (command_args.length > 0) {
          sprite = parseInt(command_args[0]);
        }

        this.grabSprite(sprite);
        break;
      }
        
      case "grabmem": {
        if (this.c64mem === null) {
          this.message("no snapshot loaded");
          return;
        }

        const address = this.parseAddress(command_args, true);
        if (address === null) {
          this.message("no address specified");
          return;
        }

        if (address < 0 || address >= this.c64mem.length) {
          this.println("address out of range");
          break;
        }

        const data = this.createNewSprite(true, this.lastSpriteCol);
        if (!data) {
          this.message("failed to create sprite");
          return;
        }

        this.grabAddress(address, data);
        this.lastIndex = address + 64;
        break;
      }

        
      case "sprites": {
        if (this.cia2mem === null || this.viciimem === null) {
          this.message("no snapshot loaded");
          return;
        }

        this.list_sprites();
        break;
      }

      case "cia": {
        if (this.cia2mem === null) {
          this.message("no snapshot loaded");
          return;
        }
        this.list_cia_memory();
        break;
      }


      case "vid": {
        if (this.viciimem === null || this.cia2mem === null) {
          this.message("no snapshot loaded");
          return;
        }

        this.list_vid(command_args);
        break;
      }


      case "vic":
        if (this.viciimem === null) {
          this.message("no snapshot loaded");
          return;
        }
       this.list_vic();
        break;


      case "edit":
        if (this.c64mem === null) {
          this.message("no snapshot loaded");
          return;
        }
        if (command_args.length < 2) {
          this.message("not enough arguments");
          return;
        }
        if (isNaN(args[0])) {
          this.message("bad address");
          return;
        }
        if (args[0] < 0 || args[0] > this.c64mem.length) {
          this.message("address out of range");
          return;
        }
        for (let i = 1; i < args.length; i++) {
          if (isNaN(args[i])) {
            this.message("bad value");
            return;
          }
          if (args[i] < 0 || args[i] > 255) {
            this.message("value out of range");
            return;
          }
          this.c64mem[args[0] + i - 1] = args[i];
        }
        this.message("memory edited");
        break;

      
      case "mem": {
        if (this.c64mem === null) {
          this.message("no snapshot loaded");
          return;
        }

        const address = this.parseAddress(command_args, true);
        if (address === null) {
          this.message("no address specified");
          return;
        }

        // If no args provided and we have lastIndex, increment by 16
        if (command_args.length === 0 && this.lastIndex !== -1) {
          this.lastIndex = this.lastIndex + 16;
          this.println(this.formatMemory(this.lastIndex));
          break;
        }

        if (address < 0 || address >= this.c64mem.length) {
          this.println("address out of range");
          break;
        }

        this.println(this.formatMemory(address));
        this.lastIndex = address;
        break;
      }


      case "help":
        this.print(this.help);
        break;

      default:
        if (command_name.length > 0) {
         this.println("bad command " +
              command_name);
        }
        this.println("type help");
        break;
    }

    this.lastCmd = command_name;
    this.prompt();
  }

  private list_vic() {
    if (this.viciimem === null) {
      return;
    }
    this.println("VIC-II memory");
    for (let i = 0; i < 64; i++) {
      if (i % 16 === 0) {
        const hexAddress = (i + VIC_BASE).toString(16).padStart(4, "0");
        this.print(hexAddress + " |");
      }
      this.print(this.viciimem[i].toString(16).padStart(2, "0") + " ");
      if ((i + 1) % 16 === 0) {
        this.print("\n");
      }
    }
    this.println();
  }

  private list_vid(command_args: string[]) {
    if (this.viciimem === null || this.cia2mem === null) {
      return;
    }

    let bank = this.cia2_bank(this.cia2mem[0]);
    if (command_args.length > 0) {
      bank = parseInt(command_args[0]);
    }

    this.println("Video matrix memory");
    const vid = this.viciimem[0xd018 - VIC_BASE];
    const vidAdd = this.video_matrix_address(vid, bank);
    this.println(vidAdd.toString(16).padStart(4, "0"));
  }

  private list_cia_memory() {
    if (this.cia2mem === null) {
      return;
    }
    this.print("CIA-II memory\n");
    for (let i = 0; i < 16; i++) {
      if (i % 16 === 0) {
        const hexAddress = (i + CIA2_VIC_BANK).toString(16).padStart(4, "0");
        this.print(hexAddress + " |");
      }
      this.print(this.cia2mem[i].toString(16).padStart(2, "0") + " ");
      if ((i + 1) % 16 === 0) {
        this.println();
      }
    }
    this.println("CIA bank");
    const bank = this.cia2_bank(this.cia2mem[0]);
    this.println(bank);
  }

  private list_sprites() {
    if (this.cia2mem === null || this.viciimem === null) {
      return;
    }
    this.println("Sprite enabled reg");
    const enabled = this.viciimem[(VIC_SPRITE_ENABLE) - VIC_BASE];
    this.println(enabled.toString(2).padStart(8, "0"));
    this.println();

    this.println("Sprite multicolour reg");
    const multicol = this.viciimem[(VIC_MULTICOLOR) - VIC_BASE];
    this.println(multicol.toString(2).padStart(8, "0"));
    this.println();

    this.println("Sprite expand regs");
    const expand_x = this.viciimem[(VIC_SPRITE_EXPAND_X) - VIC_BASE];
    const expand_y = this.viciimem[(VIC_SPRITE_EXPAND_Y) - VIC_BASE];
    this.println(expand_x.toString(2).padStart(8, "0"));
    this.println(expand_y.toString(2).padStart(8, "0"));
    this.println();


    this.println("Sprite memory");
    for (let i = 0; i <= 7; i++) {
      const spriteAddr = this.sprite_address(i).toString(16).padStart(4, "0");
      this.print(spriteAddr + " |");
    }
    this.println();
    this.println();

    this.println("Sprite colours");
    for (let i = 0; i <= 7; i++) {
      const col = this.viciimem[(i + VIC_SPRITE_COL0) - VIC_BASE];
      this.print(col.toString(16).padStart(2, "0") + " |");
    }
    this.println();
    this.println();

    this.println("Sprite multi colour regs");
    const mcol0 = this.viciimem[(VIC_SPRITE_MCOLOR_0) - VIC_BASE];
    const mcol1 = this.viciimem[(VIC_SPRITE_MCOLOR_1) - VIC_BASE];
    this.println(mcol0.toString(16).padStart(2, "0"));
    this.println(mcol1.toString(16).padStart(2, "0"));
    this.println();

    this.println("Sprite background");
    const bg = this.viciimem[(VIC_BG_COL0) - VIC_BASE];
    this.println(bg.toString(16).padStart(2, "0"));
    this.println();
  }

  private grabSprite(sprite: number) {
    if (this.viciimem === null || this.c64mem === null) {
      return;
    }

    const spriteColor = this.viciimem[(sprite + VIC_SPRITE_COL0) - VIC_BASE];
    const data = this.createNewSprite(true, spriteColor);
    if (!data) {
      this.message("failed to create sprite");
      return;
    }

    this.lastSpriteCol = spriteColor;
    const spriteAddr = this.sprite_address(sprite);

    this.grabAddress(spriteAddr, data);
    this.lastIndex = spriteAddr + 64;    // So you can grab more around the address with grabmem.
    this.println();
  }

  private grabAddress(spriteAddr: number, data: number[][]) {
    if (this.c64mem === null) {
      return;
    }

    // Add bounds checking
    if (spriteAddr + 63 >= this.c64mem.length) {
      this.message("sprite address out of bounds");
      return;
    }

    let posx = 0;
    let posy = 0;

    const bitReversal = (x: number) => ((x & 1) << 1) | ((x & 2) >> 1);

    // Fix: Loop should be < 63, not <= 62 (sprites are 63 bytes)
    for (let i = 0; i < 63; i++) {
      const col = this.c64mem[spriteAddr + i];
      let nib = (col >> 6) & 3;
      data[posy][posx] = bitReversal(nib);
      posx += 2;

      nib = (col >> 4) & 3;
      data[posy][posx] = bitReversal(nib);
      posx += 2;

      nib = (col >> 2) & 3;
      data[posy][posx] = bitReversal(nib);
      posx += 2;

      nib = col & 3;
      data[posy][posx] = bitReversal(nib);
      posx += 2;

      if (posx >= 22) {
        posx = 0;
        posy++;
      }
    }

    this.app?.update();
  }

  private grabcols() {
    if (this.viciimem === null) {
      return;
    }
    const mcol0 = this.viciimem[(VIC_SPRITE_MCOLOR_0) - VIC_BASE];
    const mcol1 = this.viciimem[(VIC_SPRITE_MCOLOR_1) - VIC_BASE];
    const bg = this.viciimem[(VIC_BG_COL0) - VIC_BASE];
    const all = this.app?.sprite.get_all();

    // Fix: Add null check
    if (!all) {
      this.message("failed to get sprite data");
      return;
    }

    all.colors[0] = bg;
    all.colors[2] = mcol0;
    all.colors[3] = mcol1;
    this.app?.list.update_all(this.app?.sprite.get_all());
    this.app?.update();
  }

  update(all_data): void {
    this.connect();
  }

  connect(): void {
    this.app = (window as any).app;
  }
}
