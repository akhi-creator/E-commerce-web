import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiUsers, FiPackage, FiShoppingCart, FiDollarSign, FiTrendingUp, FiAlertCircle, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { adminService } from '../services/adminService';
import { productService } from '../services/productService';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);

    // Redirect if not admin
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (user?.role !== 'admin') {
            navigate('/');
            return;
        }
    }, [isAuthenticated, user, navigate]);

    // Fetch dashboard data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const dashboardData = await adminService.getDashboardStats();
                setStats(dashboardData.data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'admin') {
            fetchData();
        }
    }, [user]);

    // Fetch users when tab changes
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await adminService.getAllUsers();
                setUsers(usersData.data);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            }
        };

        if (activeTab === 'users' && user?.role === 'admin') {
            fetchUsers();
        }
    }, [activeTab, user]);

    // Fetch products when tab changes
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsData = await productService.getAllProductsAdmin();
                setProducts(productsData.data);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            }
        };

        if (activeTab === 'products' && user?.role === 'admin') {
            fetchProducts();
        }
    }, [activeTab, user]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="admin-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard">
                <div className="admin-error">
                    <FiAlertCircle size={48} />
                    <h2>Error Loading Dashboard</h2>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>🛍️ ShopVerse</h2>
                    <span className="admin-badge">Admin</span>
                </div>
                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <FiTrendingUp /> Overview
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <FiPackage /> Products
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <FiShoppingCart /> Orders
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <FiUsers /> Users
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <h1>
                        {activeTab === 'overview' && 'Dashboard Overview'}
                        {activeTab === 'products' && 'Product Management'}
                        {activeTab === 'orders' && 'Order Management'}
                        {activeTab === 'users' && 'User Management'}
                    </h1>
                    <div className="admin-user">
                        <span>Welcome, {user?.name}</span>
                    </div>
                </header>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="overview-content">
                        {/* Stats Cards */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon users">
                                    <FiUsers />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats?.totalUsers || 0}</h3>
                                    <p>Total Users</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon products">
                                    <FiPackage />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats?.totalProducts || 0}</h3>
                                    <p>Total Products</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon orders">
                                    <FiShoppingCart />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats?.totalOrders || 0}</h3>
                                    <p>Total Orders</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon revenue">
                                    <FiDollarSign />
                                </div>
                                <div className="stat-info">
                                    <h3>{formatCurrency(stats?.totalRevenue || 0)}</h3>
                                    <p>Total Revenue</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="dashboard-section">
                            <h2>Recent Orders</h2>
                            <div className="data-table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats?.recentOrders?.length > 0 ? (
                                            stats.recentOrders.map((order) => (
                                                <tr key={order._id}>
                                                    <td>#{order._id.slice(-6)}</td>
                                                    <td>{order.user?.name || 'N/A'}</td>
                                                    <td>{formatCurrency(order.totalPrice)}</td>
                                                    <td>
                                                        <span className={`status-badge ${order.orderStatus?.toLowerCase()}`}>
                                                            {order.orderStatus}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="no-data">No orders yet</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Top Products & Low Stock */}
                        <div className="dashboard-grid">
                            <div className="dashboard-section">
                                <h2>Top Selling Products</h2>
                                <div className="top-products-list">
                                    {stats?.topProducts?.length > 0 ? (
                                        stats.topProducts.map((product, index) => (
                                            <div key={product._id} className="top-product-item">
                                                <span className="rank">#{index + 1}</span>
                                                <div className="product-info">
                                                    <p className="product-name">{product.name}</p>
                                                    <p className="product-stats">
                                                        {product.totalSold} sold • {formatCurrency(product.revenue)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-data">No sales data yet</p>
                                    )}
                                </div>
                            </div>

                            <div className="dashboard-section">
                                <h2>Low Stock Alert</h2>
                                <div className="low-stock-list">
                                    {stats?.lowStockProducts?.length > 0 ? (
                                        stats.lowStockProducts.map((product) => (
                                            <div key={product._id} className="low-stock-item">
                                                <div className="product-info">
                                                    <p className="product-name">{product.name}</p>
                                                    <p className="product-price">{formatCurrency(product.price)}</p>
                                                </div>
                                                <span className="stock-badge">{product.stock} left</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-data">All products well stocked</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="products-content">
                        <div className="section-actions">
                            <button className="btn btn-primary">+ Add Product</button>
                        </div>
                        <div className="data-table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length > 0 ? (
                                        products.map((product) => (
                                            <tr key={product._id}>
                                                <td>
                                                    <img
                                                        src={product.images?.[0]?.url || 'https://via.placeholder.com/50'}
                                                        alt={product.name}
                                                        className="product-thumbnail"
                                                    />
                                                </td>
                                                <td>{product.name}</td>
                                                <td>{product.category}</td>
                                                <td>{formatCurrency(product.price)}</td>
                                                <td>
                                                    <span className={`stock-indicator ${product.stock < 10 ? 'low' : ''}`}>
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button className="action-btn view" title="View">
                                                            <FiEye />
                                                        </button>
                                                        <button className="action-btn edit" title="Edit">
                                                            <FiEdit />
                                                        </button>
                                                        <button className="action-btn delete" title="Delete">
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="no-data">No products found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="orders-content">
                        <div className="data-table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.recentOrders?.length > 0 ? (
                                        stats.recentOrders.map((order) => (
                                            <tr key={order._id}>
                                                <td>#{order._id.slice(-6)}</td>
                                                <td>{order.user?.name || 'N/A'}</td>
                                                <td>{order.orderItems?.length || 0}</td>
                                                <td>{formatCurrency(order.totalPrice)}</td>
                                                <td>
                                                    <select
                                                        className={`status-select ${order.orderStatus?.toLowerCase()}`}
                                                        defaultValue={order.orderStatus}
                                                    >
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button className="action-btn view" title="View Details">
                                                            <FiEye />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="no-data">No orders found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="users-content">
                        <div className="data-table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((u) => (
                                            <tr key={u._id}>
                                                <td>{u.name}</td>
                                                <td>{u.email}</td>
                                                <td>
                                                    <span className={`role-badge ${u.role}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button className="action-btn edit" title="Edit">
                                                            <FiEdit />
                                                        </button>
                                                        <button
                                                            className="action-btn delete"
                                                            title="Delete"
                                                            disabled={u.role === 'admin'}
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="no-data">No users found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
