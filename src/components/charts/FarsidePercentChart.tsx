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
                    fontSize: 10,
                    padding: [0, 0, 0, -2], // adjust the last value to reduce the gap between the color rectangle and the text
                },
                itemGap: 9,
                itemWidth: 16,
                itemHeight: 10,
                // formatter: (name: string) => shortenStr(name, 9),
            },
            toolbox: {
                show: true,
                top: 30,
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
                    startValue: timestamps.length ? timestamps[Math.max(0, timestamps.length - 10)] : undefined,
                    fillerColor: 'transparent',
                },
            ],
            textStyle: {
                color: '#9ca3af',
            },
            xAxis: {
                type: 'category',
                // data: timestamps.map((timestamp) => toCobDayjs(timestamp).format('DD MMM. YY')),
                data: timestamps,
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#e4e4e7',
                    },
                    alignWithLabel: true,
                },
                axisLabel: {
                    show: true,
                    color: '#9ca3af',
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
                    color: '#9ca3af',
                    fontSize: 11,
                    formatter: (...a: unknown[]) => {
                        return `${Number(a[0])}%`
                    },
                },
            },
            // @ts-expect-error: poorly typed
            series: flows.map((exposure) => ({
                name: exposure.key,
                type: 'bar',
                showBackground: true,
                backgroundStyle: { color: 'rgba(250, 250, 250, 0.1)' },
                stack: 'total',
                barWidth: '80%',

                label: {
                    show: true,
                    formatter: (params: { value: number; dataIndex: number }) => {
                        const data = Math.round(params.value)
                        if (data < 5) return ''
                        return data + ''
                    },
                },
                color: exposure.hexColor,
                data: exposure.flowsPercent.map((value) => roundNToXDecimals(value, 1)),
            })),
            grid: {
                left: 50,
                right: 40,
                top: 60,
                bottom: 60,
            },
        }
    }

    /**
     * hooks
     */

    const getOptionsParams = (): GetOptionsParams => ({ timestamps: [], flows: [] })
    const [options, setOptions] = useState<echarts.EChartsOption>(getOptions(getOptionsParams()))
    const { resolvedTheme } = useTheme()
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
