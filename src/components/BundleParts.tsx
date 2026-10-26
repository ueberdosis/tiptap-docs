import Link from '@/components/Link'
import { bundleParts, partPlan } from '@/server/bundles'

/** The parts of a bundle as a table, with what each adds, its status, and its plan on its own. */
export const BundleParts = ({ bundle }: { bundle: string }) => (
  <table>
    <thead>
      <tr>
        <th>Feature</th>
        <th>What it adds</th>
        <th>Status</th>
        <th>On its own</th>
      </tr>
    </thead>
    <tbody>
      {bundleParts(bundle).map((entry) => (
        <tr key={entry.name}>
          <td>{entry.url ? <Link href={entry.url}>{entry.name}</Link> : entry.name}</td>
          <td>{entry.description}</td>
          <td>{entry.status ?? 'Stable'}</td>
          <td>{partPlan(entry)}</td>
        </tr>
      ))}
    </tbody>
  </table>
)
