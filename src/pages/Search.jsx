import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import DramaCard from '../components/DramaCard';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query) {
            setLoading(true);
            api.search(query).then(res => {
                const data = res.data || res;
                setResults(Array.isArray(data) ? data : (data.list || []));
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    }, [query]);

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
                {query && (
                    <div className="section-header">
                        <h2>Hasil Pencarian: <span className="text-primary">"{query}"</span></h2>
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>Mencari drama...</div>
                ) : results.length > 0 ? (
                    <div className="grid-cards">
                        {results.map((item, idx) => <DramaCard key={item.bookId || item.id || idx} drama={item} />)}
                    </div>
                ) : (
                    <div className="empty-state">
                        <SearchIcon size={64} strokeWidth={1} />
                        <p>Tidak ada drama yang ditemukan untuk "{query}"</p>
                    </div>
                )}
            </div>
            <style>{`
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 0;
          color: var(--text-secondary);
          gap: 16px;
        }
        .text-primary { color: var(--primary); }
      `}</style>
        </>
    );
}
