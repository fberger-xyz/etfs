export * from './cn.util'
export * from './error.util'
export * from './date.util'
export * from './format.util'
export * from './farside.util'

export const copyToClipboard = (value: string) => {
    try {
        navigator.clipboard.writeText(value)
    } catch (error) {
        console.log(error)
    }
}
