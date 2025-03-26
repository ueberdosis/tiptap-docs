'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { NavLink } from './NavLink'
import { NavLinkButton } from './ui/NavLinkButton'
import { cn } from '@/utils'

const options = [
  {
    label: 'Features',
    items: [
      { label: 'Editor', href: '/editor/getting-started/overview' },
      {
        label: 'Collaboration',
        href: '/collaboration/getting-started/overview',
      },
      { label: 'Comments', href: '/comments/getting-started/overview' },
      { label: 'Content AI', href: '/content-ai/getting-started/overview' },
      { label: 'History', href: '/collaboration/documents/history' },
      { label: 'Conversion', href: '/conversion/getting-started/overview' },
      { label: 'Semantic search', href: '/collaboration/documents/semantic-search' },
    ],
  },
  {
    label: 'Others',
    items: [
      { label: 'Guides', href: '/guides' },
      { label: 'Examples', href: '/examples' },
      { label: 'UI Components', href: '/ui-components/getting-started/overview' },
      { label: 'Website', href: 'https://tiptap.dev', target: '_blank' },
    ],
  },
]

export const MobileNavigationDropdown = () => {
  const pathname = usePathname()

  const activeItem = useMemo(() => {
    const flatOptions = options.flatMap((group) => group.items)

    return flatOptions.find((option) => {
      if (option.href === '/') {
        return pathname === '/'
      } else {
        const firstPart = option.href.split('/')[1]
        if (firstPart === '') {
          return false
        }

        return pathname.startsWith(`/${firstPart}`)
      }
    })
  }, [pathname])

  const buttonClass = cn('text-base outline-none', !!activeItem ? 'font-semibold' : 'font-normal')

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <NavLinkButton className={buttonClass}>
          {activeItem?.label || 'All docs'}
          <ChevronDownIcon className="w-3 h-3" />
        </NavLinkButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="flex flex-col gap-6 z-50 py-6 px-2 lg:py-3 text-black bg-white border rounded-lg border-grayAlpha-100 w-[14rem] lg:w-[10.43rem]">
          {options.map((group, i) => (
            <div key={`group__${i}`}>
              <div className="uppercase font-bold leading-[120%] text-xs mb-3 px-2 block lg:hidden">
                {group.label}
              </div>
              {group.items.map((option) => (
                <DropdownMenu.Item key={option.href} asChild>
                  <NavLink target={option.target} href={option.href}>
                    {option.label}
                  </NavLink>
                </DropdownMenu.Item>
              ))}
            </div>
          ))}
          <div>
            <NavLink
              variant="invert"
              href="https://cloud.tiptap.dev/register"
              target="_blank"
              className="text-center justify-center items-center"
              hideIcon
            >
              Sign up
            </NavLink>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
