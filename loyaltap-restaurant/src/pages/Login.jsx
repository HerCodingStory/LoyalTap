import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("👉 Starting login...");
    
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("✅ Firebase login success", user);

            const idToken = await userCredential.user.getIdToken();
            console.log("🪪 Got ID Token", idToken);
            localStorage.setItem('token', idToken);

            const res = await axios.post(
                'http://localhost:5001/auth/sync',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );
            console.log("✅ Synced with backend", res.data);
    
            localStorage.setItem("token", idToken); // optional
            navigate("/dashboard");
        } catch (err) {
            console.error("❌ Login failed", err);
            alert("Login failed. Please check your credentials.");
        }
    };
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded w-96">
                <h2 className="text-xl font-bold mb-4">Login</h2>
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
