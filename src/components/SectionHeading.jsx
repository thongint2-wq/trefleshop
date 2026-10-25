export default function SectionHeading({ eyebrow, title, action, badge }) {
    return (
        <div className="section-heading">
            <div>
                <span className="small-title">{eyebrow}</span>
                <h2>{title}</h2>
            </div>
            {action || badge}
        </div>
    );
}
