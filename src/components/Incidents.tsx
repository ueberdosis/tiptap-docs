import { getIncidents } from '@/server/getIncidents'
import { IncidentGrid } from './IncidentGrid'

export const Incidents = async () => {
  const incidents = await getIncidents()

  return <IncidentGrid incidents={incidents} />
}
