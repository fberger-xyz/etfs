import prisma from '@/server/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const flows = await prisma.flows.findMany({ orderBy: { close_of_bussiness_hour: 'asc' } })
        return NextResponse.json({ flows, error: '' }, { status: 200 })
    } catch (error) {
        console.error('Error fetching flows:', error)
        return NextResponse.json({ flows: [], error: 'Failed to fetch flows' }, { status: 500 })
    }
}
