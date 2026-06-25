// flagcdn.com の国旗画像。next/image を介さず軽量な <img> で表示（CDN画像のため）。

interface FlagProps {
  code: string;
  alt: string;
  size?: number; // 表示幅(px)
  className?: string;
}

export default function Flag({ code, alt, size = 24, className = "" }: FlagProps) {
  const w = size <= 20 ? 20 : size <= 40 ? 40 : 80;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w${w}/${code}.png`}
      srcSet={`https://flagcdn.com/w${w}/${code}.png 1x, https://flagcdn.com/w${w * 2}/${code}.png 2x`}
      width={size}
      height={Math.round(size * 0.67)}
      alt={alt}
      loading="lazy"
      className={`inline-block rounded-[2px] object-cover shadow-sm ring-1 ring-black/30 ${className}`}
      style={{ width: size, height: Math.round(size * 0.67) }}
    />
  );
}
