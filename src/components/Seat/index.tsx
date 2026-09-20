import type { Seat } from "../../types";

export default function Seat({seats}: {seats: Seat[]}) {
    console.log("seat: ", seats)
    return (
        <>
            {seats.map((seat) => {
                return (
                    <div key={seat.id}>
                        {seat.number}
                    </div>
                )
            })}
        </>
    )
}