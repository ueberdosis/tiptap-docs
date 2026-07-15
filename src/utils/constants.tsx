import type { VersionData } from "@/types";

export const DEMO_URL = process.env.NEXT_PUBLIC_DEMO_URL ?? "https://embed.tiptap.dev/preview";

export const PRO_DEMO_URL =
  process.env.NEXT_PUBLIC_DEMO_URL_PRO ?? "https://embed-pro.tiptap.dev/preview";

export const BASE_PATH = process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || "";
export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
export const FULL_DOMAIN = `${DOMAIN}${BASE_PATH}`;
export const IS_NEXT = process.env.NEXT_PUBLIC_NEXT === "true" ? true : false;

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || null;
export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || "development";

export const CURRENT_VERSION = "3.x";

export type CtaBarData = {
  label: string;
  button: { text: string; href: string };
  productHunt: { imageSrc: string; href: string; alt: string };
};

export const CTA_BAR: CtaBarData = {
  label: "Empower your AI to directly edit documents in real time. Now production ready.",
  button: {
    text: "Read more",
    href: "https://tiptap.dev/blog/release-notes/ai-toolkit-now-in-beta",
  },
  productHunt: {
    imageSrc:
      "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1196883&theme=light&t=1784096381913",
    href: "https://www.producthunt.com/products/tiptap?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-tiptap-ai-toolkit-2",
    alt: "Tiptap AI Toolkit - Empower your AI to directly edit documents in real time. | Product Hunt",
  },
};

export const VERSIONS: Array<VersionData> = [
  {
    version: "3.x",
    url: "https://tiptap.dev/docs",
  },
  {
    version: "2.x",
    url: "https://v2.tiptap.dev/docs",
  },
  {
    version: "1.x",
    isLegacy: true,
    url: "https://v1.tiptap.dev/",
  },
];
