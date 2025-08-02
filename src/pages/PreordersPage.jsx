import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './SimplePreorderForm.css';
import { useTheme } from '../context/ThemeContext';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Separate component for the form with Stripe elements
const PreorderForm = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [isPickup, setIsPickup] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    // Set isPaymentStep to false initially to start with the customer info form
    const [isPaymentStep, setIsPaymentStep] = useState(false);
    const [orderSummary, setOrderSummary] = useState({
        quantity: 1,
        subtotal: 23.99,
        shipping: 0,
        total: 23.99
    });
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [successDetails, setSuccessDetails] = useState(null);
    
    // Stripe hooks
    const stripe = useStripe();
    const elements = useElements();
    
    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        watch,
        getValues
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'US',
            quantity: '',
            notes: '',
            isPickup: false
        }
    });
    
    // Watch the isPickup field to update the state
    const watchIsPickup = watch("isPickup");
    
    // Update the local state when the checkbox changes
    React.useEffect(() => {
        setIsPickup(watchIsPickup);
    }, [watchIsPickup]);

    // Initial form submission - collect customer info, then proceed to payment
    const onSubmit = async (formData) => {
        setIsSubmitting(true);
        setPaymentError(null);
        
        try {
            // Compile the shipping address from individual fields for backend processing
            let submissionData = { ...formData };
            
            if (!formData.isPickup) {
                submissionData.formattedAddress = `${formData.address}
${formData.city}, ${formData.state} ${formData.zipCode}
${formData.country === 'US' ? 'United States' : 
  formData.country === 'CA' ? 'Canada' : 
  formData.country === 'UK' ? 'United Kingdom' : 
  formData.country === 'AU' ? 'Australia' : 'Other'}`;
            } else {
                // If pickup is selected, clear address fields in the submission
                submissionData.formattedAddress = 'In-store pickup';
            }
            
            // Send data to our serverless function to create a payment intent
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            });
            
            // Check if the response is OK before trying to parse JSON
            if (!response.ok) {
                // Try to get error message from response
                let errorMessage = 'Error processing your order';
                try {
                    const errorResult = await response.json();
                    errorMessage = errorResult.error || errorMessage;
                } catch (jsonError) {
                    // If JSON parsing fails, use the status text
                    errorMessage = `Server error (${response.status}): ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }
            
            const result = await response.json();
            
            console.log('Payment intent created:', result);
            
            // Store the client secret and move to payment step
            setClientSecret(result.clientSecret);
            setOrderSummary({
                quantity: formData.quantity,
                subtotal: result.amount / 100, // Convert cents to dollars
                shipping: result.shipping / 100,
                total: (result.amount + result.shipping) / 100
            });
            setIsPaymentStep(true);
            
        } catch (error) {
            console.error('Error submitting order:', error);
            setPaymentError(`Sorry, there was a problem processing your order: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Handle the actual payment submission
    const handlePaymentSubmit = async (event) => {
        event.preventDefault();
        
        if (!stripe || !elements || !clientSecret) {
            // Stripe.js has not loaded yet or client secret is not available
            return;
        }
        
        setIsSubmitting(true);
        setPaymentError(null);
        
        // Get customer data from the form
        const formData = getValues();
        
        // Get billing details from form
        const billingDetails = {
            name: formData.name,
            email: formData.email,
            address: !formData.isPickup ? {
                line1: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.zipCode,
                country: formData.country,
            } : undefined
        };
        
        try {
            // Confirm the payment with the card element
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: billingDetails,
                }
            });
            
            if (error) {
                throw new Error(error.message);
            } else if (paymentIntent.status === 'succeeded') {
                // Payment successful, show confirmation
                setSuccessDetails({
                    paymentIntentId: paymentIntent.id,
                    customerName: formData.name,
                    customerEmail: formData.email,
                    amount: (paymentIntent.amount / 100).toFixed(2),
                    quantity: formData.quantity
                });
                setPaymentSuccess(true);
            }
        } catch (error) {
            console.error('Payment error:', error);
            setPaymentError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Card element styling options
    const cardElementOptions = {
        style: {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        },
        hidePostalCode: true,
        // Allow browser autofill
        allowBrowserAutofill: true
    };

    return (
        <div className={`preorder-container ${theme}`}>
            <div className="preorder-card">
                <div className="preorder-header">
                    <h1 className="preorder-title">Preorder Volume One</h1>
                    <p>Reserve your copy of Primer's inaugural collection</p>
                    
                    <div className="book-mockup-space">
                        <img 
                            src="/images/Primer_Mockup_1.png" 
                            alt="Primer Volume One Book Mockup" 
                            className="book-mockup-image"
                        />
                    </div>
                    
                    <div className="preorder-price">
                        <span className="preorder-price-amount">$23.99</span>
                        <span className="preorder-price-shipping">+ shipping</span>
                    </div>
                </div>

                {paymentSuccess ? (
                    // Payment Success Confirmation
                    <div className="payment-success">
                        <h2>Order Confirmed</h2>
                        <p>Thank you for your preorder, {successDetails.customerName}. You'll receive a confirmation email shortly with your order details and updates on shipping.</p>
                        
                        <div className="order-details">
                            <h3>Order Summary</h3>
                            <div className="detail-row">
                                <span>Customer</span>
                                <span>{successDetails.customerName}</span>
                            </div>
                            <div className="detail-row">
                                <span>Email</span>
                                <span>{successDetails.customerEmail}</span>
                            </div>
                            <div className="detail-row">
                                <span>Quantity</span>
                                <span>{successDetails.quantity} copy{successDetails.quantity > 1 ? 'ies' : ''}</span>
                            </div>
                            <div className="detail-row">
                                <span>Total Paid</span>
                                <span>${successDetails.amount}</span>
                            </div>
                            <div className="detail-row">
                                <span>Order ID</span>
                                <span>{successDetails.paymentIntentId}</span>
                            </div>
                        </div>

                        <div className="success-message">
                            <p>We'll notify you when Primer Volume One is ready to ship.</p>
                        </div>

                        <div className="success-actions">
                            <button 
                                className="library-button"
                                onClick={() => navigate('/library')}
                            >
                                Browse Library
                            </button>
                            <button 
                                className="home-button"
                                onClick={() => navigate('/')}
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                ) : !isPaymentStep ? (
                    // Step 1: Customer Information Form
                    <form 
                        name="preorders" 
                        method="POST" 
                        data-netlify="true"
                        netlify-honeypot="bot-field"
                        onSubmit={handleSubmit(onSubmit)}
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
                                placeholder="Enter your full name"
                                {...register("name", { 
                                    required: "Name is required",
                                    minLength: { 
                                        value: 2, 
                                        message: "Name must be at least 2 characters" 
                                    }
                                })}
                            />
                            {errors.name && <p className="error-message">{errors.name.message}</p>}
                        </div>

                        <div className="preorder-form-field">
                            <label>Email Address *</label>
                            <input
                                type="email"
                                placeholder="your.email@example.com"
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            {errors.email && <p className="error-message">{errors.email.message}</p>}
                        </div>

                        <div className="preorder-form-field">
                            <div className="pickup-checkbox">
                                <input
                                    type="checkbox"
                                    id="isPickup"
                                    {...register("isPickup")}
                                />
                                <label htmlFor="isPickup">I prefer to pick up my order (no shipping fees)</label>
                            </div>
                        </div>

                        {!isPickup && (
                            <>
                                <div className="preorder-form-field">
                                    <label>Street Address *</label>
                                    <input
                                        type="text"
                                        placeholder="123 Main St, Apt 4B"
                                        {...register("address", { 
                                            required: !isPickup ? "Street address is required" : false
                                        })}
                                    />
                                    {errors.address && <p className="error-message">{errors.address.message}</p>}
                                </div>
                                
                                <Row>
                                    <Col md={6}>
                                        <div className="preorder-form-field">
                                            <label>City *</label>
                                            <input
                                                type="text"
                                                placeholder="City"
                                                {...register("city", { 
                                                    required: !isPickup ? "City is required" : false
                                                })}
                                            />
                                            {errors.city && <p className="error-message">{errors.city.message}</p>}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="preorder-form-field">
                                            <label>State/Province *</label>
                                            <input
                                                type="text"
                                                placeholder="State"
                                                {...register("state", { 
                                                    required: !isPickup ? "State/Province is required" : false
                                                })}
                                            />
                                            {errors.state && <p className="error-message">{errors.state.message}</p>}
                                        </div>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col md={6}>
                                        <div className="preorder-form-field">
                                            <label>ZIP/Postal Code *</label>
                                            <input
                                                type="text"
                                                placeholder="ZIP/Postal Code"
                                                {...register("zipCode", { 
                                                    required: !isPickup ? "ZIP/Postal Code is required" : false,
                                                    pattern: {
                                                        value: /^[0-9]{5}(-[0-9]{4})?$/,
                                                        message: "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)"
                                                    }
                                                })}
                                            />
                                            {errors.zipCode && <p className="error-message">{errors.zipCode.message}</p>}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="preorder-form-field">
                                            <label>Country *</label>
                                            <select
                                                {...register("country", { 
                                                    required: !isPickup ? "Country is required" : false
                                                })}
                                            >
                                                <option value="US">United States</option>
                                                <option value="CA">Canada</option>
                                                <option value="UK">United Kingdom</option>
                                                <option value="AU">Australia</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                            {errors.country && <p className="error-message">{errors.country.message}</p>}
                                        </div>
                                    </Col>
                                </Row>
                            </>
                        )}

                        <div className="preorder-form-field">
                            <label>Quantity *</label>
                            <select
                                {...register("quantity", { 
                                    required: "Please select a quantity" 
                                })}
                            >
                                <option value="">Select quantity</option>
                                <option value="1">1 copy</option>
                                <option value="2">2 copies</option>
                                <option value="3">3 copies</option>
                                <option value="4">4 copies</option>
                                <option value="5">5 copies</option>
                                <option value="10">10 copies</option>
                            </select>
                            {errors.quantity && <p className="error-message">{errors.quantity.message}</p>}
                        </div>

                        <div className="preorder-form-field">
                            <label>Notes (Optional)</label>
                            <textarea
                                placeholder="Any special instructions or comments..."
                                rows="3"
                                {...register("notes")}
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
                                'Continue to Payment'
                            )}
                        </button>

                        {paymentError && (
                            <div className="error-message payment-error">
                                {paymentError}
                            </div>
                        )}
                    </form>
                ) : (
                    // Step 2: Payment Form
                    <div className="payment-step">
                        <div className="order-summary">
                            <h2>Order Summary</h2>
                            <div className="summary-details">
                                <div className="summary-row">
                                    <span>Primer Volume One × {orderSummary.quantity}</span>
                                    <span>${orderSummary.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span>${orderSummary.shipping.toFixed(2)}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>${orderSummary.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handlePaymentSubmit}>
                            <div className="payment-form">
                                <h2>Payment Information</h2>
                                
                                <div className="preorder-form-field card-element-container">
                                    <label>Card Details *</label>
                                    <CardElement options={cardElementOptions} />
                                </div>
                                
                                {paymentError && (
                                    <div className="error-message payment-error">
                                        {paymentError}
                                    </div>
                                )}
                                
                                <div className="payment-buttons">
                                    <button 
                                        type="button" 
                                        className="back-button"
                                        onClick={() => setIsPaymentStep(false)}
                                        disabled={isSubmitting}
                                    >
                                        Back
                                    </button>
                                    
                                    <button 
                                        type="submit" 
                                        className="preorder-submit-button"
                                        disabled={isSubmitting || !stripe}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="preorder-spinner"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            'Complete Payment'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

// Wrapper component that provides Stripe Elements
const PreordersPage = () => {
    return (
        <Elements stripe={stripePromise}>
            <PreorderForm />
        </Elements>
    );
};

export default PreordersPage;
