import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaQrcode, FaUsers, FaCog, FaHome } from 'react-icons/fa';
import { LuScanBarcode } from "react-icons/lu";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        {
            name: 'Dashboard',
            icon: <FaHome />,
            path: '/dashboard',
        },
        {
            name: 'Customers',
            icon: <FaUsers />,
            path: '/dashboard/customers',
        },
        {
            name: 'Scan Pass',
            icon: <LuScanBarcode />,
            path: '/dashboard/scan',
        },
        {
            name: 'Generate Pass',
            icon: <FaQrcode />,
            path: '/dashboard/generate',
        },
        {
            name: 'Settings',
            icon: <FaCog />,
            path: '/dashboard/settings',
        },
    ];

    return (
        <aside className="w-64 bg-white shadow-md h-screen px-4 py-8 hidden md:block">
            <h1 className="text-2xl font-bold text-primary mb-10">LoyalTap</h1>
            <ul className="space-y-4">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <li
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                                isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
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
