import Link from '@/components/Link'
import { ADD_ON_ACCESS, DASHBOARD_URL, PILOT_PROGRAM_FORM } from '@/content/access'
import { getCatalog } from '@/server/getCatalog'

/** How to try and get each add-on and pilot feature, from src/content/access.ts. */
export const AddOnAccessTable = () => {
  const catalog = getCatalog()
  const addOns = catalog.filter((entry) => entry.plan === 'Add-on' && entry.url)
  const pilot = catalog.filter((entry) => entry.plan === 'Pilot program' && entry.url)
  return (
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>In the trial</th>
          <th>How to get it</th>
        </tr>
      </thead>
      <tbody>
        {addOns.map((entry) => {
          const access = ADD_ON_ACCESS[entry.name]
          return (
            <tr key={entry.name}>
              <td>
                <Link href={entry.url!}>{entry.name}</Link> (add-on)
              </td>
              <td>{access?.trial === undefined ? 'Ask the team' : access.trial ? 'Yes' : 'No'}</td>
              <td>
                {access?.dashboard ? (
                  <Link href={DASHBOARD_URL}>Buy it in the dashboard</Link>
                ) : (
                  <Link href={access?.contact ?? 'https://tiptap.dev/contact-sales'}>
                    Contact the Tiptap team
                  </Link>
                )}
              </td>
            </tr>
          )
        })}
        <tr>
          <td>
            {pilot.map((entry, i) => (
              <span key={entry.name}>
                {i > 0 ? ', ' : ''}
                <Link href={entry.url!}>{entry.name}</Link>
              </span>
            ))}{' '}
            (pilot program)
          </td>
          <td>No</td>
          <td>
            <Link href={PILOT_PROGRAM_FORM}>Join the pilot program</Link>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
