import fs from 'fs'
import path from 'path'
import fm from 'front-matter'
import { IncidentData, PageFrontmatter } from '@/types'

// Helper function to safely parse dates
function parseDateSafely(dateString: string): Date | null {
  if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
    return null
  }
  
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}

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

    // Sort by date (newest first) with proper handling of invalid dates
    incidents.sort((a, b) => {
      const dateA = parseDateSafely(a.incident.date)
      const dateB = parseDateSafely(b.incident.date)
      
      // If both dates are invalid, maintain original order
      if (!dateA && !dateB) {
        return 0
      }
      
      // If only one date is invalid, put invalid dates at the end
      if (!dateA) return 1
      if (!dateB) return -1
      
      // Both dates are valid, sort chronologically (newest first)
      return dateB.getTime() - dateA.getTime()
    })

    return incidents
  } catch (error) {
    console.error('Error loading incidents:', error)
    return []
  }
}
