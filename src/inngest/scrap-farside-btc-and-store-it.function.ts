import dayjs from 'dayjs'
import { inngest } from './client'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { Bot } from 'grammy'
import { APP_METADATA } from '@/config/app.config'
import { cleanFlow, enrichFarsideJson, getFarsideTableDataAsJson, prepareDate } from '@/utils'
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

        /**
         * html
         */

        const { htmlContent } = await step.run('1. [BTC] Scrap farside', async () => {
            const endpoint = `${root}/api/proxy?url=${encodeURIComponent(pageToScrap)}`
            if (debug) console.log({ endpoint })
            const response = await fetch(endpoint, { method: 'GET', headers: { Accept: 'text/html', 'User-Agent': 'Mozilla/5.0' } })
            if (!response.ok) throw new Error(`Failed to fetch text/html of ${pageToScrap}`)
            const htmlContent = await response.text()
            return { htmlContent }
        })

        /**
         * json
         */

        const { json } = await step.run('2. [BTC] Parse html content to json', async () => {
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

        /**
         * xata
         */

        const dbChanges: { day: string; xata_id: string; prevTotal: null | number; newTotal: null | number; dataToPush: string }[] = []
        const latestDaysFlows = parsedData.slice(-5)
        for (let dayIndex = 0; dayIndex < latestDaysFlows.length; dayIndex++) {
            const dayData = latestDaysFlows[dayIndex]
            const { day, xata_id, close_of_bussiness_hour, isTodayOrYesterday } = prepareDate(dayData.Date)
            dayjs(dayData.Date).hour(17).toDate()
            if (debug) console.log({ dayData })

            // xata
            const change = await step.run(`3. [BTC] Upsert ${xata_id} in xata`, async () => {
                // check new day
                const existingDayData = await prisma.flows.findFirst({ where: { xata_id } })

                // prepare
                const dataToPush = {
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
                }

                // push
                await prisma.flows.upsert({
                    where: { xata_id },
                    update: { day, close_of_bussiness_hour, ...dataToPush, total: cleanFlow(dayData.Total), raw: dayData },
                    create: {
                        xata_id,
                        day,
                        close_of_bussiness_hour,
                        ...dataToPush,
                        total: cleanFlow(dayData.Total),
                        raw: dayData,
                    },
                })

                // store change
                return {
                    day,
                    xata_id,
                    prevTotal: existingDayData?.total ?? null,
                    newTotal: cleanFlow(dayData.Total),
                    dataToPush: JSON.stringify(dataToPush),
                }
            })

            // store change
            if (isTodayOrYesterday && !dbChanges.some((otherChange) => otherChange.xata_id === change.xata_id)) dbChanges.push(change)
        }

        /**
         * telegram
         */

        const bot = new Bot(token)
        const chatId = channelId
        let notificationsCount = 0
        const env = String(process.env.NODE_ENV).toLowerCase() === 'production' ? 'Prod' : 'Dev'
        for (let changeIndex = 0; changeIndex < dbChanges.length; changeIndex++) {
            const { day, xata_id, prevTotal, newTotal, dataToPush: flows } = dbChanges[changeIndex]
            if (prevTotal !== newTotal) {
                notificationsCount += 1
                await step.run(`4. [BTC] Notify telegram for ${xata_id} new total`, async () => {
                    const message = [
                        `₿ ETFs flows update`,
                        `<b>${day}</b>`,
                        event.data?.cron ? null : `Trigger: invoked (${env})`,
                        newTotal ? `<pre>${flows}</pre>` : null,
                        `Flows: ${numeral(newTotal).format('0,0.00')} m$`,
                    ]
                        .filter((line) => !!line)
                        .join('\n')
                    await bot.api.sendMessage(chatId, message, { parse_mode: 'HTML' })
                })
            }
        }

        if (!notificationsCount)
            await step.run(`5. [BTC] Notify telegram for cron job execution`, async () => {
                await bot.api.sendMessage(chatId, `₿ ETFs flows scrapped - no update`, { parse_mode: 'HTML' })
            })

        // finally
        return {
            event,
            body: `Done at ${timestamp()} UTC`,
        }
    },
)
