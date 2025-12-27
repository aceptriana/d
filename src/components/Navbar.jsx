import { Link, useNavigate } from 'react-router-dom';
import { Search, Home, Clapperboard, Flame } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    Barudak<span className="text-primary">Dracin</span>
                </Link>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Cari drama..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit"><Search size={18} /></button>
                </form>
                <div className="nav-links">
                    <Link to="/"><Home size={20} /> <span className="link-text">Home</span></Link>
                    <Link to="/vip"><Flame size={20} /> <span className="link-text">VIP</span></Link>
                    <Link to="/categories"><Clapperboard size={20} /> <span className="link-text">Kategori</span></Link>
                </div>
            </div>
            <style>{`
        .navbar {
          height: var(--header-height);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(10px);
          z-index: 100;
          display: flex;
          align-items: center;
        }
        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 24px;
        }
        .logo {
          font-size: 1.8rem;
          font-weight: 800;
          color: white;
          letter-spacing: -1px;
          white-space: nowrap;
        }
        .text-primary {
          color: var(--primary);
        }
        .search-form {
          flex: 1;
          max-width: 400px;
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-form input {
          width: 100%;
          padding: 12px 40px 12px 16px;
          border-radius: 99px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: white;
          font-family: inherit;
          transition: all 0.2s;
        }
        .search-form input:focus {
          outline: none;
          border-color: var(--primary);
          background: var(--surface-hover);
        }
        .search-form button {
          position: absolute;
          right: 8px;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 8px;
          display: flex;
        }
        .search-form button:hover {
          color: white;
        }
        .nav-links {
          display: flex;
          gap: 24px;
        }
        .nav-links a {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .nav-links a:hover, .nav-links a.active {
          color: var(--primary);
        }
        @media (max-width: 768px) {
          .link-text { display: none; }
          .logo { font-size: 1.4rem; }
          .nav-content { gap: 12px; }
          .search-form { max-width: 200px; }
        }
      `}</style>
        </nav>
    );
}
