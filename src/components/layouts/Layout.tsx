import { forwardRef } from 'react'
import { PageEditStatus } from '../ui/PageEditStatus'
import { TiptapLogo } from '../TiptapLogo'
import { ProductDropdown } from '../ProductDropdown'
import { NavLink } from '../NavLink'
import { SearchButton } from '../SearchButton'
import { ToCButton } from '../ToCButton'
import { MobileTableOfContent } from '../MobileTableOfContent'
import { MobileSidebarNavigation } from '../MobileSidebarNavigation'
import { MobileNavigationButton } from '../MobileNavigationButton'
import { DocsSidebar } from '../SidebarRenderer'
import { MobileNavigationDropdown } from '../MobileNavigationDropdown'
import { SidebarTableOfContent } from '../SidebarTableOfContent'
import Link from '@/components/Link'
import { cn } from '@/utils'
import { getAllMetadata } from '@/server/getAllMetadata'
import { SidebarConfig } from '@/types'

const PageEditFooter = async () => {
  const allMeta = await getAllMetadata()

  return (
    <>
      <PageEditStatus allMeta={allMeta} />
    </>
  )
}

export const LayoutHeader = forwardRef<HTMLDivElement, { config?: SidebarConfig }>(
  ({ config, ...rest }, ref) => {
    return (
      <header ref={ref} {...rest} className="container sticky top-0 w-full py-1.5 z-50">
        <div className="bg-white h-14 shadow-slim rounded-tl-pilled rounded-tr-pilled lg:rounded-pilled px-[1.125rem] py-3 flex items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-deco text-lg flex items-center gap-2.5 pr-2.5">
              <TiptapLogo />
              <span>
                <span className="font-semibold">Tiptap</span> Docs
              </span>
            </Link>
            <span className="hidden lg:block select-none text-black/15">/</span>
            <nav className="hidden lg:flex items-center gap-[0.5px]">
              <ProductDropdown />
              <NavLink href="/guides">Guides</NavLink>
              <NavLink href="/examples">Examples</NavLink>
              <NavLink href="/ui-components/getting-started/overview">UI Components</NavLink>
              <NavLink href="https://tiptap.dev" target="_blank">
                Website
              </NavLink>
            </nav>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden xl:block">
              <SearchButton />
            </div>
            <div className="hidden lg:flex items-center gap-1 xl:hidden">
              <ToCButton />
              <SearchButton />
            </div>
            <div className="block lg:hidden">
              <MobileNavigationDropdown />
            </div>
            <div className="hidden lg:block">
              <NavLink
                variant="invert"
                href="https://cloud.tiptap.dev/register"
                target="_blank"
                hideIcon
              >
                Sign up
              </NavLink>
            </div>
          </div>
        </div>
        <div className="block lg:hidden py-1.5 bg-white px-[1.125rem] shadow-slim rounded-bl-pilled rounded-br-pilled border-t border-neutral-200">
          <div className="h-8 py-1 flex items-center">
            <div className="mr-auto flex items-center gap-2">
              <MobileNavigationButton config={config} />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <ToCButton />
              <SearchButton />
            </div>
          </div>
        </div>
      </header>
    )
  },
)

LayoutHeader.displayName = 'LayoutHeader'

export type LayoutWrapperProps = {} & React.HTMLAttributes<HTMLDivElement>

const LayoutWrapper = forwardRef<HTMLDivElement, LayoutWrapperProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <div
        {...rest}
        className={cn('container relative flex items-start lg:gap-8 gap-[4.5rem]', className)}
        ref={ref}
      >
        {children}
      </div>
    )
  },
)

LayoutWrapper.displayName = 'LayoutWrapper'

export type LayoutSidebarProps = {
  config: SidebarConfig
} & React.HTMLAttributes<HTMLDivElement>

const LayoutSidebar = forwardRef<HTMLDivElement, LayoutSidebarProps>(
  ({ config, children, className, ...rest }, ref) => {
    return (
      <>
        <MobileSidebarNavigation config={config} />
        <div
          {...rest}
          className={cn(
            'hidden lg:block flex-none sticky top-[4.25rem] px-2 py-6 self-start w-[16.25rem] h-[calc(100vh-4.75rem)] overflow-auto overscroll-contain',
            className,
          )}
          ref={ref}
        >
          <DocsSidebar config={config} />
          {children}
        </div>
      </>
    )
  },
)

LayoutSidebar.displayName = 'LayoutSidebar'

export type LayoutSecondarySidebarProps = {} & React.HTMLAttributes<HTMLDivElement>

const LayoutSecondarySidebar = forwardRef<HTMLDivElement, LayoutSecondarySidebarProps>(
  ({ className, ...rest }, ref) => {
    return (
      <>
        <MobileTableOfContent />
        <div
          {...rest}
          className={cn(
            'hidden xl:block flex-none self-start sticky px-3 py-6 top-[4.25rem] w-[16.25rem] h-[calc(100vh-4.75rem)] overflow-auto overscroll-contain',
            className,
          )}
          ref={ref}
        >
          <SidebarTableOfContent />
        </div>
      </>
    )
  },
)

LayoutSecondarySidebar.displayName = 'LayoutSecondarySidebar'

export type LayoutContentProps = {} & React.HTMLAttributes<HTMLDivElement>

export const LayoutContent = forwardRef<HTMLDivElement, LayoutContentProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <main
        {...rest}
        className={cn(
          'px-2 sm:px-6 lg:pr-12 lg:pl-0 flex-1 self-start sticky top-14 min-w-0 lg:max-w-[66rem]',
          className,
        )}
        ref={ref}
      >
        <div className="pt-6 pb-16 sm:pb-24 sm:pt-8 lg:pb-32 lg:pt-10">{children}</div>

        <footer className="border-t border-grayAlpha-300 pt-8 pb-[3.125rem]">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
            <div className="flex flex-col items-start flex-none">
              <PageEditFooter />
            </div>
            <div className="flex flex-col items-end flex-none"></div>
          </div>
          <div className="flex flex-col items-start justify-between gap-4 mt-12 text-sm">
            <div className="flex flex-wrap items-center flex-none gap-3">
              <Link
                className="hover:underline"
                target="_blank"
                href="https://tiptap.dev/docs/hocuspocus/introduction"
              >
                Hocuspocus
              </Link>
              <Link
                className="hover:underline"
                target="_blank"
                href="https://tiptap.dev/legal-notice"
              >
                Legal notice
              </Link>
              <Link
                className="hover:underline"
                target="_blank"
                href="https://tiptap.dev/privacy-policy"
              >
                Privacy Policy
              </Link>
              <Link
                className="hover:underline"
                target="_blank"
                href="https://tiptap.dev/terms-of-service"
              >
                Terms of Service
              </Link>
              <Link className="hover:underline" href="/resources/contributing">
                Contributing
              </Link>
              <Link className="hover:underline" href="/resources/changelog">
                Changelog
              </Link>
            </div>
            <div className="flex-none">Copyright © 2024 Tiptap</div>
          </div>
        </footer>
      </main>
    )
  },
)

LayoutContent.displayName = 'LayoutContent'

export const Layout = {
  Header: LayoutHeader,
  Wrapper: LayoutWrapper,
  Sidebar: LayoutSidebar,
  SecondarySidebar: LayoutSecondarySidebar,
  Content: LayoutContent,
}
