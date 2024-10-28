import { cn } from '@/utils'
import { ReactNode } from 'react'

/**
 * comp
 */

export function TableRow(props: {
    activateHover?: boolean
    date: ReactNode
    tickers: ReactNode[]
    total: ReactNode
    rank: ReactNode
    className?: string
}) {
    return (
        <div className={cn('flex items-center sm:gap-1 px-1', { 'hover:bg-light-hover': props.activateHover }, props.className)}>
            <div className="flex w-[90px] justify-start overflow-hidden text-discreet md:w-32">{props.date}</div>
            {...props.tickers}
            <div className="flex w-20 justify-end overflow-hidden text-discreet md:w-20">{props.total}</div>
            <div className="flex w-12 justify-end overflow-hidden text-discreet md:w-20">{props.rank}</div>
        </div>
    )
}
