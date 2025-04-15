import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import { api } from '../services/loyal-tap-api'; // Import the named export

export default function Dashboard() {
    const [restaurantName, setRestaurantName] = useState('');

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                const res = await api.get('/auth/me', { headers });
                setRestaurantName(res.data.user.name);
            } catch (err) {
                console.error('Failed to load restaurant name');
            }
        };
        fetchRestaurant();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1">
                <Header restaurantName={restaurantName}/>
                <Outlet/> {/* Dynamic nested route content */}
            </div>
        </div>
    );
}
