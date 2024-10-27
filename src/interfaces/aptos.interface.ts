export interface EventsData {
    block_height: string
    block_hash: string
    block_timestamp: string
    first_version: string
    last_version: string
    transactions: Transaction[]
}

interface Transaction {
    version: string
    hash: string
    state_change_hash: string
    event_root_hash: string
    state_checkpoint_hash: null | string
    gas_used: string
    success: boolean
    vm_status: string
    accumulator_root_hash: string
    changes: (Change | Changes2 | Changes3)[]
    id?: string
    epoch?: string
    round?: string
    events?: Event[]
    previous_block_votes_bitvec?: number[]
    proposer?: string
    failed_proposer_indices?: unknown[]
    timestamp: string
    type: string
    sender?: string
    sequence_number?: string
    max_gas_amount?: string
    gas_unit_price?: string
    expiration_timestamp_secs?: string
    payload?: Payload
    signature?: Signature
}

interface Signature {
    sender?: Sender
    secondary_signer_addresses?: unknown[]
    secondary_signers?: unknown[]
    fee_payer_address?: string
    fee_payer_signer?: Sender
    type: string
    public_key?: string
    signature?: string
}

interface Sender {
    public_key: string
    signature: string
    type: string
}

interface Payload {
    function: string
    type_arguments: string[]
    arguments: (string[] | Metadata | number | string | string | string)[]
    type: string
}

interface Event {
    guid: Guid2
    sequence_number: string
    // type: string
    data: Data7
}

interface Data7 {
    epoch?: string
    failed_proposer_indices?: unknown[]
    hash?: string
    height?: string
    previous_block_votes_bitvec?: string
    proposer?: string
    round?: string
    time_microseconds?: string
    amount?: string
    store?: string
    execution_gas_units?: string
    io_gas_units?: string
    storage_fee_octas?: string
    storage_fee_refund_octas?: string
    total_charge_gas_units?: string
    custodian_id?: string
    market_id?: string
    order_id?: string
    reason?: number
    user?: string
    integrator?: string
    price?: string
    remaining_size?: string
    restriction?: number
    self_match_behavior?: number
    side?: boolean
    size?: string
    damage?: string
}

interface Guid2 {
    creation_number: string
    account_address: string
}

interface Changes3 {
    address: string
    state_key_hash: string
    data: Data6
    type: string
}

interface Data6 {
    type: string
    data: Data5
}

interface Data5 {
    epoch_interval?: string
    height?: string
    new_block_events?: Coinregisterevents
    update_epoch_interval_events?: Coinregisterevents
    validators?: Validator[]
    microseconds?: string
    epoch?: string
    round?: string
    seed?: Seed
}

interface Seed {
    vec: string[]
}

interface Validator {
    failed_proposals: string
    successful_proposals: string
}

interface Changes2 {
    address?: string
    state_key_hash: string
    data: Datum2 | Datum | Data22 | Data42 | null
    type: string
    handle?: string
    key?: string
    value?: string
}

interface Data42 {
    type: string
    data: Data4
}

interface Data4 {
    allow_ungated_transfer: boolean
    guid_creation_num: string
    owner: string
    transfer_events: Coinregisterevents
}

interface Datum2 {
    type: string
    data: Data3
}

interface Data3 {
    balance: string
    frozen: boolean
    metadata: Metadata
}

interface Metadata {
    inner: string
}

interface Change {
    address?: string
    state_key_hash: string
    data: Datum | Data22 | null
    type: string
    handle?: string
    key?: string
    value?: string
}

interface Data22 {
    type: string
    data: Data2
}

interface Data2 {
    coin: Coin
    deposit_events: Coinregisterevents
    frozen: boolean
    withdraw_events: Coinregisterevents
}

interface Coin {
    value: string
}

interface Datum {
    type: string
    data: Data
}

interface Data {
    authentication_key: string
    coin_register_events: Coinregisterevents
    guid_creation_num: string
    key_rotation_events: Coinregisterevents
    rotation_capability_offer: Rotationcapabilityoffer
    sequence_number: string
    signer_capability_offer: Rotationcapabilityoffer
}

interface Rotationcapabilityoffer {
    for: For
}

interface For {
    vec: unknown[]
}

interface Coinregisterevents {
    counter: string
    guid: Guid
}

interface Guid {
    id: Id
}

interface Id {
    addr: string
    creation_num: string
}
