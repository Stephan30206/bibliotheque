import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Search, BookOpen, ArrowRight, Star } from 'lucide-react';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query) {
                fetchBooks(query);
            } else {
                fetchBooks();
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const fetchBooks = async (q = '') => {
        try {
            setLoading(true);
            const res = q
                ? await api.get(`/books/search?q=${q}`)
                : await api.get('/books');
            setBooks(res.data);
        } catch (err) {
            console.error('Erreur lors du chargement des livres:', err);
        } finally {
            setLoading(false);
        }
    };

    const getBookCoverColor = (index) => {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
            '#F8B88B', '#A9E6E4', '#FFD93D', '#6BCB77'
        ];
        return colors[index % colors.length];
    };

    const handleBookClick = (bookId) => {
        navigate('/books');
    };

    return (
        <div className="home-page">
            {/* HERO SECTION */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Bienvenue à la Bibliothèque en Ligne</h1>
                    <p className="hero-subtitle">Découvrez notre vaste collection de livres et empruntez vos préférés</p>
                    <div className="hero-search">
                        <Search size={20} className="search-icon" />
                        <input
                            className="search-input"
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher par titre, auteur, ou ISBN..."
                        />
                    </div>
                </div>
                <div className="hero-background"></div>
            </section>

            {/* LIBRARY HEADER */}
            <div className="library-header">
                <div className="library-info">
                    <h2 className="library-title">
                        <BookOpen size={28} />
                        Collection de Livres
                    </h2>
                    <p className="library-count">{books.length} livres disponibles</p>
                </div>
                <a href="/books" className="view-all-btn">
                    Voir le catalogue complet
                    <ArrowRight size={18} />
                </a>
            </div>

            {/* BOOKS GRID */}
            <div className="books-grid">
                {books.length > 0 ? (
                    books.slice(0, 12).map((book, index) => (
                        <div
                            key={book.id}
                            className="book-card-container"
                            onClick={() => handleBookClick(book.id)}
                        >
                            <div className="book-cover" style={{ backgroundColor: getBookCoverColor(index) }}>
                                <div className="book-cover-content">
                                    <div className="book-icon">
                                        <BookOpen size={32} />
                                    </div>
                                    <h3 className="book-cover-title">{book.title}</h3>
                                    <p className="book-cover-author">{book.author}</p>
                                </div>
                                {book.stock > 0 && (
                                    <div className="stock-badge">
                                        {book.stock}
                                    </div>
                                )}
                            </div>
                            <div className="book-info-section">
                                <p className="book-short-title">{book.title}</p>
                                <p className="book-author-name">{book.author}</p>
                                <div className="book-footer">
                                    <span className={`availability ${book.stock > 0 ? 'available' : 'unavailable'}`}>
                                        {book.stock > 0 ? 'Disponible' : 'Indisponible'}
                                    </span>
                                    <span className="stock-count">{book.stock} en stock</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <BookOpen size={48} className="empty-icon" />
                        <p className="empty-text">Aucun livre ne correspond à votre recherche.</p>
                    </div>
                )}
            </div>

            {/* FEATURES SECTION */}
            <section className="features-section">
                <h2 className="features-title">Pourquoi choisir notre bibliothèque ?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon blue">📚</div>
                        <h3 className="feature-title">Large Sélection</h3>
                        <p className="feature-description">Accédez à une collection diversifiée de milliers de titres.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon green">⚡</div>
                        <h3 className="feature-title">Accès Facile</h3>
                        <p className="feature-description">Empruntez des livres en quelques clics, disponible 24/7.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon purple">🎯</div>
                        <h3 className="feature-title">Gestion Simple</h3>
                        <p className="feature-description">Suivi de vos emprunts et rappels de dates de retour.</p>
                    </div>
                </div>
            </section>

            <style>{`
                .home-page {
                    display: flex;
                    flex-direction: column;
                    gap: 3rem;
                }

                /* HERO SECTION */
                .hero-section {
                    position: relative;
                    padding: 4rem 2rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 16px;
                    overflow: hidden;
                    color: white;
                    margin-bottom: 1rem;
                }

                .hero-background {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
                    border-radius: 50%;
                    pointer-events: none;
                }

                .hero-content {
                    position: relative;
                    z-index: 1;
                    max-width: 600px;
                }

                .hero-title {
                    margin: 0 0 1rem;
                    font-size: 2.5rem;
                    font-weight: 800;
                    line-height: 1.2;
                }

                .hero-subtitle {
                    margin: 0 0 2rem;
                    font-size: 1.125rem;
                    opacity: 0.95;
                }

                .hero-search {
                    position: relative;
                    display: flex;
                    align-items: center;
                    background: white;
                    border-radius: 50px;
                    padding: 0.75rem 1.5rem;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                }

                .search-icon {
                    color: #667eea;
                    margin-right: 1rem;
                    flex-shrink: 0;
                }

                .search-input {
                    border: none;
                    background: transparent;
                    outline: none;
                    flex: 1;
                    font-size: 1rem;
                    color: #333;
                }

                .search-input::placeholder {
                    color: #999;
                }

                /* LIBRARY HEADER */
                .library-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 2rem 0;
                }

                .library-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .library-title {
                    margin: 0;
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: var(--primary);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .library-count {
                    margin: 0;
                    font-size: 0.875rem;
                    color: var(--text-muted);
                }

                .view-all-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1.5rem;
                    background: var(--accent);
                    color: white;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 700;
                    transition: all 0.3s ease;
                }

                .view-all-btn:hover {
                    background: #0d47a1;
                    transform: translateX(4px);
                }

                /* BOOKS GRID */
                .books-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 2rem;
                    padding: 2rem 0;
                }

                .book-card-container {
                    display: flex;
                    flex-direction: column;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }

                .book-card-container:hover {
                    transform: translateY(-8px);
                }

                .book-cover {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 3 / 4;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 1.5rem;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                    color: white;
                    margin-bottom: 1rem;
                    transition: all 0.3s ease;
                }

                .book-card-container:hover .book-cover {
                    box-shadow: 0 12px 32px rgba(0,0,0,0.25);
                    transform: scale(1.02);
                }

                .book-cover-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }

                .book-icon {
                    opacity: 0.8;
                    padding: 1rem;
                    background: rgba(255,255,255,0.2);
                    border-radius: 12px;
                }

                .book-cover-title {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 700;
                    line-height: 1.3;
                }

                .book-cover-author {
                    margin: 0;
                    font-size: 0.875rem;
                    opacity: 0.9;
                }

                .stock-badge {
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
                    background: rgba(255,255,255,0.95);
                    color: #333;
                    padding: 0.5rem 0.75rem;
                    border-radius: 20px;
                    font-weight: 700;
                    font-size: 0.875rem;
                }

                .book-info-section {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .book-short-title {
                    margin: 0;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: var(--primary);
                    line-height: 1.3;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }

                .book-author-name {
                    margin: 0;
                    font-size: 0.85rem;
                    color: var(--text-muted);
                }

                .book-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 0.5rem;
                    padding-top: 0.75rem;
                    border-top: 1px solid var(--border);
                    font-size: 0.75rem;
                }

                .availability {
                    font-weight: 700;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                }

                .availability.available {
                    color: #22c55e;
                    background: #f0fdf4;
                }

                .availability.unavailable {
                    color: #ef4444;
                    background: #fef2f2;
                }

                .stock-count {
                    color: var(--text-muted);
                }

                .empty-state {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 4rem 2rem;
                    background: var(--background);
                    border-radius: 12px;
                    border: 2px dashed var(--border);
                }

                .empty-icon {
                    color: var(--text-muted);
                    margin-bottom: 1rem;
                }

                .empty-text {
                    margin: 0;
                    color: var(--text-muted);
                    font-size: 1rem;
                }

                /* FEATURES SECTION */
                .features-section {
                    padding: 3rem 2rem;
                    background: #f9fafb;
                    border-radius: 16px;
                }

                .features-title {
                    margin: 0 0 2rem;
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: var(--primary);
                    text-align: center;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2rem;
                }

                .feature-card {
                    padding: 2rem;
                    background: white;
                    border-radius: 12px;
                    border: 1px solid var(--border);
                    text-align: center;
                    transition: all 0.3s ease;
                }

                .feature-card:hover {
                    border-color: var(--accent);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }

                .feature-icon {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }

                .feature-icon.blue { color: #3b82f6; }
                .feature-icon.green { color: #22c55e; }
                .feature-icon.purple { color: #a855f7; }

                .feature-title {
                    margin: 0 0 0.5rem;
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: var(--primary);
                }

                .feature-description {
                    margin: 0;
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    line-height: 1.5;
                }

                @media (max-width: 768px) {
                    .hero-title {
                        font-size: 1.75rem;
                    }

                    .hero-subtitle {
                        font-size: 1rem;
                    }

                    .library-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1.5rem;
                    }

                    .books-grid {
                        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                        gap: 1.5rem;
                    }

                    .features-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 480px) {
                    .hero-section {
                        padding: 2rem 1.5rem;
                    }

                    .hero-title {
                        font-size: 1.5rem;
                    }

                    .books-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1rem;
                    }

                    .book-cover {
                        padding: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;
