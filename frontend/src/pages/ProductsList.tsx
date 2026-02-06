import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import type { Product } from '../types';
import { useAuth } from '../context/AuthContext';

const ProductsList = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      const filters = filter === 'all' ? {} : { status: filter };
      const data = await productService.getProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
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

  const canCreateProduct = ['farmer', 'manufacturer', 'admin'].includes(user?.role || '');

  if (isLoading) {
    return <div style={styles.loading}>Loading products...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Products</h1>
        {canCreateProduct && (
          <Link to="/products/create" style={styles.createButton}>
            ➕ Add New Product
          </Link>
        )}
      </div>

      <div style={styles.filters}>
        <button
          onClick={() => setFilter('all')}
          style={{
            ...styles.filterButton,
            ...(filter === 'all' ? styles.filterButtonActive : {}),
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter('HARVESTED')}
          style={{
            ...styles.filterButton,
            ...(filter === 'HARVESTED' ? styles.filterButtonActive : {}),
          }}
        >
          Harvested
        </button>
        <button
          onClick={() => setFilter('PROCESSED')}
          style={{
            ...styles.filterButton,
            ...(filter === 'PROCESSED' ? styles.filterButtonActive : {}),
          }}
        >
          Processed
        </button>
        <button
          onClick={() => setFilter('IN_TRANSIT')}
          style={{
            ...styles.filterButton,
            ...(filter === 'IN_TRANSIT' ? styles.filterButtonActive : {}),
          }}
        >
          In Transit
        </button>
        <button
          onClick={() => setFilter('DELIVERED')}
          style={{
            ...styles.filterButton,
            ...(filter === 'DELIVERED' ? styles.filterButtonActive : {}),
          }}
        >
          Delivered
        </button>
      </div>

      {products.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📦</div>
          <p style={styles.emptyText}>No products found</p>
          {canCreateProduct && (
            <Link to="/products/create" style={styles.emptyButton}>
              Add Your First Product
            </Link>
          )}
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

              {product.scientific_name && (
                <p style={styles.scientificName}>{product.scientific_name}</p>
              )}

              {product.description && (
                <p style={styles.description}>{product.description}</p>
              )}

              <div style={styles.details}>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Batch:</span>
                  <span style={styles.detailValue}>{product.batch_number}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Quantity:</span>
                  <span style={styles.detailValue}>{product.quantity} {product.unit}</span>
                </div>
                {product.category && (
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Category:</span>
                    <span style={styles.detailValue}>{product.category}</span>
                  </div>
                )}
              </div>

              <div style={styles.actions}>
                <Link to={`/products/${product.id}`} style={styles.viewButton}>
                  View Details
                </Link>
                <Link to={`/trace/${product.id}`} style={styles.traceButton}>
                  🔍 Trace
                </Link>
              </div>

              {product.qr_code && (
                <div style={styles.qrCode}>
                  <img src={product.qr_code} alt="QR Code" style={styles.qrImage} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2d3748',
  },
  createButton: {
    backgroundColor: '#48bb78',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    display: 'inline-block',
  },
  filters: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  filterButton: {
    padding: '0.5rem 1rem',
    border: '1px solid #cbd5e0',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  filterButtonActive: {
    backgroundColor: '#48bb78',
    color: 'white',
    borderColor: '#48bb78',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  emptyText: {
    fontSize: '1.2rem',
    color: '#718096',
    marginBottom: '1.5rem',
  },
  emptyButton: {
    backgroundColor: '#48bb78',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    display: 'inline-block',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
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
    fontSize: '1.3rem',
    color: '#2d3748',
    margin: 0,
    flex: 1,
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: 'white',
    marginLeft: '0.5rem',
  },
  scientificName: {
    fontStyle: 'italic',
    color: '#718096',
    fontSize: '0.9rem',
    margin: '0.5rem 0',
  },
  description: {
    color: '#4a5568',
    fontSize: '0.9rem',
    margin: '1rem 0',
    lineHeight: '1.5',
  },
  details: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #e2e8f0',
  },
  detailLabel: {
    color: '#718096',
    fontSize: '0.9rem',
  },
  detailValue: {
    color: '#2d3748',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  viewButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#4299e1',
    color: 'white',
    textAlign: 'center',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  traceButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#9f7aea',
    color: 'white',
    textAlign: 'center',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  qrCode: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f7fafc',
    borderRadius: '4px',
    textAlign: 'center',
  },
  qrImage: {
    maxWidth: '150px',
    height: 'auto',
  },
};

export default ProductsList;
