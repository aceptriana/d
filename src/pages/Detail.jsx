import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import { Play, Star, List } from 'lucide-react';

export default function Detail() {
    const { id } = useParams();
    const [detail, setDetail] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const detailRes = await api.getDetail(id);
                // Correctly handle the v2 API structure: { data: { drama: { ... }, chapters: [...] } }
                const apiData = detailRes.data || detailRes;

                // If apiData has a 'drama' key, that's where the info is.
                const dramaInfo = apiData.drama || apiData;

                // Normalize the data
                const normalizedDetail = {
                    ...dramaInfo,
                    title: dramaInfo.bookName || dramaInfo.title || dramaInfo.name,
                    cover_image: dramaInfo.cover || dramaInfo.cover_image || dramaInfo.coverWap,
                    introduction: dramaInfo.introduction || dramaInfo.intro || dramaInfo.brief,
                    total_chapter: dramaInfo.chapterCount || dramaInfo.total_chapter,
                    score: dramaInfo.score || '9.0',
                    category: dramaInfo.tags?.map(t => t.tagName).join(', ') || dramaInfo.category
                };

                setDetail(normalizedDetail);

                // Chapters might be in apiData.chapters or separate
                const chapList = apiData.chapters || dramaInfo.chapters || [];

                // If chapters are missing in detail response, fetch them separately
                if (chapList.length > 0) {
                    setChapters(chapList);
                } else {
                    const chapRes = await api.getChapters(id);
                    const chapData = chapRes.data || chapRes;
                    setChapters(Array.isArray(chapData) ? chapData : (chapData.list || []));
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <> <Navbar /> <div className="container" style={{ paddingTop: 48, textAlign: 'center' }}>Loading...</div> </>;
    if (!detail) return <> <Navbar /> <div className="container" style={{ paddingTop: 48, textAlign: 'center' }}>Drama tidak ditemukan</div> </>;

    return (
        <>
            <Navbar />
            <div className="banner">
                <img src={detail.cover_image || detail.cover_url || detail.cover} alt="banner" className="banner-bg" />
                <div className="banner-overlay"></div>
                <div className="container banner-content">
                    <div className="poster">
                        <img src={detail.cover_image || detail.cover_url || detail.cover} alt="poster" />
                    </div>
                    <div className="info">
                        <h1 className="title">{detail.title || detail.novel_name || 'Untitled'}</h1>
                        <div className="meta">
                            {detail.category && <span className="tag">{detail.category}</span>}
                            <span><Star size={16} fill="#ff5500" stroke="none" /> {detail.score || '9.0'}</span>
                            <span>{detail.total_chapter || chapters.length} Episode</span>
                        </div>
                        <p className="summary">{detail.introduction || detail.intro || 'Tidak ada deskripsi.'}</p>
                        <div className="actions">
                            {chapters.length > 0 && (
                                <Link to={`/watch/${id}/1`} className="btn btn-primary">
                                    <Play size={20} style={{ marginRight: 8 }} fill="white" /> Mulai Nonton
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container chapters-section">
                <div className="section-header">
                    <List size={24} className="text-primary" /> <h2>Daftar Episode</h2>
                </div>
                <div className="chapter-grid">
                    {chapters.map((chap, idx) => (
                        <Link key={chap.id || idx} to={`/watch/${id}/${idx + 1}`} className="chapter-btn">
                            Episode {idx + 1}
                        </Link>
                    ))}
                </div>
            </div>

            <style>{`
        .banner {
          position: relative;
          min-height: 500px;
          display: flex;
          align-items: flex-end;
          padding-bottom: 48px;
        }
        .banner-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.2;
          filter: blur(20px);
        }
        .banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, var(--background) 10%, transparent 100%);
        }
        .banner-content {
          position: relative;
          z-index: 10;
          display: flex;
          gap: 48px;
          align-items: flex-end;
          width: 100%;
        }
        .poster {
          width: 250px;
          aspect-ratio: 2/3;
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          flex-shrink: 0;
        }
        .poster img { width: 100%; height: 100%; object-fit: cover; }
        .info { flex: 1; margin-bottom: 12px; }
        .title { font-size: 3rem; font-weight: 800; line-height: 1.1; margin-bottom: 16px; }
        .meta { display: flex; gap: 16px; font-size: 1rem; color: var(--text-secondary); margin-bottom: 24px; align-items: center; }
        .meta span { display: flex; align-items: center; gap: 6px; }
        .tag { background: rgba(255,85,0,0.2); color: var(--primary); padding: 4px 12px; border-radius: 99px; font-size: 0.85rem; font-weight: 600; }
        .summary { font-size: 1.1rem; line-height: 1.6; max-width: 800px; margin-bottom: 32px; color: #ccc; }
        
        .chapters-section { padding: 48px 24px; }
        .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .section-header h2 { margin: 0; }
        .chapter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 12px;
          margin-top: 24px;
        }
        .chapter-btn {
          background: var(--surface);
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          font-weight: 500;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .chapter-btn:hover {
          background: var(--surface-hover);
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-2px);
        }
        @media(max-width: 768px) {
           .banner-content { flex-direction: column; align-items: center; text-align: center; }
           .meta { justify-content: center; }
           .title { font-size: 2rem; }
           .poster { width: 180px; }
           .banner { min-height: auto; padding-top: 48px; }
        }
      `}</style>
        </>
    );
}
