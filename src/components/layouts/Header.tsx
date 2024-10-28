import HeaderButton from './HeaderButton'
import { AppPagePaths } from '@/enums'
import { cn } from '@/utils'
import ThemeSwitcher from './ThemeSwitcher'
// import Image from 'next/image'
// import LinkWrapper from '../common/LinkWrapper'
// import { APP_METADATA } from '@/config/app.config'

export default function Header(props: { className?: string }) {
    return (
        <div className={cn('fixed top-0 flex justify-center items-center w-full', props.className)}>
            <div className="relative z-50 flex h-fit w-full max-w-[650px] items-center justify-between gap-0.5 rounded-xl bg-transparent p-2 backdrop-blur-sm sm:justify-between">
                <div className="absolute inset-0 -z-40 rounded-xl bg-background opacity-50" />
                {/* <LinkWrapper href="/" className="flex items-end gap-2">
                    <Image
                        src={APP_METADATA.PROFILE_PICTURE}
                        width={38}
                        height={38}
                        alt="https://x.com/fran6brg/photo"
                        className="rounded-md bg-discreet p-0.5"
                    />
                    <p className="hidden text-xl text-primary sm:block">{APP_METADATA.ENS}</p>
                </LinkWrapper> */}
                <div className="flex gap-0.5 sm:gap-1">
                    {(Object.values(AppPagePaths) as AppPagePaths[]).map((path) => (
                        <HeaderButton key={path} pagePath={path} />
                    ))}
                </div>
                <ThemeSwitcher />
            </div>
        </div>
    )
}
