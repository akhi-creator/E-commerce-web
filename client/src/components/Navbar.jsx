import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiSettings, FiGrid } from 'react-icons/fi';
import { logout } from '../store/slices/authSlice';
import { selectCartItemsCount } from '../store/slices/cartSlice';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const cartItemsCount = useSelector(selectCartItemsCount);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        setIsUserMenuOpen(false);
        navigate('/');
    };

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">🛍️</span>
                    <span className="logo-text">ShopVerse</span>
                </Link>

                {/* Search Bar */}
                <form className="navbar-search" onSubmit={handleSearch}>
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>

                {/* Nav Links */}
                <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    <Link to="/products" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                        Products
                    </Link>
                    <Link to="/categories" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                        Categories
                    </Link>
                    <Link to="/deals" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                        Deals
                    </Link>
                </div>

                {/* Actions */}
                <div className="navbar-actions">
                    {/* Cart */}
                    <Link to="/cart" className="action-btn cart-btn">
                        <FiShoppingCart />
                        {cartItemsCount > 0 && (
                            <span className="cart-badge">{cartItemsCount}</span>
                        )}
                    </Link>

                    {/* User Menu */}
                    {isAuthenticated ? (
                        <div className="user-menu-container">
                            <button
                                className="action-btn user-btn"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            >
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="user-avatar" />
                                ) : (
                                    <FiUser />
                                )}
                            </button>

                            {isUserMenuOpen && (
                                <div className="user-dropdown">
                                    <div className="user-dropdown-header">
                                        <p className="user-name">{user?.name}</p>
                                        <p className="user-email">{user?.email}</p>
                                    </div>
                                    <div className="user-dropdown-divider" />
                                    <Link to="/profile" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                                        <FiUser /> Profile
                                    </Link>
                                    <Link to="/orders" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                                        <FiPackage /> My Orders
                                    </Link>
                                    {user?.role === 'admin' && (
                                        <Link to="/admin" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                                            <FiGrid /> Admin Dashboard
                                        </Link>
                                    )}
                                    <Link to="/settings" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                                        <FiSettings /> Settings
                                    </Link>
                                    <div className="user-dropdown-divider" />
                                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                                        <FiLogOut /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary btn-sm">
                            Sign In
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Search */}
            <form className="mobile-search container" onSubmit={handleSearch}>
                <FiSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>
        </nav>
    );
};

export default Navbar;
