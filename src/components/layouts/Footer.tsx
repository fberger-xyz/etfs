import { cn } from '@/utils'
// import LinkWrapper from '../common/LinkWrapper'
// import { APP_METADATA } from '@/config/app.config'
import packageJson from '../../../package.json'

interface FooterProps {
    className?: string
}

export default function Footer(props: FooterProps) {
    return (
        <div className={cn('fixed bottom-0 w-full flex justify-between items-end text-xs z-0 px-2 py-1.5 text-inactive', props.className)}>
            <div className="flex items-center gap-4">
                <p className="text-discreet opacity-50 sm:hidden">UI v{packageJson?.version ?? 'n/a'}</p>
                <div className="hidden flex-row gap-1 sm:flex">
                    <p className="text-discreet opacity-50">UI</p>
                    <p>v{packageJson?.version ?? 'n/a'}</p>
                </div>
                {/* {process.env.NODE_ENV !== 'production' && (
                    <p className="flex flex-col sm:flex-row sm:gap-1">
                        <span className="text-discreet opacity-50">Environment</span>
                        <span>{process.env.NODE_ENV}</span>
                    </p>
                )}
                {process.env.NODE_ENV !== 'production' && (
                    <p className="flex flex-col sm:flex-row sm:gap-1">
                        <span className="text-discreet opacity-50">Screen</span>
                        <span className="block sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden">xs</span>
                        <span className="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">sm</span>
                        <span className="hidden sm:hidden md:block lg:hidden xl:hidden 2xl:hidden">md</span>
                        <span className="hidden sm:hidden md:hidden lg:block xl:hidden 2xl:hidden">lg</span>
                        <span className="hidden sm:hidden md:hidden lg:hidden xl:block 2xl:hidden">xl</span>
                        <span className="hidden sm:hidden md:hidden lg:hidden xl:hidden 2xl:block">2xl</span>
                    </p>
                )} */}
            </div>
            <div className="flex flex-col items-end sm:flex-row sm:gap-1">
                <p className="text-discreet opacity-50">Copyright © 2024</p>
                {/* <LinkWrapper href="https://x.com/fran6brg" className="hidden sm:flex">
                    <p>{APP_METADATA.ENS}</p>
                </LinkWrapper> */}
            </div>
        </div>
    )
}
