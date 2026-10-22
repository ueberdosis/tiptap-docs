import { SidebarConfig } from '@/types'

// Guides that span the whole product. Guides for one area live there, such as
// src/content/editor/guides and src/content/collaboration/guides.
export const sidebarConfig: SidebarConfig = {
  id: 'guides',
  rootHref: '/guides',
  title: 'Guides',
  items: [
    {
      title: 'First Steps',
      href: '',
      type: 'group',
      children: [
        {
          href: '/guides/pro-extensions',
          title: 'Integrate Pro Extensions',
        },
      ],
    },
    {
      title: 'Essentials',
      type: 'group',
      href: '',
      children: [
        { href: '/guides/faq', title: 'FAQ' },
        { href: '/guides/accessibility', title: 'Accessibility' },
        { href: '/guides/performance', title: 'Performance' },
        { href: '/guides/typescript', title: 'TypeScript' },
      ],
    },
    {
      title: 'Upgrade Tiptap',
      type: 'group',
      href: '',
      children: [
        { href: '/guides/upgrade-tiptap-v2', title: 'From v2 to v3' },
        { href: '/guides/upgrade-tiptap-v1', title: 'From v1 to v2' },
      ],
    },
    {
      title: 'Migrate from another editor',
      type: 'group',
      href: '',
      children: [
        { href: '/guides/migrate-from-tinymce', title: 'TinyMCE' },
        { href: '/guides/migrate-from-ckeditor4', title: 'CKEditor 4' },
        { href: '/guides/migrate-from-ckeditor5', title: 'CKEditor 5' },
        { href: '/guides/migrate-from-quill', title: 'Quill' },
        { href: '/guides/migrate-from-slate', title: 'Slate' },
        { href: '/guides/migrate-from-lexical', title: 'Lexical' },
        { href: '/guides/migrate-from-editorjs', title: 'Editor.js' },
        { href: '/guides/migrate-from-draftjs', title: 'Draft.js' },
      ],
    },
  ],
}
