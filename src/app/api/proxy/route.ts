import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    try {
        const response = await fetch(url, { method: 'GET', headers: { Accept: 'text/html' } })
        if (!response.ok) return NextResponse.json({ error: 'Error fetching content' }, { status: response.status })
        const htmlContent = await response.text()
        return new NextResponse(htmlContent, { headers: { 'Content-Type': 'text/html' } })
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching content' }, { status: 500 })
    }
}
