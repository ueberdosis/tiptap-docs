// Industries for the catalog filter, the configurator, and the MCP tool
// list_features. Each lists the features that matter most there, by catalog
// name; basics every editor needs (paragraphs, bold, lists) stay out.
//
// DRAFT: a first mapping from the docs, to check with the product team.

export type Industry = {
  id: string
  title: string
  description: string
  features: string[]
}

export const INDUSTRIES: Industry[] = [
  {
    id: 'legal',
    title: 'Legal',
    description: 'Contracts and agreements that are drafted, negotiated, and signed off.',
    features: [
      'Tracked Changes',
      'Comments',
      'Compare',
      'Snapshots',
      'Content Protection',
      'Slots',
      'Variables',
      'Pages',
      'DOCX import',
      'DOCX export',
      'PDF export',
      'Collaboration',
    ],
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Course material, assignments, and feedback, written alone or together.',
    features: [
      'Mathematics',
      'Code block lowlight',
      'Image',
      'YouTube',
      'Audio',
      'Task list',
      'Character count',
      'Collaboration',
      'Collaboration caret',
      'Comments',
      'Snapshots',
      'Basic AI Generation',
      'Server AI Toolkit',
    ],
  },
  {
    id: 'finance',
    title: 'Finance',
    description: 'Reports and statements built from data and reviewed before they go out.',
    features: [
      'Table kit',
      'Variables',
      'Slots',
      'Content Protection',
      'Pages',
      'PDF export',
      'DOCX export',
      'Compare',
      'Snapshots',
      'Tracked Changes',
      'Comments',
    ],
  },
  {
    id: 'banking',
    title: 'Banking',
    description:
      'Customer documents and policies that must stay controlled, traceable, and approved.',
    features: [
      'Content Protection',
      'Slots',
      'Variables',
      'Table kit',
      'Tracked Changes',
      'Comments',
      'Compare',
      'Snapshots',
      'Unique ID',
      'Pages',
      'PDF export',
      'DOCX import',
      'DOCX export',
    ],
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    description: 'Clinical and regulatory documents with controlled editing and a full history.',
    features: [
      'Content Protection',
      'Slots',
      'Variables',
      'Snapshots',
      'Tracked Changes',
      'Comments',
      'Collaboration',
      'PDF export',
      'Unique ID',
    ],
  },
  {
    id: 'content-operations',
    title: 'Content operations',
    description: 'Articles and pages for a CMS, with media, editorial review, and AI help.',
    features: [
      'Image',
      'YouTube',
      'Twitch',
      'Audio',
      'Link',
      'Table of contents',
      'Typography',
      'Character count',
      'Find and replace',
      'Unique ID',
      'Drag handle',
      'Markdown export',
      'Comments',
      'Tracked Changes',
      'Snapshots',
      'Slots',
      'Basic AI Generation',
      'Server AI Toolkit',
    ],
  },
  {
    id: 'public-sector',
    title: 'Public sector',
    description: 'Official documents and forms with review, a full history, and open formats.',
    features: [
      'Content Protection',
      'Slots',
      'Variables',
      'Tracked Changes',
      'Comments',
      'Compare',
      'Snapshots',
      'Collaboration',
      'Pages',
      'DOCX import',
      'DOCX export',
      'ODT export',
      'PDF export',
    ],
  },
]
