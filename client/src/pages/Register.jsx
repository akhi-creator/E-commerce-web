import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { register, googleLogin, facebookLogin, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import './Auth.css';

// Facebook App ID - Replace with your actual app ID from Facebook Developer Console
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || 'your-facebook-app-id';

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

    // Google Login Handler using access token
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // Get user info from Google API using access token
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });
                const userInfo = await userInfoResponse.json();

                // Create a mock credential with user info for our backend
                dispatch(googleLogin({
                    access_token: tokenResponse.access_token,
                    email: userInfo.email,
                    name: userInfo.name,
                    picture: userInfo.picture,
                    sub: userInfo.sub
                }));
            } catch (error) {
                toast.error('Google signup failed. Please try again.');
            }
        },
        onError: () => {
            toast.error('Google signup failed. Please try again.');
        },
    });

    // Facebook Login Handler
    const handleFacebookResponse = (response) => {
        if (response.accessToken) {
            dispatch(facebookLogin({
                accessToken: response.accessToken,
                userID: response.userID
            }));
        } else {
            toast.error('Facebook signup failed. Please try again.');
        }
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
                            <button
                                className="social-btn google-btn"
                                onClick={() => handleGoogleLogin()}
                                disabled={loading}
                                type="button"
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span>Google</span>
                            </button>

                            <FacebookLogin
                                appId={FACEBOOK_APP_ID}
                                autoLoad={false}
                                fields="name,email,picture"
                                callback={handleFacebookResponse}
                                render={renderProps => (
                                    <button
                                        className="social-btn facebook-btn"
                                        onClick={renderProps.onClick}
                                        disabled={loading}
                                        type="button"
                                    >
                                        <svg viewBox="0 0 24 24" width="20" height="20">
                                            <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                        <span>Facebook</span>
                                    </button>
                                )}
                            />
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

