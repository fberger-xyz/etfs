import PageWrapper from '@/components/common/PageWrapper'
import { IconIds } from '@/enums'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import FlowsTable from '@/components/farside/FlowsTable'
import IconWrapper from '@/components/common/IconWrapper'
import { PrismaClient } from '@prisma/client'
import { unstable_cache } from 'next/cache'
import ChartsWrapper from '@/components/farside/chartsWrapper'
dayjs.extend(weekOfYear)

const getFlows = unstable_cache(
    async () => {
        const prisma = new PrismaClient()
        return await prisma.flows.findMany()
    },
    ['flows'],
    { revalidate: 3600 / (60 / 4), tags: ['flows'] }, // every 4 minutes
)

export default async function Page() {
    const flows = await getFlows().catch(() => [])
    return (
        <PageWrapper>
            <FlowsTable data={flows} />
            <div className="mb-5 flex w-full animate-pulse items-center justify-center gap-1 text-sm">
                <p className="">Charts</p>
                <IconWrapper icon={IconIds.SCROLL} className="w-5" />
            </div>
            <ChartsWrapper flows={flows} />
            <div className="mb-10" />
        </PageWrapper>
    )
}
