import { CatalogCards } from './FeatureCatalog.client'
import { getCatalog } from '@/server/getCatalog'

/** The features of one catalog group as cards, for the group's own page. */
export const CatalogGroup = ({ id }: { id: string }) => (
  <div className="my-8">
    <CatalogCards entries={getCatalog().filter((entry) => entry.group === id)} />
  </div>
)
