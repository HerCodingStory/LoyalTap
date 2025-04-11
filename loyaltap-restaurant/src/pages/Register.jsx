import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("👉 Starting registration...");
    
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("✅ Firebase registration successful", user);
    
            const idToken = await user.getIdToken();
            console.log("🪪 Got ID Token", idToken);
    
            const res = await axios.post(
                'http://localhost:5001/auth/sync',
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );
            console.log("✅ Synced with backend", res.data);
    
            navigate('/dashboard');
        } catch (err) {
            console.error("❌ Registration failed", err);
            alert('Registration failed');
        }
    };
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded w-96">
                <h2 className="text-xl font-bold mb-4">Register</h2>
                <input
                    className="w-full p-2 mb-3 border"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="w-full p-2 mb-3 border"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="w-full p-2 mb-3 border"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Register</button>
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full mt-4 bg-gray-300 text-black p-2 rounded"
                >
                    Login Instead
                </button>
            </form>
        </div>
    );
}
