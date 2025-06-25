'use client'

import { useCallback, useMemo } from 'react'
import { Tag } from './ui/Tag'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import Link from '@/components/Link'
import { IncidentData, INCIDENT_STATUS_COLORS, INCIDENT_SEVERITY_COLORS } from '@/types'
import { useQueryParam } from '@/hooks/useQueryParams'

// Constants
const INCIDENT_FILTER = {
  ALL: 'all',
  UI_COMPONENT: 'ui-component',
} as const

const SEVERITY_TOOLTIPS = {
  low: 'Low severity: Minor security issue with minimal impact',
  medium: 'Medium severity: Moderate security risk with limited impact',
  high: 'High severity: Significant security vulnerability that could lead to data exposure or system compromise',
  critical: 'Critical severity: Immediate security threat requiring urgent attention',
} as const

// Types
type IncidentFilter = (typeof INCIDENT_FILTER)[keyof typeof INCIDENT_FILTER]

interface IncidentGridProps {
  incidents: IncidentData[]
}

interface FilterButtonProps {
  onClick: () => void
  children: React.ReactNode
  isActive?: boolean
}

// Utils
function normalizeProductForFilter(product: string): string {
  return product.toLowerCase().replace(/\s+/g, '-')
}

function getSeverityTooltip(severity: string): string {
  const normalizedSeverity = severity.toLowerCase() as keyof typeof SEVERITY_TOOLTIPS
  return SEVERITY_TOOLTIPS[normalizedSeverity] || `${severity} severity incident`
}

function getProductVariant(product: string): 'gray' | 'info' {
  return product === 'UI Component' ? 'gray' : 'info'
}

// Components
function FilterButton({ onClick, children, isActive }: FilterButtonProps) {
  return (
    <Button variant="tertiary" isActive={isActive} onClick={onClick}>
      {children}
    </Button>
  )
}

function IncidentCard({ incident }: { incident: IncidentData }) {
  const severityColor = INCIDENT_SEVERITY_COLORS[incident.incident.severity] || 'neutral'
  const productVariant = getProductVariant(incident.incident.product)
  const severityTooltip = getSeverityTooltip(incident.incident.severity)

  return (
    <Card className="w-full" isClickable asChild>
      <Link href={incident.url}>
        {/* Header with title and severity */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-black leading-[140%]">{incident.title}</h3>
          </div>
          <div className="flex-shrink-0">
            <Tag
              variant={severityColor as any}
              className="text-xs font-medium"
              tooltip={severityTooltip}
            >
              {incident.incident.severity.toUpperCase()}
            </Tag>
          </div>
        </div>

        {/* Description */}
        <div className="leading-[140%] text-grayAlpha-600">{incident.meta.description}</div>

        {/* Meta information row */}
        <div className="mt-3 flex items-center flex-wrap gap-1 text-sm text-grayAlpha-600">
          <span>
            {incident.incident.status} {incident.incident.date}
          </span>
          <span className="mx-1">•</span>
          <Tag variant={productVariant}>{incident.incident.product}</Tag>
        </div>
      </Link>
    </Card>
  )
}

// Hooks
function useIncidentSearch() {
  const [filter, setFilter] = useQueryParam<IncidentFilter>('filter', INCIDENT_FILTER.ALL)

  const showAll = useCallback(() => {
    setFilter(INCIDENT_FILTER.ALL)
  }, [setFilter])

  const showUIComponent = useCallback(() => {
    setFilter(INCIDENT_FILTER.UI_COMPONENT)
  }, [setFilter])

  return {
    filter,
    showAll,
    showUIComponent,
  }
}

function useFilteredIncidents(incidents: IncidentData[], filter: IncidentFilter) {
  return useMemo(() => {
    return incidents.filter((incident) => {
      if (filter === INCIDENT_FILTER.ALL) {
        return true
      }

      return normalizeProductForFilter(incident.incident.product) === filter
    })
  }, [incidents, filter])
}

function useAvailableProducts(incidents: IncidentData[]) {
  return useMemo(() => {
    const products = new Set(incidents.map((incident) => incident.incident.product))
    return Array.from(products)
  }, [incidents])
}

// Main Component
export const IncidentGrid = ({ incidents }: IncidentGridProps) => {
  const { filter, showAll, showUIComponent } = useIncidentSearch()
  const filteredIncidents = useFilteredIncidents(incidents, filter)
  const availableProducts = useAvailableProducts(incidents)

  const noIncidents = incidents.length === 0 || filteredIncidents.length === 0
  const hasUIComponents = availableProducts.includes('UI Component')

  return (
    <div className="grid gap-8">
      {/* Filter controls */}
      <div className="flex flex-none items-center gap-1 justify-end">
        <FilterButton isActive={filter === INCIDENT_FILTER.ALL} onClick={showAll}>
          All
        </FilterButton>
        {hasUIComponents && (
          <FilterButton
            isActive={filter === INCIDENT_FILTER.UI_COMPONENT}
            onClick={showUIComponent}
          >
            UI Component
          </FilterButton>
        )}
      </div>

      {/* Incident list */}
      <div className="grid gap-6">
        {noIncidents ? (
          <div className="text-theme-secondary">No incidents found matching your filters.</div>
        ) : (
          filteredIncidents.map((incident) => (
            <IncidentCard key={incident.path} incident={incident} />
          ))
        )}
      </div>
    </div>
  )
}
