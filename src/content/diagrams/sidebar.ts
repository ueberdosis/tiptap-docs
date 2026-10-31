import type { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'diagrams',
  rootHref: '/diagrams/getting-started/overview',
  title: 'Diagrams',
  items: [
    {
      type: 'group',
      href: '/diagrams/getting-started/overview',
      title: 'Diagrams',
      tags: ['Alpha'],
      children: [
        { title: 'Overview', href: '/diagrams/getting-started/overview' },
        { title: 'Install', href: '/diagrams/getting-started/install' },
        { title: 'Live demo', href: '/diagrams/getting-started/live-demo' },
        {
          title: 'Charts',
          href: '/diagrams/charts/overview',
          children: [
            { title: 'Appearance', href: '/diagrams/charts/appearance' },
            { title: 'Looks', href: '/diagrams/charts/looks' },
            { title: 'Editing in the chart', href: '/diagrams/charts/editing' },
            { title: 'Axes', href: '/diagrams/charts/axes' },
            { title: 'Reference lines', href: '/diagrams/charts/references' },
          ],
        },
        {
          title: 'Flow diagrams',
          href: '/diagrams/flow-diagrams/overview',
          children: [
            { title: 'Formats', href: '/diagrams/flow-diagrams/formats' },
            { title: 'Editing in the diagram', href: '/diagrams/flow-diagrams/editing' },
            { title: 'A diagram from a table', href: '/diagrams/flow-diagrams/from-table' },
          ],
        },
        {
          title: 'Data',
          href: '/diagrams/data/overview',
          children: [
            {
              title: 'Quick Input',
              href: '/diagrams/data/quick-input',
              children: [{ title: 'Chart syntax', href: '/diagrams/data/chart-syntax' }],
            },
            { title: 'Pasting', href: '/diagrams/data/pasting' },
            { title: 'Tables', href: '/diagrams/data/tables' },
            { title: 'Data Sources', href: '/diagrams/data/sources' },
          ],
        },
        {
          title: 'Renderers',
          href: '/diagrams/renderers/overview',
          children: [
            { title: 'ECharts', href: '/diagrams/renderers/echarts' },
            { title: 'D3', href: '/diagrams/renderers/d3' },
            { title: 'Mermaid', href: '/diagrams/renderers/mermaid' },
            { title: 'draw.io', href: '/diagrams/renderers/drawio' },
            { title: 'BPMN', href: '/diagrams/renderers/bpmn' },
            { title: 'Pele', href: '/diagrams/renderers/pele' },
            {
              title: 'Your own Renderer',
              href: '/diagrams/renderers/custom',
              children: [
                { title: 'Drawing on a canvas', href: '/diagrams/renderers/custom-canvas' },
                { title: 'Your own chart type', href: '/diagrams/renderers/custom-chart-types' },
                { title: 'Your own Diagram Renderer', href: '/diagrams/renderers/custom-diagrams' },
              ],
            },
          ],
        },
        { title: 'Export', href: '/diagrams/export' },
        {
          title: 'Guides',
          href: '',
          children: [
            {
              title: 'Google Sheets, Excel and Airtable',
              href: '/diagrams/guides/spreadsheets',
            },
            { title: 'Collaboration', href: '/diagrams/guides/collaboration' },
            { title: 'Versions', href: '/diagrams/guides/versions' },
            { title: 'Tools for a model', href: '/diagrams/guides/ai' },
            { title: 'Size and view', href: '/diagrams/guides/size-and-view' },
            { title: 'Text beside the picture', href: '/diagrams/guides/split-view' },
            { title: 'Styling', href: '/diagrams/guides/styling' },
          ],
        },
        {
          title: 'API reference',
          href: '',
          children: [
            { title: 'Options', href: '/diagrams/api-reference/options' },
            { title: 'Commands', href: '/diagrams/api-reference/commands' },
            { title: 'Storage', href: '/diagrams/api-reference/storage' },
            { title: 'Selectors', href: '/diagrams/api-reference/selectors' },
          ],
        },
      ],
    },
  ],
}
