import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function PassPreview({ restaurantName, programName, logoUrl, email, points = 0, goal = 10 }) {
    const qrValue = `${restaurantName}-${email}`;

    return (
        <div className="w-full max-w-xs border border-gray-300 bg-white rounded-2xl shadow-lg p-4 text-center">
            {/* Top: Logo + Issuer */}
            <div className="flex items-center justify-start space-x-3 mb-4">
                {logoUrl ? (
                    <img src={logoUrl} alt="logo" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-full content-center">
                        Logo
                    </div>
                )}
                <span className="text-xl font-semibold text-gray-700">{restaurantName || 'Restaurant Name'}</span>
            </div>

            {/* Program Title */}
            <h2 className="text-l font-bold text-gray-800">{programName || 'Program Name'}</h2>

            {/* Points */}
            <div className="mt-2 text-left">
                <p className="text-sm text-gray-500 font-medium">Points</p>
                <p className="text-lg font-semibold text-black">{points}/{goal}</p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center my-4">
                <QRCodeSVG value={qrValue} size={128} />
            </div>

            {/* Customer email */}
            <p className="text-sm text-gray-500">{email || 'customer@email.com'}</p>
        </div>
    );
}