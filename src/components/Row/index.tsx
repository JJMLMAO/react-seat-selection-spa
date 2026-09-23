import type { SectionRowProps } from "./types"
import "./styled.css"
import Seat from "../Seat"

export default function SectionRow({rows, selectedIds, unavailableIds, onToggle}: SectionRowProps) {
    return (
        <>
            {(rows ?? []).map((row) => {
                return (
                    <div className="row-div" key={row.id}>
                        <div className="row-label">
                            {row.label}
                        </div>
                        {(row.seats ?? []).map((seat) => (
                            <Seat
                                key={seat.id}
                                id={seat.id}
                                number={seat.number}
                                selected={selectedIds.has(seat.id)}
                                unavailable={unavailableIds.has(seat.id)}
                                onToggle={onToggle}
                            />
                        ))}
                    </div>
                )
            })}
        </>
    )
}
