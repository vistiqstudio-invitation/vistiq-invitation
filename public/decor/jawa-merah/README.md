# Floral decoration assets - jawa-merah theme

AI-generated (ChatGPT), background-removed and trimmed to their content
bounding box. Referenced by `themes/jawa-merah/*.tsx` with an `onError`
fallback that hides the `<img>` if a file is ever missing, so the theme
never breaks even if one of these is replaced or removed.

| Filename | Used in | Notes |
| --- | --- | --- |
| `corner-foliage.png` | Cover.tsx (top-left/top-right, mirrored via CSS `scaleX(-1)`) | Maroon foliage corner cluster - real alpha transparency as generated |
| `floral-spray.png` | Cover.tsx (bottom), Couple.tsx (profile accent) | Mixed colorful floral spray - background removed with a flood-fill trim since the source came back on a flat white background |
| `oval-garland.png` | (future) Gift Confirm form arch | Curved garland variant - background removed the same way |
| `butterfly.png` | Hero.tsx (small accent near the joglo stage) | Background removed the same way |
| `paper-texture.jpg` | `style.module.css` `.root::after`, site-wide fixed background | AI-generated aged paper + gold batik lattice texture, resized/compressed from a 3MB PNG to a 272KB JPEG. Applied as one fixed `background-size: cover` layer (not tiled - AI tools don't reliably produce seamless tiles, so this is used as a single large image instead) |

Only `corner-foliage.png` came back from the generator with genuine PNG
alpha; the other three were flattened onto solid white/near-white despite
being asked for a transparent background (a known ChatGPT image-gen
limitation), so a flood-fill from the image edges was used to knock out
the background and crop to content. Edges are clean because the source
backgrounds were flat and evenly lit - if a future regeneration comes
back with a busier background, this trick won't work as well and a
proper background remover (remove.bg, Photoshop) would be needed instead.
