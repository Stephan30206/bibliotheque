import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { UserPlus, User, Mail, Lock, Library } from 'lucide-react';

const Register = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', form);
            login(res.data);
            toast.success('Inscription réussie !');
            navigate('/books');
        } catch (err) {
            toast.error(err.response?.data || 'Erreur lors de l\'inscription.');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon-container">
                        <Library size={32} color="var(--accent)" />
                    </div>
                    <h2 className="auth-title">Inscription</h2>
                    <p className="auth-subtitle">Créez votre compte pour commencer à emprunter</p>
                </div>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <User className="input-icon" size={18} />
                        <input 
                            className="input-field with-icon" 
                            placeholder="Nom d'utilisateur" 
                            required
                            value={form.username} 
                            onChange={e => setForm({...form, username: e.target.value})}
                        />
                    </div>

                    <div className="input-group">
                        <Mail className="input-icon" size={18} />
                        <input
                            className="input-field with-icon"
                            type="email"
                            placeholder="Email"
                            required
                            value={form.email}
                            onChange={e => setForm({...form, email: e.target.value})}
                        />
                    </div>

                    <div className="input-group">
                        <Lock className="input-icon" size={18} />
                        <input 
                            className="input-field with-icon" 
                            type="password" 
                            placeholder="Mot de passe" 
                            required
                            value={form.password} 
                            onChange={e => setForm({...form, password: e.target.value})} 
                        />
                    </div>
                    
                    <button className="btn btn-primary auth-btn" type="submit">
                        <UserPlus size={18} />
                        <span>S'inscrire</span>
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>
                        Déjà un compte ? <Link to="/login">Se connecter</Link>
                    </p>
                </div>
            </div>
            
            <style>{`
                .auth-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: calc(100vh - 200px);
                }
                .auth-card {
                    background: white;
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    padding: 2.5rem;
                    width: 100%;
                    max-width: 440px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                }
                .auth-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .auth-icon-container {
                    background: #eff6ff;
                    width: 64px;
                    height: 64px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                }
                .auth-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary);
                    margin: 0;
                }
                .auth-subtitle {
                    color: var(--text-muted);
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                }
                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }
                .input-group {
                    position: relative;
                }
                .input-icon {
                    position: absolute;
                    left: 0.875rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                    pointer-events: none;
                }
                .input-field.with-icon {
                    padding-left: 2.75rem;
                }
                .auth-btn {
                    width: 100%;
                    justify-content: center;
                    padding: 0.75rem;
                    font-size: 1rem;
                    margin-top: 0.5rem;
                }
                .auth-footer {
                    margin-top: 2rem;
                    text-align: center;
                    font-size: 0.875rem;
                    color: var(--text-muted);
                }
                .auth-footer a {
                    color: var(--accent);
                    font-weight: 600;
                    text-decoration: none;
                }
                .auth-footer a:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
};

export default Register;
