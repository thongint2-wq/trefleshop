// # ส่งคำขอไปยัง backend และแปลงผลตอบกลับ JSON พร้อมแจ้งข้อผิดพลาด HTTP
async function requestJson(url, options) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
    }

    return response.status === 204 ? null : response.json();
}

// # ค้นหาต้นไม้ด้วยคำค้น
export function searchPlants(query) {
    return requestJson(`/api/plants/search?q=${encodeURIComponent(query)}`);
}

// # ขอรายการดอกไม้แนะนำ
export function getRecommendations() {
    return requestJson("/api/plants/recommendations");
}

// # ขอรายละเอียดต้นไม้ตาม slug
export function getPlant(slug) {
    return requestJson(`/api/plants/${encodeURIComponent(slug)}`);
}

// # ขอรายการโปรดทั้งหมด
export function getFavorites() {
    return requestJson("/api/favorites");
}

// # ตรวจสอบว่าต้นไม้ตาม slug เป็นรายการโปรดหรือไม่
export function checkFavorite(slug) {
    return requestJson(`/api/favorites/${encodeURIComponent(slug)}`);
}

// # เพิ่มต้นไม้ลงในรายการโปรด
export function addFavorite(plant) {
    return requestJson("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plant)
    });
}

// # ลบต้นไม้ออกจากรายการโปรด
export function removeFavorite(slug) {
    return requestJson(`/api/favorites/${encodeURIComponent(slug)}`, {
        method: "DELETE"
    });
}
