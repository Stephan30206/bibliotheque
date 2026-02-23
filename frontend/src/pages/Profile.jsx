import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User, Shield, Calendar, Mail, LogOut, BookOpen, Clock, Users, BarChart3, Package, TrendingUp } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            fetchAdminStats();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchAdminStats = async () => {
        try {
            const [booksRes, usersRes, borrowingsRes] = await Promise.all([
                api.get('/books'),
                api.get('/users'),
                api.get('/borrowings')
            ]);
            setStats({
                totalBooks: booksRes.data.length,
                totalUsers: usersRes.data.length,
                totalBorrowings: borrowingsRes.data.length,
                activeBorrowings: borrowingsRes.data.filter(b => !b.returnDate).length
            });
        } catch (err) {
            console.error('Erreur lors du chargement des stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    const isAdmin = user.role === 'ADMIN';

    return (
        <div className="profile-page">
            <header className="page-header">
                <h1 className="page-title">
                    <User size={32} />
                    {isAdmin ? 'Tableau de Bord Admin' : 'Mon Profil'}
                </h1>
                <p className="text-muted">
                    {isAdmin
                        ? 'Gérez la bibliothèque et visualisez les statistiques.'
                        : 'Gérez vos informations personnelles et vos emprunts.'
                    }
                </p>
            </header>

            {isAdmin ? (
                <div className="admin-dashboard">
                    <div className="stats-grid">
                        <div className="stat-card card">
                            <div className="stat-header">
                                <Package size={24} className="stat-icon" />
                                <span className="stat-label">Livres</span>
                            </div>
                            <p className="stat-value">{stats?.totalBooks || 0}</p>
                            <a href="/books" className="stat-link">Gérer les livres →</a>
                        </div>

                        <div className="stat-card card">
                            <div className="stat-header">
                                <Users size={24} className="stat-icon" />
                                <span className="stat-label">Utilisateurs</span>
                            </div>
                            <p className="stat-value">{stats?.totalUsers || 0}</p>
                            <a href="/users" className="stat-link">Gérer les utilisateurs →</a>
                        </div>

                        <div className="stat-card card">
                            <div className="stat-header">
                                <TrendingUp size={24} className="stat-icon" />
                                <span className="stat-label">Emprunts Actifs</span>
                            </div>
                            <p className="stat-value">{stats?.activeBorrowings || 0}</p>
                            <a href="/borrowings" className="stat-link">Voir les emprunts →</a>
                        </div>

                        <div className="stat-card card">
                            <div className="stat-header">
                                <BarChart3 size={24} className="stat-icon" />
                                <span className="stat-label">Total Emprunts</span>
                            </div>
                            <p className="stat-value">{stats?.totalBorrowings || 0}</p>
                            <a href="/stats" className="stat-link">Voir les statistiques →</a>
                        </div>
                    </div>

                    <div className="admin-info-card card">
                        <h2 className="admin-info-title">Informations Administrateur</h2>
                        <div className="profile-info-grid">
                            <div className="profile-info-item">
                                <span className="info-label">Nom d'utilisateur</span>
                                <span className="info-value">{user.username}</span>
                            </div>
                            <div className="profile-info-item">
                                <span className="info-label">Email</span>
                                <span className="info-value">{user.email}</span>
                            </div>
                            <div className="profile-info-item">
                                <span className="info-label">Statut</span>
                                <span className="info-badge">Administrateur</span>
                            </div>
                            <div className="profile-info-item">
                                <span className="info-label">Membre depuis</span>
                                <span className="info-value">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}</span>
                            </div>
                        </div>
                        <button className="logout-btn" onClick={logout}>
                            <LogOut size={18} />
                            Se déconnecter
                        </button>
                    </div>
                </div>
            ) : (
                <div className="student-profile">
                    <div className="profile-container">
                        <div className="profile-card card">
                            <div className="profile-header">
                                <div className="profile-avatar">
                                    <User size={64} />
                                </div>
                                <div className="profile-main-info">
                                    <h2 className="profile-username">{user.username}</h2>
                                    <span className="role-badge student">
                                        <Shield size={14} />
                                        Étudiant
                                    </span>
                                </div>
                            </div>

                            <div className="profile-details">
                                <div className="detail-item">
                                    <Mail size={20} className="detail-icon" />
                                    <div className="detail-content">
                                        <span className="detail-label">Email</span>
                                        <span className="detail-value">{user.email || 'Non renseigné'}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Calendar size={20} className="detail-icon" />
                                    <div className="detail-content">
                                        <span className="detail-label">Membre depuis</span>
                                        <span className="detail-value">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Non renseigné'}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Shield size={20} className="detail-icon" />
                                    <div className="detail-content">
                                        <span className="detail-label">Type de compte</span>
                                        <span className="detail-value">Emprunteur</span>
                                    </div>
                                </div>
                            </div>

                            <button className="logout-btn" onClick={logout}>
                                <LogOut size={18} />
                                Se déconnecter
                            </button>
                        </div>

                        <div className="profile-summary">
                            <div className="summary-card card">
                                <BookOpen size={24} className="summary-icon blue" />
                                <h3 className="summary-title">Livres Empruntés</h3>
                                <p className="summary-desc">Consultez l'historique complet de vos lectures.</p>
                                <a href="/borrowings" className="summary-link">Voir mes emprunts →</a>
                            </div>
                            <div className="summary-card card">
                                <Clock size={24} className="summary-icon green" />
                                <h3 className="summary-title">Emprunts en cours</h3>
                                <p className="summary-desc">Vérifiez les dates de retour de vos livres.</p>
                                <a href="/borrowings" className="summary-link">Vérifier →</a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .profile-page {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    max-width: 1000px;
                    margin: 0 auto;
                }

                /* ADMIN DASHBOARD */
                .admin-dashboard {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                }

                .stat-card {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    border: 2px solid var(--border);
                    transition: all 0.3s ease;
                }

                .stat-card:hover {
                    border-color: var(--accent);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }

                .stat-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .stat-icon {
                    color: var(--accent);
                    padding: 0.5rem;
                    background: rgba(0,0,0,0.05);
                    border-radius: 8px;
                }

                .stat-label {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-weight: 600;
                }

                .stat-value {
                    margin: 0;
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: var(--primary);
                }

                .stat-link {
                    color: var(--accent);
                    font-weight: 700;
                    text-decoration: none;
                    font-size: 0.875rem;
                    margin-top: auto;
                }

                .stat-link:hover {
                    text-decoration: underline;
                }

                .admin-info-card {
                    padding: 2rem;
                }

                .admin-info-title {
                    margin: 0 0 2rem;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary);
                }

                .profile-info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 2rem;
                    margin-bottom: 2rem;
                    padding-bottom: 2rem;
                    border-bottom: 1px solid var(--border);
                }

                .profile-info-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .info-label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-weight: 600;
                }

                .info-value {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: var(--primary);
                }

                .info-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: #eff6ff;
                    color: #3b82f6;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 700;
                    width: fit-content;
                }

                /* STUDENT PROFILE */
                .student-profile {
                    display: flex;
                    flex-direction: column;
                }

                .profile-container {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: 2rem;
                    align-items: start;
                }

                .profile-card {
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .profile-header {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 1.25rem;
                }

                .profile-avatar {
                    width: 120px;
                    height: 120px;
                    background: #f1f5f9;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--accent);
                    border: 4px solid white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                .profile-username {
                    margin: 0 0 0.5rem;
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: var(--primary);
                }

                .role-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 700;
                }

                .role-badge.admin { background: #eff6ff; color: #3b82f6; }
                .role-badge.student { background: #f0fdf4; color: #22c55e; }

                .profile-details {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    padding: 1.5rem 0;
                    border-top: 1px solid var(--border);
                    border-bottom: 1px solid var(--border);
                }

                .detail-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .detail-icon {
                    color: var(--text-muted);
                }

                .detail-label {
                    display: block;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .detail-value {
                    font-weight: 600;
                    color: var(--primary);
                }

                .logout-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    background: #fef2f2;
                    color: #ef4444;
                    border: 1px solid #fee2e2;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .logout-btn:hover {
                    background: #fee2e2;
                }

                .profile-summary {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }

                .summary-card {
                    padding: 1.5rem;
                }

                .summary-icon {
                    margin-bottom: 1rem;
                    padding: 0.5rem;
                    border-radius: 8px;
                }

                .summary-icon.blue { background: #eff6ff; color: #3b82f6; }
                .summary-icon.green { background: #f0fdf4; color: #22c55e; }

                .summary-title {
                    margin: 0 0 0.5rem;
                    font-size: 1.125rem;
                    font-weight: 700;
                }

                .summary-desc {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    margin-bottom: 1.25rem;
                }

                .summary-link {
                    color: var(--accent);
                    font-weight: 700;
                    text-decoration: none;
                    font-size: 0.875rem;
                }

                @media (max-width: 1024px) {
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                    .profile-container {
                        grid-template-columns: 1fr;
                    }
                    .profile-info-grid {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Profile;
