'use client'

import { ReactNode, useState } from 'react'
import { ETFs, IconIds } from '@/enums'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import IconWrapper from '@/components/common/IconWrapper'
import LinkWrapper from '@/components/common/LinkWrapper'
import { cleanFlow, cn, farsidePage, formatFlows, getConfig, monthName } from '@/utils'
import TextWithTickerColor from '@/components/farside/ColorWrapper'
import { Flows } from '@prisma/client'
import Link from 'next/link'
import CopyOrDownloadDataModal from './CopyOrDownloadDataModal'
import { ETFsTickers, FarsideFlows } from '@/interfaces'
dayjs.extend(weekOfYear)

function TableRow(props: { activateHover?: boolean; date: ReactNode; tickers: ReactNode[]; total: ReactNode; rank: ReactNode; className?: string }) {
    return (
        <div className={cn('flex items-center sm:gap-1 px-1 md:px-2', { 'hover:bg-very-light-hover': props.activateHover }, props.className)}>
            <div className="flex w-[95px] justify-start overflow-hidden md:w-32">{props.date}</div>
            {...props.tickers}
            <div className="flex w-20 justify-end overflow-hidden md:w-24">{props.total}</div>
            <div className="flex w-12 justify-end overflow-hidden pr-0.5 md:w-24">{props.rank}</div>
        </div>
    )
}

