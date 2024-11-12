'use client'

import { AppThemes, ETFs } from '@/enums'
import { cn, getConfig } from '@/utils'
import { useTheme } from 'next-themes'
import { ReactNode, useEffect, useState } from 'react'

export default function TextWithTickerColor(props: { etf: ETFs; ticker: string; children: ReactNode; className?: string }) {
    const [mounted, setMounted] = useState(false)
    const { resolvedTheme } = useTheme()
    useEffect(() => setMounted(true), [])
    if (!mounted) return <p className={cn(`text-${props.ticker}`, props.className)}>{props.children}</p>
    return (
        <p className={cn(props.className)} style={{ color: getConfig(props.etf, props.ticker).colors[resolvedTheme as AppThemes] }}>
            {props.children}
        </p>
    )
}
