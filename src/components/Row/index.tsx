import type { Row } from "../../types"
import "./styled.css"
import Seat from "../Seat"

export default function SectionRow({rows}: {rows: Row[]}) {
    return (
        <>
            {rows.map((row) => {
                return (
                    <div className="row-div" key={row.id}>
                        <div className="row-label">
                            {row.label}
                        </div>
                        <Seat seats={row.seats} />
                    </div>
                )
            })}
        </>
    )
}
