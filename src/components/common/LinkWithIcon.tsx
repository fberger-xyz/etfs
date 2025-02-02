import IconWrapper from '@/components/common/IconWrapper'
import { IconIds } from '@/enums'
import LinkWrapper from './LinkWrapper'

export default function LinkWithIcon({ children, href }: { href: string; children?: React.ReactNode }) {
    return (
        <LinkWrapper
            href={href}
            className="group flex w-fit cursor-alias items-center gap-2 rounded-xl bg-light-hover px-1.5 text-default hover:bg-light-hover hover:text-primary"
            target="_blank"
        >
            {children}
            <IconWrapper icon={IconIds.IC_BASELINE_OPEN_IN_NEW} className="h-3.5 w-3.5 text-inactive group-hover:text-primary" />
        </LinkWrapper>
    )
}
