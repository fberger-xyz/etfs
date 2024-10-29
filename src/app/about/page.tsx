import LinkWithIcon from '@/components/common/LinkWithIcon'
import PageWrapper from '@/components/common/PageWrapper'

export default function Page() {
    return (
        <PageWrapper>
            <div className="mt-10 flex w-full justify-center gap-1">
                <p>Just better.</p>
                <LinkWithIcon href="https://web.telegram.org/a/#-1002417234515">
                    <p>Telegram</p>
                </LinkWithIcon>
            </div>
        </PageWrapper>
    )
}
