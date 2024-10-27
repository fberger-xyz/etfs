// import * as echarts from 'echarts'
// import { ErrorBoundary } from 'react-error-boundary'
// import { LoadingArea } from '../../../../Common/CommonComponents'
// import { Fallback } from '../../lending-book-daily/page-lending-book-data/tables/LendingBookCommons'
// import { cn } from '../../../../../helpers/utils'
// import { colors, getAssetsToVenuesMetric, roundNToXDecimals, shortenStr, toCobDayjs } from '../../../../../utils'
// import EchartWrapper from '../../../hfs/charts/Echart.wrapper'
// import { useEffect, useState } from 'react'
// import { useCscmCounterpartiesReportStore } from '../../../../../stores/reports/cscm/counterparties/counterparties-report.store'
// import { CscmReportCounterpartiesCategories, HarukoCounterpartyIds, HarukoMetric, HarukoRelationshipType } from '../../../../../enums'
// import { RiskReportConfig } from '../../../../../config'

// interface GetOptionsParams {
//     timestamps: number[]
//     exposures: {
//         key: string
//         expositionUsd: number[]
//         expositionUsdPercent: number[]
//         hexColor: string
//         hasAtLeastOneEntry: boolean
//     }[]
// }

// export default function FarsidePercentChart(props: {
//     category: CscmReportCounterpartiesCategories
//     isExporting: boolean
//     id?: string
//     className?: string
// }) {
//     // debug
//     const debug = false

//     /**
//      * methods
//      */

//     // chart config
//     const getOptions = ({ timestamps, exposures }: GetOptionsParams): echarts.EChartsOption => {
//         return {
//             animation: !props.isExporting,
//             tooltip: {
//                 trigger: 'axis',
//                 axisPointer: {
//                     type: 'cross',
//                 },
//                 backgroundColor: 'rgba(255, 255, 255, 0.6)',
//             },
//             legend: {
//                 selectedMode: true,
//                 textStyle: {
//                     fontSize: 10,
//                     padding: [0, 0, 0, -2], // Adjust the last value to reduce the gap between the color rectangle and the text
//                 },
//                 itemGap: 9,
//                 itemWidth: 16,
//                 itemHeight: 10,
//                 formatter: (name: string) => shortenStr(name, 9),
//             },
//             toolbox: {
//                 show: !props.isExporting,
//                 top: 30,
//                 itemSize: 10,
//                 feature: {
//                     dataZoom: { show: !props.isExporting, yAxisIndex: 'none' },
//                     restore: { show: !props.isExporting },
//                     saveAsImage: { show: !props.isExporting },
//                     dataView: { show: !props.isExporting, readOnly: false },
//                 },
//             },
//             dataZoom: [
//                 {
//                     type: 'slider',
//                     show: true,
//                     height: 20,
//                     bottom: '3%',
//                     startValue: timestamps.length ? toCobDayjs(timestamps[Math.max(0, timestamps.length - 30)]).format('DD MMM. YY') : undefined,
//                     fillerColor: 'transparent',
//                 },
//             ],
//             textStyle: {
//                 color: '#9ca3af',
//             },
//             xAxis: {
//                 type: 'category',
//                 data: timestamps.map((timestamp) => toCobDayjs(timestamp).format('DD MMM. YY')),
//                 axisTick: {
//                     show: true,
//                     lineStyle: {
//                         color: '#e4e4e7',
//                     },
//                     alignWithLabel: true,
//                 },
//                 axisLabel: {
//                     show: true,
//                     color: '#9ca3af',
//                     fontSize: 11,
//                     showMinLabel: true,
//                     showMaxLabel: true,
//                 },
//             },
//             yAxis: {
//                 type: 'value',
//                 min: 0,
//                 max: 100,

//                 // see https://github.com/apache/echarts/blob/13c2d062e6bcd49ab6da87eb4032ac01ec9fe467/src/coord/axisDefault.ts
//                 axisLabel: {
//                     show: true,
//                     color: '#9ca3af',
//                     fontSize: 11,
//                     formatter: (...a: unknown[]) => {
//                         return `${Number(a[0])}%`
//                     },
//                 },
//             },
//             series: exposures.map((exposure) => ({
//                 name: exposure.key,
//                 type: 'bar',
//                 showBackground: true,
//                 backgroundStyle: { color: 'rgba(250, 250, 250, 0.1)' },
//                 stack: 'total',
//                 barWidth: '80%',
//                 label: {
//                     show: true,
//                     formatter: (params: { value: number; dataIndex: number }) => {
//                         const data = Math.round(params.value)
//                         if (data < 4) return ''
//                         return data + ''
//                     },
//                 },
//                 color: exposure.hexColor,
//                 data: exposure.expositionUsdPercent.map((value) => roundNToXDecimals(value, 1)),
//             })),
//             grid: {
//                 left: 50,
//                 right: 40,
//                 top: 60,
//                 bottom: 60,
//             },
//         }
//     }

