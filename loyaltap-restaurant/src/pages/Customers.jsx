import React, { useEffect, useState } from 'react';
import axios from 'axios';
import loyalTapApi from '../services/loyal-tap-api'; // Use the default export

export default function Customers() {
    const [passes, setPasses] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State for search input

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        };
        const fetchPasses = async () => {
            try {
                const allCustomers = await loyalTapApi.getAllCustomers(headers);
                setPasses(allCustomers.data);
            } catch (err) {
                console.error('Failed to load passes', err);
            }
        };
        fetchPasses();
    }, []);

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
            setPasses((prev) => prev.filter((p) => p.customerEmail !== email));
        } catch (err) {
            alert('Failed to delete customer data');
        }
    };

    // Filter passes based on the search term
    const filteredPasses = passes.filter((p) =>
        p.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-4">Customers</h2>
            
            {/* Search bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            <table className="w-full table-auto text-sm bg-white rounded-xl shadow">
                <thead className="bg-gray-100 text-gray-600">
                <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Phone</th>
                    <th className="p-3 text-center">Points</th>
                    <th className="p-3 text-center">Goal</th>
                    <th className="p-3 text-center">Date created</th>
                    <th className="p-3 text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredPasses.map((p, index) => (
                    <tr key={index} className="border-t text-center">
                        <td className="p-3 text-left">{p.customerName}</td>
                        <td className="p-3 text-left">{p.customerEmail}</td>
                        <td className="p-3 text-left">{p.customerPhone}</td>
                        <td className="p-3">{p.points}</td>
                        <td className="p-3">{p.goal}</td>
                        <td className="p-3">{p.createdAt}</td>
                        <td className="p-3">
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
    );
}