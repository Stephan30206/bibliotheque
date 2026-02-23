import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users as UsersIcon, User as UserIcon, Calendar, Shield, Mail, Pencil, X, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ username: '', email: '', role: '' });

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            toast.error('Erreur lors du chargement des utilisateurs.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditClick = (user) => {
        setEditingUser(user);
        setEditForm({
            username: user.username,
            email: user.email || '',
            role: user.role
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${editingUser.id}`, editForm);
            toast.success('Utilisateur mis à jour avec succès !');
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour.');
        }
    };

    if (isLoading) {
        return <div className="loading-state">Chargement des utilisateurs...</div>;
    }

    return (
        <div className="users-page">
            <header className="page-header">
                <h1 className="page-title">
                    <UsersIcon size={32} />
                    Gestion des Utilisateurs
                </h1>
                <p className="text-muted">Consultez et gérez les membres de la bibliothèque.</p>
            </header>

            <div className="users-list card">
                <div className="table-wrapper">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Utilisateur</th>
                                <th>Email</th>
                                <th>Rôle</th>
                                <th>Date d'inscription</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-info-cell">
                                            <div className="user-avatar">
                                                <UserIcon size={20} />
                                            </div>
                                            <div className="user-details">
                                                <span className="username">{user.username}</span>
                                                <span className="user-id">ID: #{user.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="email-cell">
                                            {user.email || '-'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${user.role === 'ADMIN' ? 'admin' : 'student'}`}>
                                            <Shield size={12} />
                                            {user.role === 'ADMIN' ? 'Administrateur' : 'Étudiant'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="date-cell">
                                            <Calendar size={14} />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-secondary sm"
                                            onClick={() => handleEditClick(user)}
                                        >
                                            <Pencil size={14} style={{ marginRight: '6px' }} />
                                            Modifier
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingUser && (
                <div className="modal-overlay">
                    <div className="modal-content card">
                        <div className="modal-header">
                            <h3>Modifier l'utilisateur</h3>
                            <button className="close-btn" onClick={() => setEditingUser(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="edit-user-form">
                            <div className="form-group">
                                <label>Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    value={editForm.username}
                                    onChange={e => setEditForm({...editForm, username: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={e => setEditForm({...editForm, email: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Rôle</label>
                                <select
                                    value={editForm.role}
                                    onChange={e => setEditForm({...editForm, role: e.target.value})}
                                >
                                    <option value="USER">Étudiant (USER)</option>
                                    <option value="ADMIN">Administrateur (ADMIN)</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setEditingUser(null)}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <Save size={18} style={{ marginRight: '8px' }} />
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .users-page {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .users-list {
                    padding: 0;
                    overflow: hidden;
                }
                .table-wrapper {
                    overflow-x: auto;
                }
                .users-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }
                .users-table th {
                    padding: 1.25rem 1.5rem;
                    background: #f8fafc;
                    border-bottom: 1px solid var(--border);
                    color: var(--text-muted);
                    font-size: 0.875rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .users-table td {
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid var(--border);
                    vertical-align: middle;
                }
                .users-table tr:last-child td {
                    border-bottom: none;
                }
                .user-info-cell {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    background: #f1f5f9;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--accent);
                }
                .user-details {
                    display: flex;
                    flex-direction: column;
                }
                .username {
                    font-weight: 600;
                    color: var(--primary);
                }
                .user-id {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }
                .role-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.375rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .role-badge.admin {
                    background: #eff6ff;
                    color: #3b82f6;
                }
                .role-badge.student {
                    background: #f0fdf4;
                    color: #22c55e;
                }
                .date-cell {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-muted);
                    font-size: 0.875rem;
                }
                .email-cell {
                    color: var(--text-muted);
                    font-size: 0.875rem;
                }
                .btn-secondary.sm {
                    padding: 0.375rem 0.75rem;
                    font-size: 0.8125rem;
                }
                .loading-state {
                    display: flex;
                    justify-content: center;
                    padding: 5rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                }
                .modal-content {
                    width: 100%;
                    max-width: 450px;
                    padding: 2rem;
                    position: relative;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .modal-header h3 {
                    margin: 0;
                    font-size: 1.25rem;
                }
                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .edit-user-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .form-group label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--text-muted);
                }
                .form-group input, .form-group select {
                    padding: 0.75rem;
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    font-size: 0.875rem;
                }
                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1rem;
                }
            `}</style>
        </div>
    );
};

export default Users;
