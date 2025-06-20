import { ETFs } from '@/enums'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import FarsideAreaChart from '@/components/charts/FarsideAreaChart'
import FarsidePercentChart from '@/components/charts/FarsidePercentChart'
import { Suspense, memo, useMemo } from 'react'
import CustomFallback from '@/components/common/CustomFallback'
import { ETFsTickers, FarsideFlows } from '@/interfaces'
dayjs.extend(weekOfYear)

const ChartsWrapper = memo((props: { etf: ETFs; flows: FarsideFlows[]; tickers: ETFsTickers[] }) => {
    // Memoize cumulated flows calculation
    const cumulatedFarsideData = useMemo(() => {
        const sortedData = [...props.flows].sort(
            (curr, next) => new Date(curr.close_of_bussiness_hour).getTime() - new Date(next.close_of_bussiness_hour).getTime(),
        )

        // Calculate cumulative flows
        for (let cfdIndex = 0; cfdIndex < sortedData.length; cfdIndex++) {
            for (let tickerIndex = 0; tickerIndex < props.tickers.length; tickerIndex++) {
                const ticker = props.tickers[tickerIndex] as keyof FarsideFlows
                const flow = Number(sortedData[cfdIndex][ticker])
                // Fix type safety by creating a new object
                const updatedFlow = isNaN(flow) ? 0 : flow
                if (cfdIndex === 0) {
                    sortedData[cfdIndex] = { ...sortedData[cfdIndex], [ticker]: updatedFlow }
                } else {
                    const prevFlow = Number(sortedData[cfdIndex - 1][ticker]) || 0
                    sortedData[cfdIndex] = { ...sortedData[cfdIndex], [ticker]: updatedFlow + prevFlow }
                }
            }
        }

        return sortedData
    }, [props.flows, props.tickers])

    // html
    return (
        <Suspense fallback={<CustomFallback loadingText="charts loading..." />}>
            <FarsideAreaChart etf={props.etf} areaData={cumulatedFarsideData} tickers={props.tickers} />
            <FarsidePercentChart etf={props.etf} percentData={cumulatedFarsideData} tickers={props.tickers} />
        </Suspense>
    )
})

ChartsWrapper.displayName = 'ChartsWrapper'

export default ChartsWrapper
