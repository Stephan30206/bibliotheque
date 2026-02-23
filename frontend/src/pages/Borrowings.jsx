import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { ClipboardList, Book, Calendar, CheckCircle, RotateCcw, Clock, AlertCircle, User, ShieldCheck } from 'lucide-react';

const Borrowings = () => {
    const { user } = useAuth();
    const [borrowings, setBorrowings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBorrowings = async () => {
        try {
            const endpoint = user.role === 'ADMIN' ? '/borrowings' : '/borrowings/my';
            const res = await api.get(endpoint);
            setBorrowings(res.data);
        } catch (err) {
            toast.error('Erreur lors du chargement des emprunts.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { 
        if (user) fetchBorrowings(); 
    }, [user]);

    const handleReturn = async (bookId, borrowingId) => {
        try {
            const payload = user.role === 'ADMIN' ? { borrowingId } : { bookId };
            await api.post('/borrowings/return', payload);
            toast.success('Livre retourné avec succès !');
            fetchBorrowings();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Erreur lors du retour du livre.');
        }
    };

    if (isLoading) return <div className="loading-state">Chargement des emprunts...</div>;

    const active = borrowings.filter(b => !b.returnedAt);
    const returned = borrowings.filter(b => b.returnedAt);

    return (
        <div className="borrowings-page">
            <header className="page-header">
                <h1 className="page-title">
                    <ClipboardList size={32} />
                    {user.role === 'ADMIN' ? 'Gestion des Emprunts' : 'Mes Emprunts'}
                </h1>
                <p className="text-muted">
                    {user.role === 'ADMIN' 
                        ? 'Supervisez tous les emprunts et validez les retours.' 
                        : 'Gérez vos emprunts en cours et consultez votre historique.'}
                </p>
            </header>

            <div className="borrowings-layout">
                <section className="borrowings-section card">
                    <div className="section-header">
                        <h2 className="section-title active-title">
                            <Clock size={20} />
                            En cours ({active.length})
                        </h2>
                    </div>
                    <div className="table-wrapper">
                        <table className="borrowings-table">
                            <thead>
                                <tr>
                                    <th>Livre</th>
                                    {user.role === 'ADMIN' && <th>Emprunteur</th>}
                                    <th>Date d'emprunt</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {active.map(b => (
                                    <tr key={b.id}>
                                        <td>
                                            <div className="book-cell">
                                                <Book size={16} className="text-muted" />
                                                <div className="book-info">
                                                    <span className="book-title">{b.book.title}</span>
                                                    <span className="book-isbn">ISBN: {b.book.isbn}</span>
                                                </div>
                                            </div>
                                        </td>
                                        {user.role === 'ADMIN' && (
                                            <td>
                                                <div className="user-cell">
                                                    <User size={14} />
                                                    {b.user.username}
                                                </div>
                                            </td>
                                        )}
                                        <td>
                                            <div className="date-cell">
                                                <Calendar size={14} />
                                                {new Date(b.borrowedAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <button 
                                                className={`btn-action ${user.role === 'ADMIN' ? 'admin-btn' : 'student-btn'}`}
                                                onClick={() => handleReturn(b.book.id, b.id)}
                                            >
                                                <RotateCcw size={14} />
                                                {user.role === 'ADMIN' ? 'Valider Retour' : 'Retourner'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {active.length === 0 && (
                            <div className="empty-state">
                                <CheckCircle size={40} className="text-muted" />
                                <p>Aucun emprunt en cours.</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="borrowings-section card">
                    <div className="section-header">
                        <h2 className="section-title">
                            <RotateCcw size={20} />
                            Historique des retours ({returned.length})
                        </h2>
                    </div>
                    <div className="table-wrapper">
                        <table className="borrowings-table">
                            <thead>
                                <tr>
                                    <th>Livre</th>
                                    {user.role === 'ADMIN' && <th>Emprunteur</th>}
                                    <th>Date de retour</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {returned.map(b => (
                                    <tr key={b.id}>
                                        <td>
                                            <div className="book-cell">
                                                <Book size={16} className="text-muted" />
                                                <span className="book-title">{b.book.title}</span>
                                            </div>
                                        </td>
                                        {user.role === 'ADMIN' && (
                                            <td>
                                                <div className="user-cell">
                                                    <User size={14} />
                                                    {b.user.username}
                                                </div>
                                            </td>
                                        )}
                                        <td>
                                            <div className="date-cell">
                                                <Calendar size={14} />
                                                {new Date(b.returnedAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="status-badge success">
                                                <ShieldCheck size={14} />
                                                Retourné
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {returned.length === 0 && (
                            <div className="empty-state">
                                <AlertCircle size={40} className="text-muted" />
                                <p>Aucun historique de prêt.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <style>{`
                .borrowings-page {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .borrowings-layout {
                    display: flex;
                    flex-direction: column;
                    gap: 2.5rem;
                }
                .borrowings-section {
                    padding: 0;
                    overflow: hidden;
                }
                .section-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border);
                }
                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1.125rem;
                    font-weight: 700;
                    margin: 0;
                    color: var(--text-muted);
                }
                .active-title {
                    color: var(--primary);
                }
                .table-wrapper {
                    overflow-x: auto;
                }
                .borrowings-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }
                .borrowings-table th {
                    padding: 1rem 1.5rem;
                    background: #f8fafc;
                    border-bottom: 1px solid var(--border);
                    color: var(--text-muted);
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .borrowings-table td {
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid var(--border);
                    vertical-align: middle;
                }
                .book-cell {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .book-info {
                    display: flex;
                    flex-direction: column;
                }
                .book-title {
                    font-weight: 600;
                    color: var(--primary);
                }
                .book-isbn {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }
                .user-cell {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: var(--primary);
                    font-weight: 500;
                }
                .date-cell {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: var(--text-muted);
                }
                .btn-action {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }
                .admin-btn {
                    background: #eff6ff;
                    color: #3b82f6;
                    border-color: #dbeafe;
                }
                .admin-btn:hover { background: #dbeafe; }
                .student-btn {
                    background: #f1f5f9;
                    color: #475569;
                    border-color: #e2e8f0;
                }
                .student-btn:hover { background: #e2e8f0; }
                
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.375rem;
                    padding: 0.375rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .status-badge.success {
                    background: #f0fdf4;
                    color: #22c55e;
                }
                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 2rem;
                    text-align: center;
                    color: var(--text-muted);
                    gap: 1rem;
                }
                .loading-state {
                    display: flex;
                    justify-content: center;
                    padding: 5rem;
                    color: var(--text-muted);
                }
            `}</style>
        </div>
    );
};

export default Borrowings;
