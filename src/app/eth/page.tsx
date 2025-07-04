import PageWrapper from '@/components/common/PageWrapper'
import { ETFs, EthETFsTickers, IconIds } from '@/enums'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import FlowsTable from '@/components/farside/FlowsTable'
import IconWrapper from '@/components/common/IconWrapper'
import ChartsWrapper from '@/components/farside/ChartsWrapper'
import LinkWrapper from '@/components/common/LinkWrapper'
import LinkWithIcon from '@/components/common/LinkWithIcon'
import { APP_METADATA } from '@/config/app.config'
import prisma from '@/server/prisma'
import { ETFsTickers, FarsideFlows } from '@/interfaces'
import { farsidePage } from '@/utils'
import { Metadata } from 'next'
dayjs.extend(weekOfYear)

export const metadata: Metadata = {
    title: `Ξ ETFs | ${APP_METADATA.SITE_AUTHOR}`,
}

// https://nextjs.org/docs/app/api-reference/functions/fetch
// https://medium.com/@kassiomatheus23/data-not-updating-on-refresh-creating-cache-and-fetching-next-js-14-and-prisma-60d98aecca96
export const revalidate = 0
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

async function getFlows() {
    try {
        // Optimize query with pagination and proper ordering
        const flows = await prisma.ethFlows.findMany({
            orderBy: { close_of_bussiness_hour: 'asc' },
            // Add pagination if needed for large datasets
            // take: 1000,
            // skip: 0,
            select: {
                xata_id: true,
                day: true,
                total: true,
                rank: true,
                close_of_bussiness_hour: true,
                ETHA: true,
                FETH: true,
                ETHW: true,
                CETH: true,
                ETHV: true,
                EZBC: true,
                QETH: true,
                EZET: true,
                ETHE: true,
                ETH: true,
                raw: true,
            },
        })
        return flows as FarsideFlows[]
    } catch (error) {
        console.error('Error fetching ETH flows:', error)
        return [] as FarsideFlows[]
    }
}

export default async function Page() {
    const tickers = Object.keys(EthETFsTickers) as ETFsTickers[]
    const flows = await getFlows()

    if (!flows.length) {
        return (
            <PageWrapper className="gap-5">
                <div className="flex w-full items-center justify-center">
                    <p className="text-lg text-inactive">No data available</p>
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper className="gap-5">
            <FlowsTable etf={ETFs.ETH} data={flows} tickers={tickers} />
            <div className="flex w-full animate-pulse items-center justify-center gap-1 text-sm text-primary">
                <p>Charts</p>
                <IconWrapper icon={IconIds.SCROLL} className="w-5" />
            </div>
            <ChartsWrapper etf={ETFs.ETH} flows={flows} tickers={tickers} />
            <div className="mt-14 flex w-full flex-col items-center gap-8">
                <LinkWrapper href={farsidePage(ETFs.ETH)} target="_blank" className="group flex items-baseline gap-1">
                    <p>
                        Better than <span className="underline underline-offset-2">the original</span>
                    </p>
                    <IconWrapper icon={IconIds.IC_BASELINE_OPEN_IN_NEW} className="hidden h-4 w-4 group-hover:flex" />
                </LinkWrapper>
                <div className="flex flex-wrap justify-center gap-4 px-5 text-sm text-inactive">
                    <p>Reach out on telegram</p>
                    <LinkWithIcon href={`https://t.me/${APP_METADATA.SOCIALS.TELEGRAM}`}>@{APP_METADATA.SOCIALS.TELEGRAM}</LinkWithIcon>
                </div>
            </div>
        </PageWrapper>
    )
}
