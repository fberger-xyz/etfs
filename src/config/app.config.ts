import { AppThemes, IconIds } from '@/enums'

export const APP_METADATA = {
    SITE_AUTHOR: 'fberger',
    SITE_NAME: 'better-farside',
    SITE_INFO: 'SITE_INFO',
    SITE_DESCRIPTION: 'SITE_DESCRIPTION',
    SITE_URL: 'https://better-farside.vercel.app/',
    SOCIALS: {
        TWITTER: 'fberger_xyz',
        TELEGRAM: 'fberger_xyz',
        LINKEDIN: 'francis-berger-a2404094',
        ENS: 'fran6.eth',
        MAIL: 'tba@protonmail.com',
    },
    PROFILE_PICTURE: 'https://pbs.twimg.com/profile_images/1824850421078220800/jWMhjkyv_400x400.jpg',
}

export const APP_THEMES: Partial<Record<AppThemes, { index: number; iconId: IconIds }>> = {
    [AppThemes.LIGHT]: { index: 0, iconId: IconIds.THEME_LIGHT },
    [AppThemes.DARK]: { index: 1, iconId: IconIds.THEME_DARK },
}
