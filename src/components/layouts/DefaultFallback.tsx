import PageWrapper from '../common/PageWrapper'

export default function DefaultFallback() {
    return (
        <div className="h-full overflow-scroll">
            <PageWrapper className="gap-5">
                <div className="flex w-full flex-col items-center justify-center gap-3">
                    <div className="h-6 w-full max-w-52 animate-pulse rounded-md bg-light-hover" />
                    <div className="relative flex h-[400px] w-full animate-pulse flex-col gap-1 border border-inactive bg-background md:h-[calc(100vh-280px)]">
                        <div className="h-11 w-full rounded-sm border-b border-inactive bg-light-hover" />
                        {Array(24)
                            .fill('-')
                            .map((entry, entryIndex) => (
                                <div key={`${entry}-${entryIndex}`} className="h-6 w-full rounded-sm bg-very-light-hover opacity-50" />
                            ))}
                        <p className="absolute bottom-1/2 w-full text-center text-primary">Loading App ...</p>
                    </div>
                </div>
            </PageWrapper>
        </div>
    )
}
