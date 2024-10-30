import LinkWithIcon from '@/components/common/LinkWithIcon'
import PageWrapper from '@/components/common/PageWrapper'

export default function Page() {
    return (
        <PageWrapper>
            <div className="mt-10 flex w-full flex-col justify-center gap-1 md:flex-row">
                <p>Just better than the original.</p>
                <LinkWithIcon href="https://t.me/+nMy_2LCHvEJjZDI0">
                    <p>Telegram</p>
                </LinkWithIcon>
            </div>
        </PageWrapper>
    )
}
