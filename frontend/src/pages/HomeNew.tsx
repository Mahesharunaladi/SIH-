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
              <span style={styles.featureIcon}>🔗</span>
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
    background: '#ffffff',
  },
  hero: {
    position: 'relative',
    minHeight: '600px',
    backgroundImage: 'url(https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1920&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: 'white',
    padding: '4rem 6rem',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(45, 85, 60, 0.85) 0%, rgba(25, 55, 40, 0.9) 100%)',
    zIndex: 1,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '650px',
    textAlign: 'left',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1.25rem',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '50px',
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '2rem',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  badgeIcon: {
    fontSize: '1rem',
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
    fontWeight: '700',
    lineHeight: '1.2',
    marginBottom: '1.5rem',
    color: 'white',
  },
  heroGolden: {
    color: '#D4A574',
    fontWeight: '700',
  },
  heroDescription: {
    fontSize: 'clamp(1rem, 2vw, 1.1rem)',
    lineHeight: '1.7',
    marginBottom: '2.5rem',
    opacity: 0.95,
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  orangeButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: '#C87A3C',
    color: 'white',
    padding: '0.875rem 1.75rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    border: 'none',
  },
  whiteButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'white',
    color: '#2d3748',
    padding: '0.875rem 1.75rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    border: 'none',
  },
  buttonIcon: {
    fontSize: '1.2rem',
  },
  buttonArrow: {
    fontSize: '1.2rem',
    transition: 'transform 0.3s ease',
  },
  howItWorks: {
    padding: '5rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    background: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
    color: '#1a202c',
    marginBottom: '0.75rem',
    textAlign: 'center',
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: '1.05rem',
    color: '#718096',
    textAlign: 'center',
    marginBottom: '3.5rem',
    lineHeight: '1.6',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '2rem',
    marginTop: '3rem',
  },
  featureCard: {
    background: 'white',
    padding: '2rem 1.5rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
  },
  featureIconBox: {
    width: '60px',
    height: '60px',
    background: '#f0f4f8',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.25rem',
  },
  featureIcon: {
    fontSize: '1.75rem',
  },
  featureTitle: {
    fontSize: '1.25rem',
    color: '#1a202c',
    marginBottom: '0.75rem',
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: '0.95rem',
    color: '#718096',
    lineHeight: '1.6',
  },
  rolesSection: {
    padding: '5rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    background: 'white',
  },
  rolesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '3rem',
  },
  roleCard: {
    background: 'white',
    padding: '2.5rem 2rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
  },
  roleIconBox: {
    width: '60px',
    height: '60px',
    background: '#2d5540',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  roleIcon: {
    fontSize: '1.75rem',
  },
  roleTitle: {
    fontSize: '1.35rem',
    color: '#1a202c',
    marginBottom: '0.75rem',
    fontWeight: '600',
  },
  roleDescription: {
    fontSize: '0.95rem',
    color: '#718096',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
  },
  roleLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#2d5540',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
  },
  roleLinkArrow: {
    transition: 'transform 0.3s ease',
  },
  cta: {
    background: 'linear-gradient(135deg, #2d5540 0%, #1a3728 100%)',
    color: 'white',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  ctaContent: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  ctaTitle: {
    fontSize: 'clamp(2rem, 4vw, 2.75rem)',
    marginBottom: '1rem',
    fontWeight: '700',
  },
  ctaDescription: {
    fontSize: '1.15rem',
    marginBottom: '2rem',
    opacity: 0.95,
  },
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: '#C87A3C',
    color: 'white',
    padding: '1rem 2.25rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease',
  },
};

export default Home;
