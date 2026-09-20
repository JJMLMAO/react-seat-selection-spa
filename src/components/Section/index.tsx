import  type { SeatSectionProps }  from "./types"

export default function SeatSection(props: SeatSectionProps) {
    const { sections } = props
    console.log("sections: ", sections)
    return (
        <>
            {sections.map((section) => {
                return (
                    <section key={section.id} className="seat-section">
                        <h2 className="seat-section__name">
                            {section.name}
                            
                        </h2>

                        
                    </section>
                )
            })}
        </>
    )
}
