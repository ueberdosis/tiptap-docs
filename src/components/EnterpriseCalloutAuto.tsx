'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { EnterpriseCallout } from './EnterpriseCallout'

export type EnterpriseCalloutAutoProps = {
  variant: 'migration' | 'ai-agent' | 'pages' | 'semantic-search'
  placement?: 'inline' | 'sidebar'
}

export const EnterpriseCalloutAuto = ({ 
  variant, 
  placement = 'sidebar' 
}: EnterpriseCalloutAutoProps) => {
  const [mounted, setMounted] = useState(false)
  const [sidebarElement, setSidebarElement] = useState<Element | null>(null)

  useEffect(() => {
    setMounted(true)
    
    if (placement === 'sidebar') {
      // Find the secondary sidebar by looking for the requirements-slot's parent
      const requirementsSlot = document.getElementById('requirements-slot')
      if (requirementsSlot && requirementsSlot.parentElement) {
        const sidebar = requirementsSlot.parentElement
        // Find or create a container for the callout after requirements-slot
        let container = sidebar.querySelector('#enterprise-callout-slot')
        if (!container) {
          container = document.createElement('div')
          container.id = 'enterprise-callout-slot'
          container.className = 'mt-8'
          // Insert after requirements-slot
          requirementsSlot.insertAdjacentElement('afterend', container)
        }
        setSidebarElement(container)
      }
    }
  }, [placement])
  
  // Render inline
  if (placement === 'inline') {
    return <EnterpriseCallout variant={variant} inline className="mt-12" />
  }
  
  // Render in sidebar via portal
  if (mounted && sidebarElement && placement === 'sidebar') {
    return createPortal(
      <EnterpriseCallout variant={variant} />,
      sidebarElement
    )
  }
  
  return null
}