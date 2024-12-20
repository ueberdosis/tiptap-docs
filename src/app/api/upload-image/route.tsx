import { NextResponse } from 'next/server'

/**
 * This function is called as the `imageUploadCallback` for the `Import` extension.
 * This in no way is a good implementation as it will store the image within the document, bloating the document size.
 * If implementing this in a real-world scenario, you should upload the image to a cloud storage service and return the URL to the image.
 * It also is not even checking the proper mime type of the file, which is a security risk.
 */
export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const base64String = Buffer.from(arrayBuffer).toString('base64')
  const mimeType = file.type
  const base64Url = `data:${mimeType};base64,${base64String}`

  return NextResponse.json({ url: base64Url }, { status: 200 })
}
