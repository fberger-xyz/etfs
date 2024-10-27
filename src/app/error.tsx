'use client'

import Button from '@/components/common/Button'
import PageWrapper from '@/components/common/PageWrapper'
import JsonField from '@/components/common/JsonField'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => console.error(error), [error])
    return (
        <PageWrapper>
            <div className="m-auto flex flex-col items-center gap-10">
                <h2>Something went wrong!</h2>
                <div className="flex flex-col items-center gap-1">
                    <p>Error</p>
                    <JsonField>{JSON.stringify(error, null, 2)}</JsonField>
                </div>
                <Button onClickFn={() => reset()} text="Reload page" />
            </div>
        </PageWrapper>
    )
}
