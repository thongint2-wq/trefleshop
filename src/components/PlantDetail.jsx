import { useEffect, useState } from "react";
import { addFavorite, checkFavorite, removeFavorite } from "../services/plantApi";
import PlantCare from "./PlantCare";

export default function PlantDetail({ plant }) {
    const [favorite, setFavorite] = useState(null);
    const [saving, setSaving] = useState(false);
    const [favoriteError, setFavoriteError] = useState(false);

    useEffect(() => {
        let active = true;
        checkFavorite(plant.slug)
            .then(result => {
                if (active) setFavorite(result.favorite === true);
            })
            .catch(error => {
                console.error("Check Favorite Error:", error);
                if (active) setFavoriteError(true);
            });

        return () => {
            active = false;
        };
    }, [plant.slug]);

    async function toggleFavorite() {
        setSaving(true);
        try {
            if (favorite) {
                await removeFavorite(plant.slug);
                setFavorite(false);
            } else {
                await addFavorite(plant);
                setFavorite(true);
            }
        } catch (error) {
            console.error("Favorite Error:", error);
            window.alert("Unable to update favorites.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            {plant.image_url && (
                <img className="detail-image" src={plant.image_url} alt={plant.common_name || plant.scientific_name} />
            )}
            <span className="small-title">PLANT INFORMATION</span>
            <h2>{plant.common_name || plant.scientific_name}</h2>
            <p className="scientific-name">{plant.scientific_name || "Scientific name unavailable"}</p>
            <button
                className={`favorite-button${favorite ? " is-favorite" : ""}`}
                type="button"
                disabled={favorite === null || saving}
                onClick={toggleFavorite}
            >
                {saving
                    ? (favorite ? "Removing..." : "Saving...")
                    : favoriteError ? "Favorite status unavailable."
                        : favorite === null ? "Checking..."
                            : favorite ? "❤️ Saved" : "♡ Save"}
            </button>
            {favoriteError && (
                    <p className="care-note" role="status">
                        Unable to check favorite status. Please refresh and try again.
                    </p>
            )}
            <PlantCare plant={plant} />
        </>
    );
}
