import { CSSProperties } from "react";

interface StandardImageAttributes {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  style?: CSSProperties;
  className?: string;
}

export default function StandardImage({
  src,
  alt,
  width,
  height,
  style,
  className,
}: StandardImageAttributes) {
  return (
    <img
      src={`/roguelands-compendium/${src}`}
      alt={alt}
      width={width}
      height={height}
      style={style}
      className={className}
      loading="lazy"
    />
  );
}
