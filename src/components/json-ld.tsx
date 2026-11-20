/** Renders structured data as a `<script type="application/ld+json">` tag. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // `<` is escaped so the JSON cannot close the script tag.
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD needs the raw JSON text.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
