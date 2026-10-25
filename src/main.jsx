import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import FavoritesPage from "./pages/FavoritesPage";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import PlantDetailPage from "./pages/PlantDetailPage";
import "./styles.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SiteLayout><HomePage /></SiteLayout>} />
                <Route
                    path="/favorites.html"
                    element={<SiteLayout showBack><FavoritesPage /></SiteLayout>}
                />
                <Route
                    path="/history.html"
                    element={<SiteLayout showBack><HistoryPage /></SiteLayout>}
                />
                <Route
                    path="/plantDetail.html"
                    element={<SiteLayout showBack><PlantDetailPage /></SiteLayout>}
                />
                <Route path="*" element={<SiteLayout><HomePage /></SiteLayout>} />
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
