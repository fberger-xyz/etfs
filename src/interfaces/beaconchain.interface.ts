export interface IBeaconchainEpochData {
    attestationscount: number
    attesterslashingscount: number
    averagevalidatorbalance: number
    blockscount: number
    depositscount: number
    eligibleether: number
    epoch: number
    finalized: boolean
    globalparticipationrate: number
    missedblocks: number
    orphanedblocks: number
    proposedblocks: number
    proposerslashingscount: number
    rewards_exported: boolean
    scheduledblocks: number
    totalvalidatorbalance: number
    ts: string
    validatorscount: number
    voluntaryexitscount: number
    votedether: number
    withdrawalcount: number
}

export interface IBeaconchainQueueData {
    beaconchain_entering: number
    beaconchain_exiting: number
    validatorscount: number
}

export interface IBeaconchainAPRData {
    apr: number
    avgapr31d: number
    avgapr7d: number
    avgconsensus_rewards31d_wei: number
    avgconsensus_rewards7d_wei: number
    avgtx_fees31d_wei: number
    avgtx_fees7d_wei: number
    cl_apr: number
    cl_avgapr31d: number
    cl_avgapr7d: number
    consensus_rewards_sum_wei: number
    day: number
    day_end: string
    day_start: string
    deposits_sum_wei: number
    effective_balances_sum_wei: number
    el_apr: number
    el_avgapr31d: number
    el_avgapr7d: number
    end_balances_sum_wei: number
    start_balances_sum_wei: number
    total_rewards_wei: number
    tx_fees_sum_wei: number
}
