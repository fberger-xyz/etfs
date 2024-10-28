'use client'

import * as echarts from 'echarts'
import { ErrorBoundary } from 'react-error-boundary'
import { useEffect, useState } from 'react'
import { farsideData } from '@/interfaces'
import dayjs from 'dayjs'
import { AppThemes, EtfTickers } from '@/enums'
import { useTheme } from 'next-themes'
import { cn, getConfig, roundNToXDecimals } from '@/utils'
import EchartWrapper from './EchartWrapper'
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

export default function FarsidePercentChart(props: { className?: string; farsideData: farsideData[]; tickers: (EtfTickers | string)[] }) {
    /**
     * methods
     */

    const { resolvedTheme } = useTheme()
    const getOptions = ({ timestamps, flows }: GetOptionsParams): echarts.EChartsOption => {
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' },
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
                // itemWidth: 16,
                itemHeight: 10,
                // formatter: (name: string) => shortenStr(name, 9),
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
                    startValue: timestamps.length ? timestamps[Math.max(0, timestamps.length - 20)] : undefined,
                    fillerColor: 'transparent',

                    labelFormatter: function (value) {
                        return dayjs(new Date(timestamps[value])).format('D MMM. YY')
                    },
                    textStyle: { color: colors.text[resolvedTheme as AppThemes] },
                },
            ],
            textStyle: {
                color: colors.text[resolvedTheme as AppThemes],
            },
            xAxis: {
                type: 'category',
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
                min: 0,
                max: 100,

                // see https://github.com/apache/echarts/blob/13c2d062e6bcd49ab6da87eb4032ac01ec9fe467/src/coord/axisDefault.ts
                axisLabel: {
                    show: true,
                    color: colors.text[resolvedTheme as AppThemes],
                    fontSize: 11,
                    formatter: (...a: unknown[]) => {
                        return `${Number(a[0])}%`
                    },
                },
                splitLine: {
                    lineStyle: {
                        color: colors.line[resolvedTheme as AppThemes],
                    },
                },
            },
            // @ts-expect-error: poorly typed
            series: flows.map((flow) => ({
                name: flow.key,
                type: 'bar',
                showBackground: true,
                backgroundStyle: { color: resolvedTheme === AppThemes.LIGHT ? 'rgba(250, 250, 250, 0.1)' : 'rgba(50, 50, 50, 0.1)' },
                // backgroundStyle: 'transparent',
                stack: 'total',
                barWidth: '80%',

                label: {
                    show: true,
                    formatter: (params: { value: number; dataIndex: number }) => {
                        const data = Math.round(params.value)
                        if (params.dataIndex % 5 !== 1) return ''
                        if (data >= 5) return data
                        else return ''
                    },
                },
                color: flow.hexColor,
                data: flow.flowsPercent.map((value) => roundNToXDecimals(value, 1)),
            })),
            grid: {
                left: '10%',
                right: 40,
                top: 60,
                bottom: 70,
            },
        }
    }

    /**
     * hooks
     */

    const getOptionsParams = (): GetOptionsParams => ({ timestamps: [], flows: [] })
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
                if (ticker === EtfTickers.GBTC) continue
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
                optionsParams.flows[serieIndex].flowsPercent.push(roundNToXDecimals(percent * 100, 2))
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
        <ErrorBoundary FallbackComponent={Fallback}>
            <div className={cn('w-full', props.className)}>
                {Array.isArray(options.series) && options.series ? <EchartWrapper options={options} /> : <LoadingArea message="Loading data..." />}
            </div>
        </ErrorBoundary>
    )
}
