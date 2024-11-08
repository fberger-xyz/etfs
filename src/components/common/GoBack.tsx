'use client'

import { useRouter } from 'next/navigation'
import IconWrapper from './IconWrapper'
import { IconIds } from '@/enums'

export default function GoBack() {
    const router = useRouter()
    return (
        <button onClick={() => router.back()} className="flex items-center gap-1 text-inactive hover:text-secondary hover:underline">
            <IconWrapper icon={IconIds.CARBON_CHEVRON_LEFT} />
            <p className="text-base sm:text-sm">Back</p>
        </button>
    )
}
