import { useEffect, useState } from 'react';
import { api } from '../services/api';
import DramaCard from '../components/DramaCard';
import { Flame, Star, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Home() {
    const [latest, setLatest] = useState([]);
    const [dubbed, setDubbed] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [homeRes, dubbedRes, recRes] = await Promise.allSettled([
                    api.getHome(),
                    api.getDubbed(),
                    api.getRecommend(),
                ]);

                const extractList = (res) => {
                    const data = res.value?.data || res.value;
                    if (!data) return [];
                    if (Array.isArray(data)) return data;
                    return data.list || data.book || data.data?.columnVoList?.[0]?.bookList || [];
                };

                if (homeRes.status === 'fulfilled') {
                    setLatest(extractList(homeRes));
                }
                if (dubbedRes.status === 'fulfilled') {
                    setDubbed(extractList(dubbedRes));
                }
                if (recRes.status === 'fulfilled') {
                    setRecommended(extractList(recRes));
                }
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const Section = ({ title, icon: Icon, data }) => (
        <section className="section">
            <div className="section-header">
                <div className="section-title">
                    {Icon && <Icon className="text-primary" size={24} />}
                    <h2>{title}</h2>
                </div>
            </div>
            <div className="grid-cards">
                {data.map((item, idx) => <DramaCard key={(item.bookId || item.id) + idx} drama={item} />)}
            </div>
        </section>
    );

    return (
        <>
            <Navbar />
            <div className="container home-page">
                {loading ? (
                    <div className="loading-state">
                        <div className="skeleton" style={{ height: '300px', marginBottom: '20px' }}></div>
                        <div className="skeleton" style={{ height: '300px' }}></div>
                    </div>
                ) : (
                    <>
                        <div className="hero">
                            <h1 className="heading">Selamat Datang di Barudak Dracin</h1>
                            <p className="subtitle">Tempat nonton drama china terlengkap dan gratis.</p>
                        </div>

                        {dubbed.length > 0 && <Section title="Drama Sulih Suara (Dubbed)" icon={Flame} data={dubbed} />}
                        {recommended.length > 0 && <Section title="Rekomendasi Editor" icon={Star} data={recommended} />}
                        {latest.length > 0 && <Section title="Drama Terbaru" icon={Sparkles} data={latest} />}
                    </>
                )}
            </div>
            <style>{`
        .home-page { padding-top: 24px; padding-bottom: 48px; }
        .hero { text-align: center; margin-bottom: 48px; padding: 48px 0; background: linear-gradient(to bottom, rgba(255,85,0,0.1), transparent); border-radius: var(--radius); }
        .subtitle { color: var(--text-secondary); margin-top: 12px; font-size: 1.1rem; }
        .section { margin-bottom: 48px; }
        .section-header { margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; }
        .section-title { display: flex; align-items: center; gap: 12px; }
        .section-title h2 { margin: 0; font-size: 1.5rem; font-weight: 700; color: white; }
        .text-primary { color: var(--primary); }
        .loading-state { padding: 48px 0; }
      `}</style>
        </>
    );
}
