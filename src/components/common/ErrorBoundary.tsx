'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import PageWrapper from './PageWrapper'
import Button from './Button'
import JsonField from './JsonField'
import { extractErrorMessage } from '@/utils'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <PageWrapper>
                    <div className="my-10 flex flex-col items-center gap-6">
                        <p className="font-bold">Something went wrong!</p>
                        <div className="flex flex-col items-center gap-2 rounded-xl border border-light-hover p-4">
                            <p className="text-inactive">Application logs</p>
                            <JsonField className="text-red-400">{JSON.stringify(extractErrorMessage(this.state.error), null, 2)}</JsonField>
                        </div>
                        <Button onClickFn={() => this.setState({ hasError: false, error: null })} text="Try again" />
                    </div>
                </PageWrapper>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
