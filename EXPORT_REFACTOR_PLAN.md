# Export Refactoring Plan

## Problem
Currently, the Export dialog shows all export options in one large modal. We want to split this into focused, contextual dialogs accessed via submenus.

## Proposed Solution

### Option A: Focused Dialog Classes (Recommended)
Create separate dialog classes for each export type:

**Files:**
- `Export-Assembly.ts` - Dialog for assembly code options (KICK/ACME, hex/binary)
- `Export-Image.ts` - Dialog for PNG options (current/all sprites)
- `Export-Spritesheet.ts` - Dialog for spritesheet options (rows, border)
- `Export-Base.ts` - Shared functionality (file saving, rendering, data conversion)

**Pros:**
- Clean separation of concerns
- Each dialog is focused and simple
- Easy to maintain
- No code in menu files

**Cons:**
- More files to manage
- Some code duplication (dialog boilerplate)

### Option B: Direct Export Functions
Skip dialogs for simple exports, call functions directly:

**Menu Structure:**
```
File > Export Sprite Data As...
  ├─ Assembly Code...           → Opens Assembly dialog
  ├─ BASIC Code                 → Direct export (no dialog)
  ├─ Image (PNG)...             → Opens Image dialog
  └─ Spritesheet (PNG)...       → Opens Spritesheet dialog
```

**Implementation:**
- BASIC export: Directly calls export function (no choices needed)
- Assembly: Dialog for format selection (KICK/ACME, hex/binary)
- Image: Dialog for current vs all sprites
- Spritesheet: Dialog for rows and border options

**Pros:**
- Simpler for single-option exports
- Faster workflow
- Fewer clicks for common operations

**Cons:**
- Inconsistent UX (some have dialogs, some don't)

### Option C: Hybrid Approach (RECOMMENDED)
Combine both approaches for best UX:

```
File > Export Sprite Data As...
  ├─ Assembly Code...
  │   ├─ KICK ASS (hex)        → Direct export
  │   ├─ KICK ASS (binary)     → Direct export
  │   ├─ ACME (hex)            → Direct export
  │   └─ ACME (binary)         → Direct export
  ├─ BASIC Code                → Direct export
  ├─ Image (PNG)...
  │   ├─ Current Sprite        → Direct export
  │   └─ All Sprites (ZIP)     → Direct export
  └─ Spritesheet (PNG)...      → Opens dialog (needs configuration)
```

**Pros:**
- Best of both worlds
- No unnecessary dialogs
- Configuration only when needed
- Clean, intuitive UX

**Cons:**
- Deeper menu nesting
- More menu items to manage

## Recommended Implementation

**Phase 1: Create Base Class**
1. Extract common functionality to `Export-Base.ts`
2. Include: file saving, sprite rendering, assembly/BASIC generation

**Phase 2: Create Specific Exporters**
1. `Export-Spritesheet.ts` - Only module that needs a dialog
2. Direct export functions in App.ts for simple exports

**Phase 3: Update Menu**
1. Add nested submenus for Assembly and Image
2. Wire up direct export functions
3. Show Spritesheet dialog for configuration

## File Structure

```
src/js/
├── Export-Base.ts           # Shared export functionality
├── Export-Spritesheet.ts    # Spritesheet dialog & export
└── App.ts                   # Direct export functions for simple cases
```

## Next Steps

Please review and let me know which approach you prefer:
- Option A: Focused dialogs for everything
- Option B: Some dialogs, some direct
- Option C: Nested submenus, minimal dialogs

I recommend **Option C (Hybrid)** for the best user experience.
