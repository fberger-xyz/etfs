import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                discreet: 'var(--color-discreet)',
                inactive: 'var(--color-inactive)',
                background: 'var(--color-background)',
                'light-hover': 'var(--color-light-hover)',
                'very-light-hover': 'var(--color-very-light-hover)',
                'light-border': 'var(--color-light-border)',

                // tickers
                ibit: 'var(--color-ibit)',
                fbtc: 'var(--color-fbtc)',
                bitb: 'var(--color-bitb)',
                arkb: 'var(--color-arkb)',
                btco: 'var(--color-btco)',
                ezbc: 'var(--color-ezbc)',
                brrr: 'var(--color-brrr)',
                hodl: 'var(--color-hodl)',
                btcw: 'var(--color-btcw)',
                gbtc: 'var(--color-gbtc)',
                btc: 'var(--color-btc)',
            },
        },
    },
    plugins: [],
}
export default config
