import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Books from './pages/Books';
import BookForm from './pages/BookForm';
import Borrowings from './pages/Borrowings';
import Stats from './pages/Stats';
import Users from './pages/Users';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <ToastContainer position="top-right" autoClose={3000} />
                <div className="main-content">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/books" element={<PrivateRoute><Books /></PrivateRoute>} />
                        <Route path="/books/new" element={<PrivateRoute role="ADMIN"><BookForm /></PrivateRoute>} />
                        <Route path="/books/edit/:id" element={<PrivateRoute role="ADMIN"><BookForm /></PrivateRoute>} />
                        <Route path="/borrowings" element={<PrivateRoute><Borrowings /></PrivateRoute>} />
                        <Route path="/stats" element={<PrivateRoute><Stats /></PrivateRoute>} />
                        <Route path="/users" element={<PrivateRoute role="ADMIN"><Users /></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                        <Route path="*" element={<Navigate to="/books" />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
