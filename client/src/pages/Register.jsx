import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { register, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '';

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirect ? `/${redirect}` : '/');
        }
    }, [isAuthenticated, navigate, redirect]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        dispatch(register({
            name: formData.name,
            email: formData.email,
            password: formData.password
        }));
    };

    return (
        <main className="auth-page">
            <div className="auth-container">
                <div className="auth-visual">
                    <div className="visual-content">
                        <h2>Join ShopVerse</h2>
                        <p>Create an account and start your shopping journey today.</p>
                        <div className="visual-features">
                            <div className="feature">🎁 Get 20% off your first order</div>
                            <div className="feature">💳 Secure payment options</div>
                            <div className="feature">🌟 Earn rewards on every purchase</div>
                        </div>
                    </div>
                    <div className="visual-decoration">
                        <div className="circle circle-1"></div>
                        <div className="circle circle-2"></div>
                        <div className="circle circle-3"></div>
                    </div>
                </div>

                <div className="auth-form-container">
                    <div className="auth-form-wrapper">
                        <Link to="/" className="auth-logo">
                            <span className="logo-icon">🛍️</span>
                            <span className="logo-text">ShopVerse</span>
                        </Link>

                        <h1>Create Account</h1>
                        <p className="auth-subtitle">Fill in your details to get started</p>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <div className="input-wrapper">
                                    <FiUser className="input-icon" />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <div className="input-wrapper">
                                    <FiMail className="input-icon" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <FiLock className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="input-wrapper">
                                    <FiLock className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <label className="checkbox-label terms-checkbox">
                                <input type="checkbox" required />
                                <span>
                                    I agree to the <Link to="/terms">Terms of Service</Link> and{' '}
                                    <Link to="/privacy">Privacy Policy</Link>
                                </span>
                            </label>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg submit-btn"
                                disabled={loading}
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="auth-divider">
                            <span>or sign up with</span>
                        </div>

                        <div className="social-buttons">
                            <button className="social-btn">
                                <img src="https://www.google.com/favicon.ico" alt="Google" />
                                Google
                            </button>
                            <button className="social-btn">
                                <img src="https://www.facebook.com/favicon.ico" alt="Facebook" />
                                Facebook
                            </button>
                        </div>

                        <p className="auth-footer">
                            Already have an account?{' '}
                            <Link to={`/login${redirect ? `?redirect=${redirect}` : ''}`}>
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Register;
