import type { SeatWithContext } from '../../types'
import { groupBy } from '../../helpers/seatmapHelpers'

type SidebarPanelProps = {
    selectedSeats: SeatWithContext[];
    unavailableIds: Set<string>;
    /* The booked order, or null while the user is still choosing. Non-null
       locks the panel: nothing here can be changed after checkout. */
    order: SeatWithContext[] | null;
    onRemove: (seatId: string) => void;
    onCheckout: () => void;
    onReset: () => void;
}

export default function SidebarPanel({ selectedSeats, unavailableIds, order, onRemove, onCheckout, onReset }: SidebarPanelProps) {
    const bySection = groupBy(selectedSeats, (seat) => seat.sectionName)

    const conflicted = selectedSeats.filter((seat) => unavailableIds.has(seat.id))
    /* Taken seats are excluded from the total: they cannot be bought, so
       counting them would quote a price the user can never pay. */
    const total = selectedSeats
        .filter((seat) => !unavailableIds.has(seat.id))
        .reduce((sum, seat) => sum + seat.price, 0)

    /* Checkout is blocked while anything is conflicted, so every seat in a
       completed order was buyable — no filtering needed here. */
    const paid = order?.reduce((sum, seat) => sum + seat.price, 0) ?? 0
    const orderLines = order
        ? [...groupBy(order, (seat) => `${seat.sectionName} · Row ${seat.rowLabel}`)]
        : []

    return (
        <aside>
            <h2>Seat Selection</h2>
            <div className="aside-body">
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
                                                : `MYR ${price}`}
                                        </span>
                                        {order === null && (
                                            <button
                                                type="button"
                                                className="seat-remove"
                                                onClick={() => onRemove(id)}
                                                aria-label={`Remove ${sectionName} Row ${rowLabel} Seat ${number}`}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
            </div>

            <div className="aside-footer">
                {order !== null && (
                    /* Announced because the panel changes without the focus
                       moving — a sighted user sees it, others would not. */
                    <div className="aside-order" role="status">
                        <p className="aside-order-head">
                            ✓ Booked {order.length} {order.length === 1 ? 'seat' : 'seats'}
                        </p>
                        {orderLines.map(([location, seats]) => (
                            <p key={location} className="aside-order-line">
                                {location} · {seats.map((seat) => seat.number).join(', ')}
                            </p>
                        ))}
                        <p className="aside-order-total">
                            <span>Total paid</span>
                            <span>MYR {paid}</span>
                        </p>
                    </div>
                )}

                {conflicted.length > 0 && (
                    <p className="aside-warning" id="checkout-blocked">
                        {conflicted.length === 1 ? 'A seat was' : `${conflicted.length} seats were`}
                        {' '}taken by someone else. Remove
                        {conflicted.length === 1 ? ' it' : ' them'} to continue.
                    </p>
                )}
                <button
                    type="button"
                    className="checkout"
                    onClick={onCheckout}
                    disabled={order !== null || selectedSeats.length === 0 || conflicted.length > 0}
                    /* Points the screen reader at the reason rather than
                       leaving a disabled button with no explanation. */
                    aria-describedby={conflicted.length > 0 ? 'checkout-blocked' : undefined}
                >
                    {order !== null ? 'Booked' : <>Checkout{total > 0 && ` · MYR ${total}`}</>}
                </button>

                {/* Only offered once an order is locked in — before that the
                    user can undo everything by deselecting, so a destructive
                    button would be noise. It is the only way out of a booked
                    order, hence never disabled. */}
                {order !== null && (
                    <button type="button" className="reset" onClick={onReset}>
                        Reset
                    </button>
                )}
            </div>
        </aside>
    )
}
