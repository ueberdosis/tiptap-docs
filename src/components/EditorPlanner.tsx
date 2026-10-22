import { EditorPlannerView } from './EditorPlanner.client'
import { getCatalog } from '@/server/getCatalog'
import { FULL_DOMAIN } from '@/utils/constants'

/** "Plan your editor" for MDX pages: the catalog's documented features, planned on the client. */
export const EditorPlanner = () => (
  <div className="my-12 first:mt-0 last:mb-0">
    <EditorPlannerView entries={getCatalog().filter((entry) => entry.url)} docsRoot={FULL_DOMAIN} />
  </div>
)
