const crypto = require("crypto");

const SESSION_COOKIE = "trefle_favorites_session";

// # เก็บรายการโปรดใน Array ของหน่วยความจำของ Node.js
// ข้อมูลจะหายเมื่อเซิร์ฟเวอร์ restart หรือ serverless instance ถูกสร้างใหม่
const favorites = [];

function readFavorites(ownerId) {
    return favorites;
}

function writeFavorites(ownerId, plants) {
    favorites.splice(0, favorites.length, ...plants);
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
    const plants = readFavorites(ownerId);
    const nextPlants = plants.some(savedPlant => savedPlant.slug === plant.slug)
        ? plants.map(savedPlant => savedPlant.slug === plant.slug ? plant : savedPlant)
        : [...plants, plant];

    writeFavorites(ownerId, nextPlants);
    return plant;
}

async function removeFavorite(ownerId, slug) {
    const plants = readFavorites(ownerId);
    writeFavorites(ownerId, plants.filter(plant => plant.slug !== slug));
}

async function getFavorites(ownerId) {
    return readFavorites(ownerId);
}

async function isFavorite(ownerId, slug) {
    const plants = readFavorites(ownerId);
    return plants.some(plant => plant.slug === slug);
}

module.exports = {
    addFavorite,
    removeFavorite,
    getFavorites,
    isFavorite,
    getOwnerId
};
