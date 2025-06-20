'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcutArgs'
import { motion } from 'framer-motion'
import { IconIds, ETFs } from '@/enums'
import IconWrapper from '../common/IconWrapper'
import { Backdrop } from '../common/Backdrop'
import Button from '../common/Button'
import { APP_METADATA } from '@/config/app.config'
import LinkWithIcon from '../common/LinkWithIcon'
import { useRef } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { FarsideFlows, ETFsTickers } from '@/interfaces'
import { getConfig } from '@/utils'

interface CopyOrDownloadDataModalProps {
    etf: ETFs
    data: FarsideFlows[]
    tickers: ETFsTickers[]
}

export default function CopyOrDownloadDataModal({ etf, data, tickers }: CopyOrDownloadDataModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const showModal = searchParams.get('copy-or-download') === 'true'

    // Debug logging
    console.log('CopyOrDownloadDataModal:', { showModal, etf, dataLength: data?.length, tickersLength: tickers?.length })

    useKeyboardShortcut({ key: 'Escape', onKeyPressed: () => router.back() })
    useClickOutside(modalRef, () => router.back())

    const copyToClipboard = async () => {
        try {
            if (!data || !tickers) {
                console.error('No data or tickers available')
                return
            }

            // Filter and sort tickers
            const filteredTickers = tickers
                .filter((ticker) => getConfig(etf, ticker))
                .sort((curr, next) => getConfig(etf, curr).index - getConfig(etf, next).index)

            console.log('Copying data:', { filteredTickers, dataLength: data.length })

            // Prepare JSON data
            const jsonData = data.map((day) => {
                const dayData: Record<string, string | number> = {
                    date: day.day,
                    total: day.total,
                    rank: day.rank,
                }

                // Add ticker data
                filteredTickers.forEach((ticker) => {
                    const value = day[ticker as keyof FarsideFlows]
                    dayData[ticker] = typeof value === 'number' ? value : Number(value) || 0
                })

                return dayData
            })

            await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2))

            // You could add a toast notification here
            console.log('Data copied to clipboard')
        } catch (error) {
            console.error('Failed to copy data:', error)
        }
    }

    const downloadCSV = () => {
        try {
            if (!data || !tickers) {
                console.error('No data or tickers available')
                return
            }

            // Filter and sort tickers
            const filteredTickers = tickers
                .filter((ticker) => getConfig(etf, ticker))
                .sort((curr, next) => getConfig(etf, curr).index - getConfig(etf, next).index)

            console.log('Downloading CSV:', { filteredTickers, dataLength: data.length })

            // Prepare CSV headers
            const headers = ['Date', 'Total', 'Rank', ...filteredTickers]

            // Prepare CSV rows
            const csvRows = [
                headers.join(','),
                ...data.map((day) => {
                    const row = [
                        day.day,
                        day.total,
                        day.rank,
                        ...filteredTickers.map((ticker) => {
                            const value = day[ticker as keyof FarsideFlows]
                            return typeof value === 'number' ? value : Number(value) || 0
                        }),
                    ]
                    return row.join(',')
                }),
            ]

            const csvContent = csvRows.join('\n')
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')

            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob)
                link.setAttribute('href', url)
                link.setAttribute('download', `${etf.toLowerCase()}-flows-${new Date().toISOString().split('T')[0]}.csv`)
                link.style.visibility = 'hidden'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
        } catch (error) {
            console.error('Failed to download CSV:', error)
        }
    }

    if (!showModal) return null

    return (
        <Backdrop>
            <motion.div
                ref={modalRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: 'easeInOut', duration: 0.25 }}
                className="flex max-w-[400px] flex-col gap-5 rounded-xl border border-light-hover bg-background py-3 text-base shadow-lg"
            >
                <div className="flex w-full items-center justify-between px-6">
                    <p className="font-bold text-secondary lg:text-lg">
                        <span className="underline underline-offset-4">Copy</span> or <span className="underline underline-offset-4">Download</span>{' '}
                        flows data
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="rounded-xl text-default hover:bg-very-light-hover hover:text-primary focus:outline-none"
                    >
                        <IconWrapper icon={IconIds.CARBON_CLOSE} className="size-7" />
                    </button>
                </div>
                <div className="w-full border-t border-very-light-hover" />
                <div className="flex flex-wrap gap-1.5 px-5">
                    <p>Reach out on telegram</p>
                    <LinkWithIcon href={`https://t.me/${APP_METADATA.SOCIALS.TELEGRAM}`}>@{APP_METADATA.SOCIALS.TELEGRAM}</LinkWithIcon>
                    <p>to refine the data</p>
                </div>
                <div className="w-full border-t border-very-light-hover" />
                <div className="flex w-full items-center justify-end gap-3 px-5">
                    <Button text="Copy (JSON)" icons={{ right: IconIds.CARBON_COPY }} onClickFn={copyToClipboard} />
                    <Button text="Download (CSV)" icons={{ right: IconIds.CARBON_DOWNLOAD }} onClickFn={downloadCSV} />
                </div>
            </motion.div>
        </Backdrop>
    )
}
