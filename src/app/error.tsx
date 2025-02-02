'use client'

import Button from '@/components/common/Button'
import PageWrapper from '@/components/common/PageWrapper'
import JsonField from '@/components/common/JsonField'
import { useEffect } from 'react'
import { extractErrorMessage } from '@/utils'
import LinkWithIcon from '@/components/common/LinkWithIcon'
import { APP_METADATA } from '@/config/app.config'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => console.error(error), [error])
    return (
        <PageWrapper>
            <div className="my-10 flex flex-col items-center gap-6">
                <p className="font-bold">Something went wrong!</p>
                <div className="flex flex-col items-center gap-2 rounded-xl border border-light-hover p-4">
                    <p className="text-inactive">Application logs</p>
                    <JsonField className="text-red-400">{JSON.stringify(extractErrorMessage(error), null, 2)}</JsonField>
                </div>
                ⬇️
                <div className="flex flex-col items-center gap-3">
                    <Button onClickFn={() => reset()} text="Reload page" />
                    <p className="text-inactive">or</p>
                    <LinkWithIcon href={`https://t.me/${APP_METADATA.SOCIALS.TELEGRAM}`}>@{APP_METADATA.SOCIALS.TELEGRAM}</LinkWithIcon>
                    <p className="text-inactive">contact me on telegram</p>
                </div>
            </div>
        </PageWrapper>
    )
}
