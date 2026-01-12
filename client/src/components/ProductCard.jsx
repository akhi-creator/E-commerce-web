import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiHeart, FiShoppingCart, FiEye, FiStar } from 'react-icons/fi';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [imageError, setImageError] = useState(false);
    const dispatch = useDispatch();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({
            product: product._id,
            name: product.name,
            image: product.images?.[0]?.url || '/placeholder.jpg',
            price: product.price,
            stock: product.stock,
            quantity: 1
        }));
        toast.success('Added to cart!');
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    };

    const discount = product.originalPrice > product.price
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';

    return (
        <Link to={`/product/${product._id}`} className="product-card">
            <div className="product-card-image">
                <img
                    src={imageError ? fallbackImage : (product.images?.[0]?.url || fallbackImage)}
                    alt={product.name}
                    onError={() => setImageError(true)}
                />
                {discount > 0 && (
                    <span className="product-discount">-{discount}%</span>
                )}
                {product.stock < 10 && product.stock > 0 && (
                    <span className="product-low-stock">Low Stock</span>
                )}
                {product.stock === 0 && (
                    <span className="product-out-of-stock">Out of Stock</span>
                )}
                <div className="product-actions">
                    <button
                        className={`action-btn ${isWishlisted ? 'active' : ''}`}
                        onClick={handleWishlist}
                        aria-label="Add to wishlist"
                    >
                        <FiHeart />
                    </button>
                    <button
                        className="action-btn"
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        aria-label="Add to cart"
                    >
                        <FiShoppingCart />
                    </button>
                    <Link
                        to={`/product/${product._id}`}
                        className="action-btn"
                        aria-label="Quick view"
                    >
                        <FiEye />
                    </Link>
                </div>
            </div>
            <div className="product-card-body">
                <span className="product-category">{product.category}</span>
                <h3 className="product-title">{product.name}</h3>
                <div className="product-rating">
                    <div className="stars">
                        {[...Array(5)].map((_, i) => (
                            <FiStar
                                key={i}
                                className={i < Math.floor(product.ratings || 0) ? 'filled' : ''}
                            />
                        ))}
                    </div>
                    <span className="rating-count">({product.numReviews || 0})</span>
                </div>
                <div className="product-pricing">
                    <span className="product-price">${product.price?.toFixed(2)}</span>
                    {product.originalPrice > product.price && (
                        <span className="product-original-price">${product.originalPrice?.toFixed(2)}</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
