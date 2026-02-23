# Système de Gestion de Bibliothèque (BiblioTech)

Ce projet est une application web de gestion de bibliothèque réalisée pour l'examen PostgreSQL. Elle permet de gérer les livres, les emprunts et les statistiques d'utilisation.

## 🚀 Technologies Utilisées
- **Backend** : Java / Spring Boot (Maven)
- **Frontend** : React.js (Vite), Lucide-React (Icones)
- **Base de données** : PostgreSQL (Obligatoire)

## 🗄️ Structure de la Base de Données
Le schéma PostgreSQL inclut les tables suivantes :
1. **users** : id, username, password_hash, role (USER/ADMIN), created_at
2. **books** : id, title, author, isbn, stock, created_at
3. **borrowings** : id, user_id, book_id, borrowed_at, returned_at

### Contraintes SQL implémentées :
- `UNIQUE` sur `username` et `isbn`.
- `CHECK` sur le `role` (ADMIN/USER) et le `stock` (>= 0).
- `FOREIGN KEY` avec `ON DELETE CASCADE`.
- Index sur le titre et l'ISBN des livres pour optimiser la recherche.
- Procédure stockée (PL/pgSQL) pour la gestion transactionnelle des emprunts.

## ✨ Fonctionnalités
- **Authentification** : Inscription et connexion sécurisées.
- **Catalogue de Livres** : Recherche multicritère (titre, auteur, ISBN).
- **Gestion des Emprunts** : Emprunter un livre et le retourner (mise à jour automatique du stock).
- **Administration** : CRUD complet sur les livres (ajout, modification, suppression).
- **Statistiques** : Top des livres les plus empruntés et top des utilisateurs les plus actifs.

## 📦 Installation & Lancement

### 1. Base de données
Exécutez le script `database.sql` dans votre instance PostgreSQL pour créer les tables et insérer les données de test.

### 2. Backend
Configurez les accès à votre base de données dans `backend/src/main/resources/application.properties`.
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📝 Jeu de données de test
- **Admin** : `admin` / `admin`
- **Utilisateurs** : `user1` / `password`, `user2` / `password`
- **Livres** : 10 livres pré-enregistrés (Le Petit Prince, 1984, etc.)
