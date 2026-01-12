import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import { getProducts, getCategories } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import './Products.css';

const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' }
];

const priceRanges = [
    { min: 0, max: 50, label: 'Under $50' },
    { min: 50, max: 100, label: '$50 - $100' },
    { min: 100, max: 250, label: '$100 - $250' },
    { min: 250, max: 500, label: '$250 - $500' },
    { min: 500, max: null, label: '$500+' }
];

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [selectedSort, setSelectedSort] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);

    const dispatch = useDispatch();
    const { products, categories, loading, totalPages, total } = useSelector((state) => state.products);

    const allCategories = ['All', ...categories];

    useEffect(() => {
        const params = {
            page: currentPage,
            category: selectedCategory !== 'All' ? selectedCategory : undefined,
            sort: selectedSort,
            search: searchParams.get('search') || undefined
        };

        if (selectedPriceRange) {
            params.minPrice = selectedPriceRange.min;
            if (selectedPriceRange.max) {
                params.maxPrice = selectedPriceRange.max;
            }
        }

        dispatch(getProducts(params));
    }, [dispatch, currentPage, selectedCategory, selectedPriceRange, selectedSort, searchParams]);

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    useEffect(() => {
        const category = searchParams.get('category');
        if (category) {
            setSelectedCategory(category);
        }
    }, [searchParams]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        if (category === 'All') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', category);
        }
        setSearchParams(searchParams);
    };

    const handlePriceRangeChange = (range) => {
        setSelectedPriceRange(range);
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSelectedSort(e.target.value);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSelectedCategory('All');
        setSelectedPriceRange(null);
        setSelectedSort('newest');
        setCurrentPage(1);
        setSearchParams({});
    };

    const hasActiveFilters = selectedCategory !== 'All' || selectedPriceRange || searchParams.get('search');

    return (
        <main className="products-page">
            <div className="container">
                {/* Page Header */}
                <div className="products-header">
                    <div>
                        <h1>
                            {searchParams.get('search')
                                ? `Results for "${searchParams.get('search')}"`
                                : selectedCategory !== 'All'
                                    ? selectedCategory
                                    : 'All Products'}
                        </h1>
                        <p className="products-count">{total} products found</p>
                    </div>
                    <div className="products-actions">
                        <button
                            className="filter-toggle btn btn-secondary"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <FiFilter /> Filters
                        </button>
                        <div className="sort-select">
                            <select value={selectedSort} onChange={handleSortChange}>
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <FiChevronDown className="select-icon" />
                        </div>
                    </div>
                </div>

                <div className="products-content">
                    {/* Filters Sidebar */}
                    <aside className={`filters-sidebar ${isFilterOpen ? 'open' : ''}`}>
                        <div className="filters-header">
                            <h3>Filters</h3>
                            {hasActiveFilters && (
                                <button className="clear-filters" onClick={clearFilters}>
                                    Clear All
                                </button>
                            )}
                            <button
                                className="close-filters"
                                onClick={() => setIsFilterOpen(false)}
                            >
                                <FiX />
                            </button>
                        </div>

                        {/* Categories */}
                        <div className="filter-group">
                            <h4>Categories</h4>
                            <div className="filter-options">
                                {allCategories.map((category) => (
                                    <button
                                        key={category}
                                        className={`filter-option ${selectedCategory === category ? 'active' : ''}`}
                                        onClick={() => handleCategoryChange(category)}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="filter-group">
                            <h4>Price Range</h4>
                            <div className="filter-options">
                                {priceRanges.map((range, index) => (
                                    <button
                                        key={index}
                                        className={`filter-option ${selectedPriceRange === range ? 'active' : ''}`}
                                        onClick={() => handlePriceRangeChange(selectedPriceRange === range ? null : range)}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="products-main">
                        {loading ? (
                            <div className="products-grid">
                                {[...Array(12)].map((_, i) => (
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
                        ) : products.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">🔍</div>
                                <h3 className="empty-state-title">No products found</h3>
                                <p className="empty-state-text">Try adjusting your filters or search terms.</p>
                                <button className="btn btn-primary" onClick={clearFilters}>
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="products-grid">
                                    {products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            className="btn btn-secondary"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                        >
                                            Previous
                                        </button>
                                        <div className="pagination-pages">
                                            {[...Array(totalPages)].map((_, i) => (
                                                <button
                                                    key={i + 1}
                                                    className={`pagination-page ${currentPage === i + 1 ? 'active' : ''}`}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            className="btn btn-secondary"
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Products;
