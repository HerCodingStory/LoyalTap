import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar'; // Import the sidebar

export default function Header({ restaurantName }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <>
            {/* Header */}
            <header className="w-full bg-white px-4 sm:px-6 py-4 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {/* Hamburger (mobile only) */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden text-gray-700"
                    >
                        <FaBars size={20} />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-800">
                        {restaurantName ? `${restaurantName}'s Dashboard 🌴` : 'Dashboard'}
                    </h2>
                </div>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
                >
                    Logout
                </button>
            </header>

            {/* Mobile Sidebar Drawer */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <div
                        className="absolute top-0 left-0 h-full w-64 bg-white shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h1 className="text-xl font-bold text-primary">LoyalTap</h1>
                            <button onClick={() => setIsSidebarOpen(false)}>
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <Sidebar isMobile onNavigate={() => setIsSidebarOpen(false)} />
                    </div>
                </div>
            )}
        </>
    );
}
