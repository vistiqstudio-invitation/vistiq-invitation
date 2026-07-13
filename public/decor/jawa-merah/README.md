# Pending floral decoration assets - jawa-merah theme

These four files are referenced by `themes/jawa-merah/*.tsx` but not yet
supplied. The `<img>` tags that point at them use an `onError` handler
that hides the element, so the theme renders cleanly without them - drop
the real files in here (same filenames) once they're generated and
they'll appear automatically, no code changes needed.

| Filename | Used in | Notes |
| --- | --- | --- |
| `corner-foliage.png` | Cover.tsx (top-left/top-right, mirrored via CSS) | Maroon foliage corner cluster |
| `floral-spray.png` | Cover.tsx (bottom), Couple.tsx (profile accent) | Mixed colorful floral spray |
| `oval-garland.png` | (future) Gift Confirm form | Curved garland variant of the floral spray |
| `butterfly.png` | (not yet wired into any component) | Sparse accent |

See the published prompt sheet for AI-generation prompts for each of
these: ask in chat if the link needs to be resurfaced.
