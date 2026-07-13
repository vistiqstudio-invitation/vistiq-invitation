"use client";

function hideOnError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}

const SRC = {
  corner: "/decor/jawa-merah/corner-foliage.png",
  spray: "/decor/jawa-merah/floral-spray.png",
} as const;

export default function FloralAccent({
  variant,
  className,
}: {
  variant: keyof typeof SRC;
  className?: string;
}) {
  return (
    <img className={className} src={SRC[variant]} alt="" onError={hideOnError} />
  );
}
