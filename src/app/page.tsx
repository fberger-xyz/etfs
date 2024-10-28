import PageWrapper from '@/components/common/PageWrapper'
import { EtfTickers } from '@/enums'
import { farsideData } from '@/interfaces'
import dayjs from 'dayjs'
import { promises as fs } from 'fs'
import numeral from 'numeral'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import FarsideAreaChart from '@/components/charts/FarsideAreaChart'
dayjs.extend(weekOfYear)
import { cloneDeep } from 'lodash'
import FarsidePercentChart from '@/components/charts/FarsidePercentChart'
import FlowsTable from '@/components/farside/FlowsTable'

export default async function Page() {
    // load json
    const path = process.cwd() + '/src/data/farside-btc.json'
    const file = await fs.readFile(path, 'utf8')
    const rawData = JSON.parse(file) as farsideData[]

    // parse json
    const tickers: (EtfTickers | string)[] = []
    const farsideData = rawData
        .filter((day) => dayjs(day.Date).isValid())
        .map((day) => {
            let totalCheck = 0
            const dup = { ...day }
            const entries = Object.entries(dup)
            for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
                const key = entries[entryIndex][0] as keyof typeof dup
                const value = entries[entryIndex][1]
                if (key === 'Date' || dayjs(key).isValid()) continue
                if (key === 'Total') continue
                if (!tickers.includes(key)) tickers.push(key)
                else if (value === '-') dup[key] = 0
                else {
                    const sign = String(value).includes('(') || String(value).includes(')') ? -1 : 1
                    const parsedValue = numeral(String(value).replaceAll('(', '').replaceAll(')', '')).multiply(sign).value()
                    if (parsedValue === null || isNaN(parsedValue)) continue
                    dup[key] = parsedValue
                    totalCheck += parsedValue
                }
            }
            dup.TotalCheck = totalCheck
            return dup
        })

    // apply rank for days
    const daysSortedByTotal = [...farsideData].sort((curr, next) => next.TotalCheck - curr.TotalCheck)
    for (let sortedDayIndex = 0; sortedDayIndex < daysSortedByTotal.length; sortedDayIndex++) {
        const dayIndex = farsideData.findIndex((day) => day.Date === daysSortedByTotal[sortedDayIndex].Date)
        if (dayIndex >= 0) farsideData[dayIndex].rank = sortedDayIndex + 1
    }

    // cumulated flows
    const cumulatedFarsideData = cloneDeep(farsideData)
    for (let cfdIndex = 0; cfdIndex < cumulatedFarsideData.length; cfdIndex++) {
        for (let tickerIndex = 0; tickerIndex < tickers.length; tickerIndex++) {
            const ticker = tickers[tickerIndex] as keyof farsideData
            const flow = Number(cumulatedFarsideData[cfdIndex][ticker])
            cumulatedFarsideData[cfdIndex][ticker] = isNaN(flow) ? 0 : flow
            if (cfdIndex === 0) continue
            cumulatedFarsideData[cfdIndex][ticker] += Number(cumulatedFarsideData[cfdIndex - 1][ticker])
        }
    }

    // html
    return (
        <PageWrapper>
            <FlowsTable farsideData={farsideData} tickers={tickers} />
            <FarsidePercentChart className="mt-20 h-[520px]" farsideData={cumulatedFarsideData} tickers={tickers} />
            <FarsideAreaChart className="my-20 h-[520px]" farsideData={cumulatedFarsideData} tickers={tickers} />
        </PageWrapper>
    )
}
