/** Names of the brand icons that `@/components/brand-icons` exports. */
export const brandIconNames = ['Twitch', 'Youtube'] as const;

export type BrandIconName = (typeof brandIconNames)[number];

/** Import path of the brand icon components. */
export const brandIconsModule = '@/components/brand-icons';

export const isBrandIcon = (name: string): name is BrandIconName =>
  (brandIconNames as readonly string[]).includes(name);
