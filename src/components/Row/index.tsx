import type { Row } from "../../types"
import "./styled.css"
import Seat from "../Seat"

type SectionRowProps = {
    rows: Row[];
    selectedIds: Set<string>;
    onToggle: (seatId: string) => void;
}

export default function SectionRow({rows, selectedIds, onToggle}: SectionRowProps) {
    return (
        <>
            {rows.map((row) => {
                return (
                    <div className="row-div" key={row.id}>
                        <div className="row-label">
                            {row.label}
                        </div>
                        <Seat
                            seats={row.seats}
                            selectedIds={selectedIds}
                            onToggle={onToggle}
                        />
                    </div>
                )
            })}
        </>
    )
}
