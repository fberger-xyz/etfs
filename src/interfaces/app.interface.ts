import { AppPagePaths, IconIds } from '../enums'

export interface InterfaceAppLink {
    name: string
    path: AppPagePaths
    icon?: IconIds
    enabled: boolean
    description?: string
    sublinks: InterfaceAppLink[]
}

export interface APIResponse<Data> {
    data?: Data
    error: string
}
