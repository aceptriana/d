import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function Categories() {
    const [cats, setCats] = useState([]);

    useEffect(() => {
        api.getCategories().then(res => {
            const d = res.data || res;
            setCats(Array.isArray(d) ? d : (d.list || []));
        });
    }, []);

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
                <h1 className="heading">Kategori Drama</h1>
                <div className="cat-grid">
                    {cats.map((c, i) => (
                        <Link key={c.id || i} to={`/category/${c.id}`} className="cat-card">
                            <h3>{c.name || c.category_name || c.title || 'Category'}</h3>
                        </Link>
                    ))}
                </div>
            </div>
            <style>{`
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; }
        .cat-card {
           background: var(--surface);
           padding: 24px;
           border-radius: var(--radius);
           text-align: center;
           border: 1px solid var(--border);
           transition: all 0.2s;
        }
        .cat-card:hover {
           border-color: var(--primary);
           color: var(--primary);
           transform: translateY(-2px);
           background: var(--surface-hover);
        }
        .cat-card h3 { margin: 0; font-size: 1rem; font-weight: 600; }
      `}</style>
        </>
    )
}
