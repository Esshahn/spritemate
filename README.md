# spritemate
spritemate is a browser based sprite editor for the Commodore 64. This is a very early version of the spritemate tool and is not functional yet. Feel free to download the dist and play around with it, but there's really not much to see yet.

You can check out a version from 2017-09-22: http://spritemate.com/170922/

<img src="https://user-images.githubusercontent.com/434355/29740898-0212147a-8a62-11e7-879f-f938bd009718.png" style="width: 50%;"/>

<center>Screenshot of the very first commit</center>

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
* undo
* window based GUI
* loading and saving to internal format

## What it does not yet

* loading & saving as image (PNG), native C64 binary, SpritePad SPR
* redo
* pixel tools like: rotate, copy & paste
* save window layout
* animation
* stacked sprite layers (onion skinning)
* and tons of other stuff

## History

2017-09-22
* Zoom in/out in the sprite list window
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
