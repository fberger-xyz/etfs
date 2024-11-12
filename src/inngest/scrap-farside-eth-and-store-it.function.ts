import dayjs from 'dayjs'
import { inngest } from './client'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
// import { Bot } from 'grammy'
import { APP_METADATA } from '@/config/app.config'
import { cleanFlow, enrichEthFarsideJson, getEthFarsideTableDataAsJson } from '@/utils'
// import numeral from 'numeral'
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
const pageToScrap = 'https://farside.co.uk/ethereum-etf-flow-all-data/'

export const scrapFarsideEthAndStoreIt = inngest.createFunction(
    { id: 'scrap-farside-eth-and-store-it' },
    { cron: 'TZ=Europe/Paris */15 * * * *' }, // https://crontab.guru/every-1-hour
    async ({ event, step }) => {
        // debug
        const debug = false

        // html
        const { htmlContent } = await step.run('1. ETH | Scrap farside', async () => {
            const endpoint = `${root}/api/proxy?url=${encodeURIComponent(pageToScrap)}`
            // if (debug) console.log({ endpoint })
            const response = await fetch(endpoint, { method: 'GET', headers: { Accept: 'text/html', 'User-Agent': 'Mozilla/5.0' } })
            if (!response.ok) throw new Error(`Failed to fetch text/html of ${pageToScrap}`)
            const htmlContent = await response.text()
            return { htmlContent }
        })

        // json
        const { json } = await step.run('2. ETH | Parse html content to json', async () => {
            const json = getEthFarsideTableDataAsJson(htmlContent)
            return { json }
        })
        if (debug) console.log({ json })

        // debug
        if (debug) console.log(`2. Scrapped ${json.length} entries`)

        // parse
        const { parsedData } = enrichEthFarsideJson(json)
        if (debug) console.log({ parsedData })

        // prevent further processing
        if (!parsedData.length)
            return {
                event,
                body: `Done at ${timestamp()} UTC - empty data`,
            }

        // debug
        // const latestDaysFlows = parsedData.slice(-5)
        const latestDaysFlows = parsedData
        const dbChanges: { xata_id: string; dayIsNew: boolean; prevTotal: null | number; newTotal: null | number; dataToPush: string }[] = []
        for (let dayIndex = 0; dayIndex < latestDaysFlows.length; dayIndex++) {
            const dayData = latestDaysFlows[dayIndex]
            const day = dayjs(dayData.Date).format('ddd DD MMM YYYY')
            const xata_id = String(day).toLowerCase().replaceAll(' ', '-')
            const close_of_bussiness_hour = dayjs(dayData.Date).hour(17).toDate()
            if (debug) console.log({ dayData })

            // xata
            const change = await step.run(`3. ETH | Upsert ${xata_id} in xata`, async () => {
                // check new day
                const existingDayData = await prisma.ethFlows.findFirst({ where: { xata_id } })

                // prepare
                const dataToPush = {
                    ETHA: cleanFlow(dayData.ETHA),
                    FETH: cleanFlow(dayData.FETH),
                    ETHW: cleanFlow(dayData.ETHW),
                    CETH: cleanFlow(dayData.CETH),
                    ETHV: cleanFlow(dayData.ETHV),
                    QETH: cleanFlow(dayData.QETH),
                    EZET: cleanFlow(dayData.EZET),
                    ETHE: cleanFlow(dayData.ETHE),
                    ETH: cleanFlow(dayData.ETH),
                }

                // push
                await prisma.ethFlows.upsert({
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
                    xata_id,
                    dayIsNew: !existingDayData,
                    prevTotal: existingDayData?.total ?? null,
                    newTotal: cleanFlow(dayData.Total),
                    dataToPush: JSON.stringify(dataToPush),
                }
            })

            // store change
            dbChanges.push(change)
        }

        // debug
        console.log({ dbChanges })

        // telegram
        // const before = Date.now()
        // const bot = new Bot(token)
        // const chatId = channelId
        // const env = String(process.env.NODE_ENV).toLowerCase() === 'production' ? 'Prod' : 'Dev'
        // for (let changeIndex = 0; changeIndex < dbChanges.length; changeIndex++) {
        //     const { xata_id, dayIsNew, newTotal: total, dataToPush: flows } = dbChanges[changeIndex]
        //     if (!dayIsNew) continue // do not notify prev days
        //     if (dbChanges[changeIndex].dataToPush === dbChanges[changeIndex].dataToPush) continue // do not push twice the same notif
        //     await step.run(`4. ETH | Notify telegram for ${xata_id} new total`, async () => {
        //         const message = [
        //             `<u><b>New flows update</b></u>`,
        //             // `Time: ${timestamp()} UTC`, // redundant w/ hour displayed at bottom of message
        //             `Trigger: ${event.data?.cron ?? 'invoked'} (${env})`,
        //             // `Action: upserted <b>${xata_id}</b>`,
        //             total ? `<pre>${flows}</pre>` : null,
        //             `Flows: ${numeral(total).format('0,0')} m$`,
        //         ]
        //             .filter((line) => !!line)
        //             .join('\n')
        //         await bot.api.sendMessage(chatId, message, { parse_mode: 'HTML' })
        //         const after = Date.now()
        //         return { ms: after - before }
        //     })
        // }

        // finally
        return {
            event,
            body: `Done at ${timestamp()} UTC`,
        }
    },
)
