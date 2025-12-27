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

import Footer from './components/Footer';

function App() {
    return (
        <div className="app">
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/detail/:id" element={<Detail />} />
                <Route path="/watch/:id/:episode" element={<Watch />} />
                <Route path="/vip" element={<Vip />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/category/:id" element={<CategoryDetail />} />
            </Routes>
            <Footer />
        </div>
    )
}

export default App
