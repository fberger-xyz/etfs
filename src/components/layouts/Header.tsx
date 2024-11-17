import HeaderButton from './HeaderButton'
import { AppPagePaths } from '@/enums'
import { cn } from '@/utils'
import ThemeSwitcher from './ThemeSwitcher'

export default function Header(props: { className?: string }) {
    return (
        <div className={cn('z-50 fixed top-0 flex justify-center items-center w-full', props.className)}>
            <div className="relative flex h-14 w-full items-center justify-between gap-0.5 border-b border-very-light-hover bg-background px-4 text-base backdrop-blur-md sm:mt-2 sm:h-fit sm:max-w-[300px] sm:justify-between sm:rounded-lg sm:border-transparent sm:bg-transparent sm:p-2 sm:text-lg">
                {/* <!-- eslint-disable-next-line --> */}
                <div className="bg-background/10 absolute inset-0 rounded-xl" />
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