export default function FlowsTable({ etf, data, tickers }: { etf: ETFs; data: FarsideFlows[]; tickers: ETFsTickers[] }) {
    const [totalsToShow, setTotalsToShow] = useState({
        perMonth: false,
        perYear: false,
        inception: true,
    })

    // apply rank for days
    const daysSortedByTotal = [...data].sort((curr, next) => cleanFlow(next.total) - cleanFlow(curr.total))
    for (let sortedDayIndex = 0; sortedDayIndex < daysSortedByTotal.length; sortedDayIndex++) {
        const dayIndex = data.findIndex((day) => day.xata_id === daysSortedByTotal[sortedDayIndex].xata_id)
        if (dayIndex >= 0) data[dayIndex].rank = sortedDayIndex + 1
    }

    // group by month / week
    const farsideDataGroupedBy: {
        rank: number
        index: number
        totalPeriod: number
        totalPerEtfs: Record<ETFsTickers, number>
        months: {
            year: number
            index: number
            totalPeriod: number
            rank: number
            weeks: { index: number; totalPeriod: number; days: Flows[] }[]
        }[]
    }[] = []
    for (let dayIndex = 0; dayIndex < data.length; dayIndex++) {
        // year
        const dayAsDayjs = dayjs(data[dayIndex].day)
        const dayYear = dayAsDayjs.year()
        let yearIndex = farsideDataGroupedBy.findIndex((year) => year.index === dayYear)
        if (yearIndex < 0) {
            farsideDataGroupedBy.unshift({ rank: 0, index: dayAsDayjs.year(), months: [], totalPeriod: 0, totalPerEtfs: {} })
            yearIndex = farsideDataGroupedBy.findIndex((year) => year.index === dayYear)
        }

        // month
        const dayMonth = dayAsDayjs.month()
        let monthIndex = farsideDataGroupedBy[yearIndex].months.findIndex((month) => month.index === dayMonth)
        if (monthIndex < 0) {
            farsideDataGroupedBy[yearIndex].months.unshift({ year: dayYear, index: dayMonth, weeks: [], rank: 0, totalPeriod: 0 })
            monthIndex = farsideDataGroupedBy[yearIndex].months.findIndex((month) => month.index === dayMonth)
        }

        // week
        const dayWeek = dayAsDayjs.week()
        let weekIndex = farsideDataGroupedBy[yearIndex].months[monthIndex].weeks.findIndex((week) => week.index === dayWeek)
        if (weekIndex < 0) {
            farsideDataGroupedBy[yearIndex].months[monthIndex].weeks.unshift({ index: dayWeek, days: [], totalPeriod: 0 })
            weekIndex = farsideDataGroupedBy[yearIndex].months[monthIndex].weeks.findIndex((week) => week.index === dayWeek)
        }

        // store
        farsideDataGroupedBy[yearIndex].months[monthIndex].weeks[weekIndex].days.unshift(data[dayIndex])
        farsideDataGroupedBy[yearIndex].months[monthIndex].weeks[weekIndex].totalPeriod += Number(data[dayIndex].total)
        farsideDataGroupedBy[yearIndex].months[monthIndex].totalPeriod += Number(data[dayIndex].total)
        farsideDataGroupedBy[yearIndex].totalPeriod += Number(data[dayIndex].total)

        // total per month
        // for (let tickerIndex = 0; tickerIndex < tickers.length; tickerIndex++) {
        //     if (!farsideDataGroupedBy[yearIndex].totalPerEtfs[tickers[tickerIndex]])
        //         farsideDataGroupedBy[yearIndex].totalPerEtfs[tickers[tickerIndex]] = 0
        //     const flow = Number(data[dayIndex][tickers[tickerIndex] as keyof FarsideFlows])
        //     if (isNaN(flow)) continue
        //     farsideDataGroupedBy[yearIndex].totalPerEtfs[tickers[tickerIndex]] += flow
        // }

        // total per year
        // todo total since inception
        for (let tickerIndex = 0; tickerIndex < tickers.length; tickerIndex++) {
            if (!farsideDataGroupedBy[yearIndex].totalPerEtfs[tickers[tickerIndex]])
                farsideDataGroupedBy[yearIndex].totalPerEtfs[tickers[tickerIndex]] = 0
            const flow = Number(data[dayIndex][tickers[tickerIndex] as keyof FarsideFlows])
            if (isNaN(flow)) continue
            farsideDataGroupedBy[yearIndex].totalPerEtfs[tickers[tickerIndex]] += flow
        }
    }

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
        <div className="flex w-full flex-col">
            {/* context */}
            <div className="grid grid-flow-col items-baseline">
                <span className="hidden md:flex" />
                <div className="mb-1 flex w-full items-baseline justify-start gap-1.5 text-lg md:justify-center">
                    <IconWrapper icon={etf === ETFs.BTC ? IconIds.CRYPTO_BTC : IconIds.CRYPTO_ETH} className="size-5" />
                    <p>ETFs Flows</p>
                    <p className="text-base text-inactive">in millions of $</p>
                </div>
                <div className="flex justify-end gap-2 text-2xs italic">
                    <button className="group w-8 text-inactive">
                        <p className="line-through group-hover:hidden">Month</p>
                        <p className="hidden truncate group-hover:flex">To code</p>
                    </button>
                    <button className="group w-8 text-inactive">
                        <p className="line-through group-hover:hidden">Year</p>
                        <p className="hidden truncate group-hover:flex">To code</p>
                    </button>
                    <button
                        onClick={() => setTotalsToShow({ ...totalsToShow, inception: !totalsToShow.inception })}
                        className={cn('w-10', { 'text-inactive line-through': !totalsToShow.inception, 'text-default': totalsToShow.inception })}
                    >
                        <p>Inception</p>
                    </button>
                </div>
            </div>

            {/* headers */}
            <TableRow
                className="border-x border-t border-inactive bg-light-hover text-2xs sm:text-sm md:text-sm lg:text-base"
                date={<p>Date</p>}
                tickers={tickers
                    .filter((curr) => getConfig(etf, curr))
                    .sort((curr, next) => getConfig(etf, curr).index - getConfig(etf, next).index)
                    .map((ticker) => (
                        <LinkWrapper
                            href={getConfig(etf, ticker).url}
                            key={ticker}
                            className="group flex h-9 w-12 -rotate-45 items-center justify-center overflow-visible hover:rotate-0 sm:rotate-0 md:w-16"
                            target="_blank"
                        >
                            <TextWithTickerColor className="text-center group-hover:hidden" etf={etf} ticker={ticker}>
                                {ticker}
                            </TextWithTickerColor>
                            <IconWrapper icon={IconIds.IC_BASELINE_OPEN_IN_NEW} className="hidden h-4 w-4 text-primary group-hover:flex" />
                        </LinkWrapper>
                    ))}
                total={
                    <>
                        <p className="hidden text-nowrap sm:flex">Total</p>
                        <p className="pr-2 text-base sm:hidden">∑</p>
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
            <div className="flex h-[400px] w-full flex-col overflow-y-scroll border border-inactive text-2xs sm:text-xs md:h-[calc(100vh-280px)] md:text-sm">
                {/* for each year */}
                {farsideDataGroupedBy.map((year, yearIndex) => (
                    <div key={`${yearIndex}-${year.index}`} className="flex flex-col py-1">
                        <TableRow
                            date={<p className="text-primary">{year.index}</p>}
                            tickers={
                                totalsToShow.inception
                                    ? Object.entries(year.totalPerEtfs)
                                          .filter(([ticker]) => getConfig(etf, ticker))
                                          .sort(([curr], [next]) => getConfig(etf, curr).index - getConfig(etf, next).index)
                                          .map(([ticker, total]) => (
                                              <div key={`${yearIndex}-${year.index}-${ticker}`} className="w-12 md:w-16">
                                                  <TextWithTickerColor etf={etf} className="hidden text-center md:flex" ticker={ticker}>
                                                      {formatFlows(total)}
                                                  </TextWithTickerColor>
                                                  <TextWithTickerColor etf={etf} className="text-center md:hidden" ticker={ticker}>
                                                      {formatFlows(total, true)}
                                                  </TextWithTickerColor>
                                              </div>
                                          ))
                                    : tickers.map((ticker, tickerIndex) => <div key={`${ticker}-${tickerIndex}`} className="flex w-12 md:w-16" />)
                            }
                            total={<p className="text-inactive">{formatFlows(year.totalPeriod)}</p>}
                            rank={null}
                            className="py-1"
                        />

                        {/* for each month */}
                        {year.months.map((month, monthIndex) => (
                            <div key={`${yearIndex}-${year.index}-${monthIndex}-${month.index}`} className="flex flex-col py-1">
                                <TableRow
                                    className="border-t border-light-hover py-1.5"
                                    date={
                                        <p className="w-fit text-primary">
                                            {monthName(month.index).slice(0, 3)} {String(year.index).slice(2)}
                                        </p>
                                    }
                                    tickers={tickers.map(() => (
                                        <div className="flex w-12 items-center justify-center overflow-hidden text-inactive md:w-16" />
                                    ))}
                                    total={<p className="text-inactive">{formatFlows(month.totalPeriod)}</p>}
                                    rank={null}
                                />

                                {/* for each week */}
                                {month.weeks.map((week, weekIndex) => (
                                    <div
                                        key={`${yearIndex}-${year.index}-${monthIndex}-${month.index}-${weekIndex}-${week.index}`}
                                        className="flex flex-col py-0.5 sm:gap-0.5"
                                    >
                                        {week.days.length && dayjs(week.days[0].day).format('ddd') === 'Fri' && (
                                            <TableRow
                                                className="border-b border-dashed border-light-hover pt-0.5"
                                                date={<p className="w-fit">Week {week.index}</p>}
                                                tickers={tickers.map((ticker, tickerIndex) => (
                                                    <div key={`${ticker}-${tickerIndex}`} className="flex w-12 md:w-16" />
                                                ))}
                                                total={
                                                    null
                                                    // <p className="text-inactive">{numeral(week.totalPeriod).format('0,0')}</p>
                                                }
                                                rank={null}
                                            />
                                        )}

                                        {/* for each day */}
                                        {week.days.map((day, dayIndex) => (
                                            <TableRow
                                                activateHover={true}
                                                key={`${yearIndex}-${year.index}-${monthIndex}-${month.index}-${weekIndex}-${week.index}-${dayIndex}-${day.day}`}
                                                date={
                                                    <>
                                                        <p className="text-nowrap text-inactive xl:hidden">{dayjs(day.day).format('ddd DD')}</p>
                                                        <p className="hidden text-nowrap text-inactive xl:flex">
                                                            {dayjs(day.day).format('ddd DD MMM')}
                                                        </p>
                                                    </>
                                                }
                                                tickers={tickers
                                                    .filter((curr) => getConfig(etf, curr))
                                                    .sort((curr, next) => getConfig(etf, curr).index - getConfig(etf, next).index)
                                                    .map((ticker) => (
                                                        <div
                                                            key={`${yearIndex}-${year.index}-${monthIndex}-${month.index}-${weekIndex}-${week.index}-${dayIndex}-${day.day}-${ticker}`}
                                                            className="flex w-12 items-center justify-center md:w-16"
                                                        >
                                                            {day[ticker as keyof typeof day] ? (
                                                                <TextWithTickerColor
                                                                    etf={etf}
                                                                    className="w-full text-center group-hover:hidden"
                                                                    ticker={ticker}
                                                                >
                                                                    {formatFlows(Number(day[ticker as keyof typeof day]))}
                                                                </TextWithTickerColor>
                                                            ) : (
                                                                <p className="text-center text-inactive group-hover:hidden">.</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                total={
                                                    <p
                                                        className={cn('text-nowrap', {
                                                            'text-green-500': Number(day.total) > 0,
                                                            'text-red-500': Number(day.total) < 0,
                                                        })}
                                                    >
                                                        {formatFlows(day.total)}
                                                    </p>
                                                }
                                                rank={<p className="italic text-inactive">{day.rank}</p>}
                                                className="leading-3 xl:leading-4"
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* legend */}
            <div className="mt-1 flex w-full items-center justify-between">
                <LinkWrapper href={farsidePage(etf)} className="flex gap-1 text-inactive hover:text-primary" target="_blank">
                    <p className="truncate text-xs">Data: farside.co.uk, a few min. ago</p>
                </LinkWrapper>
                <div className="flex gap-2">
                    <Link
                        href={etf === ETFs.BTC ? '/?copy-or-download=true' : '/eth?copy-or-download=true'}
                        className="flex items-center gap-1 text-inactive hover:text-primary"
                    >
                        <p className="text-xs">Copy</p>
                        <IconWrapper icon={IconIds.CARBON_COPY} className="w-4" />
                    </Link>
                    <Link
                        href={etf === ETFs.BTC ? '/?copy-or-download=true' : '/eth?copy-or-download=true'}
                        className="flex items-center gap-1 text-inactive hover:text-primary"
                    >
                        <p className="text-xs">CSV</p>
                        <IconWrapper icon={IconIds.CARBON_DOWNLOAD} className="w-4" />
                    </Link>
                    <CopyOrDownloadDataModal />
                </div>
            </div>
        </div>
    )
}
