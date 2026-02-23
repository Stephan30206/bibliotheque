import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Library, BookOpen, ClipboardList, BarChart3, LogOut, LogIn, UserPlus, PlusCircle, Users, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/books" className="navbar-logo">
                    <Library className="icon" size={24} />
                    <span>BiblioTech</span>
                </Link>

                <div className="navbar-links">
                    {user ? (
                        <>
                            <Link 
                                to="/books" 
                                className={`nav-link ${isActive('/books') ? 'active' : ''}`}
                            >
                                <BookOpen size={18} />
                                <span>Catalogue</span>
                            </Link>
                            <Link 
                                to="/borrowings" 
                                className={`nav-link ${isActive('/borrowings') ? 'active' : ''}`}
                            >
                                <ClipboardList size={18} />
                                <span>{user.role === 'ADMIN' ? 'Flux Emprunts' : 'Mes Emprunts'}</span>
                            </Link>
                            <Link 
                                to="/stats" 
                                className={`nav-link ${isActive('/stats') ? 'active' : ''}`}
                            >
                                <BarChart3 size={18} />
                                <span>Statistiques</span>
                            </Link>
                            {user.role === 'ADMIN' && (
                                <>
                                    <Link 
                                        to="/users" 
                                        className={`nav-link ${isActive('/users') ? 'active' : ''}`}
                                    >
                                        <Users size={18} />
                                        <span>Usagers</span>
                                    </Link>
                                    <Link 
                                        to="/books/new" 
                                        className={`nav-link ${isActive('/books/new') ? 'active' : ''}`}
                                    >
                                        <PlusCircle size={18} />
                                        <span>Ajouter Livre</span>
                                    </Link>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/login" 
                                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                            >
                                <LogIn size={18} />
                                <span>Connexion</span>
                            </Link>
                            <Link 
                                to="/register" 
                                className={`nav-link ${isActive('/register') ? 'active' : ''}`}
                            >
                                <UserPlus size={18} />
                                <span>Inscription</span>
                            </Link>
                        </>
                    )}
                </div>

                {user && (
                    <div className="navbar-user">
                        <Link to="/profile" className={`user-info-link ${isActive('/profile') ? 'active' : ''}`}>
                            <div className="user-info">
                                <span className="user-name">{user.username}</span>
                                <span className="user-role">{user.role === 'ADMIN' ? 'Administrateur' : 'Étudiant'}</span>
                            </div>
                            <div className="user-avatar-mini">
                                <User size={18} />
                            </div>
                        </Link>
                        <button className="logout-btn" onClick={handleLogout} title="Déconnexion">
                            <LogOut size={20} />
                        </button>
                    </div>
                )}
            </div>
            <style>{`
                .navbar {
                    background: #1e293b;
                    color: white;
                    padding: 0.5rem 0;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .navbar-container {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 4rem;
                }
                .navbar-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: white;
                    text-decoration: none;
                    font-size: 1.5rem;
                    font-weight: 800;
                    letter-spacing: -0.025em;
                }
                .navbar-logo .icon {
                    color: #3b82f6;
                }
                .navbar-links {
                    display: flex;
                    gap: 0.5rem;
                    margin-left: 2rem;
                }
                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #94a3b8;
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 600;
                    transition: all 0.2s;
                    padding: 0.5rem 0.75rem;
                    border-radius: 8px;
                }
                .nav-link:hover {
                    color: white;
                    background: #334155;
                }
                .nav-link.active {
                    color: white;
                    background: #334155;
                }
                .navbar-user {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-left: auto;
                }
                .user-info-link {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    text-decoration: none;
                    color: white;
                    padding: 0.5rem;
                    border-radius: 12px;
                    transition: all 0.2s;
                }
                .user-info-link:hover, .user-info-link.active {
                    background: #334155;
                }
                .user-info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }
                .user-name {
                    font-size: 0.875rem;
                    font-weight: 700;
                }
                .user-role {
                    font-size: 0.75rem;
                    color: #94a3b8;
                    font-weight: 500;
                }
                .user-avatar-mini {
                    width: 36px;
                    height: 36px;
                    background: #3b82f6;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                .logout-btn {
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    padding: 0.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .logout-btn:hover {
                    background: #fef2f2;
                    color: #ef4444;
                }
                @media (max-width: 1024px) {
                    .nav-link span {
                        display: none;
                    }
                    .navbar-logo span {
                        display: none;
                    }
                }
                @media (max-width: 768px) {
                    .user-info {
                        display: none;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
