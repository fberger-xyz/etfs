'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcutArgs'
import { motion } from 'framer-motion'
import { IconIds } from '@/enums'
import IconWrapper from '../common/IconWrapper'
import { Backdrop } from '../common/Backdrop'
import Button from '../common/Button'
import { APP_METADATA } from '@/config/app.config'
import LinkWithIcon from '../common/LinkWithIcon'

export default function CopyOrDownloadDataModal() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const showModal = searchParams.get('copy-or-download') === 'true'
    useKeyboardShortcut({ key: 'Escape', onKeyPressed: () => router.back() })
    if (!showModal) return null
    return (
        <Backdrop>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: 'easeInOut', duration: 0.25 }}
                className="flex max-w-[530px] flex-col gap-5 rounded-md border border-light-hover bg-background py-3 shadow-lg"
            >
                <div className="flex w-full items-center justify-between px-4">
                    <p className="text-lg text-secondary">
                        <span className="underline underline-offset-2">Copy</span> or <span className="underline underline-offset-2">Download</span>{' '}
                        flows data
                    </p>
                    <Link href="/" className="rounded-sm text-inactive hover:bg-very-light-hover hover:text-primary focus:outline-none">
                        <IconWrapper icon={IconIds.CARBON_CLOSE} className="size-6" />
                    </Link>
                </div>
                <div className="w-full border-t border-very-light-hover" />
                <div className="flex flex-wrap gap-1 px-3">
                    <p>If need be - reach out</p>
                    <LinkWithIcon href={`https://t.me/${APP_METADATA.SOCIALS.TELEGRAM}`}>@{APP_METADATA.SOCIALS.TELEGRAM}</LinkWithIcon>
                    <p>to refine the data</p>
                </div>
                <div className="w-full border-t border-very-light-hover" />
                <div className="flex w-full items-center justify-end gap-3 px-3">
                    <Button text="Copy data (JSON)" icons={{ right: IconIds.CARBON_COPY }} />
                    <Button text="Download data (CSV)" icons={{ right: IconIds.CARBON_DOWNLOAD }} />
                </div>
            </motion.div>
        </Backdrop>
    )
}
