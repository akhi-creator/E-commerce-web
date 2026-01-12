import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { removeFromCart, updateQuantity, selectCartItems, selectCartTotal } from '../store/slices/cartSlice';
import './Cart.css';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(selectCartItems);
    const subtotal = useSelector(selectCartTotal);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    const handleQuantityChange = (productId, newQuantity, stock) => {
        if (newQuantity < 1) {
            dispatch(removeFromCart(productId));
        } else if (newQuantity <= stock) {
            dispatch(updateQuantity({ productId, quantity: newQuantity }));
        }
    };

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleCheckout = () => {
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            navigate('/login?redirect=checkout');
        }
    };

    if (items.length === 0) {
        return (
            <main className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">
                            <FiShoppingBag />
                        </div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added any products to your cart yet.</p>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-page">
            <div className="container">
                <h1 className="page-title">Shopping Cart</h1>
                <p className="cart-count">{items.length} items in your cart</p>

                <div className="cart-content">
                    {/* Cart Items */}
                    <div className="cart-items">
                        {items.map((item) => (
                            <div key={item.product} className="cart-item">
                                <Link to={`/product/${item.product}`} className="item-image">
                                    <img src={item.image} alt={item.name} />
                                </Link>
                                <div className="item-details">
                                    <Link to={`/product/${item.product}`} className="item-name">
                                        {item.name}
                                    </Link>
                                    <p className="item-price">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="item-quantity">
                                    <button
                                        className="quantity-btn"
                                        onClick={() => handleQuantityChange(item.product, item.quantity - 1, item.stock)}
                                    >
                                        <FiMinus />
                                    </button>
                                    <span className="quantity-value">{item.quantity}</span>
                                    <button
                                        className="quantity-btn"
                                        onClick={() => handleQuantityChange(item.product, item.quantity + 1, item.stock)}
                                        disabled={item.quantity >= item.stock}
                                    >
                                        <FiPlus />
                                    </button>
                                </div>
                                <div className="item-total">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemove(item.product)}
                                    aria-label="Remove item"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                        <div className="summary-card glass-card">
                            <h3>Order Summary</h3>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax (8%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            {subtotal < 100 && (
                                <div className="shipping-note">
                                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                                </div>
                            )}
                            <div className="summary-divider"></div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <button className="btn btn-primary btn-lg checkout-btn" onClick={handleCheckout}>
                                Proceed to Checkout <FiArrowRight />
                            </button>
                            <Link to="/products" className="continue-shopping">
                                Continue Shopping
                            </Link>
                        </div>

                        <div className="promo-code">
                            <h4>Have a promo code?</h4>
                            <form className="promo-form">
                                <input type="text" placeholder="Enter code" />
                                <button type="submit" className="btn btn-secondary">Apply</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Cart;
