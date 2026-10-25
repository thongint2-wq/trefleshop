import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import FavoritesPage from "./pages/FavoritesPage";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import PlantDetailPage from "./pages/PlantDetailPage";
import "./styles.css";

// # กำหนดเส้นทางหน้าทั้งหมด และครอบแต่ละหน้าด้วยโครงร่างเว็บไซต์
function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* # จุดเชื่อมจากหน้าแรกไปหน้ารายการโปรด ประวัติ และรายละเอียดผ่านเมนูหรือการ์ดต้นไม้ */}
                <Route path="/" element={<SiteLayout><HomePage /></SiteLayout>} />
                {/* # หน้ารายการโปรด เชื่อมกลับหน้าแรก/ประวัติจากเมนู และไปหน้ารายละเอียดจากการ์ด */}
                <Route
                    path="/favorites.html"
                    element={<SiteLayout showBack><FavoritesPage /></SiteLayout>}
                />
                {/* # หน้าประวัติ เชื่อมกลับหน้าแรก/รายการโปรดจากเมนู และไปหน้ารายละเอียดจากการ์ด */}
                <Route
                    path="/history.html"
                    element={<SiteLayout showBack><HistoryPage /></SiteLayout>}
                />
                {/* # หน้ารายละเอียดต้นไม้ เมนูส่วนหัวเชื่อมไปหน้าแรก ประวัติ และรายการโปรด */}
                <Route
                    path="/plantDetail.html"
                    element={<SiteLayout showBack><PlantDetailPage /></SiteLayout>}
                />
                {/* # เส้นทางที่ไม่ตรงกับหน้าใดให้แสดงหน้าแรก */}
                <Route path="*" element={<SiteLayout><HomePage /></SiteLayout>} />
            </Routes>
        </BrowserRouter>
    );
}

// # เริ่มแสดงแอป React ใน element root ของหน้า HTML
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
