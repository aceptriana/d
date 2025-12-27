import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import DramaCard from '../components/DramaCard';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Search state for input
    const [searchTerm, setSearchTerm] = useState(query || '');

    // Sync local state with URL query if URL changes externally
    useEffect(() => {
        setSearchTerm(query || '');
    }, [query]);

    useEffect(() => {
        if (query) {
            setLoading(true);
            api.search(query).then(res => {
                const data = res.data || res;
                setResults(Array.isArray(data) ? data : (data.list || []));
                setLoading(false);
            }).catch(() => setLoading(false));
        } else {
            setResults([]);
        }
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Use window.location as valid workaround or assume router context. 
        // Better: we can't easily use useNavigate cleanly without importing it, 
        // but wait, line 2 had `import { useSearchParams } from 'react-router-dom';`.
        // I can just add `useNavigate` to imports.
        window.location.search = `?q=${encodeURIComponent(searchTerm)}`;
    };

    return (
        <>
            <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
                <form onSubmit={handleSearch} className="search-bar">
                    <input
                        type="text"
                        placeholder="Cari drama..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-btn"><SearchIcon size={20} /></button>
                </form>

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
                    query && (
                        <div className="empty-state">
                            <SearchIcon size={64} strokeWidth={1} />
                            <p>Tidak ada drama yang ditemukan untuk "{query}"</p>
                        </div>
                    )
                )}

                {!query && !loading && (
                    <div className="empty-state">
                        <SearchIcon size={64} strokeWidth={1} />
                        <p>Silakan cari drama favoritmu</p>
                    </div>
                )}
            </div>
            <style>{`
                .search-bar {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 24px;
                }
                .search-input {
                    flex: 1;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    padding: 12px 16px;
                    border-radius: var(--radius);
                    color: white;
                    font-size: 1rem;
                }
                .search-input:focus {
                    outline: none;
                    border-color: var(--primary);
                }
                .search-btn {
                    padding: 0 20px;
                    background: var(--primary);
                    border: none;
                    border-radius: var(--radius);
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
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
