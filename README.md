# spritemate
spritemate is a browser based sprite editor for the Commodore 64. It works in most modern browsers on Windows, Mac and Linux. All data is processed on front end side, no back end is involved and you can use this tool offline. The release version will support the most common sprite formats for the Commodore 64 (e.g. SpritePad), therefore spritemate can be used as easy sprite viewer on almost any device with a browser.

There's no official release yet, but you can check out a version from 2017-09-22: http://spritemate.com/170922/

<img src="https://user-images.githubusercontent.com/434355/30771674-a15113be-a04d-11e7-9f9f-e29d3582e4fe.png" width= "50%"/>

## Features (what it currently does)

* choose one of 16 C64 colors from the color palette
* draw pixels on a 24x21 pixel (singlecolor) or 12x21 pixel (multicolor) canvas
* C64 mode restrictions (number of colors per sprite, global sprite colors)
* delete, fill, shift left, right, up, down, flip horizontal & vertical
* check your sprite in the preview window
* display grid in editor
* multiple sprites
* double width & height sprites
* flood fill
* sprite sorting
* undo & redo
* window based GUI
* import & export to internal format
* import & export SpritePad 2.0 format
* import & export SpritePad 1.8.1 format
* export as ASM source

## Backlog (what it does not yet)

* import & export PNG images
* export animation as GIF
* rotate 90 degrees
* copy & paste
* select and move pixels
* save window layout
* animation
* stacked sprite layers (onion skinning)
* touch controls and tablet optimization
* keyboard controls
* and tons of other stuff

---

## Menu toolbar
Please note that keyboard and touch controls are not implemented as of now.

| Symbol        | Shortcut      | Function  |
| :-------------: | ------------- | --------------- |
| <img src="https://user-images.githubusercontent.com/434355/30785990-6a8e9bd0-a16f-11e7-904f-33975fbdb725.png" > | - | Loads a file. Supported formats: Spritemate (SPR) |
| <img src="https://user-images.githubusercontent.com/434355/30785997-6ab25638-a16f-11e7-9392-13c1c4b899cd.png" > | - | Saves a file. Supported formats: Spritemate (SPR) |
| <img src="https://user-images.githubusercontent.com/434355/30786005-6acf7dc6-a16f-11e7-9725-42ba4ca5bfe1.png" > | - | Undo. For when you screwed up. |
| <img src="https://user-images.githubusercontent.com/434355/30785996-6aabec80-a16f-11e7-9345-6a0fe4ed051c.png" > | - | Redo. For when you realized it wasn't that bad |
| <img src="https://user-images.githubusercontent.com/434355/31428668-e7a4882e-ae6b-11e7-9bcc-60efe6726a92.png" > | - | Draw pixels |
| <img src="https://user-images.githubusercontent.com/434355/31428743-24037cb2-ae6c-11e7-919a-0073e3d3324f.png" > | - | Select pixels |
| <img src="https://user-images.githubusercontent.com/434355/30785982-6a72dbf2-a16f-11e7-9f1c-35b415d59b8e.png" > | - | Flood fill |
| <img src="https://user-images.githubusercontent.com/434355/31428727-147bfd46-ae6c-11e7-8f04-5e383322f82a.png" > | - | Toggle fullscreen window mode |
| <img src="https://user-images.githubusercontent.com/434355/31428730-187cf6fc-ae6c-11e7-81ac-d64fce3c95f9.png" > | - | Displays the info window |

## Editor window
Please note that keyboard and touch controls are not implemented as of now.

| Symbol        | Shortcut      | Function  |
| :-------------: | ------------- | --------------- |

| <img src="https://user-images.githubusercontent.com/434355/30785991-6a99bf10-a16f-11e7-821b-b5be9f81d7d7.png" > | - | Toggle between singlecolor and multicolor mode |
| <img src="https://user-images.githubusercontent.com/434355/30785999-6ab77d5c-a16f-11e7-8f46-05859afea191.png" > | - | Shift sprite left |
| <img src="https://user-images.githubusercontent.com/434355/30786000-6ab92882-a16f-11e7-9b0b-39517adf02a3.png" > | - | Shift sprite right |
| <img src="https://user-images.githubusercontent.com/434355/30786001-6abda4c0-a16f-11e7-9e23-53b845c900ba.png" > | - | Shift sprite up |
| <img src="https://user-images.githubusercontent.com/434355/30785998-6ab5f36a-a16f-11e7-9694-772a8fd79331.png" > | - | Shift sprite down |
| <img src="https://user-images.githubusercontent.com/434355/30785983-6a741e18-a16f-11e7-89e6-931b5cc52a0e.png" > | - | Flip sprite horizontal |
| <img src="https://user-images.githubusercontent.com/434355/30785984-6a75c10a-a16f-11e7-8701-589fd6218bd5.png" > | - | Flip sprite vertical |
| <img src="https://user-images.githubusercontent.com/434355/30785986-6a82ef1a-a16f-11e7-92ef-bb755f6dcc8d.png" > | - | Toggles grid display on/off |
| <img src="https://user-images.githubusercontent.com/434355/30786004-6acf03be-a16f-11e7-956d-dfdc4c412bf7.png" > | - | Zoom window in/out |

---

## History

2017-10-10
* flood fill
* draw & fill modes can be switched
* performance optimization when working with huge sprite set
* export as ASM sourcecode

2017-10-07
* reworked toolbar/menu
* fullscreen option
* status bar

2017-10-05
* full import & export of SpritePad 1.8.1 and 2.0 formats
* preview window zoom

2017-10-04
* export sprites as SPD to SpritePad

2017-09-27
* import sprites from SpritePad SPD files

2017-09-23
* Zoom in/out in the sprite list window
* redo
* fixed an issue where the same file could not be reloaded
* more reliable behaviour of palette window

2017-09-20
* basic loading and saving is now working (finally!)
* lots of reworked UI
* lots of cleaned up code

2017-09-13
* proper C64 color restrictions are now implemented
* lots of cleanup, still one huge pile of crap left to do right

2017-09-07
* Zoom levels for editor, preview and list view can be set in the config
* Sprites in list view are sortable correctly when size is changing
* Info button has a new modal with version info and links
* sprite streching for preview window

2017-09-06
* Sorting in list view finally works

2017-09-04
* Undo implemented

