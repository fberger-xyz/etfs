import IconWrapper from '@/components/common/IconWrapper'
import LinkWrapper from '@/components/common/LinkWrapper'
import PageWrapper from '@/components/common/PageWrapper'
import { IconIds } from '@/enums'

export default function Page() {
    return (
        <PageWrapper>
            <div className="mt-10 flex w-full flex-col items-center justify-center gap-8">
                <LinkWrapper href="https://farside.co.uk/btc/" target="_blank" className="flex items-baseline gap-1">
                    <p>
                        Just better than <span className="underline underline-offset-2">the original</span>
                    </p>
                    <IconWrapper icon={IconIds.IC_BASELINE_OPEN_IN_NEW} className="h-4 w-4" />
                </LinkWrapper>
            </div>
        </PageWrapper>
    )
}
