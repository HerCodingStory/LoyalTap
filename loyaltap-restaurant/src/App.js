import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Generate from './pages/Generate';
import Scan from './pages/Scan';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute'; // TODO: add so no one can access this without being verify

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard/*" element={<Dashboard />}>
                    <Route path="customers" element={<Customers />} />
                    <Route path="scan" element={<Scan />} />
                    <Route path="generate" element={<Generate />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="" element={<Navigate to="" />} />
                </Route>
            </Routes>
        </Router>
    );
}
