import { useCallback, useState } from "react"


export function useSeatSelection(unavailableSeatIds: Set<string>) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    const toggleSeat = useCallback((id: string) => {
        setSelectedIds((prev) => {
            /* A conflicted seat — held by the user but taken out from under
               them — is unavailable yet still selected. The user must always
               be able to let go of it, so only acquiring is guarded.

               Returning prev rather than an equal-but-new Set matters: a fresh
               reference would re-render all 500 seats for no change. */
            if (!prev.has(id) && unavailableSeatIds.has(id)) return prev

            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }, [unavailableSeatIds])

    const clearSelection = useCallback(() => setSelectedIds(new Set()), [])

    return { selectedIds, toggleSeat, clearSelection }
}
