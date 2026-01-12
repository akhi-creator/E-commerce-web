import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiHeart, FiStar, FiMinus, FiPlus, FiShare2, FiCheck, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { getProduct, clearProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const dispatch = useDispatch();
    const { product, loading } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getProduct(id));
        return () => dispatch(clearProduct());
    }, [dispatch, id]);

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            dispatch(addToCart({
                product: product._id,
                name: product.name,
                image: product.images?.[0]?.url || '/placeholder.jpg',
                price: product.price,
                stock: product.stock,
                quantity
            }));
            toast.success('Added to cart!');
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };

    if (loading) {
        return (
            <main className="product-detail-page">
                <div className="container">
                    <div className="product-detail-skeleton">
                        <div className="skeleton-gallery">
                            <div className="skeleton-main-image skeleton"></div>
                            <div className="skeleton-thumbnails">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="skeleton-thumb skeleton"></div>
                                ))}
                            </div>
                        </div>
                        <div className="skeleton-info">
                            <div className="skeleton-line skeleton" style={{ width: '60%', height: '32px' }}></div>
                            <div className="skeleton-line skeleton" style={{ width: '40%', height: '24px' }}></div>
                            <div className="skeleton-line skeleton" style={{ width: '100%', height: '100px' }}></div>
                            <div className="skeleton-line skeleton" style={{ width: '30%', height: '40px' }}></div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="product-detail-page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h3 className="empty-state-title">Product Not Found</h3>
                        <p className="empty-state-text">The product you're looking for doesn't exist.</p>
                        <Link to="/products" className="btn btn-primary">
                            Browse Products
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const discount = product.originalPrice > product.price
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800';

    return (
        <main className="product-detail-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/products">Products</Link>
                    <span>/</span>
                    <Link to={`/products?category=${product.category}`}>{product.category}</Link>
                    <span>/</span>
                    <span className="current">{product.name}</span>
                </nav>

                <div className="product-detail-content">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            <img
                                src={product.images?.[selectedImage]?.url || fallbackImage}
                                alt={product.name}
                                onError={(e) => { e.target.src = fallbackImage; }}
                            />
                            {discount > 0 && (
                                <span className="discount-badge">-{discount}%</span>
                            )}
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="thumbnail-list">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img
                                            src={image.url || fallbackImage}
                                            alt={`${product.name} ${index + 1}`}
                                            onError={(e) => { e.target.src = fallbackImage; }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                        <span className="product-category">{product.category}</span>
                        <h1 className="product-title">{product.name}</h1>

                        <div className="product-rating">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar
                                        key={i}
                                        className={i < Math.floor(product.ratings || 0) ? 'filled' : ''}
                                    />
                                ))}
                            </div>
                            <span className="rating-value">{product.ratings || 0}</span>
                            <span className="rating-count">({product.numReviews || 0} reviews)</span>
                        </div>

                        <div className="product-pricing">
                            <span className="current-price">${product.price?.toFixed(2)}</span>
                            {product.originalPrice > product.price && (
                                <>
                                    <span className="original-price">${product.originalPrice?.toFixed(2)}</span>
                                    <span className="savings">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
                                </>
                            )}
                        </div>

                        <p className="product-description">{product.description}</p>

                        {/* Stock Status */}
                        <div className="stock-status">
                            {product.stock > 0 ? (
                                <span className="in-stock">
                                    <FiCheck /> In Stock ({product.stock} available)
                                </span>
                            ) : (
                                <span className="out-of-stock">Out of Stock</span>
                            )}
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="product-actions">
                            <div className="quantity-selector">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >
                                    <FiMinus />
                                </button>
                                <span>{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= product.stock}
                                >
                                    <FiPlus />
                                </button>
                            </div>

                            <button
                                className="btn btn-primary btn-lg add-to-cart-btn"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                            >
                                <FiShoppingCart /> Add to Cart
                            </button>

                            <button
                                className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                                onClick={() => {
                                    setIsWishlisted(!isWishlisted);
                                    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                                }}
                            >
                                <FiHeart />
                            </button>

                            <button className="share-btn" onClick={handleShare}>
                                <FiShare2 />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="product-features">
                            <div className="feature">
                                <FiTruck />
                                <div>
                                    <strong>Free Delivery</strong>
                                    <span>On orders over $100</span>
                                </div>
                            </div>
                            <div className="feature">
                                <FiRefreshCw />
                                <div>
                                    <strong>30 Days Return</strong>
                                    <span>Easy returns policy</span>
                                </div>
                            </div>
                            <div className="feature">
                                <FiShield />
                                <div>
                                    <strong>Secure Payment</strong>
                                    <span>100% secure checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                {product.reviews && product.reviews.length > 0 && (
                    <section className="reviews-section">
                        <h2>Customer Reviews</h2>
                        <div className="reviews-list">
                            {product.reviews.map((review, index) => (
                                <div key={index} className="review-card">
                                    <div className="review-header">
                                        <div className="reviewer-info">
                                            <div className="reviewer-avatar">
                                                {review.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <span className="reviewer-name">{review.name}</span>
                                                <div className="review-stars">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FiStar
                                                            key={i}
                                                            className={i < review.rating ? 'filled' : ''}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="review-date">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
};

export default ProductDetail;
