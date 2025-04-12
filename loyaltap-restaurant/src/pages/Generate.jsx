import React, { useState } from 'react';
import { createPassWithQR } from '../services/loyal-tap-api';
import axios from 'axios';

export default function Generate() {
    const [email, setEmail] = useState('');
    const [points, setPoints] = useState(0);
    const [goal, setGoal] = useState(10);
    const [qr, setQr] = useState(null);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            const res = await createPassWithQR(email, points, goal);
            setQr(res.data.qrCode);
        } catch (err) {
            alert('Failed to generate pass');
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <form onSubmit={handleGenerate} className="space-y-4 bg-white shadow-md rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-primary">Create Loyalty Pass</h2>
                <input
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Customer Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="number"
                    placeholder="Current Points"
                    onChange={(e) => setPoints(Number(e.target.value))}
                />
                <input
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="number"
                    placeholder="Goal"
                    value={goal}
                    onChange={(e) => setGoal(Number(e.target.value))}
                />
                <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-md hover:bg-blue-700 transition"
                >
                    Generate QR Code
                </button>
            </form>

            {qr && (
                <div className="mb-10">
                    <h3 className="text-lg font-semibold mb-2">QR Code:</h3>
                    <img src={qr} alt="Wallet QR Code" className="border p-2 bg-white" />
                </div>
            )}
        </div>
    );
}
