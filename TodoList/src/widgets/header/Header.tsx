import { Link } from "react-router-dom";

export function Header() {
    return (
        <div>
            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <h1 className="header-title">Мои задачи</h1>
                    <div className="header-actions">
                        <Link to="/auth" className="btn btn--text btn--danger">
                            <span>🚪</span> Выход
                        </Link>
                    </div>
                </div>
            </header>
        </div>
    )
}