import { ETF_TICKERS_CONFIG } from '@/config/farside.config'
import { EtfTickers } from '@/enums'
import { cn } from '@/utils'
import { ReactNode } from 'react'

/**
 * helpers
 */

export const getConfig = (ticker: EtfTickers | string) =>
    ticker in EtfTickers
        ? ETF_TICKERS_CONFIG[ticker as EtfTickers]
        : {
              provider: ticker,
              index: Object.keys(ETF_TICKERS_CONFIG).length,
              colors: { light: 'black', dark: 'white' },
              url: '/',
          }
export const monthName = (monthIndex: number) =>
    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][monthIndex]

/**
 * comp
 */

export function TableRow(props: { date: ReactNode; tickers: ReactNode[]; total: ReactNode; rank: ReactNode; className?: string }) {
    return (
        <div className={cn('flex items-center sm:gap-1 hover:bg-light-hover px-1', props.className)}>
            <div className="flex w-[90px] justify-start overflow-hidden text-discreet md:w-32">{props.date}</div>
            {...props.tickers}
            <div className="flex w-20 justify-end overflow-hidden text-discreet md:w-20">{props.total}</div>
            <div className="flex w-12 justify-end overflow-hidden text-discreet md:w-20">{props.rank}</div>
        </div>
    )
}
