'use client'

import { useRouter } from 'next/navigation'
import IconWrapper from './IconWrapper'
import { IconIds } from '@/enums'

export default function GoBack() {
    const router = useRouter()
    return (
        <button onClick={() => router.back()} className="flex items-center gap-1 text-discreet hover:text-primary hover:underline">
            <IconWrapper icon={IconIds.CARBON_CHEVRON_LEFT} />
            <p className="text-lg sm:text-sm">Back</p>
        </button>
    )
}
