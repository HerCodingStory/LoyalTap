import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import loyalTapApi from '../services/loyal-tap-api';

export default function Dashboard() {
    const [restaurantName, setRestaurantName] = useState('');

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                const res = await loyalTapApi.get('/auth/me', { headers });
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
