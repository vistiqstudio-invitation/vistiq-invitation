// Renders one hidden, shared <clipPath> - a union of a center circle plus
// 8 petal circles - that every .scallopFrame element in this theme
// references via clip-path: url(#kasih-scallop). Rendered once at the
// theme root; multiple elements can safely share the same clip-path id.
export default function ScallopDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <clipPath id="kasih-scallop" clipPathUnits="objectBoundingBox">
          <circle cx="0.5" cy="0.5" r="0.32" />
          <circle cx="0.82" cy="0.5" r="0.13" />
          <circle cx="0.726" cy="0.726" r="0.13" />
          <circle cx="0.5" cy="0.82" r="0.13" />
          <circle cx="0.274" cy="0.726" r="0.13" />
          <circle cx="0.18" cy="0.5" r="0.13" />
          <circle cx="0.274" cy="0.274" r="0.13" />
          <circle cx="0.5" cy="0.18" r="0.13" />
          <circle cx="0.726" cy="0.274" r="0.13" />
        </clipPath>
      </defs>
    </svg>
  );
}
