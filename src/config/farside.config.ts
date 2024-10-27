import { EtfTickers } from '@/enums'

export const ETF_TICKERS_CONFIG: Record<EtfTickers, { index: number; provider: string; colors: { light: string; dark: string }; url: string }> = {
    [EtfTickers.IBIT]: {
        provider: 'Blackrock',
        index: 0,
        colors: { light: '#616161', dark: '#616161' },
        url: 'https://www.blackrock.com/us/individual/products/333011/ishares-bitcoin-trust',
    }, // #ffffff #efefef #ffce00 > #68a230 #9062bc > #616161 > #000000
    [EtfTickers.FBTC]: {
        provider: 'Fidelity',
        index: 1,
        colors: { light: '#368727', dark: '#368727' },
        url: 'https://institutional.fidelity.com/advisors/investment-solutions/asset-classes/alternatives/fidelity-wise-origin-bitcoin-fund',
    },
    [EtfTickers.BITB]: { provider: 'Bitwise', index: 2, colors: { light: '#22c96a', dark: '#22c96a' }, url: 'https://bitbetf.com/' }, // #11181c // #22c96a
    [EtfTickers.ARKB]: { provider: 'Ark', index: 3, colors: { light: '#8264FF', dark: '#8264FF' }, url: 'https://www.ark-funds.com/funds/arkb/' },
    [EtfTickers.BTCO]: {
        provider: 'Invesco',
        index: 4,
        colors: { light: '#000AD2', dark: '#000AD2' },
        url: 'https://www.invesco.com/us/financial-products/etfs/product-detail?audienceType=Advisor&ticker=BTCO',
    },
    [EtfTickers.EZBC]: {
        provider: 'Franklin',
        index: 5,
        colors: { light: '#b3d4fc', dark: '#b3d4fc' },
        url: 'https://www.franklintempleton.com/strategies/bitcoin-etf',
    },
    [EtfTickers.BRRR]: { provider: 'Valkyrie', index: 6, colors: { light: '#cfff24', dark: '#cfff24' }, url: 'https://coinshares.com/us/etf/brrr/' },
    [EtfTickers.HODL]: {
        provider: 'VanEck',
        index: 7,
        colors: { light: '#17468F', dark: '#17468F' },
        url: 'https://www.vaneck.com/us/en/investments/bitcoin-etf-hodl/overview/',
    },
    [EtfTickers.BTCW]: {
        provider: 'WTree',
        index: 8,
        colors: { light: '#05a9b1', dark: '#05a9b1' },
        url: 'https://www.wisdomtree.com/investments/etfs/crypto/btcw',
    },
    [EtfTickers.GBTC]: {
        provider: 'Grayscale Bitcoin Trust',
        index: 9,
        colors: { light: '#c5bfe4', dark: '#c5bfe4' },
        url: 'https://etfs.grayscale.com/gbtc',
    },
    [EtfTickers.BTC]: { provider: 'Grayscale BTC', index: 10, colors: { light: '#c5bfe4', dark: '#c5bfe4' }, url: 'https://etfs.grayscale.com/btc' },
}
