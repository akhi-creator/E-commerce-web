import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowRight, FiTrendingUp, FiZap, FiPackage, FiStar } from 'react-icons/fi';
import { getFeaturedProducts, getCategories } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import './Home.css';

const categories = [
    { name: 'Electronics', icon: '📱', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
    { name: 'Clothing', icon: '👕', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
    { name: 'Home & Garden', icon: '🏠', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400' },
    { name: 'Sports', icon: '⚽', image: 'https://images.unsplash.com/photo-1461896836934- voices-of-sports-fans?w=400' },
    { name: 'Beauty', icon: '💄', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
    { name: 'Books', icon: '📚', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400' }
];

const Home = () => {
    const dispatch = useDispatch();
    const { featuredProducts, loading } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getFeaturedProducts());
        dispatch(getCategories());
    }, [dispatch]);

    return (
        <main className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-gradient"></div>
                    <div className="hero-glow"></div>
                    <div className="hero-particles">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="particle" style={{
                                '--delay': `${i * 0.2}s`,
                                '--x': `${Math.random() * 100}%`,
                                '--y': `${Math.random() * 100}%`
                            }}></div>
                        ))}
                    </div>
                </div>
                <div className="container hero-container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <FiZap /> New Collection 2026
                        </div>
                        <h1 className="hero-title">
                            Discover the <span className="gradient-text">Future</span> of Shopping
                        </h1>
                        <p className="hero-description">
                            Experience premium products curated just for you. From cutting-edge tech to timeless fashion,
                            find everything you need with exclusive deals and lightning-fast delivery.
                        </p>
                        <div className="hero-actions">
                            <Link to="/products" className="btn btn-primary btn-lg">
                                Shop Now <FiArrowRight />
                            </Link>
                            <Link to="/deals" className="btn btn-outline btn-lg">
                                View Deals
                            </Link>
                        </div>
                        <div className="hero-stats">
                            <div className="stat">
                                <span className="stat-value">50K+</span>
                                <span className="stat-label">Products</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat">
                                <span className="stat-value">100K+</span>
                                <span className="stat-label">Customers</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat">
                                <span className="stat-value">4.9</span>
                                <span className="stat-label">Rating</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-image-wrapper">
                            <img
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
                                alt="Premium Shopping Experience"
                                className="hero-image"
                            />
                            <div className="floating-card card-1">
                                <FiPackage className="card-icon" />
                                <div>
                                    <p className="card-title">Free Shipping</p>
                                    <p className="card-text">On orders $100+</p>
                                </div>
                            </div>
                            <div className="floating-card card-2">
                                <FiStar className="card-icon" />
                                <div>
                                    <p className="card-title">Top Rated</p>
                                    <p className="card-text">By customers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="section categories-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Shop by Category</h2>
                        <Link to="/categories" className="section-link">
                            View All <FiArrowRight />
                        </Link>
                    </div>
                    <div className="categories-grid">
                        {categories.map((category, index) => (
                            <Link
                                key={category.name}
                                to={`/products?category=${category.name}`}
                                className="category-card"
                                style={{ '--delay': `${index * 0.1}s` }}
                            >
                                <div className="category-image">
                                    <img src={category.image} alt={category.name} />
                                    <div className="category-overlay"></div>
                                </div>
                                <div className="category-content">
                                    <span className="category-icon">{category.icon}</span>
                                    <h3>{category.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section featured-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">
                                <FiTrendingUp className="title-icon" /> Featured Products
                            </h2>
                            <p className="section-subtitle">Handpicked just for you</p>
                        </div>
                        <Link to="/products" className="btn btn-secondary">
                            View All Products <FiArrowRight />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="products-grid">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="product-card-skeleton">
                                    <div className="skeleton-image"></div>
                                    <div className="skeleton-body">
                                        <div className="skeleton-line"></div>
                                        <div className="skeleton-line"></div>
                                        <div className="skeleton-line"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="products-grid">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Banner */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card glass-card">
                        <div className="cta-content">
                            <h2>Get 20% Off Your First Order</h2>
                            <p>Sign up for our newsletter and receive an exclusive discount code.</p>
                            <form className="cta-form">
                                <input type="email" placeholder="Enter your email" />
                                <button type="submit" className="btn btn-primary">Subscribe</button>
                            </form>
                        </div>
                        <div className="cta-decoration">
                            <div className="cta-circle circle-1"></div>
                            <div className="cta-circle circle-2"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brands Section */}
            <section className="section brands-section">
                <div className="container">
                    <h2 className="brands-title">Trusted by Leading Brands</h2>
                    <div className="brands-grid">
                        {['Apple', 'Nike', 'Samsung', 'Sony', 'Adidas', 'Dyson'].map((brand) => (
                            <div key={brand} className="brand-item">
                                <span>{brand}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
