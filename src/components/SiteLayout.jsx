import { Link, useLocation, useNavigate } from "react-router-dom";

export function SiteHeader() {
    const location = useLocation();

    return (
        <header className="header">
            <div className="nav">
                <Link to="/" className="brand">
                    <div className="brand-icon">🌿</div>
                    <div>
                        <h1>Trefle Plant Shop</h1>
                        <span>
                            {location.pathname === "/favorites.html"
                                ? "Your favorite plants"
                                : location.pathname === "/history.html"
                                    ? "Plants you've viewed"
                                    : location.pathname === "/plantDetail.html"
                                        ? "Plant information"
                                        : "Discover your favorite plants"}
                        </span>
                    </div>
                </Link>
                <nav className="nav-actions" aria-label="Main navigation">
                    <Link
                        to="/history.html"
                        className="favorites-link"
                        aria-current={location.pathname === "/history.html" ? "page" : undefined}
                    >
                        🕘 Viewing history
                    </Link>
                    <Link
                        to="/favorites.html"
                        className="favorites-link"
                        aria-current={location.pathname === "/favorites.html" ? "page" : undefined}
                    >
                        ❤️ Favorites
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export function BackButton() {
    const navigate = useNavigate();

    function goBack(event) {
        const referrer = document.referrer;
        if (referrer && new URL(referrer).origin === window.location.origin) {
            event.preventDefault();
            navigate(-1);
        }
    }

    return (
        <a href="/" className="back-button corner-back-button" onClick={goBack}>
            <span aria-hidden="true">←</span>
            Back
        </a>
    );
}

export function SiteFooter() {
    return (
        <footer className="footer">
            <strong>🌿 Trefle Plant Shop</strong>
            <span>Plant information powered by Trefle API</span>
        </footer>
    );
}

export default function SiteLayout({ children, showBack = false }) {
    return (
        <>
            {showBack && <BackButton />}
            <SiteHeader />
            {children}
            <SiteFooter />
        </>
    );
}
