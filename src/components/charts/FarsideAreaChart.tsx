'use client'

import * as echarts from 'echarts'
import { ErrorBoundary } from 'react-error-boundary'
import { useEffect, useState } from 'react'
import { farsideData } from '@/interfaces'
import dayjs from 'dayjs'
import { AppThemes, EtfTickers } from '@/enums'
import { useTheme } from 'next-themes'
import { cn, getConfig, roundNToXDecimals, shortenStr } from '@/utils'
import EchartWrapper from './EchartWrapper'
import numeral from 'numeral'
import { colors } from '@/config/charts.config'

interface GetOptionsParams {
    timestamps: string[]
    flows: {
        index: number
        key: string
        flows: number[]
        flowsPercent: number[]
        hexColor: string
        showSerie: boolean
    }[]
}

export function Fallback({ error }: { error: Error }) {
    return (
        <div className="flex flex-col items-center text-xs">
            <p className="">Something went wrong...</p>
            <p className="rounded-md bg-gray-100 p-1 text-orange-500">Error: {error.message}</p>
        </div>
    )
}

export function LoadingArea({ message = 'Loading...' }: { message?: string }) {
    return (
        <div className="flex h-full w-full animate-pulse items-center justify-center bg-gray-100 p-2">
            <p className="text-sm text-gray-400">{message}</p>
        </div>
    )
}

