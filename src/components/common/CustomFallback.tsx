export default function CustomFallback({ loadingText }: { loadingText: string }) {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <p className="text-orange-400">{loadingText}</p>
        </div>
    )
}
