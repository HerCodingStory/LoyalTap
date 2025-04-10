import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/loyal-tap-api';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(email, password, name);
            navigate('/');
        } catch (err) {
            alert('Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded w-96">
                <h2 className="text-xl font-bold mb-4">Register</h2>
                <input className="w-full p-2 mb-3 border" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                <input className="w-full p-2 mb-3 border" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" className="w-full p-2 mb-3 border" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Register</button>
            </form>
        </div>
    );
}