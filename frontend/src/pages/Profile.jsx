import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Calendar, Mail, LogOut, BookOpen, Clock } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <div className="profile-page">
            <header className="page-header">
                <h1 className="page-title">
                    <User size={32} />
                    Mon Profil
                </h1>
                <p className="text-muted">Gérez vos informations personnelles et votre compte.</p>
            </header>

            <div className="profile-container">
                <div className="profile-card card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <User size={64} />
                        </div>
                        <div className="profile-main-info">
                            <h2 className="profile-username">{user.username}</h2>
                            <span className={`role-badge ${user.role === 'ADMIN' ? 'admin' : 'student'}`}>
                                <Shield size={14} />
                                {user.role === 'ADMIN' ? 'Administrateur' : 'Étudiant'}
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
                                <span className="detail-value">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Non renseigné'}</span>
                            </div>
                        </div>
                        <div className="detail-item">
                            <Shield size={20} className="detail-icon" />
                            <div className="detail-content">
                                <span className="detail-label">Type de compte</span>
                                <span className="detail-value">{user.role === 'ADMIN' ? 'Gestionnaire' : 'Emprunteur'}</span>
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

            <style>{`
                .profile-page {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    max-width: 900px;
                    margin: 0 auto;
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
                @media (max-width: 768px) {
                    .profile-container {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default Profile;