export default function FarsideAreaChart(props: { className?: string; farsideData: farsideData[]; tickers: (EtfTickers | string)[] }) {
    const getOptionsParams = (): GetOptionsParams => ({ timestamps: [], flows: [] })
    const { resolvedTheme } = useTheme()

    /**
     * methods
     */

    const getOptions = ({ timestamps, flows }: GetOptionsParams): echarts.EChartsOption => {
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                },
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
            },
            legend: {
                selectedMode: true,
                textStyle: {
                    fontSize: 12,
                    padding: [0, 0, 0, -2], // adjust the last value to reduce the gap between the color rectangle and the text
                    color: colors.text[resolvedTheme as AppThemes],
                },
                // itemGap: 9,
                itemWidth: 10,
                itemHeight: 8,
                icon: 'rect',
                selected: {
                    ...props.tickers.reduce((acc, curr) => ({ ...acc, [curr]: true }), {}),
                    [EtfTickers.GBTC]: false,
                },
            },
            toolbox: {
                show: false,
                top: 20,
                itemSize: 10,
                feature: {
                    dataZoom: { show: true, yAxisIndex: 'none' },
                    restore: { show: true },
                    saveAsImage: { show: true },
                    dataView: { show: true, readOnly: false },
                },
            },
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    height: 20,
                    bottom: '3%',
                    left: '15%',
                    right: '15%',
                    // startValue: timestamps.length ? timestamps[Math.max(0, timestamps.length - 1000)] : undefined,
                    fillerColor: 'transparent',
                },
            ],
            textStyle: {
                color: colors.text[resolvedTheme as AppThemes],
            },
            xAxis: {
                type: 'category',
                // data: timestamps.map((timestamp) => toCobDayjs(timestamp).format('DD MMM. YY')),
                data: timestamps,
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: colors.line[resolvedTheme as AppThemes],
                    },
                    alignWithLabel: true,
                },
                axisLabel: {
                    margin: 15,
                    show: true,
                    color: colors.text[resolvedTheme as AppThemes],
                    fontSize: 11,
                    showMinLabel: true,
                    showMaxLabel: true,
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    show: true,
                    color: colors.text[resolvedTheme as AppThemes],
                    fontSize: 10,
                    formatter: (...a: unknown[]) => {
                        return numeral(a[0]).multiply(1000000).format('0,0 a$')
                    },
                },
                scale: true,
                splitLine: {
                    lineStyle: {
                        color: colors.line[resolvedTheme as AppThemes],
                    },
                },
            },
            grid: {
                left: '12%',
                right: '10%',
                top: 60,
                bottom: 70,
            },
            // @ts-expect-error: poorly typed
            series: flows.map((etf) => {
                const showEndlabel =
                    etf.key === EtfTickers.BRRR || (etf.flowsPercent.length > 0 && Math.abs(etf.flowsPercent[etf.flowsPercent.length - 1]) > 20) // 5 %
                return {
                    showSymbol: false,
                    name: etf.key,
                    type: 'line',
                    lineStyle: { color: 'transparent' },
                    stack: 'Total',
                    areaStyle: {},
                    emphasis: { focus: 'series' },
                    color: etf.hexColor,
                    data: etf.flows.map((flow) => roundNToXDecimals(flow)),
                    itemStyle: {
                        color: etf.hexColor,
                        borderColor: etf.hexColor,
                        borderWidth: 2,
                    },
                    endLabel: {
                        show: showEndlabel,
                        offset: [10, 10],
                        fontSize: 10,
                        align: 'right',
                        formatter: function (params: { seriesName: string; data: number | string }) {
                            return !isNaN(Number(params.data))
                                ? `${shortenStr(params.seriesName, 30)}: ${numeral(params.data).multiply(1000000).format('0,0 a$')}`
                                : ''
                        },
                    },
                }
            }),
        }
    }
    const [options, setOptions] = useState<echarts.EChartsOption>(getOptions(getOptionsParams()))
    useEffect(() => {
        // prepare
        const optionsParams = getOptionsParams()

        // 1. for each day
        for (let dayIndex = 0; dayIndex < props.farsideData.length; dayIndex++) {
            // store ts
            const ts = dayjs(props.farsideData[dayIndex].Date).format('ddd DD MMM YY')
            optionsParams.timestamps.push(ts)

            // 2. for each ticker
            let totalFlowsForDay = 0
            for (let tickerIndex = 0; tickerIndex < props.tickers.length; tickerIndex++) {
                const ticker = props.tickers[tickerIndex] as keyof farsideData
                const flow = Number(props.farsideData[dayIndex][ticker] ?? 0)
                let serieIndex = optionsParams.flows.findIndex((serie) => serie.key === ticker)
                if (serieIndex < 0) {
                    optionsParams.flows.push({
                        key: ticker,
                        index: getConfig(ticker).index,
                        flows: [],
                        flowsPercent: [],
                        hexColor: getConfig(ticker).colors[resolvedTheme as AppThemes],
                        showSerie: false,
                    })
                    serieIndex = optionsParams.flows.findIndex((serie) => serie.key === ticker)
                }
                optionsParams.flows[serieIndex].flows.push(flow)
                totalFlowsForDay += flow
                if (!optionsParams.flows[serieIndex].showSerie && flow) optionsParams.flows[serieIndex].showSerie = true
            }

            // 3. for each ticker: fill validator balance %
            for (let tickerIndex = 0; tickerIndex < props.tickers.length; tickerIndex++) {
                const ticker = props.tickers[tickerIndex] as keyof farsideData
                const serieIndex = optionsParams.flows.findIndex((serie) => serie.key === ticker)
                if (serieIndex < 0) continue
                let percent = optionsParams.flows[serieIndex].flows[dayIndex] / totalFlowsForDay
                if (props.farsideData[dayIndex].TotalCheck === 0 || isNaN(percent)) percent = 0 // prevent errors
                optionsParams.flows[serieIndex].flowsPercent.push(roundNToXDecimals(percent * 100))
            }
        }

        // filter out w/o showSerie
        optionsParams.flows = optionsParams.flows
            .filter((serie) => serie.flows.length && serie.showSerie)
            // .sort((curr, next) => next.flows[0] - curr.flows[0])
            .sort((curr, next) => curr.index - next.index)

        // update chart
        const newOptions = getOptions(optionsParams)
        setOptions(newOptions)
    }, [resolvedTheme])
    return (
        <div className="mb-20 mt-10 flex w-full flex-col text-xs">
            <div className="mb-1 flex w-full justify-center text-base text-primary md:mb-2">
                <p>Cumulated Bitcoin ETF Flows $m USD</p>
            </div>
            <ErrorBoundary FallbackComponent={Fallback}>
                <div className={cn('h-[520px] w-full border border-inactive py-1 z-0', props.className)}>
                    {Array.isArray(options.series) && options.series ? (
                        <EchartWrapper options={options} />
                    ) : (
                        <LoadingArea message="Loading data..." />
                    )}
                </div>
            </ErrorBoundary>
        </div>
    )
}
