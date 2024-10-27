import { create } from 'zustand'
import { InterfaceAppLink } from '../interfaces'
import { AppPagePaths } from '../enums'
import { APP_METADATA } from '../config/app.config'

export const useAppStore = create<{
    name: string
    version: string
    env: string
    debug: boolean
    initialized: boolean
    loading: boolean
    links: InterfaceAppLink[]
    actions: Record<string, () => void>
    computeds: Record<string, () => void>
}>(() => ({
    name: APP_METADATA.SITE_NAME,
    version: '0.0.0',
    env: String(process.env.NEXT_PUBLIC_APP_ENV),
    debug: String(process.env.NEXT_PUBLIC_APP_DEBUG) === 'true',
    loading: false,
    initialized: false,
    links: [
        {
            name: 'Better Farside',
            path: AppPagePaths.HOME,
            enabled: true,
            sublinks: [],
        },
        {
            name: 'About',
            path: AppPagePaths.ABOUT,
            enabled: true,
            sublinks: [],
        },
    ],
    actions: {},
    computeds: {},
}))
