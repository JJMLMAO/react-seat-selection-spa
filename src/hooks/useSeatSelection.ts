import { useCallback, useMemo, useState } from 'react'
import type { Seatmap, SeatWithContext } from '../types'

// Walks the tree once and denormalises section/row context onto each seat, so
// the summary panel can show "Alpha · Row B · Seat 12" from a seat id alone.
export function indexSeats(seatmap: Seatmap): Map<string, SeatWithContext> {
    const index = new Map<string, SeatWithContext>()

    for (const section of seatmap.sections) {
        for (const row of section.rows) {
            for (const seat of row.seats) {
                index.set(seat.id, {
                    ...seat,
                    sectionId: section.id,
                    sectionName: section.name,
                    rowLabel: row.label,
                })
            }
        }
    }

    return index
}

export function useSeatSelection(seatmap: Seatmap | null) {
    // Ids are the source of truth; everything else is derived from them.
    const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

    const seatIndex = useMemo(
        () => (seatmap ? indexSeats(seatmap) : new Map<string, SeatWithContext>()),
        [seatmap],
    )

    const toggle = useCallback((seatId: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (!next.delete(seatId)) next.add(seatId)
            return next
        })
    }, [])

    const clear = useCallback(() => setSelectedIds(new Set()), [])

    const selectedSeats = useMemo(() => {
        const seats: SeatWithContext[] = []
        for (const id of selectedIds) {
            const seat = seatIndex.get(id)
            if (seat) seats.push(seat)
        }
        return seats
    }, [selectedIds, seatIndex])

    const total = useMemo(
        () => selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
        [selectedSeats],
    )

    return { selectedIds, selectedSeats, total, toggle, clear }
}
