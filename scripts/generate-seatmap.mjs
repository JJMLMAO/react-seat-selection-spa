import { writeFileSync } from "fs"

// seat sections
const SECTIONS = [
    {id: "alpha", name: "Alpha", rows: 5, seatsPerRow: 25, price: 250},
    {id: "beta", name: "Beta", rows: 5, seatsPerRow: 25, price: 150},
    {id: "charlie", name: "Charlie", rows: 5, seatsPerRow: 25, price: 50},
    {id: "delta", name: "Delta", rows: 5, seatsPerRow: 25, price: 30},
];

// SEATS that will be sold when user run
const UNAVAILABLE_SEATS = 0.30;

const rowLabel = (i) => String.fromCharCode(65 + i);

const sections = SECTIONS.map((section) => ({
    id: section.id,
    name: section.name,
    rows: Array.from({ length: section.rows }, (_, rowIndex) => {
        const label = rowLabel(rowIndex);
        return {
            id: `${section.id}-${label}`,
            label,
            seats: Array.from({ length: section.seatsPerRow }, (_, seatIndex) => {
                const number = seatIndex + 1;
                return {
                    id: `${section.id}-${label}-${number}`,
                    number,
                    price: section.price,
                    status: Math.random() < UNAVAILABLE_SEATS ? "unavailable" : "available"
                }
            })
        }
    })
}));

const seatmap = {
    eventId: "event_01",
    eventName: "An evening at the theature",
    venue: "Playhouse",
    sections
}

writeFileSync(
    "public/seatmap.json",
    JSON.stringify(seatmap, null, 2)
)

const total = sections.flatMap(s => s.rows).flatMap(r => r.seats).length;
console.log(`Wrote ${total} seats to public/seatmap.json`)


