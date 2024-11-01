'use client'

import { Suspense } from 'react'
import CustomFallback from './CustomFallback'

export default function PageWrapper({ children, ...props }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<CustomFallback loadingText="Page loading..." />}>
            <div
                {...props}
                className="mx-auto mt-16 flex max-w-[600px] flex-col items-start gap-3 overflow-auto px-3 sm:max-w-[800px] sm:px-16 md:mt-20 md:max-w-[900px] md:gap-6"
            >
                {children}
            </div>
        </Suspense>
    )
}
