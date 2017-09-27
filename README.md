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
* sprite sorting
* undo & redo
* window based GUI
* import & export to internal format
* import SpritePad SPD format

## Backlog (what it does not yet)

* loading & saving as image (PNG), native C64 binary, SpritePad SPR & SPD
* export SpritePad SPR & SPD file formats
* import & export PNG images
* import & export native C64 binary
* export as ASM source
* export as PRG
* export animation as GIF
* flood fill
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

# UI
Please note that keyboard and touch controls are not implemented as of now.

| Symbol        | Shortcut      | Function  |
| :-------------: | ------------- | --------------- |
| <img src="https://user-images.githubusercontent.com/434355/30785990-6a8e9bd0-a16f-11e7-904f-33975fbdb725.png" width="200%"> | - | Loads a file. Supported formats: Spritemate (SPR) |
| <img src="https://user-images.githubusercontent.com/434355/30785997-6ab25638-a16f-11e7-9392-13c1c4b899cd.png" width="200%"> | - | Saves a file. Supported formats: Spritemate (SPR) |
| <img src="https://user-images.githubusercontent.com/434355/30786005-6acf7dc6-a16f-11e7-9725-42ba4ca5bfe1.png" width="200%"> | - | Undo. For when you screwed up. |
| <img src="https://user-images.githubusercontent.com/434355/30785996-6aabec80-a16f-11e7-9345-6a0fe4ed051c.png" width="200%"> | - | Redo. For when you realized it wasn't that bad |
| <img src="https://user-images.githubusercontent.com/434355/30785986-6a82ef1a-a16f-11e7-92ef-bb755f6dcc8d.png" width="200%"> | - | Toggles grid display on/off |
| <img src="https://user-images.githubusercontent.com/434355/30785999-6ab77d5c-a16f-11e7-8f46-05859afea191.png" width="200%"> | - | Shift sprite left |
| <img src="https://user-images.githubusercontent.com/434355/30786000-6ab92882-a16f-11e7-9b0b-39517adf02a3.png" width="200%"> | - | Shift sprite right |
| <img src="https://user-images.githubusercontent.com/434355/30786001-6abda4c0-a16f-11e7-9e23-53b845c900ba.png" width="200%"> | - | Shift sprite up |
| <img src="https://user-images.githubusercontent.com/434355/30785998-6ab5f36a-a16f-11e7-9694-772a8fd79331.png" width="200%"> | - | Shift sprite down |
| <img src="https://user-images.githubusercontent.com/434355/30785983-6a741e18-a16f-11e7-89e6-931b5cc52a0e.png" width="200%"> | - | Flip sprite horizontal |
| <img src="https://user-images.githubusercontent.com/434355/30785984-6a75c10a-a16f-11e7-8701-589fd6218bd5.png" width="200%"> | - | Flip sprite vertical |
| <img src="https://user-images.githubusercontent.com/434355/30785991-6a99bf10-a16f-11e7-821b-b5be9f81d7d7.png" width="200%"> | - | Toggle between singlecolor and multicolor mode |
| <img src="https://user-images.githubusercontent.com/434355/30785982-6a72dbf2-a16f-11e7-9f1c-35b415d59b8e.png" width="200%"> | - | Fill the sprite with selected color |

---

## History

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

