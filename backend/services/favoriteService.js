const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const SESSION_COOKIE = "trefle_favorites_session";
const FAVORITES_DIRECTORY = path.join(__dirname, "../data/favorites");
const memoryFavorites = new Map();

function getStorageKey(ownerId) {
    return `trefle:favorites:${ownerId}`;
}

async function readFavorites(ownerId) {
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;

    if (kvUrl && kvToken) {
        const response = await fetch(
            `${kvUrl.replace(/\/$/, "")}/get/${encodeURIComponent(getStorageKey(ownerId))}`,
            { headers: { Authorization: `Bearer ${kvToken}` } }
        );
        if (!response.ok) {
            throw new Error(`Favorite storage returned ${response.status}`);
        }
        const result = await response.json();
        if (!result.result) return [];
        try {
            const plants = JSON.parse(result.result);
            return Array.isArray(plants) ? plants : [];
        } catch {
            return [];
        }
    }

    if (memoryFavorites.has(ownerId)) {
        return memoryFavorites.get(ownerId);
    }

    try {
        const data = await fs.readFile(path.join(FAVORITES_DIRECTORY, `${ownerId}.json`), "utf8");
        const plants = JSON.parse(data);
        const savedPlants = Array.isArray(plants) ? plants : [];
        memoryFavorites.set(ownerId, savedPlants);
        return savedPlants;
    } catch (error) {
        if (error.code === "ENOENT") {
            memoryFavorites.set(ownerId, []);
            return [];
        }
        throw error;
    }
}

async function writeFavorites(ownerId, plants) {
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;

    if (kvUrl && kvToken) {
        const response = await fetch(
            `${kvUrl.replace(/\/$/, "")}/set/${encodeURIComponent(getStorageKey(ownerId))}/${encodeURIComponent(JSON.stringify(plants))}`,
            { headers: { Authorization: `Bearer ${kvToken}` } }
        );
        if (!response.ok) {
            throw new Error(`Favorite storage returned ${response.status}`);
        }
    } else {
        await fs.mkdir(FAVORITES_DIRECTORY, { recursive: true });
        await fs.writeFile(
            path.join(FAVORITES_DIRECTORY, `${ownerId}.json`),
            JSON.stringify(plants, null, 2),
            "utf8"
        );
    }

    memoryFavorites.set(ownerId, plants);
}

function getOwnerId(req, res) {
    const cookies = Object.fromEntries(
        String(req.headers.cookie || "")
            .split(";")
            .map(cookie => cookie.trim().split("="))
            .filter(parts => parts.length === 2)
            .map(([key, value]) => {
                try {
                    return [key.trim(), decodeURIComponent(value)];
                } catch {
                    return [key.trim(), ""];
                }
            })
    );

    let ownerId = cookies[SESSION_COOKIE];
    if (!/^[a-f0-9]{64}$/i.test(ownerId || "")) {
        ownerId = crypto.randomBytes(32).toString("hex");
        res.cookie(SESSION_COOKIE, ownerId, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 365 * 24 * 60 * 60 * 1000
        });
    }

    return ownerId;
}

async function addFavorite(ownerId, plant) {
    const plants = await readFavorites(ownerId);
    const nextPlants = plants.some(savedPlant => savedPlant.slug === plant.slug)
        ? plants.map(savedPlant => savedPlant.slug === plant.slug ? plant : savedPlant)
        : [...plants, plant];

    await writeFavorites(ownerId, nextPlants);
    return plant;
}

async function removeFavorite(ownerId, slug) {
    const plants = await readFavorites(ownerId);
    await writeFavorites(ownerId, plants.filter(plant => plant.slug !== slug));
}

async function getFavorites(ownerId) {
    return await readFavorites(ownerId);
}

async function isFavorite(ownerId, slug) {
    const plants = await readFavorites(ownerId);
    return plants.some(plant => plant.slug === slug);
}

module.exports = {
    addFavorite,
    removeFavorite,
    getFavorites,
    isFavorite,
    getOwnerId
};
