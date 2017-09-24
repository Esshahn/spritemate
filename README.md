# spritemate
spritemate is a browser based sprite editor for the Commodore 64. This is a very early version of the spritemate tool and is not functional yet. Feel free to download the dist and play around with it, but there's really not much to see yet.

You can check out a version from 2017-09-22: http://spritemate.com/170922/

<img src="https://user-images.githubusercontent.com/434355/30771674-a15113be-a04d-11e7-9f9f-e29d3582e4fe.png" width= "50%"/>

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
| <img src="https://user-images.githubusercontent.com/434355/30786002-6ac6e1f2-a16f-11e7-995c-c21dcc66472c.png" width="200%"> | - | Shift sprite down |
| <img src="https://user-images.githubusercontent.com/434355/30785983-6a741e18-a16f-11e7-89e6-931b5cc52a0e.png" width="200%"> | - | Flip sprite horizontal |
| <img src="https://user-images.githubusercontent.com/434355/30785984-6a75c10a-a16f-11e7-8701-589fd6218bd5.png" width="200%"> | - | Flip sprite vertical |
| <img src="https://user-images.githubusercontent.com/434355/30786002-6ac6e1f2-a16f-11e7-995c-c21dcc66472c.png" width="200%"> | - | Toggle between singlecolor and multicolor mode |
| <img src="https://user-images.githubusercontent.com/434355/30786002-6ac6e1f2-a16f-11e7-995c-c21dcc66472c.png" width="200%"> | - | Fill the sprite with selected color |

## What it currently does

* choose one of 16 C64 colors from the color palette
* draw pixels on a 24x21 pixel (hires) or 12x21 pixel (multicolor) canvas
* C64 mode restrictions (number of colors per sprite, global sprite colors)
* delete pixels
* fill
* shift left, right, up, down
* flip horizontal, vertical
* check your sprite in the preview window
* multicolor and hires mode support
* grid mode on/off in editor
* multiple sprites
* double width & height sprites
* sprite sorting
* undo & redo
* window based GUI
* loading and saving to internal format

## What it does not yet

* loading & saving as image (PNG), native C64 binary, SpritePad SPR
* pixel tools like: rotate, copy & paste
* save window layout
* animation
* stacked sprite layers (onion skinning)
* and tons of other stuff

## History

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

