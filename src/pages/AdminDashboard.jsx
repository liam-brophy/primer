import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { useTheme } from '../context/ThemeContext';

const AdminDashboard = () => {
    const { theme } = useTheme();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();
    
    // Simple authentication - in a real app, use proper authentication
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';
    
    const handleLogin = (e) => {
        e.preventDefault();
        if (password === adminPassword) {
            setIsAuthenticated(true);
            // Store auth state in session storage
            sessionStorage.setItem('admin_authenticated', 'true');
        } else {
            alert('Invalid password');
        }
    };
    
    useEffect(() => {
        // Check if already authenticated
        if (sessionStorage.getItem('admin_authenticated') === 'true') {
            setIsAuthenticated(true);
        }
        
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);
    
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin-get-orders', {
                headers: {
                    'x-admin-auth': adminPassword
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            
            const data = await response.json();
            setOrders(data.orders);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('admin_authenticated');
    };
    
    if (!isAuthenticated) {
        return (
            <div className={`admin-container ${theme}`}>
                <div className="admin-card">
                    <h1>Admin Login</h1>
                    <form onSubmit={handleLogin}>
                        <div className="admin-form-group">
                            <label>Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="admin-button">Login</button>
                    </form>
                </div>
            </div>
        );
    }
    
    if (loading) {
        return (
            <div className={`admin-container ${theme}`}>
                <div className="admin-card">
                    <h1>Loading Orders...</h1>
                    <div className="admin-loader"></div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className={`admin-container ${theme}`}>
                <div className="admin-card">
                    <h1>Error</h1>
                    <p className="admin-error">{error}</p>
                    <button onClick={fetchOrders} className="admin-button">Try Again</button>
                    <button onClick={handleLogout} className="admin-button admin-button-secondary">Logout</button>
                </div>
            </div>
        );
    }
    
    return (
        <div className={`admin-container ${theme}`}>
            <div className="admin-header">
                <h1>Order Management</h1>
                <button onClick={handleLogout} className="admin-button admin-button-secondary">Logout</button>
            </div>
            
            <div className="admin-stats">
                <div className="admin-stat-card">
                    <h3>Total Orders</h3>
                    <p>{orders.length}</p>
                </div>
                <div className="admin-stat-card">
                    <h3>Paid Orders</h3>
                    <p>{orders.filter(order => order.paymentStatus === 'paid').length}</p>
                </div>
                <div className="admin-stat-card">
                    <h3>Pending Payment</h3>
                    <p>{orders.filter(order => order.paymentStatus === 'unpaid').length}</p>
                </div>
                <div className="admin-stat-card">
                    <h3>Total Books</h3>
                    <p>{orders.reduce((total, order) => total + order.quantity, 0)}</p>
                </div>
            </div>
            
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Qty</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="admin-no-orders">No orders found</td>
                            </tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id.substring(order._id.length - 8)}</td>
                                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td>
                                        <div>{order.name}</div>
                                        <div className="admin-email">{order.email}</div>
                                    </td>
                                    <td>{order.quantity}</td>
                                    <td>${order.paymentAmount ? order.paymentAmount.toFixed(2) : '—'}</td>
                                    <td>
                                        <span className={`admin-status admin-status-${order.status}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`admin-payment admin-payment-${order.paymentStatus}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="admin-view-button"
                                            onClick={() => {
                                                // View order details
                                                // This would be implemented in a full version
                                                alert(`View details for order ${order._id}`);
                                            }}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
