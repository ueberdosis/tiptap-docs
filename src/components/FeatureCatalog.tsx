import { FeatureCatalogGrid } from './FeatureCatalog.client'
import { getCatalog } from '@/server/getCatalog'

/** The feature catalog for MDX pages: reads the catalog on the server, filters on the client. */
export const FeatureCatalog = () => (
  <div className="my-20 first:mt-0 last:mb-0">
    <FeatureCatalogGrid entries={getCatalog()} />
  </div>
)
