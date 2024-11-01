import { EtfTickers } from '@/enums'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import FarsideAreaChart from '@/components/charts/FarsideAreaChart'
import FarsidePercentChart from '@/components/charts/FarsidePercentChart'
import { Suspense } from 'react'
import CustomFallback from '@/components/common/CustomFallback'
import { Flows } from '@prisma/client'
dayjs.extend(weekOfYear)

export default function ChartsWrapper(props: { flows: Flows[] }) {
    // cumulated flows
    const tickers = Object.keys(EtfTickers) as EtfTickers[]
    const cumulatedFarsideData = [...props.flows].sort(
        (curr, next) => new Date(curr.close_of_bussiness_hour).getTime() - new Date(next.close_of_bussiness_hour).getTime(),
    )

    for (let cfdIndex = 0; cfdIndex < cumulatedFarsideData.length; cfdIndex++) {
        for (let tickerIndex = 0; tickerIndex < tickers.length; tickerIndex++) {
            const ticker = tickers[tickerIndex]
            const flow = Number(cumulatedFarsideData[cfdIndex][ticker])
            cumulatedFarsideData[cfdIndex][ticker] = isNaN(flow) ? 0 : flow
            if (cfdIndex === 0) continue
            cumulatedFarsideData[cfdIndex][ticker] += Number(cumulatedFarsideData[cfdIndex - 1][ticker])
        }
    }

    // html
    return (
        <Suspense fallback={<CustomFallback loadingText="charts loading..." />}>
            <FarsideAreaChart areaData={cumulatedFarsideData} tickers={tickers} />
            <FarsidePercentChart percentData={cumulatedFarsideData} tickers={tickers} />
        </Suspense>
    )
}
