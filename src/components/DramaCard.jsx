import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function DramaCard({ drama }) {
    const title = drama.title || drama.drama_title || drama.book_name || 'Untitled';
    const cover = drama.cover || drama.cover_image || drama.cover_url || 'https://placehold.co/300x450';
    const id = drama.bookId || drama.id || drama.book_id;

    if (!id) return null;

    return (
        <Link to={`/detail/${id}`} className="drama-card">
            <div className="card-image">
                <img src={cover} alt={title} loading="lazy" />
                <div className="overlay">
                    <Play size={48} fill="white" className="play-icon" />
                </div>
                {drama.is_vip && <span className="vip-badge">VIP</span>}
                {(drama.total_episodes || drama.chapter_count) && (
                    <span className="ep-badge">{drama.total_episodes || drama.chapter_count} EP</span>
                )}
            </div>
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
            </div>
            <style>{`
        .drama-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
        }
        .card-image {
          position: relative;
          aspect-ratio: 2/3;
          border-radius: var(--radius);
          overflow: hidden;
          background: var(--surface);
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          transition: transform 0.3s;
        }
        .drama-card:hover .card-image {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.5);
        }
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .drama-card:hover img {
          transform: scale(1.05);
        }
        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .drama-card:hover .overlay {
          opacity: 1;
        }
        .play-icon {
          transform: scale(0.8);
          transition: transform 0.2s;
        }
        .drama-card:hover .play-icon {
          transform: scale(1);
        }
        .vip-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #ffd700;
          color: black;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 800;
        }
        .ep-badge {
          position: absolute;
          bottom: 8px;
          left: 8px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          backdrop-filter: blur(4px);
        }
        .card-title {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: var(--text-main);
          transition: color 0.2s;
        }
        .drama-card:hover .card-title {
          color: var(--primary);
        }
      `}</style>
        </Link>
    );
}
