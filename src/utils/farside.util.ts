import { ETF_TICKERS_CONFIG } from '@/config/farside.config'
import { AppThemes, EtfTickers } from '@/enums'

export const getConfig = (ticker: EtfTickers | string) =>
    ticker in EtfTickers
        ? ETF_TICKERS_CONFIG[ticker as EtfTickers]
        : {
              provider: ticker,
              index: Object.keys(ETF_TICKERS_CONFIG).length,
              colors: { [AppThemes.LIGHT]: 'black', [AppThemes.DARK]: 'white' },
              url: '/',
          }

export const monthName = (monthIndex: number) =>
    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][monthIndex]
