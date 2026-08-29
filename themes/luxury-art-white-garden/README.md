# Luxury Art — White Garden (draft)

Reference: https://web.menujuacara.id/tema-art-14/

The project owner confirmed permission to reuse the reference media. Media is stored locally under `public/themes/luxury-art-white-garden/`; third-party application code is not embedded. Demo names, photos and bank numbers are samples, not client records.

Demo route: `/demo/luxury-art-white-garden`. Category: `luxury-art`.

## Verification

- TypeScript and targeted ESLint passed.
- Production compilation passed; local prerender is blocked by missing `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` on an existing admin route.
- Browser visual comparison remains pending; local preview navigation was blocked.
- No production invitation or RSVP records were modified during testing.

## Before release

- Compare the cover, section geometry, artwork layers and animations against the supplied video on mobile and desktop. This is not yet verified as a pixel-identical reproduction.
- Verify opening, music, gallery dialog/keyboard, RSVP, clipboard, calendar and destination links in the deployed preview.
- Replace the temporary catalog portrait with a verified theme screenshot.
- Shipping address and WhatsApp confirmation do not exist in the shared invitation data model; currently the gift panel directs guests to the available Instagram contact. Implement the correct editable fields before claiming feature parity.
- Check whether the platform-wide auto-scroll controller should remain visible for this theme.

Import helper: `node scripts/import-art14-assets.mjs <reference.html> <reference.css> <fonts.css>`. The downloaded source documents are not committed.
