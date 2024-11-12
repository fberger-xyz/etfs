import { ETF_TICKERS_CONFIG, ETH_ETF_TICKERS_CONFIG } from '@/config/farside.config'
import { AppThemes, EtfTickers, EthEtfTickers } from '@/enums'
import { EthFarsideRawData, FarsideRawData } from '@/interfaces'
import * as cheerio from 'cheerio'
import dayjs from 'dayjs'
import numeral from 'numeral'

export const monthName = (monthIndex: number) =>
    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][monthIndex]

export const cleanFlow = (rawFlow: string | number | undefined) => (isNaN(Number(rawFlow)) ? 0 : Number(rawFlow))
/**
 * BTC
 */

export const getConfig = (ticker: EtfTickers | string) =>
    ticker in EtfTickers
        ? ETF_TICKERS_CONFIG[ticker as EtfTickers]
        : {
              provider: ticker,
              index: Object.keys(ETF_TICKERS_CONFIG).length,
              colors: { [AppThemes.LIGHT]: 'black', [AppThemes.DARK]: 'white' },
              url: '/',
          }

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

/**
 * ETH
 */

export const getEthConfig = (ticker: EthEtfTickers | string) =>
    ticker in EthEtfTickers
        ? ETH_ETF_TICKERS_CONFIG[ticker as EthEtfTickers]
        : {
              provider: ticker,
              index: Object.keys(ETH_ETF_TICKERS_CONFIG).length,
              colors: { [AppThemes.LIGHT]: 'black', [AppThemes.DARK]: 'white' },
              url: '/',
          }

export const getEthFarsideTableDataAsJson = (htmlContent: string): EthFarsideRawData[] => {
    const parsedHtml = cheerio.load(htmlContent)
    const table = parsedHtml('table.etf')
    const headers: string[] = ['Date']
    table
        .find('tr')
        .eq(1) // extract headers from the second header row only (skip empty first row)
        .find('th')
        .each((_, element) => {
            headers.push(parsedHtml(element).text().trim())
        })
    const rows: string[][] = []
    table.find('tbody tr').each((_, row) => {
        const rowData: string[] = []
        parsedHtml(row)
            .find('td')
            .each((_, cell) => {
                const cellText = parsedHtml(cell).find('span').first().text().trim()
                rowData.push(cellText)
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
    return tableData as unknown as EthFarsideRawData[]
}

export const enrichEthFarsideJson = (rawData: EthFarsideRawData[]) => {
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
