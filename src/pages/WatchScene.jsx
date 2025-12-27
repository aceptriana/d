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

    // Navbar removed
    // ... logic ...
    return (
        <>
            <div className="watch-page-container">
                <div className="player-wrapper">
                    {loading ? (
                        <div className="player-loading">Mengambil link stream...</div>
                    ) : url ? (
                        <video ref={videoRef} controls className="video-player" playsInline autoPlay />
                    ) : (
                        <div className="player-error">
                            <p>Gagal memuat video.</p>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>Video tidak tersedia, silakan coba episode lain.</p>
                        </div>
                    )}
                </div>

                <div className="container content-below-player">
                    <div className="player-title">
                        <h2>Episode {actualIndex + 1}</h2>
                        {chapters.length > 0 && <span className="ep-count">dari {chapters.length} Episode</span>}
                    </div>

                    <div className="controls">
                        <Link
                            to={actualIndex > 0 ? `/watch/${id}/${actualIndex}` : '#'}
                            className={`btn-control btn-prev ${actualIndex <= 0 ? 'disabled' : ''}`}
                        >
                            <ChevronLeft size={24} /> Prev
                        </Link>
                        <Link
                            to={actualIndex < chapters.length - 1 ? `/watch/${id}/${actualIndex + 2}` : '#'} // Logic: actualIndex is 0-based. If actualIndex is 0 (Ep 1), next is Ep 2.
                            className={`btn-control btn-next ${actualIndex >= chapters.length - 1 ? 'disabled' : ''}`}
                        >
                            Next Ep <ChevronRight size={24} />
                        </Link>
                    </div>

                    <div className="episode-list">
                        <h3>Daftar Episode</h3>
                        <div className="list-grid">
                            {chapters.map((c, i) => {
                                const cId = c.id || c.chapter_id;
                                const isActive = (i + 1) === parseInt(episode); // Assuming episode param is 1-based index
                                // If episode param matches the index... wait, previous code used `actualIndex`.
                                // Let's simplify. If episode is just a number.

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
            </div>
            <style>{`
        /* Mobile-first approach for watch page */
        .watch-page-container {
            padding-bottom: 90px; /* Space for BottomNavbar + extra */
        }
        
        .player-wrapper {
          width: 100%;
          aspect-ratio: 16/9;
          background: black;
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .video-player { width: 100%; height: 100%; }
        
        .content-below-player {
            padding-top: 16px;
        }

        .player-title { 
            margin-bottom: 20px; 
            display: flex; 
            justify-content: space-between;
            align-items: baseline;
        }
        .player-title h2 { margin: 0; font-size: 1.25rem; }
        .ep-count { color: var(--text-secondary); font-size: 0.9rem; }
        
        .player-loading, .player-error { color: var(--text-secondary); text-align: center; }
        
        .controls { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 16px; 
            margin-bottom: 32px; 
        }
        
        .btn-control {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 14px;
            border-radius: var(--radius);
            font-weight: 600;
            background: var(--surface);
            color: white;
            transition: all 0.2s;
            gap: 8px;
        }
        
        .btn-next { 
            background: var(--primary); 
            box-shadow: 0 4px 15px rgba(255, 85, 0, 0.3);
        }
        
        .btn-control:active { transform: scale(0.98); }
        .disabled { opacity: 0.5; pointer-events: none; }
        
        .episode-list { 
            background: var(--surface); 
            padding: 20px; 
            border-radius: var(--radius); 
            border: 1px solid var(--border); 
        }
        .episode-list h3 { margin-top: 0; margin-bottom: 16px; font-size: 1.1rem; }
        .list-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(50px, 1fr)); gap: 8px; max-height: 300px; overflow-y: auto; }
        
        .ep-item {
          display: flex; align-items: center; justify-content: center;
          background: #000; padding: 12px 0; border-radius: 8px;
          font-weight: 600; font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .ep-item.active { background: var(--primary); color: white; }
      `}</style>
        </>
    );
}
