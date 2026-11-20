import type { StaticImageData } from 'next/image';
import type { BrandIconName } from '@/lib/brand-icons';
import { cn } from '@/lib/cn';
import twitch from '../../assets/brand/twitch.svg';
import youtube from '../../assets/brand/youtube.svg';

type BrandIconProps = { className?: string };

/** Official brand logo file in its own colors. 16 px by default; size it with `className`. */
function BrandIcon({ image, className }: BrandIconProps & { image: StaticImageData }) {
  return (
    // biome-ignore lint/performance/noImgElement: a small SVG logo, shown as delivered
    <img
      src={image.src}
      width={image.width}
      height={image.height}
      alt=""
      className={cn('size-4 shrink-0 object-contain', className)}
    />
  );
}

export function Twitch({ className }: BrandIconProps) {
  return <BrandIcon image={twitch} className={className} />;
}

export function Youtube({ className }: BrandIconProps) {
  return <BrandIcon image={youtube} className={className} />;
}

export const brandIcons = { Twitch, Youtube } satisfies Record<
  BrandIconName,
  (props: BrandIconProps) => React.ReactNode
>;
