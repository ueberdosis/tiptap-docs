import { Fragment } from 'react'
import Link from '@/components/Link'
import { getPlanRows } from '@/server/planOverview'

/** What each plan includes, generated from the feature catalog. */
export const PlanOverview = () => (
  <table>
    <thead>
      <tr>
        <th>Plan</th>
        <th>What it includes</th>
      </tr>
    </thead>
    <tbody>
      {getPlanRows().map((row) => (
        <tr key={row.title}>
          <td>
            <strong>{row.title}</strong>
          </td>
          <td>
            {row.text}{' '}
            {row.catalog ? <Link href={row.catalog.url}>{row.catalog.count} features</Link> : null}
            {[
              ...row.features,
              ...(row.links ?? []).map(({ label, url }) => ({ name: label, url })),
            ].map((item, i) => (
              <Fragment key={item.url}>
                {i > 0 ? ', ' : ''}
                <Link href={item.url}>{item.name}</Link>
              </Fragment>
            ))}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)
