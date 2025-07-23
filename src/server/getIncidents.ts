import fs from 'fs'
import path from 'path'
import fm from 'front-matter'
import { IncidentData, PageFrontmatter } from '@/types'

export async function getIncidents(): Promise<IncidentData[]> {
  const incidentsDir = path.join(process.cwd(), 'src/content/resources/incidents')

  try {
    const files = fs.readdirSync(incidentsDir)
    const incidents: IncidentData[] = []

    for (const file of files) {
      if (file.endsWith('.mdx')) {
        const filePath = path.join(incidentsDir, file)
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const { attributes } = fm<PageFrontmatter>(fileContent)

        const slug = file.replace('.mdx', '')
        const url = `/resources/incidents/${slug}`

        incidents.push({
          title: attributes.title || '',
          meta: {
            title: attributes.meta?.title || '',
            description: attributes.meta?.description || '',
            category: attributes.meta?.category || '',
          },
          incident: attributes.incident || {
            product: '',
            date: '',
            status: 'resolved',
            severity: 'low',
          },
          path: file,
          url: url,
        })
      }
    }

    // Sort by date (newest first)
    incidents.sort((a, b) => {
      const dateA = new Date(a.incident.date)
      const dateB = new Date(b.incident.date)
      return dateB.getTime() - dateA.getTime()
    })

    return incidents
  } catch (error) {
    console.error('Error loading incidents:', error)
    return []
  }
}
