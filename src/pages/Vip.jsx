import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import DramaCard from '../components/DramaCard';

export default function Vip() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getVip().then(res => {
            const d = res.data || res;
            setData(Array.isArray(d) ? d : (d.list || []));
            setLoading(false);
        });
    }, []);

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
                <h1 className="heading">VIP Channel</h1>
                {loading ? <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div> : (
                    <div className="grid-cards">
                        {data.map((item, i) => <DramaCard key={item.bookId || i} drama={item} />)}
                    </div>
                )}
            </div>
        </>
    )
}
