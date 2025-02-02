import LinkWithIcon from '@/components/common/LinkWithIcon'
import LinkWrapper from '@/components/common/LinkWrapper'
import PageWrapper from '@/components/common/PageWrapper'
import ExcalidrawSVG from '@/components/excalidraw/ExcalidrawSVG'

export default function Page() {
    return (
        <PageWrapper>
            <div className="flex w-full items-center justify-between">
                <div className="flex w-full flex-col">
                    <LinkWrapper
                        href="https://etfs.fberger.xyz"
                        target="_blank"
                        className="flex w-full flex-wrap items-baseline gap-1 decoration-primary underline-offset-4 hover:underline"
                    >
                        <p className="text-xl text-secondary md:text-3xl">ETFs</p>
                        {/* <IconWrapper icon={IconIds.IC_BASELINE_OPEN_IN_NEW} className="h-6 w-6 text-primary" /> */}
                    </LinkWrapper>
                    <p className="text-xs">Better than the original (https://farside.co.uk/)</p>
                </div>
                <div className="flex w-full flex-col items-end pl-4">
                    <p className="text-secondary">Summary</p>
                    <p className="text-xs">Why</p>
                    <p className="text-xs">How it works</p>
                    <p className="text-xs">Conclusion</p>
                </div>
            </div>
            <div className="flex w-full flex-col gap-2 border-t border-light-hover py-4">
                <p className="text-secondary">Why</p>
                <div className="flex flex-wrap items-baseline gap-2">
                    <p className="text-sm">- for crypto twitter, bc farside's frontend is poorly designed</p>
                    <LinkWithIcon href="https://farside.co.uk/btc/">
                        <p className="text-nowrap text-sm">See by yourself</p>
                    </LinkWithIcon>
                </div>
                <p className="text-sm">- for other devs, to list the right tools to use in 2024</p>
            </div>
            <div className="flex w-full flex-col gap-1 border-t border-light-hover py-4">
                <p className="text-secondary">How it works</p>
                <div className="flex w-full flex-col items-center">
                    <ExcalidrawSVG src="/better-farside" className="w-full p-2" />
                    <p className="text-xs italic text-inactive">It's that simple</p>
                </div>
            </div>
            <div className="flex w-full flex-col gap-1 border-t border-light-hover pt-4">
                <p className="text-secondary">Conclusion</p>
                <p className="text-sm">With these tools, 1 dev can deploy features that would require an entire team in the corporate world</p>
            </div>
        </PageWrapper>
    )
}
