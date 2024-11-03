import { extractErrorMessage } from '@/utils'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'text/html; charset=utf-8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            },
        })
        if (!response.ok) return NextResponse.json({ error: 'Error fetching content' }, { status: response.status })
        const htmlContent = await response.text()
        return new NextResponse(htmlContent, {
            headers: {
                'Content-Type': 'text/html',
            },
        })
    } catch (error) {
        console.error('Fetch Error:', error)
        return NextResponse.json({ error: 'Error fetching content', details: extractErrorMessage(error) }, { status: 500 })
    }
}
