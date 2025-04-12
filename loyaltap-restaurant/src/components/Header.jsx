import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ restaurantName }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <header className="w-full bg-white px-6 py-4 shadow-sm flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
                {restaurantName ? `${restaurantName}'s Dashboard 🌴` : 'Dashboard'}
            </h2>

            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
            >
                Logout
            </button>
        </header>
    );
}
