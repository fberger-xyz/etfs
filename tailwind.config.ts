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
                'light-border': 'var(--color-light-border)',
            },
        },
    },
    plugins: [],
}
export default config
