export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h2>Barudak<span style={{ color: 'var(--primary)' }}>Dracin</span></h2>
                        <p>Tempat nongkrong barudak drama china</p>
                    </div>
                    <div className="footer-copyright">
                        <p>&copy; {new Date().getFullYear()} Acep Triana. All rights reserved.</p>
                    </div>
                </div>
            </div>
            <style>{`
        .footer {
            background: var(--surface);
            padding: 48px 0;
            margin-top: auto;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 24px;
        }
        .footer-brand h2 {
            font-size: 1.5rem;
            margin-bottom: 8px;
            color: var(--text-main);
        }
        .footer-brand p {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        .footer-copyright {
            color: var(--text-secondary);
            font-size: 0.8rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding-top: 24px;
            width: 100%;
            max-width: 400px;
        }
      `}</style>
        </footer>
    );
}
