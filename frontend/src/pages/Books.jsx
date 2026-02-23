import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Search, RotateCcw, BookOpen, User, Hash, Package, ShoppingCart, Pencil, Trash2, Library } from 'lucide-react';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchBooks = async (q = '') => {
        try {
            const res = q
                ? await api.get(`/books/search?q=${q}`)
                : await api.get('/books');
            setBooks(res.data);
        } catch (err) {
            toast.error('Erreur lors du chargement des livres.');
        }
    };

    useEffect(() => { fetchBooks(); }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchBooks(query);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBooks(query);
    };

    const handleBorrow = async (bookId) => {
        try {
            await api.post('/borrowings/borrow', { bookId });
            toast.success('Emprunt effectué !');
            fetchBooks(query);
        } catch (err) {
            toast.error(err.response?.data || 'Erreur lors de l\'emprunt.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce livre ?')) return;
        try {
            await api.delete(`/books/${id}`);
            toast.success('Livre supprimé.');
            fetchBooks(query);
        } catch {
            toast.error('Erreur lors de la suppression.');
        }
    };

    return (
        <div className="books-page">
            <header className="page-header">
                <div>
                    <h1 className="page-title">
                        <Library size={32} />
                        Catalogue de la Bibliothèque
                    </h1>
                    <p className="text-muted">Découvrez et empruntez parmi nos {books.length} titres disponibles.</p>
                </div>
            </header>

            <section className="search-section card">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-wrapper">
                        <Search className="search-icon" size={20} />
                        <input
                            className="input-field search-input"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Rechercher par titre, auteur ou ISBN..."
                        />
                    </div>
                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => { setQuery(''); fetchBooks(); }}
                    >
                        <RotateCcw size={18} />
                        Réinitialiser
                    </button>
                </form>
            </section>

            <div className="grid-container">
                {books.map(book => (
                    <div key={book.id} className="book-card card">
                        <div className="book-info">
                            <h3 className="book-title">{book.title}</h3>
                            <div className="book-meta">
                                <span className="meta-item">
                                    <User size={14} />
                                    {book.author}
                                </span>
                                <span className="meta-item">
                                    <Hash size={14} />
                                    {book.isbn}
                                </span>
                            </div>
                        </div>

                        <div className="book-status">
                            <span className={`badge ${book.stock > 0 ? 'badge-success' : 'badge-error'}`}>
                                <Package size={12} />
                                Stock : {book.stock}
                            </span>
                        </div>

                        <div className="book-actions">
                            {user?.role !== 'ADMIN' && (
                                book.stock > 0 ? (
                                    <button
                                        className="btn btn-primary action-btn"
                                        onClick={() => handleBorrow(book.id)}
                                    >
                                        <ShoppingCart size={18} />
                                        Emprunter
                                    </button>
                                ) : (
                                    <button className="btn btn-secondary action-btn" disabled>
                                        Indisponible
                                    </button>
                                )
                            )}

                            {user?.role === 'ADMIN' && (
                                <div className="admin-actions-full">
                                    <button
                                        className="btn btn-secondary admin-edit-btn"
                                        onClick={() => navigate(`/books/edit/${book.id}`)}
                                    >
                                        <Pencil size={18} />
                                        Modifier
                                    </button>
                                    <button
                                        className="btn btn-danger admin-delete-btn"
                                        onClick={() => handleDelete(book.id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {books.length === 0 && (
                <div className="empty-state">
                    <BookOpen size={48} className="text-muted" />
                    <p className="text-muted">Aucun livre ne correspond à votre recherche.</p>
                </div>
            )}

            <style>{`
                .books-page {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                .page-header {
                    margin-bottom: 0.5rem;
                }
                .search-form {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }
                .search-input-wrapper {
                    position: relative;
                    flex: 1;
                }
                .search-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }
                .search-input {
                    padding-left: 3rem;
                }
                .book-card {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                    justify-content: space-between;
                }
                .book-title {
                    margin: 0 0 0.5rem;
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: var(--primary);
                }
                .book-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 0.375rem;
                }
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: var(--text-muted);
                }
                .book-status .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.375rem;
                }
                .book-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: auto;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border);
                }
                .admin-actions-full {
                    display: flex;
                    gap: 0.5rem;
                    width: 100%;
                }
                .admin-edit-btn {
                    flex: 1;
                    justify-content: center;
                }
                .admin-delete-btn {
                    width: 48px;
                    justify-content: center;
                }
                .action-btn {
                    flex: 1;
                    margin-right: 1rem;
                }
                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                    background: white;
                    border-radius: 12px;
                    border: 2px dashed var(--border);
                }
                @media (max-width: 640px) {
                    .search-form {
                        flex-direction: column;
                        align-items: stretch;
                    }
                }
            `}</style>
        </div>
    );
};

export default Books;
