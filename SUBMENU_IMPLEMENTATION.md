# Submenu Implementation - Proof of Concept

## Overview
This is a proof of concept implementation showing how to create submenus in the Spritemate menu bar.

## Example Implementation
The "Export Sprite Data As..." menu item has been converted to a submenu with the following options:
- Assembly Code (*.txt)
- BASIC (*.bas)
- Image (*.png)
- Spritesheet (*.png)

## How It Works

### HTML Structure
```html
<div class="submenu-item">
  <a>Export Sprite Data As...<span class="submenu-arrow">▶</span></a>
  <div class="submenu-content">
    <a id="menubar-export-assembly">Assembly Code (*.txt)</a>
    <a id="menubar-export-basic">BASIC (*.bas)</a>
    <a id="menubar-export-png">Image (*.png)</a>
    <a id="menubar-export-spritesheet">Spritesheet (*.png)</a>
  </div>
</div>
```

### CSS Classes
- `.submenu-item` - Container for the submenu trigger and content
- `.submenu-content` - The submenu panel that appears to the right
- `.submenu-arrow` - The arrow indicator (▶) showing there's a submenu

### Key Features
1. **Hover Activation**: Submenu appears when hovering over the parent item
2. **Right-side Display**: Submenu appears to the right of the parent menu
3. **Visual Indicator**: Arrow (▶) shows which items have submenus
4. **Consistent Styling**: Matches the existing menu design
5. **Proper Z-index**: Submenu appears above other elements (z-index: 1001)

## How to Add More Submenus

1. **In HTML** (index.html):
   - Wrap the menu item in a `<div class="submenu-item">`
   - Add `<span class="submenu-arrow">▶</span>` to the parent link
   - Create a `<div class="submenu-content">` with child `<a>` elements

2. **In TypeScript** (App.ts):
   - Add event handlers for each submenu item ID
   - Example: `dom.sel("#menubar-your-item").onclick = () => { ... }`

3. **CSS** (stylesheet.css):
   - No changes needed - the submenu styles are already in place

## Browser Compatibility
The submenu uses pure CSS hover states and should work in all modern browsers.
