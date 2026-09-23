import type { Seatmap, SeatWithContext } from "../types";

// Collapses the sections → rows → seats tree into a single flat list.
export function flattenSeatMap(seatmap: Seatmap): SeatWithContext[] {
    return (seatmap.sections ?? []).flatMap((section) =>
        (section.rows ?? []).flatMap((row) =>
            (row.seats ?? []).map((seat) => ({
                ...seat,
                sectionId: section.id,
                sectionName: section.name,
                rowLabel: row.label
            }))
        )
    )
}

// Builds a seat-id → seat lookup from a flattened list.
export function indexSeats(seats: SeatWithContext[]): Map<string, SeatWithContext> {
    return new Map(seats.map((seat) => [seat.id, seat]))
}


// Gathers the ids of every already-sold seat.
export function collectUnavailable(seats: SeatWithContext[]): Set<string> {
    return new Set(
        seats.filter((seat) => seat.status === "unavailable").map((seat) => seat.id)
    )
}

export function groupBy<T, K>(items: T[], key: (item: T) => K): Map<K, T[]> {
    return items.reduce((acc, item) => {
        const k = key(item)
        const group = acc.get(k) ?? []
        group.push(item)
        return acc.set(k, group)
    }, new Map<K, T[]>())
}

// can play around with this to make rival buyers more or less aggressive
// reduce to make rival buyers less aggressive; vice versa to make them more aggressive
export const CLASH_BIAS = 0.3

export function pickSeatToTake(
    allSeats: SeatWithContext[],
    unavailableIds: Set<string>,
    selectedIds: Set<string>,
    random: () => number = Math.random,
): string | null {
    const contested = [...selectedIds].filter((id) => !unavailableIds.has(id))
    if (contested.length > 0 && random() < CLASH_BIAS) {
        return contested[Math.floor(random() * contested.length)]
    }

    const free = allSeats.filter(
        (seat) => !unavailableIds.has(seat.id) && !selectedIds.has(seat.id)
    )
    if (free.length === 0) return null
    return free[Math.floor(random() * free.length)].id
}