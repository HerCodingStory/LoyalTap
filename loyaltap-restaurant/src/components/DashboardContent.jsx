import React, { useEffect, useState } from 'react';
import loyalTapApi, { createPassWithQR } from '../services/loyal-tap-api';
import axios from 'axios';

export default function DashboardContent() {
    const [email, setEmail] = useState('');
    const [points, setPoints] = useState(0);
    const [goal, setGoal] = useState(10);
    const [qr, setQr] = useState(null);
    const [passes, setPasses] = useState([]);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchPasses = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/pass/google/all', { headers });
            setPasses(res.data);
        } catch (err) {
            console.error('Failed to load passes');
        }
    };

    useEffect(() => {
        fetchPasses();
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            const res = await createPassWithQR(email, points, goal);
            setQr(res.data.qrCode);
            fetchPasses();
        } catch (err) {
            alert('Failed to generate pass');
        }
    };

    const handleDelete = async (email) => {
        try {
            await axios.delete('http://localhost:5001/api/pass/customer/pass', {
                headers,
                data: { customerEmail: email }
            });
            await axios.delete('http://localhost:5001/api/pass/customer/reward', {
                headers,
                data: { customerEmail: email }
            });
            fetchPasses();
        } catch (err) {
            alert('Failed to delete customer data');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
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

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4">Recent Passes</h2>
                <table className="w-full table-auto text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                    <tr>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-center">Points</th>
                        <th className="p-3 text-center">Goal</th>
                        <th className="p-3 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {passes.map((p, index) => (
                        <tr key={index} className="border-t text-center">
                            <td className="p-3 text-left">{p.customerEmail}</td>
                            <td className="p-3">{p.points}</td>
                            <td className="p-3">{p.goal}</td>
                            <td className="p-3 space-x-2">
                                <button
                                    onClick={() => handleDelete(p.customerEmail)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
