import type { Seatmap, SeatWithContext } from "../types";

/**
 * Collapses the sections → rows → seats tree into a single flat list.
 *
 * Each seat carries its section and row context along with it, because those
 * labels live two levels up the tree and are lost once you're holding a bare
 * seat. That's what lets a summary panel render "Alpha · Row B · Seat 12" from
 * a seat alone.
 *
 * Order is preserved (section order, then row, then seat number), so the flat
 * list still reads in seating order.
 */
export function flattenSeatMap(seatmap: Seatmap): SeatWithContext[] {
    return seatmap.sections.flatMap((section) =>
        section.rows.flatMap((row) =>
            row.seats.map((seat) => ({
                ...seat,
                sectionId: section.id,
                sectionName: section.name,
                rowLabel: row.label
            }))
        )
    )
}

/**
 * Builds a seat-id → seat lookup from a flattened list.
 *
 * Selection state is stored as a set of seat ids, so turning those ids back
 * into renderable seats needs a lookup. Doing it with this map is O(1) per id;
 * searching the tree (or the flat array) each time would re-walk 500 seats on
 * every click.
 *
 * Seat ids are globally unique ("alpha-A-1"), so nothing collides here.
 */
export function indexSeats(seats: SeatWithContext[]): Map<string, SeatWithContext> {
    return new Map(seats.map((seat) => [seat.id, seat]))
}

/**
 * Gathers the ids of every already-sold seat.
 *
 * The seatmap's own `status` field is the authority on this, so the set is a
 * convenience for membership checks — `unavailable.has(id)` — when you only
 * have an id in hand, such as when guarding a toggle against selecting a seat
 * that can't be booked.
 */
export function collectUnavailable(seats: SeatWithContext[]): Set<string> {
    return new Set(
        seats.filter((seat) => seat.status === "unavailable").map((seat) => seat.id)
    )
}