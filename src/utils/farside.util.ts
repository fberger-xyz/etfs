import { ETF_TICKERS_CONFIG } from '@/config/farside.config'
import { AppThemes, EtfTickers } from '@/enums'
import { FarsideRawData } from '@/interfaces'
import * as cheerio from 'cheerio'
import dayjs from 'dayjs'
import numeral from 'numeral'

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

export const getFarsideTableDataAsJson = (htmlContent: string): FarsideRawData[] => {
    const parsedHtlm = cheerio.load(htmlContent)
    const table = parsedHtlm('table.etf')
    const headers: string[] = []
    table.find('th').each((_, element) => {
        headers.push(parsedHtlm(element).text().trim())
    })
    const rows: string[][] = []
    table.find('tr').each((_, row) => {
        const rowData: string[] = []
        parsedHtlm(row)
            .find('td')
            .each((_, cell) => {
                rowData.push(parsedHtlm(cell).text().trim())
            })
        if (rowData.length > 0) {
            rows.push(rowData)
        }
    })
    const tableData = rows.map((row) => {
        const rowObject: { [key: string]: string } = {}
        headers.forEach((header, i) => {
            rowObject[header] = row[i]
        })
        return rowObject
    })
    return tableData as unknown as FarsideRawData[]
}

export const enrichFarsideJson = (rawData: FarsideRawData[]) => {
    const tickers: (EtfTickers | string)[] = []
    const parsedData = rawData
        .filter((day) => dayjs(day.Date).isValid())
        .map((day) => {
            let Total = 0
            const dup = { ...day }
            const entries = Object.entries(dup)
            for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
                const key = entries[entryIndex][0] as keyof typeof dup
                const value = entries[entryIndex][1]
                if (key === 'Date' || dayjs(key).isValid()) continue
                if (key === 'Total') continue
                if (!tickers.includes(key)) tickers.push(key)
                else if (value === '-') dup[key] = 0
                else {
                    const sign = String(value).includes('(') || String(value).includes(')') ? -1 : 1
                    const parsedValue = numeral(String(value).replaceAll('(', '').replaceAll(')', '')).multiply(sign).value()
                    if (parsedValue === null || isNaN(parsedValue)) continue
                    dup[key] = parsedValue
                    Total += parsedValue
                }
            }
            dup.Total = Total
            return dup
        })
    return { tickers, parsedData }
}

export const cleanFlow = (rawFlow: string | number | undefined) => (isNaN(Number(rawFlow)) ? 0 : Number(rawFlow))
