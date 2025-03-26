export type ExternalVersion = {
  version: string
  isExternal: true
  url: string
  isBeta?: boolean
  isAlpha?: boolean
  isRc?: boolean
  isLegacy?: boolean
}

export type InternalVersion = {
  version: string
  key: string
  isBeta?: boolean
  isAlpha?: boolean
  isRc?: boolean
  isLegacy?: boolean
}

export type VersionData = ExternalVersion | InternalVersion

export type SidebarLink = {
  type: 'link'
  title: string
  href: string
  tags?: string[]
  children?: Omit<SidebarLink, 'type'>[]
}

export type SidebarGroup = {
  type: 'group'
  title: string
  href: string
  tags?: string[]
  children: Omit<SidebarLink, 'type'>[]
}

export type SidebarConfig = {
  id: string
  title: string
  rootHref: string
  items: Array<SidebarLink | SidebarGroup>
}

export type GeneralPageTag = {
  type: 'pro' | 'new' | 'experiment' | 'ai' | 'collaboration' | 'editor' | 'documents' | 'beta'
}

export type ImagePageTag = {
  type: 'image'
  src: string
  url: string
  label: string
}

export type PageTag = GeneralPageTag | ImagePageTag

export type PageMeta = {
  pageTitle: string
  pageDescription?: string
  hideSecondarySidebar?: boolean
}

export type PageFrontmatter = {
  title?: string
  description?: string
  meta?: FrontmatterMeta
  sidebars?: FrontmatterSidebar
  extension?: ExtensionMeta
  tags?: PageTag[]
}

export type FrontmatterSidebar = {
  hidePrimary?: SidebarConfig
  hideSecondary?: SidebarConfig
}

export type FrontmatterMeta = {
  title?: string
  description?: string
  category?: string
}

export enum ExtensionType {
  // eslint-disable-next-line no-unused-vars
  Node = 'node',
  // eslint-disable-next-line no-unused-vars
  Mark = 'mark',
  // eslint-disable-next-line no-unused-vars
  Functionality = 'extension',
}

export type ExtensionMeta = {
  name: string
  icon: string | null
  link: string
  description: string
  type: ExtensionType
  isPro?: boolean
  isBeta?: boolean
  isExperiment?: boolean
  isNew?: boolean
  isCloud?: boolean
}

export type ExtensionMetaWithUrl = ExtensionMeta & {
  path: string
  url: string
}

export type SearchHit = {
  hierarchy: {
    lvl0: string
    lvl1?: string
    lvl2?: string
    lvl3?: string
    lvl4?: string
    lvl5?: string
    lvl6?: string
    text?: string
  }
  hierarchy_camel: {
    lvl0: string
    lvl1?: string
    lvl2?: string
    lvl3?: string
    lvl4?: string
    lvl5?: string
    lvl6?: string
    text?: string
  }
  'hierarchy.lvl0': string
  'hierarchy.lvl1'?: string
  'hierarchy.lvl2'?: string
  'hierarchy.lvl3'?: string
  'hierarchy.lvl4'?: string
  'hierarchy.lvl5'?: string
  'hierarchy.lvl6'?: string

  url: string
  url_without_anchor: string
  url_without_variables: string
}
