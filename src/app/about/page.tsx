import LinkWithIcon from '@/components/common/LinkWithIcon'
import LinkWrapper from '@/components/common/LinkWrapper'
import PageWrapper from '@/components/common/PageWrapper'

export default function Page() {
    return (
        <PageWrapper>
            <div className="mt-10 flex w-full flex-col items-center justify-center gap-8">
                <LinkWrapper href="https://farside.co.uk/btc/" target="_blank" className="flex gap-1">
                    <p>
                        Just better than <span className="underline underline-offset-2">the original</span>
                    </p>
                </LinkWrapper>
                <LinkWithIcon href="https://t.me/+nMy_2LCHvEJjZDI0">
                    <p>Telegram</p>
                </LinkWithIcon>
            </div>
        </PageWrapper>
    )
}
