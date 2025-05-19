import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  try {
    const { slug, helpful, yesText, noOption, noText } = body
    const { addFeedbackToNotion } = await import('./notion')
    await addFeedbackToNotion({ slug, helpful, yesText, noOption, noText })
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Notion feedback error:', error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}
