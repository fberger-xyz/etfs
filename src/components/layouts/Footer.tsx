'use client'

import { cn } from '@/utils'
import LinkWrapper from '../common/LinkWrapper'
import { APP_METADATA } from '@/config/app.config'
import IconWrapper from '../common/IconWrapper'
import { IconIds } from '@/enums'
import { useEffect, useState } from 'react'

interface FooterProps {
    className?: string
}

export default function Footer(props: FooterProps) {
    const [isInFrame, setIsInFrame] = useState(false)
    useEffect(() => {
        if (typeof window === 'undefined') return
        const inIframe = () => window.self !== window.top
        setIsInFrame(inIframe())
    }, [])
    if (isInFrame) return null
    return (
        <div className={cn('fixed bottom-0 w-full flex justify-end text-sm z-0', props.className)}>
            <div className="flex items-end gap-4 rounded-ss-xl bg-background p-3 opacity-80 backdrop-blur-sm">
                {[
                    { href: `https://${APP_METADATA.SITE_AUTHOR}`, icon: IconIds.WEBSITE },
                    { href: `https://t.me/${APP_METADATA.SOCIALS.TELEGRAM}`, icon: IconIds.TELEGRAM },
                    { href: `https://x.com/${APP_METADATA.SOCIALS.TWITTER}`, icon: IconIds.X },
                    { href: `https://www.linkedin.com/in/${APP_METADATA.SOCIALS.LINKEDIN}`, icon: IconIds.LINKEDIN },
                ].map((link) => (
                    <LinkWrapper key={link.href} target="_blank" href={link.href} className="cursor-alias hover:text-primary">
                        <IconWrapper icon={link.icon} className="h-5 w-5" />
                    </LinkWrapper>
                ))}
            </div>
        </div>
    )
}
