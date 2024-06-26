import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { Layout } from '@/components/layouts/Layout'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Not found | Tiptap Documentation',
}

export default async function NotFoundPage() {
  return (
    <>
      <Layout.Header />
      <Layout.Wrapper>
        <Layout.Content className="mx-auto">
          <div className="h-[50vh] flex flex-col justify-center max-w-[46rem]">
            <div className="text-purple-500 leading-[110%] text-sm font-semibold mb-3">404</div>
            <h1 className="text-3xl lg:text-5xl leading-none font-bold">Phew, you found it.</h1>
            <p className="mt-8 text-sm lg:text-[1.125rem] leading-[1.6]">
              You came here, looking for something, and all you get is our 404 page. The page you
              are looking for is no longer here. Maybe it was never here in the first place. In any
              case, we are sorry you were sent on this wild 🪿 goose chase.
            </p>
            <div className="flex items-center mt-8">
              <Button asChild>
                <Link href="/">
                  Back to overview
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Layout.Content>
      </Layout.Wrapper>
    </>
  )
}
