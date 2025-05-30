'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcutArgs'
import { motion } from 'framer-motion'
import { IconIds } from '@/enums'
import IconWrapper from '../common/IconWrapper'
import { Backdrop } from '../common/Backdrop'
import Button from '../common/Button'
import { APP_METADATA } from '@/config/app.config'
import LinkWithIcon from '../common/LinkWithIcon'
import { useRef } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'

export default function CopyOrDownloadDataModal() {
    const modalRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const showModal = searchParams.get('copy-or-download') === 'true'
    useKeyboardShortcut({ key: 'Escape', onKeyPressed: () => router.back() })
    useClickOutside(modalRef, () => router.back())
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
                    <Button text="Copy (JSON)" icons={{ right: IconIds.CARBON_COPY }} />
                    <Button text="Download (CSV)" icons={{ right: IconIds.CARBON_DOWNLOAD }} />
                </div>
            </motion.div>
        </Backdrop>
    )
}
