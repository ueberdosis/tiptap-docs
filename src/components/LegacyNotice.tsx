import Link from '@/components/Link'
import { Callout } from '@/components/ui/Callout'
import { LegacyFeature } from '@/content/legacy'

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

/** The box under the header of a legacy page: what still works, and what to use instead. */
export const LegacyNotice = ({ feature }: { feature: LegacyFeature }) => {
  const { name, replacedBy, migrate, note, removal } = feature
  return (
    <Callout title="Legacy" variant="hint" size="sm" className="mb-0">
      <p>
        Existing projects can keep using {name}.{' '}
        {replacedBy?.href ? (
          <>
            For new projects, use <Link href={replacedBy.href}>{replacedBy.title}</Link>.{' '}
          </>
        ) : replacedBy ? (
          <>{capitalize(replacedBy.title)} will replace it and is coming soon. </>
        ) : null}
        {migrate ? (
          <>
            <Link href={migrate.href}>{migrate.title}</Link> shows how to move.{' '}
          </>
        ) : null}
        {note ? (
          <>
            {note.text} <Link href={note.link.href}>{note.link.title}</Link>.{' '}
          </>
        ) : null}
        {removal}
      </p>
    </Callout>
  )
}
