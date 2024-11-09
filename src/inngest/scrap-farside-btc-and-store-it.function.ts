import dayjs from 'dayjs'
import { inngest } from './client'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { Bot } from 'grammy'
import { APP_METADATA } from '@/config/app.config'
import { cleanFlow, enrichFarsideJson, getFarsideTableDataAsJson } from '@/utils'
import numeral from 'numeral'
import prisma from '@/server/prisma'

// helpers
dayjs.extend(utc)
dayjs.extend(timezone)
const format = "hh:mm'ss A"
const timestamp = () => dayjs.utc().format(format)

// telegram
const token = process.env.TELEGRAM_BOT_TOKEN
if (!token) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.')
const channelId = String(process.env.TELEGRAM_CHANNEL_ID)
if (!channelId) throw new Error('TELEGRAM_CHANNEL_ID environment variable not found.')

// -
const root = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : APP_METADATA.SITE_URL
const pageToScrap = 'https://farside.co.uk/bitcoin-etf-flow-all-data/'

export const scrapFarsideBtcAndStoreIt = inngest.createFunction(
    { id: 'scrap-farside-btc-and-store-it' },
    { cron: 'TZ=Europe/Paris */15 * * * *' }, // https://crontab.guru/every-1-hour
    async ({ event, step }) => {
        // debug
        const debug = false

        // html
        const { htmlContent } = await step.run('1. Scrap farside', async () => {
            const endpoint = `${root}/api/proxy?url=${encodeURIComponent(pageToScrap)}`
            if (debug) console.log({ endpoint })
            const response = await fetch(endpoint, { method: 'GET', headers: { Accept: 'text/html', 'User-Agent': 'Mozilla/5.0' } })
            if (!response.ok) throw new Error(`Failed to fetch text/html of ${pageToScrap}`)
            const htmlContent = await response.text()
            return { htmlContent }
        })

        // json
        const { json } = await step.run('2. Parse html content to json', async () => {
            const json = getFarsideTableDataAsJson(htmlContent)
            return { json }
        })

        // debug
        if (debug) console.log(`2. Scrapped ${json.length} entries`)

        // parse
        const { parsedData } = enrichFarsideJson(json)

        // prevent further processing
        if (!parsedData.length)
            return {
                event,
                body: `Done at ${timestamp()} UTC - empty data`,
            }

        // debug
        const latestDaysFlows = parsedData.slice(-5)
        for (let dayIndex = 0; dayIndex < latestDaysFlows.length; dayIndex++) {
            const dayData = latestDaysFlows[dayIndex]
            const day = dayjs(dayData.Date).format('ddd DD MMM YYYY')
            const xata_id = `${day}`.toLowerCase().replaceAll(' ', '-')
            const close_of_bussiness_hour = dayjs.utc(dayData.Date).hour(17).toDate()
            if (debug) console.log({ dayData })

            // xata
            await step.run(`3. Upsert ${xata_id} in xata`, async () => {
                return await prisma.flows.upsert({
                    where: { xata_id },
                    update: {
                        day,
                        close_of_bussiness_hour,
                        IBIT: cleanFlow(dayData.IBIT),
                        FBTC: cleanFlow(dayData.FBTC),
                        BITB: cleanFlow(dayData.BITB),
                        ARKB: cleanFlow(dayData.ARKB),
                        BTCO: cleanFlow(dayData.BTCO),
                        EZBC: cleanFlow(dayData.EZBC),
                        BRRR: cleanFlow(dayData.BRRR),
                        HODL: cleanFlow(dayData.HODL),
                        BTCW: cleanFlow(dayData.BTCW),
                        GBTC: cleanFlow(dayData.GBTC),
                        BTC: cleanFlow(dayData.BTC),
                        total: cleanFlow(dayData.Total),
                        raw: dayData,
                    },
                    create: {
                        xata_id,
                        day,
                        close_of_bussiness_hour,
                        IBIT: cleanFlow(dayData.IBIT),
                        FBTC: cleanFlow(dayData.FBTC),
                        BITB: cleanFlow(dayData.BITB),
                        ARKB: cleanFlow(dayData.ARKB),
                        BTCO: cleanFlow(dayData.BTCO),
                        EZBC: cleanFlow(dayData.EZBC),
                        BRRR: cleanFlow(dayData.BRRR),
                        HODL: cleanFlow(dayData.HODL),
                        BTCW: cleanFlow(dayData.BTCW),
                        GBTC: cleanFlow(dayData.GBTC),
                        BTC: cleanFlow(dayData.BTC),
                        total: cleanFlow(dayData.Total),
                        raw: dayData,
                    },
                })
            })
        }

        // telegram
        // todo notify only if new flows total !== prev flows total
        await step.run('4. Notify telegram', async () => {
            const before = Date.now()
            const bot = new Bot(token)
            const chatId = channelId
            const { Total: total, ...flows } = parsedData[parsedData.length - 1]
            const day = dayjs(parsedData[parsedData.length - 1].Date).format('ddd DD MMM YYYY')
            const xata_id = `${day}`.toLowerCase().replaceAll(' ', '-')
            const env = String(process.env.NODE_ENV).toLowerCase() === 'production' ? 'Prod' : 'Dev'
            const message = [
                `<u><b>Data updated</b></u>`,
                `Time: ${timestamp()} UTC`,
                `Trigger: ${event.data?.cron ?? 'invoked'} (${env})`,
                `Action: upserted <b>${xata_id}</b>`,
                total ? `<pre>${JSON.stringify(flows)}</pre>` : null,
                `Flows: ${numeral(total).format('0,0')} m$`,
            ]
                .filter((line) => !!line)
                .join('\n')
            await bot.api.sendMessage(chatId, message, { parse_mode: 'HTML' })
            const after = Date.now()
            return { ms: after - before }
        })

        // finally
        return {
            event,
            body: `Done at ${timestamp()} UTC`,
        }
    },
)
