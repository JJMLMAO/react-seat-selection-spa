import type { Seat } from "../../types";
import "./styled.css"

export default function Seat({seats}: {seats: Seat[]}) {
    return (
        <>
            {seats.map((seat) => {
                return (
                    <div className="seat" key={seat.id}>
                        {seat.number}
                    </div>
                )
            })}
        </>
    )
}
