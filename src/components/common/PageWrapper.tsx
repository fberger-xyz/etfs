'use client'

import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import GoBack from './GoBack'
import { cn } from '@/utils'

export default function PageWrapper({ children, className, ...props }: { children: React.ReactNode; className?: string }) {
    const pathname = usePathname()
    return (
        <Suspense
            fallback={
                <div
                    className={cn(
                        'mx-auto mb-10 pb-28 mt-20 flex max-w-[600px] flex-col items-start overflow-auto px-4 sm:max-w-[800px] sm:px-16 md:mt-24 md:max-w-[900px]',
                        className, // gap-2 md:gap-6
                    )}
                >
                    <p className="text-orange-400">Page loading...</p>
                </div>
            }
        >
            <div
                {...props}
                className={cn(
                    'mx-auto mb-10 pb-28 mt-20 flex max-w-[600px] flex-col items-start overflow-auto px-4 sm:max-w-[800px] sm:px-16 md:mt-24 md:max-w-[900px]',
                    className, // gap-2 md:gap-6
                )}
            >
                {pathname !== '/' && <GoBack />}
                {children}
            </div>
        </Suspense>
    )
}
