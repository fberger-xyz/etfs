import { AppThemes, ETFs, BtcETFsTickers, EthETFsTickers } from '@/enums'
import { ETFsTickers } from '@/interfaces';

export const ETFS_TICKERS_CONFIG: Record<
    ETFs,
    Record<ETFsTickers, { index: number; provider: string; colors: Record<AppThemes, string>; url: string }>
> = {
    [ETFs.BTC]: {
        [BtcETFsTickers.IBIT]: {
            provider: 'Blackrock',
            index: 0,
            colors: { [AppThemes.LIGHT]: '#616161', [AppThemes.DARK]: '#616161' },
            url: 'https://www.blackrock.com/us/individual/products/333011/ishares-bitcoin-trust',
        }, // #ffffff #efefef #ffce00 > #68a230 #9062bc > #616161 > #000000
        [BtcETFsTickers.FBTC]: {
            provider: 'Fidelity',
            index: 1,
            colors: { [AppThemes.LIGHT]: '#368727', [AppThemes.DARK]: '#368727' },
            url: 'https://institutional.fidelity.com/advisors/investment-solutions/asset-classes/alternatives/fidelity-wise-origin-bitcoin-fund',
        },
        [BtcETFsTickers.BITB]: {
            provider: 'Bitwise',
            index: 2,
            colors: { [AppThemes.LIGHT]: '#22c96a', [AppThemes.DARK]: '#22c96a' },
            url: 'https://bitbetf.com/',
        }, // #11181c // #22c96a
        [BtcETFsTickers.ARKB]: {
            provider: 'Ark',
            index: 3,
            colors: { [AppThemes.LIGHT]: '#8264FF', [AppThemes.DARK]: '#8264FF' },
            url: 'https://www.ark-funds.com/funds/arkb/',
        },
        [BtcETFsTickers.BTCO]: {
            provider: 'Invesco',
            index: 4,
            colors: { [AppThemes.LIGHT]: '#000AD2', [AppThemes.DARK]: '#6366f1' },
            url: 'https://www.invesco.com/us/financial-products/etfs/product-detail?audienceType=Advisor&ticker=BTCO',
        },
        [BtcETFsTickers.EZBC]: {
            provider: 'Franklin',
            index: 5,
            colors: { [AppThemes.LIGHT]: '#2563eb', [AppThemes.DARK]: '#b3d4fc' },
            url: 'https://www.franklintempleton.com/strategies/bitcoin-etf',
        },
        [BtcETFsTickers.BRRR]: {
            provider: 'Valkyrie',
            index: 6,
            colors: { [AppThemes.LIGHT]: '#242428', [AppThemes.DARK]: '#cfff24' },
            url: 'https://coinshares.com/us/etf/brrr/',
        },
        [BtcETFsTickers.HODL]: {
            provider: 'VanEck',
            index: 7,
            colors: { [AppThemes.LIGHT]: '#17468F', [AppThemes.DARK]: '#1d4ed8' },
            url: 'https://www.vaneck.com/us/en/investments/bitcoin-etf-hodl/overview/',
        },
        [BtcETFsTickers.BTCW]: {
            provider: 'WTree',
            index: 8,
            colors: { [AppThemes.LIGHT]: '#05a9b1', [AppThemes.DARK]: '#05a9b1' },
            url: 'https://www.wisdomtree.com/investments/etfs/crypto/btcw',
        },
        [BtcETFsTickers.GBTC]: {
            provider: 'Grayscale Bitcoin Trust',
            index: 9,
            colors: { [AppThemes.LIGHT]: '#5b21b6', [AppThemes.DARK]: '#c5bfe4' },
            url: 'https://etfs.grayscale.com/gbtc',
        },
        [BtcETFsTickers.BTC]: {
            provider: 'Grayscale BTC',
            index: 10,
            colors: { [AppThemes.LIGHT]: '#5b21b6', [AppThemes.DARK]: '#c5bfe4' },
            url: 'https://etfs.grayscale.com/btc',
        },
    },
    [ETFs.ETH]: {
        [EthETFsTickers.ETHA]: {
            provider: 'Blackrock',
            index: 0,
            colors: { [AppThemes.LIGHT]: '#616161', [AppThemes.DARK]: '#616161' },
            url: 'https://www.blackrock.com/us/individual/products/337614/ishares-ethereum-trust-etf',
        },
        [EthETFsTickers.FETH]: {
            provider: 'Fidelity',
            index: 1,
            colors: { [AppThemes.LIGHT]: '#368727', [AppThemes.DARK]: '#368727' },
            url: 'https://institutional.fidelity.com/advisors/investment-solutions/asset-classes/alternatives/fidelity-ethereum-fund',
        },
        [EthETFsTickers.ETHW]: {
            provider: 'Bitwise',
            index: 2,
            colors: { [AppThemes.LIGHT]: '#22c96a', [AppThemes.DARK]: '#22c96a' },
            url: 'https://bitbetf.com/',
        }, // #11181c // #22c96a
        [EthETFsTickers.CETH]: {
            provider: '21 Shares',
            index: 3,
            colors: { [AppThemes.LIGHT]: '#d97706', [AppThemes.DARK]: '#eda820' },
            url: 'https://www.21shares.com/en-us/product/ceth',
        },
        [EthETFsTickers.ETHV]: {
            provider: 'VanEck',
            index: 4,
            colors: { [AppThemes.LIGHT]: '#17468F', [AppThemes.DARK]: '#1d4ed8' },
            url: 'https://www.vaneck.com/us/en/investments/ethereum-etf-ethv/overview/',
        },
        [EthETFsTickers.QETH]: {
            provider: 'Invesco',
            index: 5,
            colors: { [AppThemes.LIGHT]: '#000AD2', [AppThemes.DARK]: '#6366f1' },
            url: 'https://www.invesco.com/us/financial-products/etfs/product-detail?audienceType=Advisor&ticker=QETH',
        },
        [EthETFsTickers.EZET]: {
            provider: 'Franklin',
            index: 6,
            colors: { [AppThemes.LIGHT]: '#2563eb', [AppThemes.DARK]: '#b3d4fc' },
            url: 'https://www.franklintempleton.com/strategies/franklin-ethereum-etf-ezet',
        },
        [EthETFsTickers.ETHE]: {
            provider: 'Grayscale ETHE',
            index: 7,
            colors: { [AppThemes.LIGHT]: '#05a9b1', [AppThemes.DARK]: '#05a9b1' },
            url: 'https://etfs.grayscale.com/ethe',
        },
        [EthETFsTickers.ETH]: {
            provider: 'Grayscale ETH',
            index: 8,
            colors: { [AppThemes.LIGHT]: '#5b21b6', [AppThemes.DARK]: '#c5bfe4' },
            url: 'https://etfs.grayscale.com/eth',
        },
    },
}
