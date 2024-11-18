'use client'

import * as echarts from 'echarts'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { AppThemes, ETFs, BtcETFsTickers, IconIds } from '@/enums'
import { useTheme } from 'next-themes'
import { cn, farsidePage, getConfig, roundNToXDecimals, shortenStr } from '@/utils'
import EchartWrapper from './EchartWrapper'
import numeral from 'numeral'
import { colors } from '@/config/charts.config'
import LinkWrapper from '../common/LinkWrapper'
import { ETFsTickers, FarsideFlows, FarsideRawData } from '@/interfaces'
import CustomFallback from '../common/CustomFallback'
import IconWrapper from '../common/IconWrapper'

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

export default function FarsideAreaChart(props: { className?: string; etf: ETFs; areaData: FarsideFlows[]; tickers: ETFsTickers[] }) {
    const getOptionsParams = (): GetOptionsParams => ({ timestamps: [], flows: [] })
    const { resolvedTheme } = useTheme()

    /**
     * methods
     */

    const getOptions = ({ timestamps, flows }: GetOptionsParams): echarts.EChartsOption => {
        const series = [
            ...flows.map((etf) => {
                const showEndlabel =
                    etf.key === BtcETFsTickers.BRRR || (etf.flowsPercent.length > 0 && Math.abs(etf.flowsPercent[etf.flowsPercent.length - 1]) > 15) // 5 %
                return {
                    showSymbol: false,
                    name: etf.key,
                    type: 'line',
                    lineStyle: { color: 'transparent' },
                    stack: 'Total',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series',
                        itemStyle: { opacity: 1 },
                    },
                    blur: {
                        itemStyle: { opacity: 0.2 },
                    },
                    color: etf.hexColor,
                    data: etf.flows.map((flow) => roundNToXDecimals(flow)),
                    itemStyle: {
                        color: etf.hexColor,
                        borderColor: etf.hexColor,
                        borderWidth: 2,
                    },
                    endLabel: {
                        show: showEndlabel,
                        // offset: [-0, 10],
                        fontSize: 10,
                        align: 'right',
                        // declare type BuiltinTextPosition = 'left' | 'right' | 'top' | 'bottom' | 'inside' | 'insideLeft' | 'insideRight' | 'insideTop' | 'insideBottom' | 'insideTopLeft' | 'insideTopRight' | 'insideBottomLeft' | 'insideBottomRight';
                        color: colors.text[resolvedTheme as AppThemes],
                        formatter: function (params: { seriesName: string; data: number | string }) {
                            return !isNaN(Number(params.data))
                                ? `${shortenStr(params.seriesName, 30)} = ${numeral(params.data).multiply(1000000).format('0,0 a$')}`
                                : ''
                        },
                    },
                }
            }),
            {
                itemStyle: { color: 'transparent' },
                lineStyle: { color: 'transparent' },
                showSymbol: false,
                name: '',
                type: 'line',
                data: [],
                markLine: {
                    animation: true,
                    symbol: 'none',
                    lineStyle: { color: 'gray', opacity: 0.6 },
                    data: [
                        {
                            xAxis: dayjs(new Date('2024-01-11')).format('ddd DD MMM YY'),
                            lineStyle: { color: colors.text[resolvedTheme as AppThemes], opacity: 0.5 },
                            label: {
                                show: true,
                                color: colors.text[resolvedTheme as AppThemes],
                                formatter: () => `Spot ETFs\napproved`,
                                fontSize: 9,
                                opacity: 1,
                            },
                        },
                        {
                            xAxis: dayjs(new Date('2024-04-15')).format('ddd DD MMM YY'),
                            lineStyle: { color: colors.text[resolvedTheme as AppThemes], opacity: 0.5 },
                            label: {
                                show: true,
                                color: colors.text[resolvedTheme as AppThemes],
                                formatter: () => `US tax\nseason`,
                                fontSize: 9,
                                opacity: 1,
                            },
                        },
                        {
                            xAxis: dayjs(new Date('2024-08-05')).format('ddd DD MMM YY'),
                            lineStyle: { color: colors.text[resolvedTheme as AppThemes], opacity: 0.5 },
                            label: {
                                show: true,
                                color: colors.text[resolvedTheme as AppThemes],
                                formatter: () => `$/¥ carry\ntrade unwind`,
                                fontSize: 9,
                                opacity: 1,
                            },
                        },
                        {
                            xAxis: dayjs(new Date('2024-09-18')).format('ddd DD MMM YY'),
                            lineStyle: { color: colors.text[resolvedTheme as AppThemes], opacity: 0.5 },
                            label: {
                                show: true,
                                color: colors.text[resolvedTheme as AppThemes],
                                formatter: () => `FED cuts\n50 bps`,
                                fontSize: 9,
                                opacity: 1,
                            },
                        },
                        {
                            xAxis: dayjs(new Date('2024-11-05')).format('ddd DD MMM YY'),
                            lineStyle: { color: colors.text[resolvedTheme as AppThemes], opacity: 0.5 },
                            label: {
                                show: true,
                                color: colors.text[resolvedTheme as AppThemes],
                                formatter: () => `Trump\nwins`,
                                fontSize: 9,
                                opacity: 1,
                            },
                        },
                        // {
                        //     xAxis: dayjs(new Date('2024-09-18')).format('ddd DD MMM YY'),
                        //     lineStyle: { color: colors.text[resolvedTheme as AppThemes], opacity: 0.5 },
                        //     label: {
                        //         show: true,
                        //         color: colors.text[resolvedTheme as AppThemes],
                        //         formatter: () => `18 Sept 24`,
                        //         position: 'insideMiddleTop',
                        //         offset: [0, -1],
                        //         rotate: 90,
                        //         fontSize: 10,
                        //         opacity: 1,
                        //     },
                        // },
                    ],
                },
            },
        ] as echarts.SeriesOption[]
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
                    [BtcETFsTickers.GBTC]: false,
                },
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
                color: colors.dztext[resolvedTheme as AppThemes],
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
                    fontSize: 9,
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
                        const formatted = numeral(a[0]).multiply(1000000).format('0,0 a$')
                        if (formatted === '50 b$') return ''
                        return formatted
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
                right: '5%',
                top: 80,
                bottom: 70,
            },
            series,
        }
    }
    const [options, setOptions] = useState<echarts.EChartsOption>(getOptions(getOptionsParams()))
    useEffect(() => {
        // prepare
        const optionsParams = getOptionsParams()

        // 1. for each day
        for (let dayIndex = 0; dayIndex < props.areaData.length; dayIndex++) {
            // store ts
            const ts = dayjs(props.areaData[dayIndex].day).format('ddd DD MMM YY')
            optionsParams.timestamps.push(ts)

            // 2. for each ticker
            let totalFlowsForDay = 0
            for (let tickerIndex = 0; tickerIndex < props.tickers.length; tickerIndex++) {
                const ticker = props.tickers[tickerIndex] as BtcETFsTickers
                const config = getConfig(props.etf, ticker)
                if (!config) continue
                const flow = Number(props.areaData[dayIndex][ticker] ?? 0)
                let serieIndex = optionsParams.flows.findIndex((serie) => serie.key === ticker)
                if (serieIndex < 0) {
                    optionsParams.flows.push({
                        key: ticker,
                        index: config.index,
                        flows: [],
                        flowsPercent: [],
                        hexColor: config.colors[resolvedTheme as AppThemes],
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
                if (props.areaData[dayIndex].total === 0 || isNaN(percent)) percent = 0 // prevent errors
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
        <Suspense fallback={<CustomFallback loadingText="Area chart loading..." />}>
            <div className="mt-10 flex w-full flex-col text-xs">
                {/* <div className="mb-1 flex w-full justify-center text-base text-primary md:mb-2">
                    <p>Cumulated {props.etf} ETFs Flows $m USD</p>
                </div> */}
                <div className="mb-1 flex w-full justify-center gap-1.5 text-lg md:mb-2">
                    <p>Cumulated</p>
                    <IconWrapper icon={props.etf === ETFs.BTC ? IconIds.CRYPTO_BTC : IconIds.CRYPTO_ETH} className="size-6" />
                    <p>ETFs Flows</p>
                    <p className="text-inactive">$m USD</p>
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
                <LinkWrapper href={farsidePage(props.etf)} className="flex gap-1 text-inactive hover:text-primary" target="_blank">
                    <p className="truncate text-xs">Data: farside.co.uk, a few min. ago</p>
                </LinkWrapper>
            </div>
        </Suspense>
    )
}
