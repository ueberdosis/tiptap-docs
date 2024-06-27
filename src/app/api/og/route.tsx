import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'
import { TiptapLogoWithText } from '@/components/TiptapLogoWithText'
import { FULL_DOMAIN } from '@/utils/constants'

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get('title') ?? null
  const category = req.nextUrl.searchParams.get('category') ?? null

  const fontBoldURL = new URL(`${FULL_DOMAIN}/assets/fonts/Inter-Bold.otf`)
  const fontBold = await fetch(fontBoldURL)
  const fontBoldData = await fontBold.arrayBuffer()

  const fontSemiBoldURL = new URL(`${FULL_DOMAIN}/assets/fonts/Inter-SemiBold.otf`)
  const fontSemiBold = await fetch(fontSemiBoldURL)
  const fontSemiBoldData = await fontSemiBold.arrayBuffer()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          fontFamily: 'Inter',
          padding: 50,
        }}
      >
        <div tw="flex items-center">
          <TiptapLogoWithText style={{ width: 360 }} />
        </div>
        <div tw="flex flex-col mt-auto">
          {category ? (
            <div tw="text-[50px] leading-[100%] font-semibold mb-4 text-purple-500">{category}</div>
          ) : null}
          <div
            tw="text-[90px] leading-[106%] font-bold"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {title ?? 'Tiptap'}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          data: fontBoldData,
          name: 'Inter',
          style: 'normal',
          weight: 700,
        },
        {
          data: fontSemiBoldData,
          name: 'Inter',
          style: 'normal',
          weight: 600,
        },
      ],
    },
  )
}
