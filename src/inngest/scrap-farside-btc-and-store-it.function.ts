import dayjs from 'dayjs'
import { inngest } from './client'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { PrismaClient } from '@prisma/client'
import { Bot } from 'grammy'
import { APP_METADATA } from '@/config/app.config'
import { enrichFarsideJson, getFarsideTableDataAsJson } from '@/utils'
import numeral from 'numeral'

// helpers
dayjs.extend(utc)
dayjs.extend(timezone)
const format = 'D MMMM YYYY hh:mm:ss A'
const timestamp = () => dayjs.utc().format(format)

// telegram
const token = process.env.TELEGRAM_BOT_TOKEN
if (!token) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.')
const channelId = String(process.env.TELEGRAM_CHANNEL_ID)
if (!channelId) throw new Error('TELEGRAM_CHANNEL_ID environment variable not found.')

// prisma
const prisma = new PrismaClient()

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
            const response = await fetch(`${root}/api/proxy?url=${encodeURIComponent(pageToScrap)}`, {
                method: 'GET',
                headers: { Accept: 'text/html', 'User-Agent': 'Mozilla/5.0' },
            })
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
        const latestDayFlows = parsedData[parsedData.length - 1]
        if (debug) console.log({ latestDayFlows })

        // xata
        const pushToXata = await step.run('3. Push to xata', async () => {
            const day = dayjs(latestDayFlows.Date).format('ddd DD MMM YYYY')
            const records = await prisma.days.findMany({ where: { day } })
            const xata_id = `${day}`.toLowerCase().replaceAll(' ', '-')
            const output: { action: string; record: unknown } = { action: 'unknown ', record: null }
            if (records.length) {
                output.record = await prisma.days.update({ where: { xata_id: records[0].xata_id }, data: { flows: latestDayFlows } })
                output.action = 'updated'
            } else {
                output.record = await prisma.days.create({ data: { xata_id, day, flows: latestDayFlows } })
                output.action = 'created'
            }
            return output
        })

        // telegram
        await step.run('4. Notify telegram', async () => {
            const before = Date.now()
            const bot = new Bot(token)
            const chatId = channelId
            const { Date: date, Total: total, ...flows } = latestDayFlows

            const lines = [
                `<u><b>Better Farside update</b></u>`,
                `Timestamp: ${timestamp()} UTC`,
                `Trigger: ${event.data?.cron ?? 'invoked'} (${process.env.NODE_ENV})`,
                `Action: ${pushToXata.action} <b>${date}</b> entry`,
                `<pre>${JSON.stringify(flows)}</pre>`,
                `Total: ${numeral(total).format('0,0')} m$`,
            ]
            const message = lines.join('\n')
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
