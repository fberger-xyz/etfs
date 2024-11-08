import type { Metadata } from 'next'
import { Ubuntu_Mono } from 'next/font/google'
import './globals.css'
import { APP_METADATA } from '../config/app.config'
import { cn } from '../utils'
import Header from '../components/layouts/Header'
import { Suspense } from 'react'
import Footer from '../components/layouts/Footer'
import { ThemeProvider } from 'next-themes'
import { AppThemes } from '@/enums'
import ReactQueryProvider from '@/providers/react-query.provider'
import { Toaster } from 'react-hot-toast'
import PageWrapper from '@/components/common/PageWrapper'

// https://fonts.google.com/
const font = Ubuntu_Mono({ weight: ['400', '700'], subsets: ['latin'] })

export const metadata: Metadata = {
    title: APP_METADATA.SITE_NAME,
    description: APP_METADATA.SITE_DESCRIPTION,
    applicationName: APP_METADATA.SITE_NAME,
    metadataBase: new URL(APP_METADATA.SITE_URL),
    manifest: '/manifest.json',
    appleWebApp: {
        title: APP_METADATA.SITE_NAME,
        capable: true,
        statusBarStyle: 'black-translucent',
    },
    openGraph: {
        type: 'website',
        title: APP_METADATA.SITE_NAME,
        siteName: APP_METADATA.SITE_NAME,
        description: APP_METADATA.SITE_DESCRIPTION,
        url: APP_METADATA.SITE_URL,
        images: '/opengraph-image',
    },
    twitter: {
        card: 'summary_large_image',
        site: APP_METADATA.SOCIALS.TWITTER,
        title: APP_METADATA.SITE_NAME,
        description: APP_METADATA.SITE_DESCRIPTION,
        images: '/opengraph-image',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(font.className, 'h-screen w-screen overflow-hidden')}>
                <ThemeProvider attribute="class" defaultTheme={AppThemes.DARK} disableTransitionOnChange themes={Object.values(AppThemes)}>
                    <ReactQueryProvider>
                        <main className="flex h-full w-full flex-col bg-background text-lg text-default transition-all md:text-base">
                            <Header className="h-16 px-4 text-base sm:h-20 sm:text-lg" />
                            <Suspense
                                fallback={
                                    <div className="h-full overflow-scroll">
                                        <PageWrapper className="gap-5">
                                            <div className="flex w-full flex-col items-center justify-center gap-3">
                                                <div className="h-6 w-full max-w-52 animate-pulse rounded-md bg-light-hover" />
                                                <div className="relative mx-4 flex h-[440px] w-full animate-pulse flex-col gap-1 rounded-md bg-light-hover p-2 md:h-[calc(100vh-260px)]">
                                                    <div className="mb-2 h-10 w-full rounded-md bg-default" />
                                                    {Array(25)
                                                        .fill('-')
                                                        .map(() => (
                                                            <div className="h-6 w-full rounded-md bg-background" />
                                                        ))}
                                                    <p className="absolute bottom-1/2 w-full text-center text-orange-400">Loading App ...</p>
                                                </div>
                                            </div>
                                        </PageWrapper>
                                    </div>
                                }
                            >
                                <div className="h-full overflow-scroll">{children}</div>
                            </Suspense>
                            <Footer />
                            <Toaster position="bottom-center" reverseOrder={false} />
                        </main>
                    </ReactQueryProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
