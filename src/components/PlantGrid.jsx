export default function PlantGrid({ children, ...props }) {
    return (
        <div className="plant-grid" {...props}>
            {children}
        </div>
    );
}
