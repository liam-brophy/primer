import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useForm } from 'react-hook-form';
import './OrderPage.css';
import './SimplePreorderForm.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PRODUCTS = [
  {
    id: 'vol1',
    title: 'Volume I',
    image: '/images/Primer_VolumeI.jpg',
    description: 'The original collection.',
    details: 'Introduced by R Eric Thomas.\n\nWriting by Claire Landsbaum, Julian Shendelman, Sarah Chin, Jess Mendes, Colin Griffin, Patrick Nathan, Vanessa Holyoak, and DJ Hills.\n\nFeaturing art from Larissa Bates, Kiara Florez, and Seth Clark.',
    price: 20,
    button: 'Order'
  },
  {
    id: 'vol2',
    title: 'Volume II',
    image: '/images/PrimerCover_VOLUME2.jpg',
    description: 'Now available.',
    details: 'Introduced by Anthony Roth Costanzo.\n\nWriting by John Paul Brammer, Corley Miller, Keegan Smith-Nichols, Kurt David, Hannah Rubin, Nia Watson, and Alex Bechtel.\n\nFeaturing art from Shawn Huckins, Halley Zein, and D\'Shon McCarthy.',
    price: 20,
    button: 'Order'
  }
];

const OrderPageContent = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [expanded, setExpanded] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [isPaymentStep, setIsPaymentStep] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState(null);

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
      notes: '',
      discountCode: ''
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      const raw = sessionStorage.getItem('cartData');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [isPickup, setIsPickup] = useState(() => {
    try {
      const raw = sessionStorage.getItem('checkout_pref');
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed?.isPickup || false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('cartData', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addToCart = (id) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  };

  const updateQty = (id, qty) => {
    const safe = Number.isFinite(qty) && qty > 0 ? qty : 1;
    setCart((c) => ({ ...c, [id]: safe }));
  };

  const removeFromCart = (id) => {
    setCart((c) => {
      const copy = { ...c };
      delete copy[id];
      return copy;
    });
  };

  const subtotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const p = PRODUCTS.find((x) => x.id === id);
      return sum + (p ? p.price * qty : 0);
    }, 0);
  }, [cart]);

  const shipping = isPickup ? 0 : subtotal > 0 ? 4.99 : 0;
  const total = subtotal + shipping;

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    setPaymentError(null);

    try {
      const cartItems = Object.entries(cart).map(([id, qty]) => {
        const prod = PRODUCTS.find(p => p.id === id);
        return { id, title: prod?.title || '', quantity: qty, price: prod?.price || 0 };
      });

      let submissionData = {
        ...formData,
        cart: cartItems,
        isPickup,
        quantity: Object.values(cart).reduce((sum, qty) => sum + qty, 0)
      };

      if (!isPickup) {
        submissionData.formattedAddress = `${formData.address}
${formData.city}, ${formData.state} ${formData.zipCode}
${formData.country === 'US' ? 'United States' : formData.country === 'CA' ? 'Canada' : formData.country === 'UK' ? 'United Kingdom' : formData.country === 'AU' ? 'Australia' : 'Other'}`;
      } else {
        submissionData.formattedAddress = 'In-store pickup';
      }

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        let errorMessage = 'Error processing your order';
        try {
          const errorResult = await response.json();
          errorMessage = errorResult.error || errorMessage;
        } catch {
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setClientSecret(result.clientSecret);
      setIsPaymentStep(true);
    } catch (error) {
      console.error('Error submitting order:', error);
      setPaymentError(`Sorry, there was a problem: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setIsSubmitting(true);
    setPaymentError(null);

    const formData = getValues();
    const billingDetails = {
      name: formData.name,
      email: formData.email,
      address: !isPickup ? {
        line1: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.zipCode,
        country: formData.country
      } : undefined
    };

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: billingDetails
        }
      });

      if (error) {
        throw new Error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        setSuccessDetails({
          paymentIntentId: paymentIntent.id,
          customerName: formData.name,
          customerEmail: formData.email,
          amount: (paymentIntent.amount / 100).toFixed(2)
        });
        setPaymentSuccess(true);
        sessionStorage.removeItem('cartData');
        sessionStorage.removeItem('checkout_pref');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDetails = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <main className={`main-content container ${theme}`}>
      <div className="order-page">
        <div className="products">
          {PRODUCTS.map((p) => {
            const isExpanded = !!expanded[p.id];
            return (
            <div className="product-tile" key={p.id} data-expanded={isExpanded} data-id={p.id}>
              <h2 className="product-title">{p.title}</h2>
              <img src={p.image} alt={p.title} className="product-image" />
              <p className="product-details" data-visible={isExpanded}>{p.details}</p>
              <div className="product-controls">
                <button
                  className="details-arrow"
                  onClick={() => toggleDetails(p.id)}
                  aria-expanded={!!expanded[p.id]}
                  aria-label={`${expanded[p.id] ? 'Hide' : 'Show'} details for ${p.title}`}
                >
                  {expanded[p.id] ? '▾' : '▸'}
                </button>
                <span className="product-price">${p.price}</span>
                <div className="controls-fill" />
                <span className="added-pill">{cart[p.id] ? `${cart[p.id]} in cart` : ''}</span>
                <button className="add-button" onClick={() => addToCart(p.id)} aria-label={`Add ${p.title} to cart`}>
                  +
                </button>
              </div>
            </div>
            );
          })}
        </div>

        <aside className="cart-sidebar">
          <div className="cart-contents">
            {Object.keys(cart).length === 0 ? (
              <p className="empty-note">Cart is empty.</p>
            ) : (
              <ul>
                {Object.entries(cart).map(([id, qty]) => {
                  const prod = PRODUCTS.find((p) => p.id === id);
                  if (!prod) return null;
                  return (
                    <li key={id} className="cart-item">
                      <div className="cart-item-left">
                        <img src={prod.image} alt={prod.title} />
                        <div className="cart-item-meta">
                          <div className="cart-item-title">{prod.title}</div>
                          <div className="cart-item-price">${(prod.price * qty).toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="cart-item-actions">
                        <input
                          type="number"
                          min={1}
                          value={qty}
                          onChange={(e) => updateQty(id, parseInt(e.target.value || '1', 10))}
                        />
                        <button className="remove-btn" onClick={() => removeFromCart(id)}>Remove</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row shipping">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <strong>Total</strong>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>

          <div className="shipping-toggle">
            <label className="pickup-checkbox">
              <input
                type="checkbox"
                checked={isPickup}
                onChange={(e) => setIsPickup(e.target.checked)}
              />
              <span className="pickup-toggle" />
              <span className="pickup-text">I prefer to pick up my order (no shipping)</span>
            </label>
          </div>

          {paymentSuccess ? (
            <div className="payment-success">
              <h2>Order Confirmed!</h2>
              <p>Thank you, {successDetails.customerName}.</p>
              <div className="detail-row">
                <span>Order ID</span>
                <span>{successDetails.paymentIntentId}</span>
              </div>
              <div className="detail-row">
                <span>Total Paid</span>
                <span>${successDetails.amount}</span>
              </div>
              <button className="preorder-submit-button" onClick={() => navigate('/library')}>Browse Library</button>
            </div>
          ) : !isPaymentStep ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="preorder-form-field">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
                />
                {errors.name && <p className="error-message">{errors.name.message}</p>}
              </div>

              <div className="preorder-form-field">
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })}
                />
                {errors.email && <p className="error-message">{errors.email.message}</p>}
              </div>

              {!isPickup && (
                <>
                  <div className="preorder-form-field">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      placeholder="123 Main St, Apt 4B"
                      {...register('address', { required: !isPickup ? 'Street address is required' : false })}
                    />
                    {errors.address && <p className="error-message">{errors.address.message}</p>}
                  </div>

                  <div className="preorder-form-field">
                    <label>City *</label>
                    <input
                      type="text"
                      placeholder="City"
                      {...register('city', { required: !isPickup ? 'City is required' : false })}
                    />
                    {errors.city && <p className="error-message">{errors.city.message}</p>}
                  </div>

                  <div className="preorder-form-field">
                    <label>State/Province *</label>
                    <input
                      type="text"
                      placeholder="State"
                      {...register('state', { required: !isPickup ? 'State/Province is required' : false })}
                    />
                    {errors.state && <p className="error-message">{errors.state.message}</p>}
                  </div>

                  <div className="preorder-form-field">
                    <label>ZIP/Postal Code *</label>
                    <input
                      type="text"
                      placeholder="ZIP/Postal Code"
                      {...register('zipCode', { required: !isPickup ? 'ZIP/Postal Code is required' : false, pattern: { value: /^[0-9]{5}(-[0-9]{4})?$/, message: 'Please enter a valid ZIP code' } })}
                    />
                    {errors.zipCode && <p className="error-message">{errors.zipCode.message}</p>}
                  </div>

                  <div className="preorder-form-field">
                    <label>Country *</label>
                    <select {...register('country', { required: !isPickup ? 'Country is required' : false })}>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="OTHER">Other</option>
                    </select>
                    {errors.country && <p className="error-message">{errors.country.message}</p>}
                  </div>
                </>
              )}

              <div className="preorder-form-field">
                <label>Notes (Optional)</label>
                <textarea placeholder="Any special instructions..." rows="3" {...register('notes')} />
              </div>

              <div className="preorder-form-field">
                <label>Discount Code (Optional)</label>
                <input type="text" placeholder="Enter code" {...register('discountCode')} />
              </div>

              <button type="submit" className="preorder-submit-button" disabled={isSubmitting || subtotal === 0}>
                {isSubmitting ? 'Processing...' : 'Continue to Payment'}
              </button>

              {paymentError && <div className="error-message payment-error">{paymentError}</div>}
            </form>
          ) : (
            <form onSubmit={handlePaymentSubmit}>
              <h3>Payment Information</h3>
              <div className="preorder-form-field card-element-container">
                <label>Card Details *</label>
                <CardElement options={{ style: { base: { color: '#32325d', fontFamily: '"Helvetica Neue", Helvetica, sans-serif', fontSize: '16px' } }, hidePostalCode: true }} />
              </div>

              {paymentError && <div className="error-message payment-error">{paymentError}</div>}

              <div className="payment-buttons">
                <button type="button" className="back-button" onClick={() => setIsPaymentStep(false)} disabled={isSubmitting}>Back</button>
                <button type="submit" className="preorder-submit-button" disabled={isSubmitting || !stripe}>
                  {isSubmitting ? 'Processing...' : 'Complete Payment'}
                </button>
              </div>
            </form>
          )}
        </aside>
      </div>
    </main>
  );
};

export default function OrderPage() {
  return (
    <Elements stripe={stripePromise}>
      <OrderPageContent />
    </Elements>
  );
}
