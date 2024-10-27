import PageWrapper from '@/components/common/PageWrapper'
import { EtfTickers, IconIds } from '@/enums'
import { FarsideDayData } from '@/interfaces'
import dayjs from 'dayjs'
import { promises as fs } from 'fs'
import numeral from 'numeral'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { monthName, getConfig, TableRow } from '@/components/farside/table'
import IconWrapper from '@/components/common/IconWrapper'
import LinkWrapper from '@/components/common/LinkWrapper'
import { cn } from '@/utils'
dayjs.extend(weekOfYear)

export default async function Page() {
    // load json
    const path = process.cwd() + '/src/data/farside-btc.json'
    const file = await fs.readFile(path, 'utf8')
    const rawData = JSON.parse(file) as FarsideDayData[]

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

    // group by month / week
    const farsideDataGroupedBy: {
        rank: number
        index: number
        totalPeriod: number
        months: {
            year: number
            index: number
            totalPeriod: number
            rank: number
            weeks: { index: number; totalPeriod: number; days: FarsideDayData[] }[]
        }[]
    }[] = []
    for (let dayIndex = 0; dayIndex < farsideData.length; dayIndex++) {
        // year
        const dayYear = dayjs(farsideData[dayIndex].Date).year()
        let yearIndex = farsideDataGroupedBy.findIndex((year) => year.index === dayYear)
        if (yearIndex < 0) {
            farsideDataGroupedBy.unshift({ rank: 0, index: dayjs(farsideData[dayIndex].Date).year(), months: [], totalPeriod: 0 })
            yearIndex = farsideDataGroupedBy.findIndex((year) => year.index === dayYear)
        }

        // month
        const dayMonth = dayjs(farsideData[dayIndex].Date).month()
        let monthIndex = farsideDataGroupedBy[yearIndex].months.findIndex((month) => month.index === dayMonth)
        if (monthIndex < 0) {
            farsideDataGroupedBy[yearIndex].months.unshift({ year: dayYear, index: dayMonth, weeks: [], rank: 0, totalPeriod: 0 })
            monthIndex = farsideDataGroupedBy[yearIndex].months.findIndex((month) => month.index === dayMonth)
        }

        // week
        const dayWeek = dayjs(farsideData[dayIndex].Date).week()
        let weekIndex = farsideDataGroupedBy[yearIndex].months[monthIndex].weeks.findIndex((week) => week.index === dayWeek)
        if (weekIndex < 0) {
            farsideDataGroupedBy[yearIndex].months[monthIndex].weeks.unshift({ index: dayWeek, days: [], totalPeriod: 0 })
            weekIndex = farsideDataGroupedBy[yearIndex].months[monthIndex].weeks.findIndex((week) => week.index === dayWeek)
        }

        // store
        farsideDataGroupedBy[yearIndex].months[monthIndex].weeks[weekIndex].days.unshift(farsideData[dayIndex])
        farsideDataGroupedBy[yearIndex].months[monthIndex].weeks[weekIndex].totalPeriod += farsideData[dayIndex].TotalCheck
        farsideDataGroupedBy[yearIndex].months[monthIndex].totalPeriod += farsideData[dayIndex].TotalCheck
        farsideDataGroupedBy[yearIndex].totalPeriod += farsideData[dayIndex].TotalCheck
    }

    // todo sum weeks

    // apply ranks for month
    const monthsSortedByTotal = farsideDataGroupedBy
        .map((year) => year.months)
        .flat()
        .sort((curr, next) => next.totalPeriod - curr.totalPeriod)
    for (let sortedMonthIndex = 0; sortedMonthIndex < monthsSortedByTotal.length; sortedMonthIndex++) {
        const yearIndex = farsideDataGroupedBy.findIndex((year) => year.index === monthsSortedByTotal[sortedMonthIndex].year)
        const monthIndex = farsideDataGroupedBy[yearIndex].months.findIndex((month) => month.index === monthsSortedByTotal[sortedMonthIndex].index)
        if (yearIndex >= 0 && monthIndex >= 0) farsideDataGroupedBy[yearIndex].months[monthIndex].rank = sortedMonthIndex + 1
    }

    // html
    return (
        <PageWrapper>
            {/* table */}
            <div className="flex w-full flex-col text-xs">
                {/* context */}
                <div className="flex w-full justify-center text-base text-discreet">
                    <p>Bitcoin ETF Flows $m USD</p>
                </div>

                {/* headers */}
                <TableRow
                    className="bg-light-hover"
                    date={<p>Date</p>}
                    tickers={tickers
                        .sort((curr, next) => getConfig(curr).index - getConfig(next).index)
                        .map((ticker) => (
                            <div
                                key={ticker}
                                className="flex h-8 w-12 -rotate-45 items-center justify-center overflow-hidden text-light-hover sm:rotate-0 md:w-16"
                            >
                                <p className="text-nowrap bg-light-hover p-0.5" style={{ color: getConfig(ticker).colors.dark }}>
                                    {ticker}
                                </p>
                            </div>
                        ))}
                    total={
                        <>
                            <p className="hidden text-nowrap md:flex">∑ Flows</p>
                            <p className="mx-auto md:hidden">∑</p>
                        </>
                    }
                    rank={
                        <>
                            <p className="hidden text-nowrap md:flex">Rank</p>
                            <IconWrapper icon={IconIds.RANK} className="h-5 w-5 md:hidden" />
                        </>
                    }
                />

                {/* rows */}
                <div className="flex h-[420px] w-full flex-col overflow-y-scroll border border-light-hover md:h-[calc(100vh-260px)]">
                    {/* for each year */}
                    {farsideDataGroupedBy.map((year, yearIndex) => (
                        <div key={`${yearIndex}-${year.index}`} className="flex flex-col py-1">
                            <TableRow
                                date={<p className="text-primary">{year.index}</p>}
                                tickers={tickers.map(() => (
                                    <div className="flex w-12 items-center justify-center overflow-hidden text-light-hover md:w-16" />
                                ))}
                                total={<p className="text-nowrap">{numeral(year.totalPeriod).format('0,0')}</p>}
                                rank={null}
                            />

                            {/* for each month */}
                            {year.months.map((month, monthIndex) => (
                                <div key={`${yearIndex}-${year.index}-${monthIndex}-${month.index}`} className="flex flex-col py-1">
                                    <TableRow
                                        className="border-t border-light-hover pt-1"
                                        date={
                                            <p className="w-fit text-primary">
                                                {monthName(month.index).slice(0, 3)} {String(year.index).slice(2)}
                                            </p>
                                        }
                                        tickers={tickers.map(() => (
                                            <div className="flex w-12 items-center justify-center overflow-hidden text-light-hover md:w-16" />
                                        ))}
                                        total={<p className="text-nowrap">{numeral(month.totalPeriod).format('0,0')}</p>}
                                        rank={<p className="text-nowrap">{month.rank}</p>}
                                    />

                                    {/* for each week */}
                                    {month.weeks.map((week, weekIndex) => (
                                        <div
                                            key={`${yearIndex}-${year.index}-${monthIndex}-${month.index}-${weekIndex}-${week.index}`}
                                            className="flex flex-col gap-0 py-0.5 sm:gap-0.5"
                                        >
                                            {week.days.length && dayjs(week.days[0].Date).format('ddd') === 'Fri' && (
                                                <TableRow
                                                    className="border-b border-dashed border-light-hover"
                                                    date={<p className="w-fit italic text-light-hover">Week {week.index}</p>}
                                                    tickers={tickers.map(() => (
                                                        <div className="flex w-12 items-center justify-center overflow-hidden italic text-light-hover md:w-16" />
                                                    ))}
                                                    total={
                                                        <p className="text-nowrap italic text-light-hover">
                                                            {numeral(week.totalPeriod).format('0,0')}
                                                        </p>
                                                    }
                                                    rank={null}
                                                />
                                            )}

                                            {/* for each day */}
                                            {week.days.map((day, dayIndex) => (
                                                <TableRow
                                                    // className="border-b border-dashed border-light-hover"
                                                    key={`${yearIndex}-${year.index}-${monthIndex}-${month.index}-${weekIndex}-${week.index}-${dayIndex}-${day.Date}`}
                                                    date={
                                                        <>
                                                            <p className="hidden text-nowrap md:flex">{dayjs(day.Date).format('ddd DD MMM YY')}</p>
                                                            <p className="text-nowrap md:hidden">{dayjs(day.Date).format('ddd DD')}</p>
                                                        </>
                                                    }
                                                    tickers={tickers
                                                        .sort((curr, next) => getConfig(curr).index - getConfig(next).index)
                                                        .map((ticker) => (
                                                            <div
                                                                key={`${yearIndex}-${year.index}-${monthIndex}-${month.index}-${weekIndex}-${week.index}-${dayIndex}-${day.Date}-${ticker}`}
                                                                className="flex w-12 items-center justify-center overflow-hidden text-light-hover md:w-16"
                                                            >
                                                                <p
                                                                    className="text-nowrap"
                                                                    style={{
                                                                        color:
                                                                            !isNaN(Number(day[ticker as keyof typeof day])) &&
                                                                            Number(day[ticker as keyof typeof day]) !== 0
                                                                                ? getConfig(ticker).colors.dark
                                                                                : '', // https://tailwindcss.com/docs/customizing-colors
                                                                        // !isNaN(Number(day[ticker as keyof typeof day])) &&
                                                                        // Number(day[ticker as keyof typeof day]) > 0
                                                                        //     ? getConfig(ticker).colors.dark
                                                                        //     : !isNaN(Number(day[ticker as keyof typeof day])) &&
                                                                        //         Number(day[ticker as keyof typeof day]) < 0
                                                                        //       ? '#ef4444'
                                                                        //       : '', // https://tailwindcss.com/docs/customizing-colors
                                                                    }}
                                                                >
                                                                    {day[ticker as keyof typeof day]
                                                                        ? numeral(day[ticker as keyof typeof day]).format('0,0')
                                                                        : '-'}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    total={
                                                        <p
                                                            className={cn('text-nowrap', {
                                                                'text-green-500': day.TotalCheck > 0,
                                                                'text-red-500': day.TotalCheck < 0,
                                                            })}
                                                        >
                                                            {numeral(day.TotalCheck).format('0,0')}
                                                        </p>
                                                    }
                                                    rank={<p className="text-nowrap">{day.rank}</p>}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="flex w-full items-center justify-center">
                    {/* <div className="flex flex-col"> */}
                    <LinkWrapper href="https://farside.co.uk/btc/" className="flex gap-1 text-light-hover hover:text-primary" target="_blank">
                        <p className="truncate text-xs">Data: farside.co.uk</p>
                    </LinkWrapper>
                    {/* <div className="flex w-[250px] text-xs text-light-hover">
                        <IconWrapper icon={IconIds.RANK} className="h-4 w-4" />
                        <p>Days are ranked by flow</p>
                    </div> */}
                    {/* </div> */}
                    <div className="mt-1 flex w-full items-center justify-center">
                        <p className="text-light-hover">Scroll</p>
                        <IconWrapper icon={IconIds.SCROLL} className="w-5 animate-pulse" />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-1 text-light-hover hover:text-primary">
                            <p className="truncate text-xs">CSV</p>
                            <IconWrapper icon={IconIds.CARBON_DOWNLOAD} className="w-4 animate-pulse text-primary" />
                        </button>
                        <button className="flex items-center gap-1 text-light-hover hover:text-primary">
                            <p className="truncate text-xs">Copy</p>
                            <IconWrapper icon={IconIds.CARBON_COPY} className="w-4 animate-pulse text-primary" />
                        </button>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}
