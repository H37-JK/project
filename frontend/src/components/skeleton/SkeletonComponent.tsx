// components/SkeletonItem.tsx
export default function SkeletonComponent() {
    return (
        <div className="flex items-center p-3.5 py-1.5 gap-2 border-b border-zinc-800 animate-pulse">
            <div className="h-4 w-4 bg-zinc-700 rounded-sm shrink-0" />

            <div className="flex-1 min-w-0">
                <div className="h-4 bg-zinc-700 rounded w-3/4" />
            </div>

            <div className="h-4 w-4 bg-zinc-700 rounded-sm shrink-0" />
        </div>
    );
}