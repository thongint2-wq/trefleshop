import PlantGrid from "./PlantGrid";
import SectionHeading from "./SectionHeading";

export default function ResultSection({ eyebrow, title, headingAction, children }) {
    return (
        <section className="result-section">
            <SectionHeading
                eyebrow={eyebrow}
                title={title}
                action={headingAction}
            />
            <PlantGrid aria-live="polite">
                {children}
            </PlantGrid>
        </section>
    );
}
