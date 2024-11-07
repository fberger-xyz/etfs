import PageWrapper from '@/components/common/PageWrapper'
import { IconIds } from '@/enums'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import FlowsTable from '@/components/farside/FlowsTable'
import IconWrapper from '@/components/common/IconWrapper'
import { PrismaClient } from '@prisma/client'
// import { unstable_cache } from 'next/cache'
import ChartsWrapper from '@/components/farside/ChartsWrapper'
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
    return await prisma.flows.findMany({
        orderBy: {
            close_of_bussiness_hour: 'asc',
        },
    })
}

export default async function Page() {
    const flows = await getFlows().catch(() => [])
    return (
        <PageWrapper>
            <FlowsTable data={flows} />
            <div className="my-5 flex w-full animate-pulse items-center justify-center gap-1 text-sm">
                <p>Charts</p>
                <IconWrapper icon={IconIds.SCROLL} className="w-5" />
            </div>
            <ChartsWrapper flows={flows} />
        </PageWrapper>
    )
}
