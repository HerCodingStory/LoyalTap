import React, { useState } from 'react';
import { createLoyaltyClass } from '../services/loyal-tap-api';
import PassPreview from '../components/PassPreview';

export default function Settings() {
    const [restaurantName, setRestaurantName] = useState('');
    const [programName, setProgramName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await createLoyaltyClass(restaurantName,programName,logoUrl);
            setSuccess(true);
            setError('');
        } catch (err) {
            setSuccess(false);
            setError('Failed to create loyalty class');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-emerald-100 p-8">
            <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
                {/* Form Section */}
                <div className="flex-1 bg-white p-8 rounded-3xl shadow-xl">
                    <h2 className="text-2xl font-bold text-emerald-700 mb-6">Program Settings</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-semibold">Restaurant Name</label>
                            <input
                                type="text"
                                value={restaurantName}
                                onChange={(e) => setRestaurantName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-semibold">Program Name</label>
                            <input
                                type="text"
                                value={programName}
                                onChange={(e) => setProgramName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-semibold">Program Logo URL</label>
                            <input
                                type="url"
                                value={logoUrl}
                                onChange={(e) => setLogoUrl(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl shadow-md transition"
                        >
                            Save and Create Google Wallet Class
                        </button>

                        {success && <p className="text-green-600 mt-3">✅ Loyalty class created successfully.</p>}
                        {error && <p className="text-red-600 mt-3">❌ {error}</p>}
                    </form>
                </div>

                {/* Preview Section */}
                <PassPreview
                    restaurantName={restaurantName}
                    programName={programName}
                    logoUrl={logoUrl}
                    email="customer@gmail.com"
                    points={0}
                    goal={10}
                />
            </div>
        </div>
    );
}
