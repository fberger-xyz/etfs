import PageWrapper from '@/components/common/PageWrapper'
import { IconIds } from '@/enums'
import { FarsideRawData } from '@/interfaces'
import dayjs from 'dayjs'
import { promises as fs } from 'fs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import FarsideAreaChart from '@/components/charts/FarsideAreaChart'
import { cloneDeep } from 'lodash'
import FarsidePercentChart from '@/components/charts/FarsidePercentChart'
import FlowsTable from '@/components/farside/FlowsTable'
import IconWrapper from '@/components/common/IconWrapper'
import { enrichFarsideJson } from '@/utils'
dayjs.extend(weekOfYear)

export default async function Page() {
    // load json
    const path = process.cwd() + '/src/data/farside-btc.json'
    const file = await fs.readFile(path, 'utf8')
    const rawData = JSON.parse(file) as FarsideRawData[]

    // parse json
    const { tickers, parsedData } = enrichFarsideJson(rawData)

    // apply rank for days
    const daysSortedByTotal = [...parsedData].sort((curr, next) => next.Total - curr.Total)
    for (let sortedDayIndex = 0; sortedDayIndex < daysSortedByTotal.length; sortedDayIndex++) {
        const dayIndex = parsedData.findIndex((day) => day.Date === daysSortedByTotal[sortedDayIndex].Date)
        if (dayIndex >= 0) parsedData[dayIndex].rank = sortedDayIndex + 1
    }

    // cumulated flows
    const cumulatedFarsideData = cloneDeep(parsedData)
    for (let cfdIndex = 0; cfdIndex < cumulatedFarsideData.length; cfdIndex++) {
        for (let tickerIndex = 0; tickerIndex < tickers.length; tickerIndex++) {
            const ticker = tickers[tickerIndex] as keyof FarsideRawData
            const flow = Number(cumulatedFarsideData[cfdIndex][ticker])
            cumulatedFarsideData[cfdIndex][ticker] = isNaN(flow) ? 0 : flow
            if (cfdIndex === 0) continue
            cumulatedFarsideData[cfdIndex][ticker] += Number(cumulatedFarsideData[cfdIndex - 1][ticker])
        }
    }

    // html
    return (
        <PageWrapper>
            <FlowsTable data={parsedData} tickers={tickers} />
            <div className="mb-5 flex w-full animate-pulse items-center justify-center gap-1 text-sm">
                <p className="">Charts</p>
                <IconWrapper icon={IconIds.SCROLL} className="w-5" />
            </div>
            <FarsideAreaChart areaData={cumulatedFarsideData} tickers={tickers} />
            <FarsidePercentChart percentData={cumulatedFarsideData} tickers={tickers} />
            <div className="mb-10" />
        </PageWrapper>
    )
}
