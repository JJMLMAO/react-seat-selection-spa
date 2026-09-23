import { memo } from "react";
import type { SeatProps } from "./types"
import "./styled.css"

function Seat({ id, number, selected, unavailable, onToggle }: SeatProps) {
    return (
        <div
            className="seat"
            data-status={unavailable ? "unavailable" : "available"}
            data-selected={selected}
            data-conflicted={selected && unavailable}
            onClick={() => onToggle(id)}
        >
            {number}
        </div>
    )
}

export default memo(Seat)
