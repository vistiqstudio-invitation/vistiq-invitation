"use client";

import type { InvitationData } from "@/types/invitation";
import AdatMinangMotionBase from "./AdatMinangMotionBase";

/**
 * Compatibility wrapper for the Minang motion theme.
 *
 * The original visual implementation reads Love Story images from `gallery`.
 * New invitations store dedicated Love Story images in `storyPhotos`. Keep the
 * gallery untouched for the Gallery section while exposing the configured
 * story photos to the legacy Love Story renderer until the visual component is
 * fully migrated.
 */
export default function AdatMinangMotion({ invitation }: { invitation: InvitationData }) {
  const configuredStoryPhotos = (invitation.storyPhotos || []).filter(
    (photo): photo is string => Boolean(photo),
  );

  if (configuredStoryPhotos.length === 0) {
    return <AdatMinangMotionBase invitation={invitation} />;
  }

  const sourceGallery = invitation.gallery;
  const galleryForTheme = [...sourceGallery];
  const nativeSlice = Array.prototype.slice.bind(sourceGallery) as (
    start?: number,
    end?: number,
  ) => string[];
  let storySliceCall = 0;

  galleryForTheme.slice = ((start?: number, end?: number) => {
    // The legacy Love Story renderer calls slice(0, 4) twice: first for the
    // primary story images (then reverses them), and second for its fallback.
    // Return dedicated story images for those two calls only. Gallery rendering
    // uses slice(0, 6), so the actual gallery remains exactly as uploaded.
    if (start === 0 && end === 4) {
      storySliceCall += 1;

      if (storySliceCall % 2 === 1) {
        return configuredStoryPhotos.slice(0, 4).reverse();
      }

      const fallback = nativeSlice(0, 4);
      if (configuredStoryPhotos[4]) fallback[4] = configuredStoryPhotos[4];
      return fallback;
    }

    return nativeSlice(start, end);
  }) as typeof galleryForTheme.slice;

  return (
    <AdatMinangMotionBase
      invitation={{
        ...invitation,
        gallery: galleryForTheme,
      }}
    />
  );
}
