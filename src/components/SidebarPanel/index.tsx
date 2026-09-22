import type { SeatWithContext } from '../../types'

type SidebarPanelProps = {
    selectedSeats: SeatWithContext[];
    unavailableIds: Set<string>;
    onRemove: (seatId: string) => void;
}

export default function SidebarPanel({ selectedSeats, unavailableIds, onRemove }: SidebarPanelProps) {
    const bySection = selectedSeats.reduce((acc, seat) => {
        const seats = acc.get(seat.sectionName) ?? []
        seats.push(seat)
        return acc.set(seat.sectionName, seats)
    }, new Map<string, SeatWithContext[]>())

    return (
        <aside>
            <h2>Seat Selection</h2>
            {selectedSeats.length === 0
                ? <p className="aside-empty">No seats selected yet.</p>
                : [...bySection].map(([sectionName, seats]) => (
                    <section key={sectionName}>
                        <h3>{sectionName}</h3>
                        <ul>
                            {seats.map(({ id, rowLabel, number, price }) => (
                                /* Every row here is selected by definition, so being
                                   unavailable *is* the clash — no separate flag. */
                                <li key={id} data-conflicted={unavailableIds.has(id)}>
                                    <span>
                                        Row {rowLabel} · Seat {number} —{' '}
                                        {unavailableIds.has(id)
                                            ? <span className="seat-taken">TAKEN</span>
                                            : `$${price}`}
                                    </span>
                                    <button
                                        type="button"
                                        className="seat-remove"
                                        onClick={() => onRemove(id)}
                                        aria-label={`Remove ${sectionName} Row ${rowLabel} Seat ${number}`}
                                    >
                                        ×
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
        </aside>
    )
}
