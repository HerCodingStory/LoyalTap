import React, { useEffect, useState } from 'react';
import loyalTapApi, { createPassWithQR } from '../services/loyal-tap-api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
    const [restaurantName, setRestaurantName] = useState('');
    const [email, setEmail] = useState('');
    const [points, setPoints] = useState(0);
    const [goal, setGoal] = useState(10);
    const [qr, setQr] = useState(null);
    const [passes, setPasses] = useState([]);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const fetchPasses = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/pass/google/all', { headers });
            setPasses(res.data);
        } catch (err) {
            console.error('Failed to load passes');
        }
    };

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const res = await loyalTapApi.get('/auth/me');
                setRestaurantName(res.data.name);
            } catch (err) {
                console.error('Failed to load restaurant name');
            }
        };
        fetchRestaurant();
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

    const handleRegenerate = async (email) => {
        try {
            const res = await axios.post('http://localhost:5001/api/pass/google/regenerate-pass', { customerEmail: email }, { headers });
            alert('Pass regenerated');
            fetchPasses();
        } catch (err) {
            alert('Failed to regenerate pass');
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
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold text-emerald-600 drop-shadow-sm">
                {restaurantName ? `${restaurantName}'s Dashboard 🌴` : 'LoyalTap Dashboard 🌴'}
            </h1>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Logout
            </button>
            <form onSubmit={handleGenerate} className="space-y-4 mb-8">
                <input className="w-full p-2 border" placeholder="Customer Email"
                       onChange={(e) => setEmail(e.target.value)}/>
                <input className="w-full p-2 border" type="number" placeholder="Current Points"
                       onChange={(e) => setPoints(Number(e.target.value))}/>
                <input className="w-full p-2 border" type="number" placeholder="Goal" value={goal}
                       onChange={(e) => setGoal(Number(e.target.value))}/>
                <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded">Generate QR Code</button>
            </form>
            {qr && (
                <div className="mb-10">
                    <h2 className="text-lg font-semibold mb-2">QR Code:</h2>
                    <img src={qr} alt="Wallet QR Code" className="border p-2 bg-white"/>
                </div>
            )}

            <h2 className="text-xl font-bold mb-4">Recent Passes</h2>
            <table className="w-full table-auto border">
                <thead>
                <tr className="bg-gray-100">
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Points</th>
                    <th className="p-2 border">Goal</th>
                    <th className="p-2 border">Actions</th>
                </tr>
                </thead>
                <tbody>
                {passes.map((p, index) => (
                    <tr key={index} className="text-center">
                        <td className="border p-2">{p.customerEmail}</td>
                        <td className="border p-2">{p.points}</td>
                        <td className="border p-2">{p.goal}</td>
                        <td className="border p-2 space-x-2">
                            {/*<button*/}
                            {/*    onClick={() => handleRegenerate(p.customerEmail)}*/}
                            {/*    className="bg-yellow-500 text-white px-2 py-1 rounded"*/}
                            {/*>*/}
                            {/*    Regenerate*/}
                            {/*</button>*/}
                            <button
                                onClick={() => handleDelete(p.customerEmail)}
                                className="bg-red-600 text-white px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
