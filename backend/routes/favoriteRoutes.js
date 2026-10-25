// # กำหนด API endpoints สำหรับเพิ่ม ดู ตรวจสอบ และลบรายการโปรด
const express = require("express");
const router = express.Router();

const {
    addFavorite,
    removeFavorite,
    getFavorites,
    isFavorite
} = require("../services/favoriteService");

// # ตรวจสอบข้อมูลต้นไม้และเพิ่มลงในรายการโปรด
router.post("/", (req, res) => {
    const plant = req.body;

    if (!plant || typeof plant.slug !== "string" || !plant.slug.trim()) {
        return res.status(400).json({ error: "Invalid plant data" });
    }

    addFavorite(plant);
    res.status(201).json({ data: plant });
});

// # ส่งรายการต้นไม้โปรดทั้งหมดกลับ
router.get("/", (req, res) => {
    res.json({ data: getFavorites() });
});

// # ตรวจสอบว่ามีต้นไม้ slug นี้อยู่ในรายการโปรดหรือไม่
router.get("/:slug", (req, res) => {
    res.json({ favorite: isFavorite(req.params.slug) });
});

// # ลบต้นไม้ออกจากรายการโปรดด้วย slug
router.delete("/:slug", (req, res) => {
    removeFavorite(req.params.slug);
    res.status(204).end();
});

module.exports = router;