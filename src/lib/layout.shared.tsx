import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { GlobeIcon } from 'lucide-react';
import { DiscordIcon } from '@/components/discord-icon';
import { TiptapLogo } from '@/components/tiptap-logo';

/** Layout options of a docs version. The title links to `homeUrl`. */
export function baseOptions(homeUrl: string): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2">
          <TiptapLogo className="size-5 shrink-0" />
          <span className="whitespace-nowrap">
            Tiptap <span className="font-normal">Docs</span>
          </span>
        </span>
      ),
      url: homeUrl,
    },
    links: [
      {
        type: 'icon',
        text: 'Website',
        label: 'Tiptap website',
        url: 'https://tiptap.dev',
        icon: <GlobeIcon />,
        external: true,
      },
      {
        type: 'icon',
        text: 'Discord',
        label: 'Tiptap on Discord',
        url: 'https://tiptap.dev/discord',
        icon: <DiscordIcon />,
        external: true,
      },
    ],
    githubUrl: 'https://github.com/ueberdosis/tiptap',
  };
}
