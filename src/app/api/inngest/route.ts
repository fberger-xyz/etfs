import { inngest } from '@/inngest/client'
import { scrapFarsideBtcAndStoreIt } from '@/inngest/scrap-farside-btc-and-store-it.function'
import { scrapFarsideEthAndStoreIt } from '@/inngest/scrap-farside-eth-and-store-it.function'
import { serve } from 'inngest/next'

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [scrapFarsideBtcAndStoreIt, scrapFarsideEthAndStoreIt],
    streaming: 'allow',
})
