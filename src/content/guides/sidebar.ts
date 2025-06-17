import { SidebarConfig } from '@/types'

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
      title: 'Essential',
      type: 'group',
      href: '',
      children: [
        {
          href: '/guides/faq',
          title: 'FAQ',
        },
        {
          href: '/guides/accessibility',
          title: 'Accessibility',
        },
        {
          href: '/guides/performance',
          title: 'Performance',
        },
        {
          href: '/guides/invalid-schema',
          title: 'Invalid schema handling',
        },
        {
          href: '/guides/output-json-html',
          title: 'Export JSON or HTML',
        },
        {
          href: '/guides/authentication',
          title: 'Collaboration Auth',
        },
        {
          href: '/guides/naming-documents',
          title: 'Naming documents',
        },
        {
          href: '/guides/offline-support',
          title: 'Offline Collaboration',
        },
        {
          href: '/guides/legacy-conversion',
          title: 'Legacy conversion',
        },
        {
          href: '/guides/upgrade-tiptap-v1',
          title: 'Upgrade Tiptap V1',
        },
        {
          href: '/guides/upgrade-tiptap-v2',
          title: 'Upgrade Tiptap V2',
        },
      ],
    },
    {
      title: 'Customization',
      type: 'group',
      href: '',
      children: [
        {
          href: '/guides/typescript',
          title: 'Extend with TypeScript',
        },
      ],
    },
    {
      title: 'Migration',
      type: 'group',
      href: '',
      children: [
        {
          href: '/guides/migrate-from-tinymce',
          title: 'Migrate from TinyMCE',
        },
        {
          href: '/guides/migrate-from-ckeditor4',
          title: 'Migrate from CKEditor 4',
        },
        {
          href: '/guides/migrate-from-ckeditor5',
          title: 'Migrate from CKEditor 5',
        },
        {
          href: '/guides/migrate-from-quill',
          title: 'Migrate from Quill',
        },
        {
          href: '/guides/migrate-from-slate',
          title: 'Migrate from Slate',
        },
        {
          href: '/guides/migrate-from-lexical',
          title: 'Migrate from Lexical',
        },
        {
          href: '/guides/migrate-from-editorjs',
          title: 'Migrate from Editor.js',
        },
        {
          href: '/guides/migrate-from-draftjs',
          title: 'Migrate from Draft.js',
        },
      ],
    },
  ],
}
