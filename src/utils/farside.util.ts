import { ETF_TICKERS_CONFIG } from '@/config/farside.config'
import { AppThemes, EtfTickers } from '@/enums'
import * as cheerio from 'cheerio'

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

export const getFarsideTableDataAsJson = (htmlContent: string) => {
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
    return tableData
}
