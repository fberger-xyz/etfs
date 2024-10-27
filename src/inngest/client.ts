import { APP_METADATA } from '@/config/app.config'
import { Inngest } from 'inngest'

if (!process.env.INGEST_CLIENT_ID) throw new Error(`value not found for INGEST_CLIENT_ID: ${process.env.INGEST_CLIENT_ID}`)
export const inngest = new Inngest({
    id: String(process.env.INGEST_CLIENT_ID) ?? APP_METADATA.SITE_NAME,
    env: process.env.INGEST_BRANCH,
})
