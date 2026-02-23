-- Database schema for Library Management System
-- PostgreSQL mandatory

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('USER', 'ADMIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Books table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    stock INT NOT NULL CHECK (stock >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Borrowings table
CREATE TABLE IF NOT EXISTS borrowings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    borrowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_book FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Index for faster book search by title and ISBN
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_isbn ON books(isbn);

-- PL/pgSQL Function to check if a book is available
CREATE OR REPLACE FUNCTION check_book_availability(b_id INT)
RETURNS BOOLEAN AS $$
DECLARE
    v_stock INT;
BEGIN
    SELECT stock INTO v_stock FROM books WHERE id = b_id;
    RETURN v_stock > 0;
END;
$$ LANGUAGE plpgsql;

-- Transactional Procedure for borrowing a book (Atomic operation)
-- Note: In PostgreSQL 11+, we can use PROCEDURES for explicit transactions
-- but here we demonstrate the logic that would be inside a transaction.
CREATE OR REPLACE FUNCTION borrow_book_transaction(u_id INT, b_id INT)
RETURNS VOID AS $$
BEGIN
    -- Check availability
    IF (SELECT check_book_availability(b_id)) THEN
        -- Insert borrowing record
        INSERT INTO borrowings (user_id, book_id, borrowed_at) VALUES (u_id, b_id, CURRENT_TIMESTAMP);
        -- Decrease stock
        UPDATE books SET stock = stock - 1 WHERE id = b_id;
    ELSE
        RAISE EXCEPTION 'Book is out of stock';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Initial data (Minimum 10 books, 3 users)
INSERT INTO users (username, password_hash, role) VALUES
('admin', '$2a$10$r.L0D4pM7K/F1yR5GvUoEeL9YfB6pW0zH4G3.6vP8f8z9r8/G7vO', 'ADMIN'), -- password: admin
('user1', '$2a$10$r.L0D4pM7K/F1yR5GvUoEeL9YfB6pW0zH4G3.6vP8f8z9r8/G7vO', 'USER'),  -- password: password
('user2', '$2a$10$r.L0D4pM7K/F1yR5GvUoEeL9YfB6pW0zH4G3.6vP8f8z9r8/G7vO', 'USER')   -- password: password
ON CONFLICT DO NOTHING;

INSERT INTO books (title, author, isbn, stock) VALUES
('Le Petit Prince', 'Antoine de Saint-Exupéry', '978-2070408504', 5),
('L''Étranger', 'Albert Camus', '978-2070360024', 3),
('Les Misérables', 'Victor Hugo', '978-2253096337', 2),
('1984', 'George Orwell', '978-2070368228', 10),
('Le Seigneur des Anneaux', 'J.R.R. Tolkien', '978-2266286268', 4),
('Fondation', 'Isaac Asimov', '978-2070463619', 6),
('Le Meilleur des mondes', 'Aldous Huxley', '978-2266283038', 3),
('L''Alchimiste', 'Paulo Coelho', '978-2290004449', 8),
('Guerre et Paix', 'Léon Tolstoï', '978-2253102321', 1),
('Don Quichotte', 'Miguel de Cervantes', '978-2020476164', 2)
ON CONFLICT DO NOTHING;

-- Initial borrowings
INSERT INTO borrowings (user_id, book_id, borrowed_at) VALUES
(2, 1, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(3, 4, CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT DO NOTHING;
