'use client'

import { IconIds } from '@/enums'
import { cn } from '@/utils'
import { useState, memo, useCallback } from 'react'
import IconWrapper from './IconWrapper'

interface InterfaceButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string
    icons?: {
        left?: IconIds
        right?: IconIds
    }
    disabled?: boolean
    focused?: boolean
    onClickFn?: () => void
}

const Button = memo((props: InterfaceButtonProps) => {
    const [loading, setLoading] = useState(false)

    const handleClick = useCallback(async () => {
        setLoading(() => true)
        try {
            if (props.onClickFn) props.onClickFn()
            else await new Promise((resolve) => setTimeout(resolve, 2000)) // feint
        } catch (error) {
            console.log('button', { error })
        } finally {
            setLoading(() => false)
        }
    }, [props.onClickFn])

    return (
        <button
            className={cn(`w-fit flex items-center gap-2.5 rounded-xl border border-transparent bg-light-hover px-2.5 py-1`, {
                'cursor-wait': loading,
                'cursor-not-allowe text-gray-600': props.disabled,
                'hover:border-primary hover:text-primary': !props.disabled,
                'border-primary text-primary': props.focused,
            })}
            onClick={handleClick}
            disabled={loading || props.disabled}
        >
            {props.icons?.left && <IconWrapper icon={props.icons.left} className="my-0.5 h-3.5 w-3.5" />}
            {props.text && <p className="truncate">{`${props.text}${loading ? '...' : ''}`}</p>}
            {props.icons?.right && (
                <IconWrapper
                    icon={loading ? IconIds.LOADING : props.icons.right}
                    className={cn('my-0.5 h-3.5 w-3.5', { 'text-orange-400': loading })}
                />
            )}
        </button>
    )
})

Button.displayName = 'Button'

export default Button
