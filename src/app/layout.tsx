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
        site: APP_METADATA.SOCIAL_TWITTER,
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
                        <main className="flex h-full w-full flex-col bg-background text-lg text-primary transition-all md:text-base">
                            <Header className="h-16 px-4 text-base sm:h-20 sm:text-lg" />
                            <Suspense
                                fallback={
                                    <div className="flex h-full w-full items-center justify-center">
                                        <p className="text-orange-500">App loading...</p>
                                    </div>
                                }
                            >
                                <div className="h-full overflow-scroll">{children}</div>
                            </Suspense>
                            <Footer className="md:p-3" />
                            <Toaster position="bottom-center" reverseOrder={false} />
                        </main>
                    </ReactQueryProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