//     /**
//      * hooks
//      */

//     const { reportDatetime, venues, adjustVenues, computeds } = useCscmCounterpartiesReportStore()
//     const getOptionsParams = (): GetOptionsParams => ({ timestamps: [], exposures: [] })
//     const [options, setOptions] = useState<echarts.EChartsOption>(getOptions(getOptionsParams()))
//     useEffect(() => {
//         // debug
//         if (debug) console.log('useEffect > FarsidePercentChart')

//         // prepare
//         const optionsParams = getOptionsParams()

//         // fill option params
//         const { data } = computeds.getCounterpartiesData(props.category)

//         // 1. for each day
//         const dataKeys = Object.keys(data)
//         for (let dayIndex = 0; dayIndex < dataKeys.length; dayIndex++) {
//             // store ts
//             const ts = Number(dataKeys[dayIndex])
//             optionsParams.timestamps.push(ts)

//             // exposure counter for day
//             let totalExposureForDay = 0

//             // 2. for each counterparty: fill validator balance
//             const counterpartyKeys = Object.keys(data[ts])
//             for (let counterpartyIndex = 0; counterpartyIndex < counterpartyKeys.length; counterpartyIndex++) {
//                 const counterparty = counterpartyKeys[counterpartyIndex] as HarukoCounterpartyIds
//                 const relationKeys = Object.keys(data[ts][counterparty]) as HarukoRelationshipType[]
//                 // for each relation
//                 let expositionUsd = 0
//                 for (let relationIndex = 0; relationIndex < relationKeys.length; relationIndex++) {
//                     const relation = relationKeys[relationIndex] as HarukoRelationshipType
//                     // if (!props.selectedRelations.includes(relation)) continue;
//                     const assets = data[ts][counterparty][relation]
//                     expositionUsd += Math.max(getAssetsToVenuesMetric({ metrics: [HarukoMetric.SIZE], assets })[HarukoMetric.SIZE], 0)
//                 }
//                 totalExposureForDay += expositionUsd
//                 let serieIndex = optionsParams.exposures.findIndex((serie) => serie.key === counterparty)
//                 if (serieIndex < 0) {
//                     optionsParams.exposures.push({
//                         key: counterparty,
//                         expositionUsd: [],
//                         expositionUsdPercent: [],
//                         hexColor:
//                             counterparty in HarukoCounterpartyIds
//                                 ? (RiskReportConfig.counterparties[counterparty as HarukoCounterpartyIds]?.colors?.primary ??
//                                   colors[counterpartyIndex % colors.length])
//                                 : '',
//                         hasAtLeastOneEntry: false,
//                     })
//                     serieIndex = optionsParams.exposures.findIndex((serie) => serie.key === counterparty)
//                 }
//                 optionsParams.exposures[serieIndex].expositionUsd.push(expositionUsd)
//                 if (!optionsParams.exposures[serieIndex].hasAtLeastOneEntry && expositionUsd !== 0)
//                     optionsParams.exposures[serieIndex].hasAtLeastOneEntry = true
//             }

//             // 3. for each counterparty: fill validator balance %
//             for (let counterpartyIndex = 0; counterpartyIndex < counterpartyKeys.length; counterpartyIndex++) {
//                 const counterparty = counterpartyKeys[counterpartyIndex] as HarukoCounterpartyIds
//                 const serieIndex = optionsParams.exposures.findIndex((serie) => serie.key === counterparty)
//                 if (serieIndex < 0) continue
//                 let percent = optionsParams.exposures[serieIndex].expositionUsd[dayIndex] / totalExposureForDay
//                 if (totalExposureForDay === 0 || isNaN(percent)) percent = 0 // prevent errors
//                 // console.log({ ts, counterparty, totalExposureForDay, percent });
//                 optionsParams.exposures[serieIndex].expositionUsdPercent.push(roundNToXDecimals(percent * 100, 2))
//             }
//         }

//         // filter out counterparties w/o exposure
//         optionsParams.exposures = optionsParams.exposures
//             .filter((serie) => serie.expositionUsd.length && serie.hasAtLeastOneEntry)
//             .sort((curr, next) => next.expositionUsd[0] - curr.expositionUsd[0])

//         // debug
//         if (debug) console.log({ optionsParams })

//         // update chart
//         const newOptions = getOptions(optionsParams)
//         setOptions(newOptions)
//     }, [reportDatetime, venues, adjustVenues])
//     return (
//         <ErrorBoundary FallbackComponent={Fallback}>
//             <div className={cn('w-full', props.className)}>
//                 {Array.isArray(options.series) && options.series ? <EchartWrapper options={options} /> : <LoadingArea message="Loading data..." />}
//             </div>
//         </ErrorBoundary>
//     )
// }
