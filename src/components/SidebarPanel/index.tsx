import type { SeatWithContext } from '../../types'

type SidebarPanelProps = {
    selectedSeats: SeatWithContext[];
    onRemove: (seatId: string) => void;
}

export default function SidebarPanel({selectedSeats, onRemove}: SidebarPanelProps) {
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
                      <li key={id}>
                        <span>Row {rowLabel} · Seat {number} — ${price}</span>
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
