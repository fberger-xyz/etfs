export type FunctionReturn<T> = {
    ts: number
    success: boolean
    error: string
    raw: null | T
}
