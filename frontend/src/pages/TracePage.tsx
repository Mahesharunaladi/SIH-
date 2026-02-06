import { useState } from 'react';
import type { FormEvent } from 'react';
import { traceService } from '../services/traceService';
import type { TraceData } from '../types';

const TracePage = () => {
  const [productId, setProductId] = useState('');
  const [traceData, setTraceData] = useState<TraceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrace = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await traceService.getFullTrace(productId);
      setTraceData(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to trace product');
      setTraceData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    const icons: { [key: string]: string } = {
      HARVEST: '🌱',
      PROCESS: '⚙️',
      PACKAGE: '📦',
      SHIP: '🚚',
      RECEIVE: '📥',
      VERIFY: '✅',
      QUALITY_CHECK: '🔍',
      TRANSFER: '🔄',
    };
    return icons[eventType] || '📍';
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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔍 Trace Product</h1>
      <p style={styles.subtitle}>
        Enter a product ID to view its complete supply chain history
      </p>

      <div style={styles.searchCard}>
        <form onSubmit={handleTrace} style={styles.searchForm}>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter Product ID (UUID)"
            style={styles.searchInput}
            required
          />
          <button type="submit" disabled={isLoading} style={styles.searchButton}>
            {isLoading ? 'Tracing...' : 'Trace'}
          </button>
        </form>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {traceData && (
        <div style={styles.results}>
          {/* Product Info */}
          <div style={styles.productCard}>
            <div style={styles.productHeader}>
              <div>
                <h2 style={styles.productName}>{traceData.product.name}</h2>
                {traceData.product.scientific_name && (
                  <p style={styles.scientificName}>{traceData.product.scientific_name}</p>
                )}
              </div>
              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(traceData.product.status),
                }}
              >
                {traceData.product.status}
              </span>
            </div>

            <div style={styles.productDetails}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Batch Number:</span>
                <span style={styles.detailValue}>{traceData.product.batch_number}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Quantity:</span>
                <span style={styles.detailValue}>
                  {traceData.product.quantity} {traceData.product.unit}
                </span>
              </div>
              {traceData.product.category && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Category:</span>
                  <span style={styles.detailValue}>{traceData.product.category}</span>
                </div>
              )}
              {traceData.product.harvest_date && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Harvest Date:</span>
                  <span style={styles.detailValue}>
                    {new Date(traceData.product.harvest_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {traceData.product.qr_code && (
              <div style={styles.qrSection}>
                <img
                  src={traceData.product.qr_code}
                  alt="Product QR Code"
                  style={styles.qrImage}
                />
              </div>
            )}
          </div>

          {/* Supply Chain Timeline */}
          <div style={styles.timelineCard}>
            <h3 style={styles.timelineTitle}>📍 Supply Chain Journey</h3>
            {traceData.events.length === 0 ? (
              <p style={styles.noEvents}>No supply chain events recorded yet.</p>
            ) : (
              <div style={styles.timeline}>
                {traceData.events.map((event, index) => (
                  <div key={event.id} style={styles.timelineItem}>
                    <div style={styles.timelineIcon}>
                      {getEventIcon(event.event_type)}
                    </div>
                    <div style={styles.timelineContent}>
                      <div style={styles.eventHeader}>
                        <h4 style={styles.eventType}>{event.event_type}</h4>
                        <span style={styles.eventTime}>
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p style={styles.eventDescription}>{event.description}</p>
                      {event.actor_name && (
                        <p style={styles.eventActor}>
                          By: <strong>{event.actor_name}</strong>
                          {event.actor_role && ` (${event.actor_role})`}
                        </p>
                      )}
                      {event.blockchain_tx_hash && (
                        <p style={styles.blockchainHash}>
                          🔗 Blockchain: {event.blockchain_tx_hash.substring(0, 20)}...
                        </p>
                      )}
                      {(event.location_latitude && event.location_longitude) && (
                        <p style={styles.location}>
                          📍 Location: {event.location_latitude.toFixed(4)}, {event.location_longitude.toFixed(4)}
                        </p>
                      )}
                    </div>
                    {index < traceData.events.length - 1 && (
                      <div style={styles.timelineLine} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Blockchain Proofs */}
          {traceData.blockchainProofs && traceData.blockchainProofs.length > 0 && (
            <div style={styles.blockchainCard}>
              <h3 style={styles.blockchainTitle}>🔗 Blockchain Verification</h3>
              <div style={styles.proofsGrid}>
                {traceData.blockchainProofs.map((proof, index) => (
                  <div key={index} style={styles.proofCard}>
                    <div style={styles.proofHeader}>
                      <span style={styles.proofVerified}>
                        {proof.verified ? '✅ Verified' : '⏳ Pending'}
                      </span>
                    </div>
                    <div style={styles.proofDetail}>
                      <span style={styles.proofLabel}>Transaction:</span>
                      <span style={styles.proofValue}>
                        {proof.transactionHash.substring(0, 10)}...
                      </span>
                    </div>
                    <div style={styles.proofDetail}>
                      <span style={styles.proofLabel}>Block:</span>
                      <span style={styles.proofValue}>#{proof.blockNumber}</span>
                    </div>
                    <div style={styles.proofDetail}>
                      <span style={styles.proofLabel}>Timestamp:</span>
                      <span style={styles.proofValue}>
                        {new Date(proof.blockTimestamp * 1000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#2d3748',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#718096',
    fontSize: '1.1rem',
    marginBottom: '2rem',
  },
  searchCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  searchForm: {
    display: 'flex',
    gap: '1rem',
  },
  searchInput: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #cbd5e0',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  searchButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#9f7aea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  error: {
    backgroundColor: '#fed7d7',
    color: '#c53030',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '2rem',
  },
  results: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  productCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  productHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  },
  productName: {
    fontSize: '1.8rem',
    color: '#2d3748',
    margin: '0 0 0.5rem 0',
  },
  scientificName: {
    fontStyle: 'italic',
    color: '#718096',
    margin: 0,
  },
  statusBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '500',
    color: 'white',
  },
  productDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #e2e8f0',
  },
  detailLabel: {
    color: '#718096',
  },
  detailValue: {
    color: '#2d3748',
    fontWeight: '500',
  },
  qrSection: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f7fafc',
    borderRadius: '4px',
    textAlign: 'center',
  },
  qrImage: {
    maxWidth: '200px',
    height: 'auto',
  },
  timelineCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  timelineTitle: {
    fontSize: '1.5rem',
    color: '#2d3748',
    marginBottom: '2rem',
  },
  noEvents: {
    textAlign: 'center',
    color: '#718096',
    padding: '2rem',
  },
  timeline: {
    position: 'relative',
  },
  timelineItem: {
    position: 'relative',
    paddingLeft: '4rem',
    paddingBottom: '2rem',
  },
  timelineIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '3rem',
    height: '3rem',
    backgroundColor: '#f7fafc',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    border: '3px solid #e2e8f0',
  },
  timelineLine: {
    position: 'absolute',
    left: '1.5rem',
    top: '3rem',
    bottom: '0',
    width: '2px',
    backgroundColor: '#e2e8f0',
  },
  timelineContent: {
    backgroundColor: '#f7fafc',
    padding: '1rem',
    borderRadius: '8px',
  },
  eventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  eventType: {
    fontSize: '1.1rem',
    color: '#2d3748',
    margin: 0,
    fontWeight: '600',
  },
  eventTime: {
    fontSize: '0.85rem',
    color: '#718096',
  },
  eventDescription: {
    color: '#4a5568',
    margin: '0.5rem 0',
  },
  eventActor: {
    fontSize: '0.9rem',
    color: '#718096',
    margin: '0.5rem 0',
  },
  blockchainHash: {
    fontSize: '0.85rem',
    color: '#9f7aea',
    margin: '0.5rem 0',
    fontFamily: 'monospace',
  },
  location: {
    fontSize: '0.85rem',
    color: '#4299e1',
    margin: '0.5rem 0',
  },
  blockchainCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  blockchainTitle: {
    fontSize: '1.5rem',
    color: '#2d3748',
    marginBottom: '1.5rem',
  },
  proofsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
  },
  proofCard: {
    backgroundColor: '#f7fafc',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  proofHeader: {
    marginBottom: '1rem',
  },
  proofVerified: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#48bb78',
  },
  proofDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    fontSize: '0.85rem',
  },
  proofLabel: {
    color: '#718096',
  },
  proofValue: {
    color: '#2d3748',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
};

export default TracePage;
