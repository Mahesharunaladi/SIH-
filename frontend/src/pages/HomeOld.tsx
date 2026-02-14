import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={styles.container}>
      {/* Hero Section with Botanical Background */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <span style={styles.badgeIcon}>🔒</span>
            <span>Blockchain-Verified Traceability</span>
          </div>
          <h1 style={styles.heroTitle}>
            From Soil to Soul,
            <br />
            <span style={styles.heroGolden}>Traced & Trusted</span>
          </h1>
          <p style={styles.heroDescription}>
            HerbTrace brings full transparency to Ayurvedic supply chains
            <br />
            with blockchain-anchored geo-tagging from collection to your
            <br />
            medicine cabinet.
          </p>
          <div style={styles.heroButtons}>
            {isAuthenticated ? (
              <Link to="/dashboard" style={styles.orangeButton}>
                <span style={styles.buttonIcon}>📱</span>
                <span>Go to Dashboard</span>
                <span style={styles.buttonArrow}>→</span>
              </Link>
            ) : (
              <>
                <Link to="/scan" style={styles.orangeButton}>
                  <span style={styles.buttonIcon}>📱</span>
                  <span>Scan & Verify</span>
                  <span style={styles.buttonArrow}>→</span>
                </Link>
                <Link to="/login" style={styles.whiteButton}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* How HerbTrace Works Section */}
      <div style={styles.howItWorks}>
        <h2 style={styles.sectionTitle}>How HerbTrace Works</h2>
        <p style={styles.sectionSubtitle}>
          End-to-end botanical traceability powered by blockchain and
          <br />
          geo-intelligence.
        </p>
        
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIconBox}>
              <span style={styles.featureIcon}>📍</span>
            </div>
            <h3 style={styles.featureTitle}>Geo-Tagged Origins</h3>
            <p style={styles.featureDescription}>
              Every herb is tagged with precise GPS coordinates from the point of collection.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIconBox}>
              <span style={styles.featureIcon}>�</span>
            </div>
            <h3 style={styles.featureTitle}>Blockchain Anchored</h3>
            <p style={styles.featureDescription}>
              SHA-256 hashed events with immutable on-chain proofs prevent any tampering.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIconBox}>
              <span style={styles.featureIcon}>📱</span>
            </div>
            <h3 style={styles.featureTitle}>QR Verification</h3>
            <p style={styles.featureDescription}>
              Scan any product label to instantly view its complete journey and authenticity.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIconBox}>
              <span style={styles.featureIcon}>📊</span>
            </div>
            <h3 style={styles.featureTitle}>Supply Chain Analytics</h3>
            <p style={styles.featureDescription}>
              Real-time dashboards for every stakeholder from farm to shelf.
            </p>
          </div>
        </div>
      </div>

      {/* Choose Your Role Section */}
      <div style={styles.rolesSection}>
        <h2 style={styles.sectionTitle}>Choose Your Role</h2>
        <p style={styles.sectionSubtitle}>
          Different dashboards for every stakeholder in the supply chain.
        </p>
        
        <div style={styles.rolesGrid}>
          <div style={styles.roleCard}>
            <div style={styles.roleIconBox}>
              <span style={styles.roleIcon}>🌱</span>
            </div>
            <h3 style={styles.roleTitle}>Farmer / Collector</h3>
            <p style={styles.roleDescription}>
              Submit harvests with geo-tags and track your produce through the chain.
            </p>
            <Link to="/register" style={styles.roleLink}>
              Open Dashboard <span style={styles.roleLinkArrow}>→</span>
            </Link>
          </div>

          <div style={styles.roleCard}>
            <div style={styles.roleIconBox}>
              <span style={styles.roleIcon}>📦</span>
            </div>
            <h3 style={styles.roleTitle}>Manufacturer</h3>
            <p style={styles.roleDescription}>
              Create batches, generate QR labels, and anchor processing events.
            </p>
            <Link to="/register" style={styles.roleLink}>
              Open Dashboard <span style={styles.roleLinkArrow}>→</span>
            </Link>
          </div>

          <div style={styles.roleCard}>
            <div style={styles.roleIconBox}>
              <span style={styles.roleIcon}>📱</span>
            </div>
            <h3 style={styles.roleTitle}>Consumer</h3>
            <p style={styles.roleDescription}>
              Scan a QR code or enter a product ID to verify the complete journey.
            </p>
            <Link to="/scan" style={styles.roleLink}>
              Open Dashboard <span style={styles.roleLinkArrow}>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.cta}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Start Tracing with HerbTrace</h2>
          <p style={styles.ctaDescription}>
            Join the transparent Ayurvedic supply chain revolution
          </p>
          <Link to="/register" style={styles.ctaButton}>
            <span>Get Started Today</span>
            <span style={styles.buttonArrow}>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%)',
  },
  hero: {
    background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
    color: 'white',
    padding: '5rem 2rem 6rem',
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1.25rem',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50px',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '2rem',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  badgeIcon: {
    fontSize: '1.2rem',
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: '800',
    marginBottom: '1.5rem',
    lineHeight: '1.2',
  },
  heroGradient: {
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
    maxWidth: '800px',
    margin: '0 auto 2.5rem',
    opacity: 0.95,
    lineHeight: '1.7',
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '3rem',
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1.1rem',
    boxShadow: '0 10px 25px rgba(72, 187, 120, 0.3)',
    transition: 'all 0.3s ease',
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1.1rem',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
  buttonArrow: {
    fontSize: '1.5rem',
    transition: 'transform 0.3s ease',
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
    marginTop: '3rem',
    padding: '2rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    maxWidth: '700px',
    margin: '3rem auto 0',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#48bb78',
    marginBottom: '0.25rem',
  },
  statLabel: {
    fontSize: '0.9rem',
    opacity: 0.8,
  },
  statDivider: {
    width: '2px',
    height: '40px',
    background: 'rgba(255, 255, 255, 0.2)',
  },
  features: {
    padding: '6rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featuresHeader: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  sectionBadge: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    color: 'white',
    borderRadius: '50px',
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  featuresTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    color: '#2d3748',
    marginBottom: '1rem',
    fontWeight: '800',
  },
  featuresSubtitle: {
    fontSize: '1.2rem',
    color: '#718096',
    maxWidth: '600px',
    margin: '0 auto',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
  },
  featureCard: {
    background: 'white',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    cursor: 'pointer',
  },
  featureCard1: {
    borderColor: 'rgba(72, 187, 120, 0.2)',
  },
  featureCard2: {
    borderColor: 'rgba(66, 153, 225, 0.2)',
  },
  featureCard3: {
    borderColor: 'rgba(237, 137, 54, 0.2)',
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1.5rem',
    display: 'inline-block',
  },
  featureTitle: {
    fontSize: '1.5rem',
    color: '#2d3748',
    marginBottom: '1rem',
    fontWeight: '700',
  },
  featureDescription: {
    fontSize: '1rem',
    color: '#718096',
    lineHeight: '1.7',
    marginBottom: '1.5rem',
  },
  featureHighlight: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: '#f0fff4',
    color: '#22543d',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  checkIcon: {
    color: '#48bb78',
    fontWeight: 'bold',
  },
  cta: {
    background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
    color: 'white',
    padding: '5rem 2rem',
    textAlign: 'center',
  },
  ctaContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  ctaTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    marginBottom: '1.5rem',
    fontWeight: '800',
  },
  ctaDescription: {
    fontSize: '1.2rem',
    marginBottom: '2.5rem',
    opacity: 0.9,
    lineHeight: '1.7',
  },
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    color: 'white',
    padding: '1.25rem 2.5rem',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1.2rem',
    boxShadow: '0 10px 25px rgba(72, 187, 120, 0.3)',
    transition: 'all 0.3s ease',
  },
  ctaNote: {
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    opacity: 0.7,
  },
};

export default Home;
