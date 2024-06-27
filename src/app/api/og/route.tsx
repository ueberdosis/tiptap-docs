import fs from 'fs'
import path from 'path'
import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'
import { TiptapLogoWithText } from '@/components/TiptapLogoWithText'

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get('title') ?? null
  const category = req.nextUrl.searchParams.get('category') ?? null

  const fontBoldRawData = fs.readFileSync(
    path.join(process.cwd(), './src/assets/fonts/Inter-Bold.otf'),
  )
  // convert to ArrayBuffer
  const fontBoldData = new Uint8Array(fontBoldRawData).buffer

  const fontSemiBoldRawData = fs.readFileSync(
    path.join(process.cwd(), './src/assets/fonts/Inter-SemiBold.otf'),
  )
  // convert to ArrayBuffer
  const fontSemiBoldData = new Uint8Array(fontSemiBoldRawData).buffer

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
