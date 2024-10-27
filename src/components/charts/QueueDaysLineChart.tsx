// 'use client'

// import dayjs from 'dayjs'
// import { cn } from '@/utils'
// import * as echarts from 'echarts'
// import EchartWrapper from './EchartWrapper'
// import { useTheme } from 'next-themes'
// import { useEffect, useState } from 'react'
// import { ValidatorQueueSnapshot } from '@/interfaces'
// import utc from 'dayjs/plugin/utc'
// import numeral from 'numeral'
// dayjs.extend(utc)

// export default function QueueDaysLineChart(props: { validatorQueueSnapshots: ValidatorQueueSnapshot[]; className?: string }) {
//     const colors = {
//         line: { light: '#e4e4e7', dark: '#475569' },
//         text: { light: '#6b7280', dark: '#94a3b8' },
//     }
//     const getOptions = (): echarts.EChartsOption => ({
//         tooltip: {
//             trigger: 'axis',
//         },
//         toolbox: {
//             top: 0,
//             right: 2,
//             itemSize: 8,
//             feature: {
//                 restore: { show: true },
//                 saveAsImage: { show: true },
//                 dataView: { show: true, readOnly: false },
//             },
//         },
//         animation: true,
//         xAxis: {
//             type: 'time',
//             nameTextStyle: { fontSize: 16 },
//             nameLocation: 'middle',
//             splitLine: {
//                 show: true,
//                 lineStyle: {
//                     color: colors.line[resolvedTheme as 'light' | 'dark'],
//                 },
//             },
//             axisLine: {
//                 show: true,
//                 lineStyle: { color: colors.line[resolvedTheme as 'light' | 'dark'] },
//             },
//             axisTick: {
//                 show: true,
//                 lineStyle: { color: colors.line[resolvedTheme as 'light' | 'dark'] },
//             },
//             axisLabel: {
//                 hideOverlap: true,
//                 show: true,
//                 color: colors.text[resolvedTheme as 'light' | 'dark'],
//                 fontSize: 12,
//                 margin: 12,
//                 showMinLabel: true,
//                 showMaxLabel: true,
//                 formatter: (...a: [number]) => {
//                     return dayjs(Number(a[0])).format('D MMM. YY')
//                 },
//             },
//             axisPointer: {
//                 show: true,
//                 label: {
//                     backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                     borderColor: '#ccc',
//                     borderWidth: 1,
//                     padding: [4, 10],
//                     color: 'black',
//                     formatter: (params) => {
//                         if (params.value) return `${dayjs.utc(Number(params.value)).format('ddd. D MMM. YYYY hh:mm:ss A')} UTC`
//                         return ''
//                     },
//                 },
//             },
//         },
//         yAxis: {
//             type: 'value',
//             name: 'Days',
//             nameTextStyle: { fontSize: 12, color: colors.text[resolvedTheme as 'light' | 'dark'] },
//             nameLocation: 'middle',
//             nameGap: 50,
//             splitLine: {
//                 show: true,
//                 lineStyle: {
//                     color: colors.line[resolvedTheme as 'light' | 'dark'],
//                 },
//             },
//             axisLine: {
//                 show: true,
//                 lineStyle: { color: colors.line[resolvedTheme as 'light' | 'dark'] },
//             },
//             axisTick: {
//                 show: true,
//                 inside: false,
//                 lineStyle: { color: colors.line[resolvedTheme as 'light' | 'dark'] },
//             },
//             axisLabel: {
//                 show: true,
//                 color: colors.text[resolvedTheme as 'light' | 'dark'],
//                 fontSize: 12,
//                 formatter: (...a: unknown[]) => {
//                     if (Number(a[0]) === 0) return ''
//                     return `${numeral(Number(a[0])).format('0,0.[00] a')}`
//                 },
//             },
//         },
//         series: [
//             {
//                 type: 'line',
//                 lineStyle: {
//                     color: resolvedTheme === 'light' ? '#1e40af' : '#60a5fa',
//                 },
//                 itemStyle: {
//                     color: resolvedTheme === 'light' ? '#1e40af' : '#60a5fa',
//                 },
//                 name: 'Entry',
//                 showSymbol: false,
//                 data: props.validatorQueueSnapshots.map((snapshot) => ({
//                     value: [new Date(snapshot.date).getTime(), Number(snapshot.entry_wait ?? 0)],
//                 })),
//                 endLabel: {
//                     show: true,
//                     offset: [5, 0],
//                     color: colors.text[resolvedTheme as 'light' | 'dark'],
//                     formatter: (params) => {
//                         if (!params?.value && !Array.isArray(params.value)) return ''
//                         const value = params.value as [number, number]
//                         return `Entry: ${numeral(Number(value[1])).format('0,0.0 a')}`
//                     },
//                 },
//             },
//             {
//                 type: 'line',
//                 lineStyle: {
//                     color: resolvedTheme === 'light' ? '#b91c1c' : '#f87171',
//                 },
//                 itemStyle: {
//                     color: resolvedTheme === 'light' ? '#b91c1c' : '#f87171',
//                 },
//                 name: 'Exit',
//                 showSymbol: false,
//                 data: props.validatorQueueSnapshots.map((snapshot) => ({
//                     value: [new Date(snapshot.date).getTime(), Number(snapshot.exit_wait ?? 0)],
//                 })),
//                 endLabel: {
//                     show: true,
//                     offset: [5, 0],
//                     color: colors.text[resolvedTheme as 'light' | 'dark'],
//                     formatter: (params) => {
//                         if (!params?.value && !Array.isArray(params.value)) return ''
//                         const value = params.value as [number, number]
//                         return `Exit: ${numeral(Number(value[1])).format('0,0 a')}`
//                     },
//                 },
//             },
//         ],
//         grid: {
//             top: '6%',
//             left: '5.5%',
//             right: '12%',
//             bottom: '17%',
//             containLabel: true,
//         },
//         dataZoom: [
//             {
//                 type: 'slider',
//                 show: true,
//                 height: 20, // https://github.com/apache/echarts/issues/12582
//                 bottom: '4%',
//                 fillerColor: 'transparent',
//                 labelFormatter: function (value) {
//                     return dayjs(new Date(value)).format('D MMM. YY')
//                 },
//                 textStyle: { color: resolvedTheme === 'light' ? '#4338ca' : '#818cf8' },
//             },
//         ],
//     })
//     const { resolvedTheme } = useTheme()
//     const [options, setOptions] = useState(getOptions())
//     useEffect(() => {
//         console.log('StakingAPRLineChart')
//         setOptions(() => getOptions())
//     }, [resolvedTheme])

//     return (
//         <div className={cn('w-full', props.className)}>
//             <EchartWrapper options={options} />
//         </div>
//     )
// }
