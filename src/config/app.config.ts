import { AppThemes, IconIds } from '@/enums'

export const APP_METADATA = {
    SITE_AUTHOR: 'fberger.xyz',
    SITE_NAME: 'Crypto ETFs | fberger.xyz',
    SITE_DESCRIPTION: 'US ₿ ETFs and Ξ ETFs flows',
    SITE_URL: 'https://etfs.fberger.xyz',
    SOCIALS: {
        TWITTER: 'fberger_xyz',
        TELEGRAM: 'fberger_xyz',
        LINKEDIN: 'francis-berger-a2404094',
    },
}

export const APP_THEMES: Partial<Record<AppThemes, { index: number; iconId: IconIds }>> = {
    [AppThemes.LIGHT]: { index: 0, iconId: IconIds.THEME_LIGHT },
    [AppThemes.DARK]: { index: 1, iconId: IconIds.THEME_DARK },
}
