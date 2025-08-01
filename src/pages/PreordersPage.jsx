import React, { useState } from 'react';
import './SimplePreorderForm.css';

const PreordersPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        shippingAddress: '',
        quantity: '',
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Add a slight delay to show the loading state
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Handle form submission here
        console.log('Form submitted:', formData);
        setIsSubmitting(false);
    };

    return (
        <div className="preorder-container">
            <div className="preorder-card">
                <div className="preorder-header">
                    <h1>Preorder Volume One</h1>
                    <p>Reserve your copy of Primer's inaugural collection</p>
                    <div className="preorder-price">
                        <span className="preorder-price-amount">$23</span>
                        <span className="preorder-price-shipping">+ shipping</span>
                    </div>
                </div>

                <form 
                    name="preorders" 
                    method="POST" 
                    data-netlify="true"
                    netlify-honeypot="bot-field"
                    onSubmit={handleSubmit}
                >
                    <input type="hidden" name="form-name" value="preorders" />
                    
                    <div style={{ display: 'none' }}>
                        <label>
                            Don't fill this out if you're human: 
                            <input name="bot-field" />
                        </label>
                    </div>

                    <div className="preorder-form-field">
                        <label>Full Name *</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="preorder-form-field">
                        <label>Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="preorder-form-field">
                        <label>Shipping Address *</label>
                        <textarea
                            name="shippingAddress"
                            placeholder="Street address&#10;City, State ZIP&#10;Country"
                            rows="4"
                            value={formData.shippingAddress}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="preorder-form-field">
                        <label>Quantity *</label>
                        <select
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select quantity</option>
                            <option value="1">1 copy</option>
                            <option value="2">2 copies</option>
                            <option value="3">3 copies</option>
                            <option value="4">4 copies</option>
                            <option value="5">5 copies</option>
                            <option value="10">10 copies</option>
                        </select>
                    </div>

                    <div className="preorder-form-field">
                        <label>Notes (Optional)</label>
                        <textarea
                            name="notes"
                            placeholder="Any special instructions or comments..."
                            rows="3"
                            value={formData.notes}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="preorder-submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="preorder-spinner"></span>
                                Processing...
                            </>
                        ) : (
                            'Submit Preorder'
                        )}
                    </button>

                    <div className="preorder-notice">
                        📧 You'll receive a payment link via email to complete your order.
                    </div>

                    <div className="preorder-book-details">
                        <h3>Book Details</h3>
                        <div className="preorder-detail-item">
                            <span className="preorder-detail-label">Format</span>
                            <span className="preorder-detail-value">Perfect bound, 6" × 9"</span>
                        </div>
                        <div className="preorder-detail-item">
                            <span className="preorder-detail-label">Pages</span>
                            <span className="preorder-detail-value">~200 pages</span>
                        </div>
                        <div className="preorder-detail-item">
                            <span className="preorder-detail-label">Paper</span>
                            <span className="preorder-detail-value">High-quality cream</span>
                        </div>
                        <div className="preorder-detail-item">
                            <span className="preorder-detail-label">Ship Date</span>
                            <span className="preorder-badge">Spring 2025</span>
                        </div>
                        <div className="preorder-detail-item">
                            <span className="preorder-detail-label">Shipping</span>
                            <span className="preorder-detail-value">US domestic only</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PreordersPage;
 