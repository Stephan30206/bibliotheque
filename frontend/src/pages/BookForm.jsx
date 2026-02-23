import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { Pencil, PlusCircle, Book, User, Hash, Package, ArrowLeft, Save, XCircle } from 'lucide-react';

const BookForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: '', author: '', isbn: '', stock: 1 });
    const isEdit = !!id;

    useEffect(() => {
        if (isEdit) {
            api.get(`/books/${id}`).then(res => setForm(res.data));
        }
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await api.put(`/books/${id}`, form);
                toast.success('Livre mis à jour !');
            } else {
                await api.post('/books', form);
                toast.success('Livre ajouté !');
            }
            navigate('/books');
        } catch (err) {
            console.error('Erreur lors de la sauvegarde:', err.response?.status, err.response?.data);
            toast.error(err.response?.data || 'Erreur lors de la sauvegarde.');
        }
    };

    return (
        <div className="form-page">
            <header className="page-header">
                <button 
                    className="btn btn-secondary back-btn" 
                    onClick={() => navigate('/books')}
                >
                    <ArrowLeft size={18} />
                    Retour au catalogue
                </button>
                <h1 className="page-title">
                    {isEdit ? <Pencil size={32} /> : <PlusCircle size={32} />}
                    {isEdit ? 'Modifier le livre' : 'Ajouter un nouveau livre'}
                </h1>
            </header>

            <div className="form-card card">
                <form onSubmit={handleSubmit} className="book-form">
                    <div className="input-group">
                        <label className="input-label">
                            <Book size={16} />
                            Titre du livre
                        </label>
                        <input 
                            className="input-field" 
                            placeholder="Entrez le titre..." 
                            required
                            value={form.title} 
                            onChange={e => setForm({...form, title: e.target.value})} 
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            <User size={16} />
                            Auteur
                        </label>
                        <input 
                            className="input-field" 
                            placeholder="Nom de l'auteur..." 
                            required
                            value={form.author} 
                            onChange={e => setForm({...form, author: e.target.value})} 
                        />
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label className="input-label">
                                <Hash size={16} />
                                ISBN
                            </label>
                            <input 
                                className="input-field" 
                                placeholder="ISBN-13" 
                                required
                                value={form.isbn} 
                                onChange={e => setForm({...form, isbn: e.target.value})} 
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                <Package size={16} />
                                Stock initial
                            </label>
                            <input 
                                className="input-field" 
                                type="number" 
                                min="0" 
                                placeholder="Quantité" 
                                required
                                value={form.stock} 
                                onChange={e => setForm({...form, stock: parseInt(e.target.value)})} 
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button className="btn btn-primary" type="submit">
                            <Save size={18} />
                            {isEdit ? 'Enregistrer les modifications' : 'Ajouter à la bibliothèque'}
                        </button>
                        <button 
                            className="btn btn-secondary" 
                            type="button"
                            onClick={() => navigate('/books')}
                        >
                            <XCircle size={18} />
                            Annuler
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .form-page {
                    max-width: 600px;
                    margin: 0 auto;
                }
                .back-btn {
                    margin-bottom: 1.5rem;
                }
                .form-card {
                    padding: 2.5rem;
                }
                .book-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .input-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--primary);
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .form-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .form-actions .btn {
                    flex: 1;
                    justify-content: center;
                    padding: 0.75rem;
                }
                @media (max-width: 640px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default BookForm;
