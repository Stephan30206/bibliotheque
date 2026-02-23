import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { TrendingUp, Users, BookOpen, Activity, CheckCircle, XCircle, Award, Library } from 'lucide-react';
import { toast } from 'react-toastify';

const Stats = () => {
    const [topBooks, setTopBooks] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [generalStats, setGeneralStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [booksRes, usersRes, generalRes] = await Promise.all([
                    api.get('/stats/top-books'),
                    api.get('/stats/top-users'),
                    api.get('/stats/general')
                ]);
                setTopBooks(booksRes.data);
                setTopUsers(usersRes.data);
                setGeneralStats(generalRes.data);
            } catch (err) {
                toast.error('Erreur lors du chargement des statistiques.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return <div className="loading-state">Chargement des données...</div>;
    }

    return (
        <div className="stats-page">
            <header className="page-header">
                <h1 className="page-title">
                    <TrendingUp size={32} color="var(--accent)" />
                    Statistiques & Analyse
                </h1>
                <p className="text-muted">Vue d'ensemble et rapports détaillés de l'activité.</p>
            </header>

            {generalStats && (
                <div className="quick-stats-v2">
                    <div className="stat-card blue">
                        <div className="stat-content">
                            <span className="stat-label">Total Livres</span>
                            <span className="stat-number">{generalStats.totalBooks}</span>
                        </div>
                        <BookOpen size={48} className="stat-bg-icon" />
                    </div>
                    <div className="stat-card green">
                        <div className="stat-content">
                            <span className="stat-label">Total Emprunts</span>
                            <span className="stat-number">{generalStats.totalBorrowings}</span>
                        </div>
                        <Activity size={48} className="stat-bg-icon" />
                    </div>
                    <div className="stat-card indigo">
                        <div className="stat-content">
                            <span className="stat-label">Livres Disponibles</span>
                            <span className="stat-number">{generalStats.availableBooks}</span>
                        </div>
                        <CheckCircle size={48} className="stat-bg-icon" />
                    </div>
                    <div className="stat-card rose">
                        <div className="stat-content">
                            <span className="stat-label">Emprunts Actifs</span>
                            <span className="stat-number">{generalStats.activeBorrowings}</span>
                        </div>
                        <XCircle size={48} className="stat-bg-icon" />
                    </div>
                </div>
            )}

            <div className="data-grid">
                <section className="data-card card">
                    <div className="card-header">
                        <Library size={20} className="header-icon" />
                        <h2 className="card-title">Livres les plus populaires</h2>
                    </div>
                    <div className="list-container">
                        {topBooks.length > 0 ? (
                            topBooks.slice(0, 5).map((book, index) => (
                                <div key={index} className="list-item">
                                    <div className="item-rank">{index + 1}</div>
                                    <div className="item-details">
                                        <span className="item-name">{book.title}</span>
                                        <span className="item-meta">{book.count} emprunts</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="empty-msg">Aucune donnée disponible</p>
                        )}
                    </div>
                </section>

                <section className="data-card card">
                    <div className="card-header">
                        <Users size={20} className="header-icon" />
                        <h2 className="card-title">Top Emprunteurs</h2>
                    </div>
                    <div className="list-container">
                        {topUsers.length > 0 ? (
                            topUsers.slice(0, 5).map((user, index) => (
                                <div key={index} className="list-item">
                                    <div className="item-rank">{index + 1}</div>
                                    <div className="item-details">
                                        <span className="item-name">{user.username}</span>
                                        <span className="item-meta">{user.count} emprunts</span>
                                    </div>
                                    {index === 0 && <Award size={18} className="gold-medal" />}
                                </div>
                            ))
                        ) : (
                            <p className="empty-msg">Aucune donnée disponible</p>
                        )}
                    </div>
                </section>
            </div>

            <style>{`
                .stats-page {
                    display: flex;
                    flex-direction: column;
                    gap: 2.5rem;
                    max-width: 1100px;
                    margin: 0 auto;
                }
                .quick-stats-v2 {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 1.5rem;
                }
                .stat-card {
                    position: relative;
                    padding: 1.75rem;
                    border-radius: 20px;
                    overflow: hidden;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease;
                }
                .stat-card:hover { transform: translateY(-5px); }
                .stat-card.blue { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
                .stat-card.green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
                .stat-card.indigo { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); }
                .stat-card.rose { background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); }

                .stat-content { position: relative; z-index: 2; }
                .stat-label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 600;
                    opacity: 0.9;
                    margin-bottom: 0.5rem;
                    text-transform: uppercase;
                    letter-spacing: 0.025em;
                }
                .stat-number { font-size: 2.25rem; font-weight: 800; }
                .stat-bg-icon {
                    position: absolute;
                    right: -10px;
                    bottom: -10px;
                    opacity: 0.15;
                    transform: rotate(-15deg);
                    z-index: 1;
                }

                .data-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }
                .data-card {
                    padding: 2rem;
                    border-radius: 24px;
                    border: 1px solid var(--border);
                }
                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                    border-bottom: 1px solid var(--border);
                    padding-bottom: 1rem;
                }
                .header-icon { color: var(--accent); }
                .card-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--primary);
                    margin: 0;
                }
                .list-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .list-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.75rem 1rem;
                    background: #f8fafc;
                    border-radius: 12px;
                    transition: background 0.2s;
                }
                .list-item:hover { background: #f1f5f9; }
                .item-rank {
                    width: 28px;
                    height: 28px;
                    background: var(--accent);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                }
                .item-details {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }
                .item-name {
                    font-weight: 600;
                    color: var(--primary);
                }
                .item-meta {
                    font-size: 0.8125rem;
                    color: var(--text-muted);
                }
                .gold-medal { color: #fbbf24; }
                .empty-msg {
                    color: var(--text-muted);
                    text-align: center;
                    padding: 2rem;
                    font-style: italic;
                }
                .loading-state {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 400px;
                    color: var(--text-muted);
                    font-weight: 500;
                }
                @media (max-width: 1024px) {
                    .data-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default Stats;
