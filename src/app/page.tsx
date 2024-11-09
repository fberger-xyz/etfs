import PageWrapper from '@/components/common/PageWrapper'
import { IconIds } from '@/enums'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import FlowsTable from '@/components/farside/FlowsTable'
import IconWrapper from '@/components/common/IconWrapper'
import ChartsWrapper from '@/components/farside/ChartsWrapper'
import LinkWrapper from '@/components/common/LinkWrapper'
import LinkWithIcon from '@/components/common/LinkWithIcon'
import { APP_METADATA } from '@/config/app.config'
import { Flows } from '@prisma/client'
dayjs.extend(weekOfYear)

export default async function Page() {
    const root = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : APP_METADATA.SITE_URL
    const endpoint = `${root}/api/flows`
    // https://nextjs.org/docs/app/api-reference/functions/fetch
    const response = await fetch(endpoint, { next: { revalidate: 30 } })
    const { flows }: { flows: Flows[]; error: string } = await response.json()
    if (!flows) throw new Error('No flows data available')
    return (
        <PageWrapper className="gap-5">
            <FlowsTable data={flows} />
            <div className="flex w-full animate-pulse items-center justify-center gap-1 text-sm">
                <p>Charts</p>
                <IconWrapper icon={IconIds.SCROLL} className="w-5" />
            </div>
            <ChartsWrapper flows={flows} />
            <div className="mt-10 flex w-full flex-col items-center gap-5">
                <LinkWrapper href="https://farside.co.uk/btc/" target="_blank" className="flex items-baseline gap-1">
                    <p>
                        Just better than <span className="underline underline-offset-2">the original</span>
                    </p>
                    <IconWrapper icon={IconIds.IC_BASELINE_OPEN_IN_NEW} className="h-4 w-4" />
                </LinkWrapper>
                <div className="flex flex-wrap gap-2 px-5">
                    <p>Reach out on telegram</p>
                    <LinkWithIcon href={`https://t.me/${APP_METADATA.SOCIALS.TELEGRAM}`}>@{APP_METADATA.SOCIALS.TELEGRAM}</LinkWithIcon>
                </div>
            </div>
        </PageWrapper>
    )
}
