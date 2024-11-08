import PageWrapper from '@/components/common/PageWrapper'
import { IconIds } from '@/enums'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import FlowsTable from '@/components/farside/FlowsTable'
import IconWrapper from '@/components/common/IconWrapper'
import { PrismaClient } from '@prisma/client'
// import { unstable_cache } from 'next/cache'
import ChartsWrapper from '@/components/farside/ChartsWrapper'
import LinkWrapper from '@/components/common/LinkWrapper'
import LinkWithIcon from '@/components/common/LinkWithIcon'
import { APP_METADATA } from '@/config/app.config'
dayjs.extend(weekOfYear)

// const getFlows = unstable_cache(
//     async () => {
//         const prisma = new PrismaClient()
//         return await prisma.flows.findMany({
//             orderBy: {
//                 close_of_bussiness_hour: 'asc',
//             },
//         })
//     },
//     ['flows'],
//     // The revalidate value needs to be statically analyzable. For example revalidate = 600 is valid, but revalidate = 60 * 10 is not
//     // https://nextjs.org/docs/canary/app/api-reference/file-conventions/route-segment-config#revalidate
//     { revalidate: 120, tags: ['flows'] }, // every 2 minutes
// )

const getFlows = async () => {
    const prisma = new PrismaClient()
    try {
        return await prisma.flows.findMany({
            orderBy: {
                close_of_bussiness_hour: 'asc',
            },
        })
    } finally {
        await prisma.$disconnect()
    }
}

export const metadata = {
    revalidate: 0, // Disable ISR
    cache: 'no-store', // Disable caching completely
}

export default async function Page() {
    const flows = await getFlows().catch(() => [])
    console.log(`flows.length=${flows.length}`)
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
