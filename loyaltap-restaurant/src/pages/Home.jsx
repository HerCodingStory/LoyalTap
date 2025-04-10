import React, { useState } from 'react';
import { createPassWithQR } from '../services/loyal-tap-api';

export default function Home() {
    const [email, setEmail] = useState('');
    const [points, setPoints] = useState(0);
    const [goal, setGoal] = useState(10);
    const [qr, setQr] = useState(null);

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
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Create Loyalty Pass</h1>
            <form onSubmit={handleGenerate} className="space-y-4">
                <input className="w-full p-2 border" placeholder="Customer Email" onChange={(e) => setEmail(e.target.value)} />
                <input className="w-full p-2 border" type="number" placeholder="Current Points" onChange={(e) => setPoints(Number(e.target.value))} />
                <input className="w-full p-2 border" type="number" placeholder="Goal" value={goal} onChange={(e) => setGoal(Number(e.target.value))} />
                <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded">Generate QR Code</button>
            </form>
            {qr && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">QR Code:</h2>
                    <img src={qr} alt="Wallet QR Code" className="border p-2 bg-white" />
                </div>
            )}
        </div>
    );
}