'use client'

import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import * as ecStat from 'echarts-stat'
import 'echarts-gl'
import { cn } from '@/utils'

interface InterfaceEchartWrapperProps {
    options: echarts.EChartsOption
    id?: string
    className?: string
}

export default function EchartWrapper(props: InterfaceEchartWrapperProps) {
    const debug = false
    const chartRef = useRef<HTMLDivElement>(null)
    const myChart = useRef<echarts.ECharts | null>(null)
    const handleChartResize = () => myChart.current?.resize()

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(echarts as any).registerTransform((ecStat as any).transform.regression)

        // only if ref mounted in dom
        if (chartRef?.current) {
            // ensure chart has been initialised
            if (!myChart.current) {
                if (debug) console.log('3. render EchartWrapper | init')
                myChart.current = echarts.init(chartRef.current)
            }
            window.addEventListener('resize', handleChartResize, { passive: true })

            // preserve grid3D view settings if they exist
            const currentOptions = myChart.current.getOption()
            // @ts-expect-error: poorly typed
            const grid3DOptions = currentOptions?.grid3D ? { grid3D: currentOptions.grid3D } : {}

            // set option
            if (debug) console.log('3. render EchartWrapper | set options', { props })
            // @ts-expect-error: poorly typed
            myChart.current.setOption({ ...props.options, ...grid3DOptions }, { notMerge: true })
        }

        return () => {
            if (myChart?.current) {
                // myChart.current.dispose(); // useless since we keep current instance if any (previously we used to re-init a new instance - now we don't)
                window.removeEventListener('resize', handleChartResize)
            }
        }
    }, [props.options])

    return <div ref={chartRef} className={cn('m-0 p-0', props.className)} style={{ width: '100%', height: '100%' }}></div>
}
