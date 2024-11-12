import { ETFs } from '@/enums'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import FarsideAreaChart from '@/components/charts/FarsideAreaChart'
import FarsidePercentChart from '@/components/charts/FarsidePercentChart'
import { Suspense } from 'react'
import CustomFallback from '@/components/common/CustomFallback'
import { ETFsTickers, FarsideFlows } from '@/interfaces'
dayjs.extend(weekOfYear)

export default function ChartsWrapper(props: { etf: ETFs; flows: FarsideFlows[]; tickers: ETFsTickers[] }) {
    // cumulated flows
    const cumulatedFarsideData = [...props.flows].sort(
        (curr, next) => new Date(curr.close_of_bussiness_hour).getTime() - new Date(next.close_of_bussiness_hour).getTime(),
    )

    for (let cfdIndex = 0; cfdIndex < cumulatedFarsideData.length; cfdIndex++) {
        for (let tickerIndex = 0; tickerIndex < props.tickers.length; tickerIndex++) {
            const ticker = props.tickers[tickerIndex] as keyof FarsideFlows
            const flow = Number(cumulatedFarsideData[cfdIndex][ticker])
            // @ts-expect-error: to fix later
            cumulatedFarsideData[cfdIndex][ticker] = isNaN(flow) ? 0 : flow
            if (cfdIndex === 0) continue
            // @ts-expect-error: to fix later
            cumulatedFarsideData[cfdIndex][ticker] += Number(cumulatedFarsideData[cfdIndex - 1][ticker])
        }
    }

    // html
    return (
        <Suspense fallback={<CustomFallback loadingText="charts loading..." />}>
            <FarsideAreaChart etf={props.etf} areaData={cumulatedFarsideData} tickers={props.tickers} />
            <FarsidePercentChart etf={props.etf} percentData={cumulatedFarsideData} tickers={props.tickers} />
        </Suspense>
    )
}
