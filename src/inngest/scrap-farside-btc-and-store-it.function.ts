import dayjs from 'dayjs'
import { inngest } from './client'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { PrismaClient } from '@prisma/client'
// import { Bot } from 'grammy'
import { APP_METADATA } from '@/config/app.config'
import { getFarsideTableDataAsJson } from '@/utils'

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

        // console.log({ htmlContent })

        // json
        const { json } = await step.run('2. Parse html content to json', async () => {
            const json = getFarsideTableDataAsJson(htmlContent)
            return { json }
        })

        console.log(json.length)

        // xata
        const upsert = await step.run('3. Upsert to xata', async () => {
            return await prisma.days.createMany({
                data: json,
            })
        })

        console.log({ upsert })

        // telegram
        // const { ms: telegramMs } = await step.run('5. Notify execution', async () => {
        //     const before = Date.now()
        //     const bot = new Bot(token)
        //     const chatId = channelId
        //     const lines = [
        //         `<u><b>Beaconchain Snapshot</b></u>`,
        //         `${timestamp()} UTC`,
        //         `Epoch: ${epochMs}ms ; Queue: ${queueMs}ms ; APR: ${aprMs}ms ; Xata: ${xataMs}ms`,
        //         `Trigger: ${event.data?.cron ?? 'invoked'} (${process.env.NODE_ENV})`,
        //         `<a href="https://x.com/fran6brg">@fran6brg</a>`,
        //     ]
        //     const message = lines.join('\n')
        //     await bot.api.sendMessage(chatId, message, { parse_mode: 'HTML' })
        //     const after = Date.now()
        //     return { ms: after - before }
        // })

        // finally
        return {
            event,
            body: `Done at ${timestamp()} UTC`,
        }
    },
)
