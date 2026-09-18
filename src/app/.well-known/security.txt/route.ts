import { NextResponse } from 'next/server'

export async function GET() {
  // Calculate expiration date: one year from now
  const expirationDate = new Date()
  expirationDate.setFullYear(expirationDate.getFullYear() + 1)
  
  // Format as ISO 8601 string
  const expires = expirationDate.toISOString()

  const securityTxt = `Contact: mailto:security@tiptap.dev
Expires: ${expires}
Preferred-Languages: en
Canonical: https://tiptap.dev/.well-known/security.txt
Policy: https://github.com/ueberdosis/tiptap/blob/main/SECURITY.md
`

  return new NextResponse(securityTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
