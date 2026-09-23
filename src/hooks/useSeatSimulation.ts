import { useEffect, useRef } from "react"
import type { SeatWithContext } from "../types"
import { pickSeatToTake } from "../helpers/seatmapHelpers"

const TICK_MS = 3000

/**
 * Simulates real scenarios where other buyers are reserving the seats.
 *
 * Will be fired only while the user holds at least one seat: an untouched map stays
 * static, so nothing moves until the user has something to lose.
 */
export function useSeatSimulation(
    allSeats: SeatWithContext[],
    unavailableIds: Set<string>,
    selectedIds: Set<string>,
    onSeatTaken: (seatId: string) => void,
    enabled = true,
) {
    /* The ticker reads state through a ref rather than a dep array: listing
       selectedIds as a dep would tear down and rebuild the interval on every
       click, restarting the countdown and letting a fast-clicking user stall
       the simulator indefinitely. */
    const latest = useRef({ allSeats, unavailableIds, selectedIds })

    /* Written in an effect rather than during render: assigning to a ref mid
       render is a concurrent-rendering hazard, since React may render without
       committing. The deps are exactly the three values being cached, so the
       ref is refreshed when one of them changes and skipped otherwise. */
    useEffect(() => {
        latest.current = { allSeats, unavailableIds, selectedIds }
    }, [allSeats, unavailableIds, selectedIds])

    /* Rival buyers stop the moment the order is locked in — a booked seat
       cannot be taken from under the user, and the map should sit still
       while they read their confirmation. */
    const armed = enabled && selectedIds.size > 0

    useEffect(() => {
        if (!armed) return

        const timer = setInterval(() => {
            const { allSeats, unavailableIds, selectedIds } = latest.current
            const target = pickSeatToTake(allSeats, unavailableIds, selectedIds)
            if (target) onSeatTaken(target)
        }, TICK_MS)

        /* Also what stops StrictMode's dev double-mount from running two
           tickers at twice the intended rate. */
        return () => clearInterval(timer)
    }, [armed, onSeatTaken])
}
