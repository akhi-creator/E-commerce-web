import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiCreditCard, FiShield, FiTruck, FiHeadphones } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            {/* Features Section */}
            <div className="footer-features">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-icon">
                                <FiTruck />
                            </div>
                            <div className="feature-content">
                                <h4>Free Shipping</h4>
                                <p>On orders over $100</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <FiShield />
                            </div>
                            <div className="feature-content">
                                <h4>Secure Payment</h4>
                                <p>100% secure transactions</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <FiCreditCard />
                            </div>
                            <div className="feature-content">
                                <h4>Easy Returns</h4>
                                <p>30-day return policy</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <FiHeadphones />
                            </div>
                            <div className="feature-content">
                                <h4>24/7 Support</h4>
                                <p>Dedicated support team</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="footer-main">
                <div className="container">
                    <div className="footer-grid">
                        {/* Brand */}
                        <div className="footer-brand">
                            <Link to="/" className="footer-logo">
                                <span className="logo-icon">🛍️</span>
                                <span className="logo-text">ShopVerse</span>
                            </Link>
                            <p className="footer-description">
                                Your ultimate destination for premium products.
                                Discover the latest trends and shop with confidence.
                            </p>
                            <div className="footer-social">
                                <a href="#" className="social-link" aria-label="Facebook">
                                    <FiFacebook />
                                </a>
                                <a href="#" className="social-link" aria-label="Twitter">
                                    <FiTwitter />
                                </a>
                                <a href="#" className="social-link" aria-label="Instagram">
                                    <FiInstagram />
                                </a>
                                <a href="#" className="social-link" aria-label="YouTube">
                                    <FiYoutube />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-links">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><Link to="/products">All Products</Link></li>
                                <li><Link to="/categories">Categories</Link></li>
                                <li><Link to="/deals">Special Deals</Link></li>
                                <li><Link to="/new-arrivals">New Arrivals</Link></li>
                                <li><Link to="/bestsellers">Best Sellers</Link></li>
                            </ul>
                        </div>

                        {/* Customer Service */}
                        <div className="footer-links">
                            <h4>Customer Service</h4>
                            <ul>
                                <li><Link to="/contact">Contact Us</Link></li>
                                <li><Link to="/faq">FAQ</Link></li>
                                <li><Link to="/shipping">Shipping Info</Link></li>
                                <li><Link to="/returns">Returns & Exchanges</Link></li>
                                <li><Link to="/track-order">Track Order</Link></li>
                            </ul>
                        </div>

                        {/* Account */}
                        <div className="footer-links">
                            <h4>My Account</h4>
                            <ul>
                                <li><Link to="/login">Sign In</Link></li>
                                <li><Link to="/register">Create Account</Link></li>
                                <li><Link to="/orders">Order History</Link></li>
                                <li><Link to="/wishlist">Wishlist</Link></li>
                                <li><Link to="/profile">Profile Settings</Link></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="footer-newsletter">
                            <h4>Stay Updated</h4>
                            <p>Subscribe to our newsletter for exclusive offers and updates.</p>
                            <form className="newsletter-form">
                                <div className="newsletter-input">
                                    <FiMail className="input-icon" />
                                    <input type="email" placeholder="Enter your email" />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <p>&copy; {currentYear} ShopVerse. All rights reserved.</p>
                        <div className="footer-bottom-links">
                            <Link to="/privacy">Privacy Policy</Link>
                            <Link to="/terms">Terms of Service</Link>
                            <Link to="/cookies">Cookie Policy</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
