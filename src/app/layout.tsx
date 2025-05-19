import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import { cn } from '@/utils'
import { Providers } from '@/components/Providers'
import { createMetadata } from '@/server/createMetadata'
import { Search } from '@/components/Search'
import { createCanonicalUrl } from '@/server/createCanonicalUrl'
import { FULL_DOMAIN, GTM_ID } from '@/utils/constants'
const inter = Inter({ subsets: ['latin'] })

export async function getMetadata() {
  return createMetadata({
    title: 'Tiptap Suite Documentation',
    description: 'Documentation for Tiptap and all Tiptap products',
    ogTitle: 'Tiptap Suite Documentation',
    canonicalUrl: createCanonicalUrl([]),
  })
}

const GTM_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    url: 'https://tiptap.dev',
    sameAs: [
      'https://www.linkedin.com/company/tiptapdev/',
      'https://github.com/ueberdosis/tiptap',
      'https://discord.com/invite/WtJ49jGshW',
      'https://www.pinterest.co.uk/brand/',
      'https://twitter.com/tiptap_editor',
    ],
    image: `${FULL_DOMAIN}assets/images/example-image.jpg`,
    logo: `${FULL_DOMAIN}assets/images/tiptap-logo.png`,
    foundingDate: '2023',
    name: 'Tiptap',
    alternateName: 'Tiptap Editor',
    legalName: 'Tiptap GmbH',
    description:
      'A suite of open source content editing and real-time collaboration tools for developers building apps like Notion or Google Docs.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kurfürstenstraße 56',
      addressLocality: 'Berlin',
      addressCountry: 'DE',
      addressRegion: 'Berlin',
      postalCode: '10785',
    },
    vatID: 'DE358781150',
    email: 'humans@tiptap.dev',
    telephone: '+49-30-85730603',
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href={`${FULL_DOMAIN}/favicon.png`} sizes="any" />
        <meta name="docsearch:version" content="2.x" />
      </head>
      <body className={cn(inter.className, 'font-sans bg-warmGray text-black')}>
        {GTM_ID ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
        ) : null}
        <Providers>
          {children}
          <Search />
        </Providers>
        {/* Footer without PageHelpFeedback at the bottom of the page */}
        <footer className="w-full flex flex-col items-center mt-16 mb-8">
          <div className="w-full max-w-4xl px-4">{/* PageHelpFeedback removed as requested */}</div>
        </footer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        ></script>
        {process.env.NEXT_PUBLIC_COOKIEBOT_ID ? (
          <Script
            id="Cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid={process.env.NEXT_PUBLIC_COOKIEBOT_ID ?? ''}
            type="text/javascript"
          ></Script>
        ) : null}
        {GTM_ID ? (
          <Script id="GTM" strategy="beforeInteractive">
            {GTM_SCRIPT}
          </Script>
        ) : null}
      </body>
    </html>
  )
}
