import { Home, Search, Grid, Crown } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function BottomNavbar() {
    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Search, label: 'Cari', path: '/search' },
        { icon: Grid, label: 'Kategori', path: '/categories' },
        { icon: Crown, label: 'VIP', path: '/vip' },
    ];

    return (
        <>
            <nav className="bottom-navbar">
                {navItems.map((item) => (
                    <NavLink
                        to={item.path}
                        key={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={24} strokeWidth={2} />
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <style>{`
        .bottom-navbar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: rgba(20, 20, 20, 0.95);
          backdrop-filter: blur(10px);
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-around;
          align-items: center;
          z-index: 1000;
          padding-bottom: env(safe-area-inset-bottom);
          box-shadow: 0 -4px 20px rgba(0,0,0,0.5);
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          font-size: 11px;
          gap: 4px;
          flex: 1;
          height: 100%;
          transition: all 0.2s;
        }
        .nav-item:active {
            transform: scale(0.95);
        }
        .nav-item.active {
          color: var(--primary);
        }
        .nav-item.active svg {
            filter: drop-shadow(0 0 8px rgba(255, 85, 0, 0.4));
        }
      `}</style>
        </>
    );
}
