import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaQrcode, FaUsers, FaCog, FaHome } from 'react-icons/fa';
import { LuScanBarcode } from "react-icons/lu";

export default function Sidebar({ isMobile = false, onNavigate = () => {} }) {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', icon: <FaHome />, path: '/dashboard' },
        { name: 'Customers', icon: <FaUsers />, path: '/dashboard/customers' },
        { name: 'Scan Pass', icon: <LuScanBarcode />, path: '/dashboard/scan' },
        { name: 'Generate Pass', icon: <FaQrcode />, path: '/dashboard/generate' },
        { name: 'Settings', icon: <FaCog />, path: '/dashboard/settings' },
    ];

    return (
        <aside className={`${isMobile ? '' : 'hidden md:block h-screen'} w-64 bg-white p-6 shadow-md`}>
            <h1 className="text-xl font-bold text-primary hidden md:block">LoyalTap</h1>
            <ul className="space-y-4 mt-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <li
                            key={item.name}
                            onClick={() => {
                                navigate(item.path);
                                onNavigate(); // Close sidebar if mobile
                            }}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                                isActive
                                    ? 'bg-primary text-white'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}