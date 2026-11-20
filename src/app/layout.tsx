import './global.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { JsonLd } from '@/components/json-ld';
import { PageViewTracker } from '@/components/page-view-tracker';
import { Provider } from '@/components/provider';
import { isProductionSite, previewRobots, siteUrl } from '@/lib/shared';
import { organizationJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  robots: isProductionSite ? undefined : previewRobots,
};

const inter = Inter({
  subsets: ['latin'],
});

// Analytics and consent load only on the production site.
const gtmId = isProductionSite ? process.env.NEXT_PUBLIC_GTM_ID : undefined;
const cookiebotId = isProductionSite ? process.env.NEXT_PUBLIC_COOKIEBOT_ID : undefined;

const gtmScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        {gtmId ? (
          <noscript>
            {/* biome-ignore lint/a11y/useIframeTitle: standard GTM noscript iframe, hidden */}
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        ) : null}
        {/* First Tab stop, hidden until focused: skips the header and sidebar (WCAG 2.4.1) */}
        <a
          href="#nd-page"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:border focus:bg-fd-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
        >
          Skip to content
        </a>
        <Provider>{children}</Provider>
        <JsonLd data={organizationJsonLd} />
        {cookiebotId ? (
          <Script
            id="Cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid={cookiebotId}
            type="text/javascript"
          />
        ) : null}
        {gtmId ? (
          <>
            <Script id="GTM" strategy="beforeInteractive">
              {gtmScript}
            </Script>
            <PageViewTracker />
          </>
        ) : null}
      </body>
    </html>
  );
}
