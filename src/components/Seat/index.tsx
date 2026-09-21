import type { Seat } from "../../types";
import "./styled.css"

type SeatProps = {
    seats: Seat[];
    selectedIds: Set<string>;
    onToggle: (seatId: string) => void;
}

export default function Seat({seats, selectedIds, onToggle}: SeatProps) {
    return (
        <>
            {seats.map((seat) => {
                return (
                    <div
                        className="seat"
                        data-status={seat.status}
                        data-selected={selectedIds.has(seat.id)}
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
