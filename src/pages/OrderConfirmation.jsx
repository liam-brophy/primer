import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './OrderConfirmation.css';
import { useTheme } from '../context/ThemeContext';

const OrderConfirmation = () => {
    const { theme } = useTheme();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Get the payment_intent from URL query parameters
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const paymentIntentId = searchParams.get('payment_intent');
    
    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!paymentIntentId) {
                setError('No payment information found');
                setLoading(false);
                return;
            }
            
            try {
                const response = await fetch(`/api/confirm-payment?payment_intent=${paymentIntentId}`);
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch order details');
                }
                
                setOrderDetails(data.orderDetails);
            } catch (err) {
                console.error('Error fetching order details:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchOrderDetails();
    }, [paymentIntentId]);
    
    if (loading) {
        return (
            <div className="confirmation-container">
                <div className="confirmation-card">
                    <h1>Processing Your Order...</h1>
                    <div className="confirmation-loader"></div>
                </div>
            </div>
        );
    }
    
    if (error || !orderDetails) {
        return (
            <div className="confirmation-container">
                <div className="confirmation-card">
                    <h1>There was a problem</h1>
                    <p className="confirmation-error">
                        {error || 'Could not retrieve order details'}
                    </p>
                    <a href="/preorders" className="confirmation-button">
                        Return to Preorder Page
                    </a>
                </div>
            </div>
        );
    }
    
    return (
        <div className={`confirmation-container ${theme}`}>
            <div className="confirmation-card">
                <div className="confirmation-header">
                    <svg className="confirmation-checkmark" viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                    <h1>Thank You for Your Order!</h1>
                </div>
                
                <div className="confirmation-details">
                    <p className="confirmation-number">
                        Order #{orderDetails.orderNumber.toString().substring(0, 8)}
                    </p>
                    
                    <div className="confirmation-summary">
                        <div className="confirmation-item">
                            <span>Name:</span>
                            <span>{orderDetails.customerName}</span>
                        </div>
                        <div className="confirmation-item">
                            <span>Email:</span>
                            <span>{orderDetails.customerEmail}</span>
                        </div>
                        <div className="confirmation-item">
                            <span>Item:</span>
                            <span>Primer Volume One × {orderDetails.quantity}</span>
                        </div>
                        <div className="confirmation-item">
                            <span>Total Amount:</span>
                            <span>${orderDetails.amount.toFixed(2)}</span>
                        </div>
                        <div className="confirmation-item">
                            <span>Delivery Method:</span>
                            <span>{orderDetails.isPickup ? 'In-store Pickup' : 'Shipping'}</span>
                        </div>
                    </div>
                </div>
                
                <div className="confirmation-message">
                    <p>A confirmation email has been sent to {orderDetails.customerEmail}</p>
                    <p>We'll notify you when your {orderDetails.isPickup ? 'order is ready for pickup' : 'order ships'}!</p>
                </div>
                
                <a href="/" className="confirmation-button">
                    Return to Homepage
                </a>
            </div>
        </div>
    );
};

export default OrderConfirmation;
