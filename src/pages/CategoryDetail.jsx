import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
// import Navbar from '../components/Navbar';
import DramaCard from '../components/DramaCard';

export default function CategoryDetail() {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Page 1, Size 20
        api.getByCategory(id, 1, 20).then(res => {
            const d = res.data || res;
            setData(Array.isArray(d) ? d : (d.list || []));
            setLoading(false);
        });
    }, [id]);

    return (
        <>
// Navbar removed
            <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
                <h1 className="heading">Kategori {id}</h1>
                {loading ? <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div> : (
                    <div className="grid-cards">
                        {data.map((item, i) => <DramaCard key={item.bookId || i} drama={item} />)}
                    </div>
                )}
            </div>
        </>
    )
}
