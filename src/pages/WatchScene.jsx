import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Hls from 'hls.js';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Watch() {
    const { id, episode } = useParams();
    const videoRef = useRef(null);
    const [url, setUrl] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch chapters for navigation
        api.getChapters(id).then(res => {
            const data = res.data || res;
            setChapters(Array.isArray(data) ? data : (data.list || []));
        });
    }, [id]);

    useEffect(() => {
        setLoading(true);
        setUrl(null);
        // Fetch stream link
        api.getStream(id, episode).then(res => {
            console.log("Stream API response:", res); // Debug log
            let streamUrl = null;

            // Handle various likely response structures
            const data = res.data || res;

            if (typeof data === 'string') {
                streamUrl = data;
            } else if (data?.url) {
                streamUrl = data.url;
            } else if (data?.chapter?.video) {
                // Structure from user example: data.chapter.video.m3u8 / mp4
                const video = data.chapter.video;
                streamUrl = video.m3u8 || video.mp4;
            } else if (data?.videoUrl) {
                streamUrl = data.videoUrl;
            }

            if (streamUrl) {
                setUrl(streamUrl);
            } else {
                console.warn("No stream URL found in response", res);
                // Don't set URL, let it show the error state or handle it
            }
            setLoading(false);
        }).catch(err => {
            console.error("Stream fetch error:", err);
            setLoading(false);
        });
    }, [id, episode]);

    useEffect(() => {
        // Initialize Player when URL is ready
        if (url && videoRef.current) {
            if (Hls.isSupported() && url.includes('.m3u8')) {
                const hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(videoRef.current);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    videoRef.current.play().catch(e => console.log("Auto-play prevented", e));
                });
                return () => hls.destroy();
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                // Native HLS (Safari)
                videoRef.current.src = url;
                videoRef.current.addEventListener('loadedmetadata', () => {
                    videoRef.current.play().catch(e => console.log("Auto-play prevented", e));
                });
            } else {
                // MP4 or other
                videoRef.current.src = url;
                videoRef.current.play().catch(e => console.log("Auto-play prevented", e));
            }
        }
    }, [url]);

    // Determine current, prev, next
    // Note: episode param might be ID or Index. 
    // If it's ID, we find index. If it's effectively 1-based index, we handle that.
    // The API likely expects whatever chapterId is in the chapters list.

    const currentEpIndex = chapters.findIndex(c => String(c.id) === String(episode) || String(c.chapter_id) === String(episode));
    const actualIndex = currentEpIndex === -1 ? (parseInt(episode) - 1) : currentEpIndex; // Fallback if episode is index

    const prevEp = actualIndex > 0 ? chapters[actualIndex - 1] : null;
    const nextEp = actualIndex < chapters.length - 1 ? chapters[actualIndex + 1] : null;

    return (
        <>
            <Navbar />
            <div className="container watch-page">
                <div className="player-title">
                    <h2>Nonton Episode {actualIndex + 1}</h2>
                </div>
                <div className="player-wrapper">
                    {loading ? (
                        <div className="player-loading">Mengambil link stream...</div>
                    ) : url ? (
                        <video ref={videoRef} controls className="video-player" playsInline />
                    ) : (
                        <div className="player-error">
                            <p>Gagal memuat video.</p>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>Video tidak tersedia, silakan coba episode lain.</p>
                        </div>
                    )}
                </div>

                <div className="controls">
                    <div className="nav-buttons">
                        <Link
                            to={actualIndex > 0 ? `/watch/${id}/${actualIndex}` : '#'}
                            className={`btn btn-secondary ${actualIndex <= 0 ? 'disabled' : ''}`}
                        >
                            <ChevronLeft size={20} /> Sebelumnya
                        </Link>
                        <Link
                            to={actualIndex < chapters.length - 1 ? `/watch/${id}/${actualIndex + 2}` : '#'}
                            className={`btn btn-primary ${actualIndex >= chapters.length - 1 ? 'disabled' : ''}`}
                        >
                            Selanjutnya <ChevronRight size={20} />
                        </Link>
                    </div>
                </div>

                <div className="episode-list">
                    <h3>Daftar Episode</h3>
                    <div className="list-grid">
                        {chapters.map((c, i) => {
                            const cId = c.id || c.chapter_id;
                            const isActive = (i + 1) === parseInt(episode);
                            return (
                                <Link
                                    key={cId || i}
                                    to={`/watch/${id}/${i + 1}`}
                                    className={`ep-item ${isActive ? 'active' : ''}`}
                                >
                                    {i + 1}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
            <style>{`
        .watch-page { padding-top: 24px; max-width: 1000px; padding-bottom: 48px; }
        .player-title { margin-bottom: 16px; font-size: 1.2rem; }
        .player-wrapper {
          width: 100%;
          aspect-ratio: 16/9;
          background: black;
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .video-player { width: 100%; height: 100%; }
        .player-loading, .player-error { color: var(--text-secondary); text-align: center; }
        .controls { display: flex; justify-content: flex-end; margin-bottom: 32px; }
        .nav-buttons { display: flex; gap: 12px; }
        .btn-secondary { background: var(--surface); color: white; display: inline-flex; align-items: center; padding: 12px 24px; border-radius: var(--radius); transition: 0.2s; }
        .btn-secondary:hover { background: var(--surface-hover); }
        .disabled { opacity: 0.5; pointer-events: none; }
        
        .episode-list { background: var(--surface); padding: 24px; border-radius: var(--radius); border: 1px solid var(--border); }
        .episode-list h3 { margin-top: 0; margin-bottom: 16px; font-size: 1.2rem; }
        .list-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 8px; max-height: 300px; overflow-y: auto; padding-right: 8px; }
        
        /* Custom Scrollbar for list */
        .list-grid::-webkit-scrollbar { width: 6px; }
        .list-grid::-webkit-scrollbar-track { background: transparent; }
        .list-grid::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }

        .ep-item {
          display: flex; align-items: center; justify-content: center;
          background: #000; padding: 10px; border-radius: 6px;
          font-weight: 600; font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .ep-item.active { background: var(--primary); color: white; box-shadow: 0 4px 10px rgba(255,85,0,0.3); }
        .ep-item:hover:not(.active) { background: #2a2a2a; color: white; cursor: pointer; }
        
        @media(max-width: 768px) {
           .player-wrapper { position: sticky; top: var(--header-height); z-index: 50; border-radius: 0; margin-left: -24px; margin-right: -24px; width: auto; aspect-ratio: 16/9; }
           .controls { justify-content: center; margin-top: 16px; }
        }
      `}</style>
        </>
    );
}
