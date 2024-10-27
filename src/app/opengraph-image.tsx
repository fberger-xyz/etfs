import { APP_METADATA } from '@/config/app.config'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = APP_METADATA.SITE_NAME
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                tw="flex flex-col items-center justify-center w-full h-full text-white"
                style={{
                    background: 'linear-gradient(96deg, rgba(53,53,62,1) 0%, rgba(1,1,22,1) 46%, rgba(33,33,38,1) 100%)',
                }}
            >
                <h1 tw="text-8xl">{APP_METADATA.SITE_NAME}</h1>
                <p tw="text-4xl">{APP_METADATA.SITE_INFO}</p>
            </div>
        ),
    )
}
