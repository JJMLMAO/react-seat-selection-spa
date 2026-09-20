import type { Row } from "../../types"
import "./styled.css"
import Seat from "../Seat"

export default function SectionRow({rows}: {rows: Row[]}) {
    console.log("row: ", rows)
    return (
        <>
            {rows.map((row) => {
                return (
                    <div className="row-div" key={row.id}>
                        <div>
                        {row.label}-{row.id}

                        </div>
                        {/* seats component here */}
                        <Seat seats={row.seats} />
                    </div>
                )
            })}
        </>
    )
}