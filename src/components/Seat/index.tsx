import type { Seat } from "../../types";
import "./styled.css"

type SeatProps = {
    seats: Seat[];
    selectedIds: Set<string>;
    unavailableIds: Set<string>;
    onToggle: (seatId: string) => void;
}

export default function Seat({seats, selectedIds, unavailableIds, onToggle}: SeatProps) {
    return (
        <>
            {seats.map((seat) => {
                /* unavailableIds, not seat.status: the JSON status only seeds
                   that set at load, and rival buyers change it as they go. */
                const taken = unavailableIds.has(seat.id)
                const selected = selectedIds.has(seat.id)

                return (
                    <div
                        className="seat"
                        data-status={taken ? "unavailable" : "available"}
                        data-selected={selected}
                        data-conflicted={selected && taken}
                        key={seat.id}
                        onClick={() => onToggle(seat.id)}
                    >
                        {seat.number}
                    </div>
                )
            })}
        </>
    )
}
