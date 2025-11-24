---
'tiptap-docs': patch
---

Update color highlight button documentation:

- Added missing imports to the `useColorHighlight()`
- Added `mode` parameter to the hook props table
- Updated `onApplied` callback type to include mode parameter
- Updated `canColorHighlight()` signature to include optional mode parameter
- Added parameters table for `canColorHighlight()`
- Updated `isColorHighlightActive()` signature: renamed `color` parameter to `highlightColor` and added optional `mode` parameter
- Added usage examples for `isColorHighlightActive()`
- Added new `removeHighlight()` utility function
- Added new `pickHighlightColorsByValue()` utility function