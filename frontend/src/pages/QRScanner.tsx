import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { traceService } from '../services/traceService';

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleManualScan = async () => {
    if (!manualInput.trim()) {
      setError('Please enter a product ID or QR code data');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Try to extract product ID from QR data
      let productId = manualInput.trim();
      
      // If it's a URL, extract the product ID
      if (productId.includes('/trace/') || productId.includes('pid=')) {
        const match = productId.match(/(?:trace\/|pid=)([a-f0-9-]+)/);
        if (match) {
          productId = match[1];
        }
      }

      await traceService.getFullTrace(productId);
      // Navigate to trace page with the product
      navigate(`/trace/${productId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to scan QR code. Invalid product ID.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCameraScan = () => {
    setError('Camera scanning requires additional setup with a QR scanning library.');
    // In production, integrate with libraries like:
    // - react-qr-scanner
    // - html5-qrcode
    // - @zxing/browser
    setIsScanning(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📱 Scan QR Code</h1>
        <p style={styles.subtitle}>
          Verify product authenticity and view complete supply chain history
        </p>
      </div>

      <div style={styles.scannerCard}>
        <div style={styles.scannerOptions}>
          <div style={styles.option}>
            <div style={styles.optionIcon}>📷</div>
            <h3 style={styles.optionTitle}>Scan with Camera</h3>
            <p style={styles.optionDescription}>
              Use your device camera to scan QR code on product packaging
            </p>
            <button
              onClick={handleCameraScan}
              disabled={isScanning}
              style={styles.scanButton}
            >
              {isScanning ? 'Opening Camera...' : 'Open Camera'}
            </button>
          </div>

          <div style={styles.divider}>
            <span style={styles.dividerText}>OR</span>
          </div>

          <div style={styles.option}>
            <div style={styles.optionIcon}>⌨️</div>
            <h3 style={styles.optionTitle}>Enter Product ID</h3>
            <p style={styles.optionDescription}>
              Manually enter the product ID or paste QR code data
            </p>
            <div style={styles.inputGroup}>
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualScan()}
                placeholder="Enter Product ID or QR data"
                style={styles.input}
              />
              <button
                onClick={handleManualScan}
                disabled={isLoading}
                style={styles.submitButton}
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}
      </div>

      <div style={styles.infoCard}>
        <h3 style={styles.infoTitle}>🌿 How to Verify Your Ayurvedic Product</h3>
        <div style={styles.steps}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <div style={styles.stepContent}>
              <h4 style={styles.stepTitle}>Find the QR Code</h4>
              <p style={styles.stepDescription}>
                Look for the HerbTrace QR code on your product packaging
              </p>
            </div>
          </div>

          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <div style={styles.stepContent}>
              <h4 style={styles.stepTitle}>Scan or Enter</h4>
              <p style={styles.stepDescription}>
                Use camera to scan or manually enter the product ID
              </p>
            </div>
          </div>

          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <div style={styles.stepContent}>
              <h4 style={styles.stepTitle}>View Journey</h4>
              <p style={styles.stepDescription}>
                See complete supply chain history from harvest to your hands
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.features}>
        <h3 style={styles.featuresTitle}>✅ What You Can Verify</h3>
        <div style={styles.featureGrid}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🌱</span>
            <span style={styles.featureText}>Origin & Harvest Location</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>📅</span>
            <span style={styles.featureText}>Harvest & Processing Dates</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🔗</span>
            <span style={styles.featureText}>Blockchain Proof</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>✅</span>
            <span style={styles.featureText}>Quality Certifications</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🚚</span>
            <span style={styles.featureText}>Transportation History</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>👥</span>
            <span style={styles.featureText}>All Stakeholders Involved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#2d3748',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#718096',
  },
  scannerCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  scannerOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  option: {
    textAlign: 'center',
  },
  optionIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  optionTitle: {
    fontSize: '1.5rem',
    color: '#2d3748',
    marginBottom: '0.5rem',
  },
  optionDescription: {
    color: '#718096',
    marginBottom: '1.5rem',
  },
  scanButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#9f7aea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  divider: {
    textAlign: 'center',
    position: 'relative',
    margin: '1rem 0',
  },
  dividerText: {
    backgroundColor: 'white',
    padding: '0 1rem',
    color: '#cbd5e0',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  inputGroup: {
    display: 'flex',
    gap: '0.5rem',
    maxWidth: '600px',
    margin: '0 auto',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    border: '2px solid #cbd5e0',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  submitButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  error: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#fed7d7',
    color: '#c53030',
    borderRadius: '8px',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  infoTitle: {
    fontSize: '1.5rem',
    color: '#2d3748',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  step: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#48bb78',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: '1.2rem',
    color: '#2d3748',
    marginBottom: '0.5rem',
  },
  stepDescription: {
    color: '#718096',
    lineHeight: '1.6',
  },
  features: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  featuresTitle: {
    fontSize: '1.5rem',
    color: '#2d3748',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
  },
  featureIcon: {
    fontSize: '1.5rem',
  },
  featureText: {
    color: '#2d3748',
    fontWeight: '500',
  },
};

export default QRScanner;
