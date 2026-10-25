async function requestJson(url, options) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
    }

    return response.status === 204 ? null : response.json();
}

export function searchPlants(query) {
    return requestJson(`/api/plants/search?q=${encodeURIComponent(query)}`);
}

export function getRecommendations() {
    return requestJson("/api/plants/recommendations");
}

export function getPlant(slug) {
    return requestJson(`/api/plants/${encodeURIComponent(slug)}`);
}

export function getFavorites() {
    return requestJson("/api/favorites");
}

export function checkFavorite(slug) {
    return requestJson(`/api/favorites/${encodeURIComponent(slug)}`);
}

export function addFavorite(plant) {
    return requestJson("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plant)
    });
}

export function removeFavorite(slug) {
    return requestJson(`/api/favorites/${encodeURIComponent(slug)}`, {
        method: "DELETE"
    });
}
