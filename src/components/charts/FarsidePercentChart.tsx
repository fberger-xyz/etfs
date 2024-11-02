'use client'

import * as echarts from 'echarts'
import { ErrorBoundary } from 'react-error-boundary'
import { useEffect, useState } from 'react'
import { FarsideRawData } from '@/interfaces'
import dayjs from 'dayjs'
import { AppThemes, EtfTickers } from '@/enums'
import { useTheme } from 'next-themes'
import { cn, getConfig, roundNToXDecimals } from '@/utils'
import EchartWrapper from './EchartWrapper'
import { colors } from '@/config/charts.config'
import LinkWrapper from '../common/LinkWrapper'
import { Flows } from '@prisma/client'

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

export default function FarsidePercentChart(props: { className?: string; percentData: Flows[]; tickers: (EtfTickers | string)[] }) {
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
                itemWidth: 12,
                itemHeight: 10,
                // formatter: (name: string) => shortenStr(name, 9),
            },
            toolbox: {
                show: true,
                top: 20,
                itemSize: 10,
                feature: {
                    dataZoom: { show: false, yAxisIndex: 'none' },
                    restore: { show: true },
                    saveAsImage: { show: false },
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
                    textStyle: { color: colors.dztext[resolvedTheme as AppThemes] },
                    borderColor: colors.text[resolvedTheme as AppThemes], // Border color of the slider area
                    backgroundColor: 'transparent',
                    handleStyle: {
                        color: 'transparent',
                        borderColor: colors.text[resolvedTheme as AppThemes], // Border color of the handle
                    },
                    moveHandleStyle: {
                        color: 'transparent',
                        borderColor: colors.text[resolvedTheme as AppThemes], // Border color of the handle
                    },
                    emphasis: {
                        handleStyle: {
                            color: 'transparent',
                            borderColor: colors.dztext[resolvedTheme as AppThemes], // Border color of the handle
                        },
                        moveHandleStyle: {
                            color: 'transparent',
                            borderColor: colors.dztext[resolvedTheme as AppThemes], // Border color of the handle
                        },
                    },
                    selectedDataBackground: {
                        lineStyle: {
                            color: colors.dztext[resolvedTheme as AppThemes], // Border color of the handle
                        },
                        areaStyle: {
                            color: colors.dztext[resolvedTheme as AppThemes], // Border color of the handle
                        },
                    },
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
                    fontSize: 10,
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
                        if (params.dataIndex !== props.percentData.length - 2 && params.dataIndex % 10 !== 1) return ''
                        if (data >= 10) return data
                        else return ''
                    },
                },
                color: flow.hexColor,
                data: flow.flowsPercent.map((value) => roundNToXDecimals(value, 1)),
            })),
            grid: {
                left: '12%',
                right: '5%',
                top: 70,
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
        for (let dayIndex = 0; dayIndex < props.percentData.length; dayIndex++) {
            // store ts
            const ts = dayjs(props.percentData[dayIndex].day).format('ddd DD MMM YY')
            optionsParams.timestamps.push(ts)

            // 2. for each ticker
            let totalFlowsForDay = 0
            for (let tickerIndex = 0; tickerIndex < props.tickers.length; tickerIndex++) {
                const ticker = props.tickers[tickerIndex] as EtfTickers
                if (ticker === EtfTickers.GBTC) continue
                const flow = Number(props.percentData[dayIndex][ticker] ?? 0)
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
                const ticker = props.tickers[tickerIndex] as keyof FarsideRawData
                const serieIndex = optionsParams.flows.findIndex((serie) => serie.key === ticker)
                if (serieIndex < 0) continue
                let percent = optionsParams.flows[serieIndex].flows[dayIndex] / totalFlowsForDay
                if (props.percentData[dayIndex].total === 0 || isNaN(percent)) percent = 0 // prevent errors
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
        <div className="mb-28 mt-14 flex w-full flex-col text-xs">
            <div className="mb-1 flex w-full justify-center text-base text-primary md:mb-2">
                <p>Cumulated Bitcoin ETF Flows %</p>
            </div>
            <ErrorBoundary FallbackComponent={Fallback}>
                <div className={cn('h-[520px] w-full border border-inactive py-1 z-0', props.className)}>
                    {Array.isArray(options.series) && options.series ? (
                        <EchartWrapper options={options} />
                    ) : (
                        <LoadingArea message="Loading data..." />
                    )}
                </div>
                <LinkWrapper href="https://farside.co.uk/btc/" className="flex gap-1 text-inactive hover:text-primary" target="_blank">
                    <p className="truncate text-xs">Data: farside.co.uk, a few min. ago</p>
                </LinkWrapper>
            </ErrorBoundary>
        </div>
    )
}
