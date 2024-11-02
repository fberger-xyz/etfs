import { cn } from '@/utils'
import LinkWrapper from '../common/LinkWrapper'
import { APP_METADATA } from '@/config/app.config'
import packageJson from '../../../package.json'

interface FooterProps {
    className?: string
}

export default function Footer(props: FooterProps) {
    return (
        <div className={cn('fixed bottom-0 w-full flex justify-between items-end text-xs z-0 px-2 py-1.5 opacity-50', props.className)}>
            <div className="flex items-start gap-1">
                <p className="text-inactive">UI</p>
                <p className="text-secondary">v{packageJson?.version ?? 'n/a'}</p>
            </div>
            <div className="flex items-end gap-1">
                <p className="text-inactive">Author</p>
                <LinkWrapper href="https://www.fberger.xyz/" className="">
                    <p className="text-secondary">{APP_METADATA.SITE_AUTHOR}</p>
                </LinkWrapper>
            </div>
        </div>
    )
}
