import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import type { Product } from '../types';

const Dashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    harvestedProducts: 0,
    inTransitProducts: 0,
    deliveredProducts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const allProducts = await productService.getProducts();
      setProducts(allProducts.slice(0, 5)); // Get latest 5 products
      
      setStats({
        totalProducts: allProducts.length,
        harvestedProducts: allProducts.filter(p => p.status === 'HARVESTED').length,
        inTransitProducts: allProducts.filter(p => p.status === 'IN_TRANSIT').length,
        deliveredProducts: allProducts.filter(p => p.status === 'DELIVERED').length,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      HARVESTED: '#48bb78',
      PROCESSED: '#4299e1',
      PACKAGED: '#9f7aea',
      IN_TRANSIT: '#ed8936',
      DELIVERED: '#38b2ac',
      VERIFIED: '#48bb78',
      REJECTED: '#f56565',
    };
    return colors[status] || '#718096';
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome back, {user?.name}! 🌿</h1>
        <p style={styles.subtitle}>Role: <strong>{user?.role}</strong></p>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📦</div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{stats.totalProducts}</div>
            <div style={styles.statLabel}>Total Products</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>🌱</div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{stats.harvestedProducts}</div>
            <div style={styles.statLabel}>Harvested</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>🚚</div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{stats.inTransitProducts}</div>
            <div style={styles.statLabel}>In Transit</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{stats.deliveredProducts}</div>
            <div style={styles.statLabel}>Delivered</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          {(user?.role === 'farmer' || user?.role === 'manufacturer' || user?.role === 'admin') && (
            <Link to="/products/create" style={styles.actionCard}>
              <div style={styles.actionIcon}>➕</div>
              <div style={styles.actionLabel}>Add New Product</div>
            </Link>
          )}
          
          <Link to="/products" style={styles.actionCard}>
            <div style={styles.actionIcon}>📋</div>
            <div style={styles.actionLabel}>View All Products</div>
          </Link>

          <Link to="/trace" style={styles.actionCard}>
            <div style={styles.actionIcon}>🔍</div>
            <div style={styles.actionLabel}>Trace Products</div>
          </Link>

          <Link to="/profile" style={styles.actionCard}>
            <div style={styles.actionIcon}>👤</div>
            <div style={styles.actionLabel}>My Profile</div>
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Recent Products</h2>
          <Link to="/products" style={styles.viewAllLink}>View All →</Link>
        </div>

        {products.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No products found. Start by adding a new product!</p>
          </div>
        ) : (
          <div style={styles.productsGrid}>
            {products.map((product) => (
              <div key={product.id} style={styles.productCard}>
                <div style={styles.productHeader}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(product.status),
                    }}
                  >
                    {product.status}
                  </span>
                </div>
                <p style={styles.productDetail}>
                  <strong>Batch:</strong> {product.batch_number}
                </p>
                <p style={styles.productDetail}>
                  <strong>Quantity:</strong> {product.quantity} {product.unit}
                </p>
                {product.scientific_name && (
                  <p style={styles.productDetail}>
                    <strong>Scientific Name:</strong> {product.scientific_name}
                  </p>
                )}
                <div style={styles.productActions}>
                  <Link to={`/products/${product.id}`} style={styles.viewButton}>
                    View Details
                  </Link>
                  <Link to={`/trace/${product.id}`} style={styles.traceButton}>
                    Trace
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.1rem',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2d3748',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#718096',
    fontSize: '1rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  statIcon: {
    fontSize: '2.5rem',
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2d3748',
  },
  statLabel: {
    color: '#718096',
    fontSize: '0.9rem',
  },
  section: {
    marginBottom: '3rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2d3748',
  },
  viewAllLink: {
    color: '#48bb78',
    textDecoration: 'none',
    fontWeight: '500',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  actionCard: {
    backgroundColor: 'white',
    padding: '2rem 1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#2d3748',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  actionIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  actionLabel: {
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#718096',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  productCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  productHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  productName: {
    fontSize: '1.2rem',
    color: '#2d3748',
    margin: 0,
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: 'white',
  },
  productDetail: {
    fontSize: '0.9rem',
    color: '#718096',
    margin: '0.5rem 0',
  },
  productActions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  viewButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#48bb78',
    color: 'white',
    textAlign: 'center',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  traceButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#4299e1',
    color: 'white',
    textAlign: 'center',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
};

export default Dashboard;
