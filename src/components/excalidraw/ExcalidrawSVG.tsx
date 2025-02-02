'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ExcalidrawSVG({ src, className = '' }: { src: string; width?: string; height?: string; className?: string }) {
    const [svgContent, setSvgContent] = useState('')
    const { resolvedTheme } = useTheme()
    useEffect(() => {
        const fetchSVG = async () => {
            try {
                const response = await fetch(`${src}-${resolvedTheme}.svg`)
                const text = await response.text()
                setSvgContent(text)
            } catch (error) {
                console.error('Error fetching SVG:', error)
            }
        }

        fetchSVG()
    }, [src, resolvedTheme])

    return <div className={className} dangerouslySetInnerHTML={{ __html: svgContent }} />
}
