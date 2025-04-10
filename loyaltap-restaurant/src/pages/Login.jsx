import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/loyal-tap-api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(email, password);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            alert('Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded w-96">
                <h2 className="text-xl font-bold mb-4">Login</h2>
                <input className="w-full p-2 mb-3 border" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" className="w-full p-2 mb-3 border" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
                <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="w-full mt-4 bg-gray-300 text-black p-2 rounded"
                >
                    Register Instead
                </button>
            </form>
        </div>
    );
}
