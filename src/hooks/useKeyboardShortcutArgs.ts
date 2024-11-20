import { useEffect } from 'react'

// https://dev.to/brdnicolas/click-outside-magic-a-new-custom-hook-4np4
export function useKeyboardShortcut({ key, onKeyPressed }: { key: string; onKeyPressed: () => void }) {
    useEffect(() => {
        function keyDownHandler(e: globalThis.KeyboardEvent) {
            if (e.key === key) {
                e.preventDefault()
                onKeyPressed()
            }
        }
        document.addEventListener('keydown', keyDownHandler)
        return () => {
            document.removeEventListener('keydown', keyDownHandler)
        }
    }, [])
}
