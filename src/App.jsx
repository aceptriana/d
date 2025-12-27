import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Search from './pages/Search'
import Detail from './pages/Detail'
import Watch from './pages/WatchScene'
import Vip from './pages/Vip'
import Categories from './pages/Categories'
import CategoryDetail from './pages/CategoryDetail'

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

import BottomNavbar from './components/BottomNavbar';

function App() {
    const { pathname } = useLocation();

    // Hide navbar on watch page if desired, or keep it. 
    // User requested "pas play vidio buat kaya full screen", maybe meaning the player itself.
    // Let's keep navbar everywhere for now.

    return (
        <div className="app">
            <ScrollToTop />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/detail/:id" element={<Detail />} />
                    <Route path="/watch/:id/:episode" element={<Watch />} />
                    <Route path="/vip" element={<Vip />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/category/:id" element={<CategoryDetail />} />
                </Routes>
            </div>
            <BottomNavbar />
            <style>{`
                .app {
                    min-height: 100vh;
                    background: var(--background);
                }
                .main-content {
                    padding-bottom: 80px; /* Space for BottomNavbar */
                }
            `}</style>
        </div>
    )
}

export default App
