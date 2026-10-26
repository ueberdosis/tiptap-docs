import Link from '@/components/Link'
import { PartLicense, bundleParts } from '@/server/bundles'

/** The parts of a bundle as a table, with what each adds and its status. */
export const BundleParts = ({ bundle, license }: { bundle: string; license?: PartLicense }) => (
  <table>
    <thead>
      <tr>
        <th>Feature</th>
        <th>What it adds</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {bundleParts(bundle, license).map((entry) => (
        <tr key={entry.name}>
          <td>{entry.url ? <Link href={entry.url}>{entry.name}</Link> : entry.name}</td>
          <td>{entry.description}</td>
          <td>{entry.status ?? 'Stable'}</td>
        </tr>
      ))}
    </tbody>
  </table>
)
