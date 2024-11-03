import { cn } from '@/utils'
import LinkWrapper from '../common/LinkWrapper'
import { APP_METADATA } from '@/config/app.config'
import IconWrapper from '../common/IconWrapper'
import { IconIds } from '@/enums'

interface FooterProps {
    className?: string
}

export default function Footer(props: FooterProps) {
    return (
        <div className={cn('fixed bottom-0 w-full flex justify-end text-sm z-0 px-3 pb-1.5 opacity-50', props.className)}>
            <div className="flex items-end gap-4 text-default">
                <LinkWrapper target="_blank" href={`https://${APP_METADATA.SITE_AUTHOR}.xyz`} className="hover:text-primary">
                    <IconWrapper icon={IconIds.WEBSITE} className="h-6 w-6" />
                </LinkWrapper>
                <LinkWrapper target="_blank" href={`https://t.me/${APP_METADATA.SOCIALS.TELEGRAM}`} className="hover:text-primary">
                    <IconWrapper icon={IconIds.TELEGRAM} className="h-6 w-6" />
                </LinkWrapper>
                <LinkWrapper target="_blank" href={`https://x.com/${APP_METADATA.SOCIALS.TWITTER}`} className="hover:text-primary">
                    <IconWrapper icon={IconIds.X} className="h-6 w-6" />
                </LinkWrapper>
                <LinkWrapper target="_blank" href={`https://www.linkedin.com/in/${APP_METADATA.SOCIALS.LINKEDIN}`} className="hover:text-primary">
                    <IconWrapper icon={IconIds.LINKEDIN} className="h-6 w-6" />
                </LinkWrapper>
            </div>
        </div>
    )
}
