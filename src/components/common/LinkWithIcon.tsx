import IconWrapper from '@/components/common/IconWrapper'
import { IconIds } from '@/enums'
import LinkWrapper from './LinkWrapper'

export default function LinkWithIcon({ children, href }: { href: string; children?: React.ReactNode }) {
    return (
        <LinkWrapper
            href={href}
            className="flex w-fit items-center gap-2 rounded-md bg-light-hover px-1 text-secondary hover:text-primary"
            target="_blank"
        >
            {children}
            <IconWrapper icon={IconIds.IC_BASELINE_OPEN_IN_NEW} className="h-4 w-4" />
        </LinkWrapper>
    )
}
