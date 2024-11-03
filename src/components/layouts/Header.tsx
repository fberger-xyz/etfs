import HeaderButton from './HeaderButton'
import { AppPagePaths } from '@/enums'
import { cn } from '@/utils'
import ThemeSwitcher from './ThemeSwitcher'

export default function Header(props: { className?: string }) {
    return (
        <div className={cn('fixed top-0 flex justify-center items-center w-full', props.className)}>
            <div className="relative flex h-fit w-full max-w-[650px] items-center justify-between gap-0.5 rounded-xl bg-transparent p-2 backdrop-blur-sm sm:justify-between">
                <div className="absolute inset-0 z-40 rounded-xl bg-background md:opacity-50" />
                <div className="z-50 flex gap-0.5 sm:gap-1">
                    {(Object.values(AppPagePaths) as AppPagePaths[]).map((path) => (
                        <HeaderButton key={path} pagePath={path} />
                    ))}
                </div>
                <ThemeSwitcher />
            </div>
        </div>
    )
}
