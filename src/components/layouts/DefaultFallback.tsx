import PageWrapper from '../common/PageWrapper'

export default function DefaultFallback() {
    return (
        <div className="h-full overflow-scroll">
            <PageWrapper className="gap-5">
                <div className="flex w-full flex-col items-center justify-center gap-3">
                    <div className="h-6 w-full max-w-52 animate-pulse rounded-md bg-light-hover" />
                    <div className="relative flex h-[420px] w-full animate-pulse flex-col gap-1 border border-inactive bg-light-hover md:h-[calc(100vh-280px)]">
                        <div className="h-10 w-full rounded-sm border-b border-inactive" />
                        {Array(20)
                            .fill('-')
                            .map(() => (
                                <div className="h-6 w-full rounded-sm bg-very-light-hover p-2" />
                            ))}
                        <p className="absolute bottom-1/2 w-full text-center text-primary">Loading App ...</p>
                    </div>
                </div>
            </PageWrapper>
        </div>
    )
}
