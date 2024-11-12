import { BtcETFsTickers, EthETFsTickers } from '@/enums'
import { EthFlows, Flows } from '@prisma/client'

export type ETFsTickers = BtcETFsTickers | EthETFsTickers | string
export type FarsideRawData = Record<ETFsTickers, string | number> & {
    Date: string | number
    Total: string | number
    rank?: number
}
export type FarsideFlows = Flows & EthFlows
