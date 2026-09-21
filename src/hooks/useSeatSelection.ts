import { useCallback, useState } from "react"


export function useSeatSelection(unavailableSeatIds: Set<string>) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    const toggleSeat = useCallback((id: string) => {
        if (unavailableSeatIds.has(id)) return

        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }, [unavailableSeatIds])

    return { selectedIds, toggleSeat }
}
