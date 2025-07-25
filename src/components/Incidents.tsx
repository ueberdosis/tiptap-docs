import { IncidentGrid } from './IncidentGrid'
import { getIncidents } from '@/server/getIncidents'

export const Incidents = async () => {
  const incidents = await getIncidents()

  return <IncidentGrid incidents={incidents} />
}
