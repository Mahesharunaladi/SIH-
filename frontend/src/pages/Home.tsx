import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>🌿 HerbTrace</h1>
        <p style={styles.heroSubtitle}>
          Blockchain-based Botanical Traceability System
        </p>
        <p style={styles.heroDescription}>
          Track medicinal herbs and botanical products from farm to pharmacy with
          transparency, authenticity, and trust powered by blockchain technology.
        </p>
        <div style={styles.heroButtons}>
          <Link to="/register" style={styles.primaryButton}>
            Get Started
          </Link>
          <Link to="/login" style={styles.secondaryButton}>
            Login
          </Link>
        </div>
      </div>

      <div style={styles.features}>
        <h2 style={styles.featuresTitle}>Key Features</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔗</div>
            <h3 style={styles.featureTitle}>Blockchain Security</h3>
            <p style={styles.featureDescription}>
              All supply chain events are permanently recorded on the blockchain,
              ensuring tamper-proof traceability.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📍</div>
            <h3 style={styles.featureTitle}>Geo-tagging</h3>
            <p style={styles.featureDescription}>
              Track the exact location and journey of botanical products from origin
              to destination.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📱</div>
            <h3 style={styles.featureTitle}>QR Code Scanning</h3>
            <p style={styles.featureDescription}>
              Scan QR codes to instantly verify product authenticity and view complete
              supply chain history.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>✅</div>
            <h3 style={styles.featureTitle}>Quality Assurance</h3>
            <p style={styles.featureDescription}>
              Verify certifications, quality checks, and compliance at every stage of
              the supply chain.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>👥</div>
            <h3 style={styles.featureTitle}>Multi-stakeholder</h3>
            <p style={styles.featureDescription}>
              Connect farmers, processors, manufacturers, distributors, retailers, and
              consumers.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📊</div>
            <h3 style={styles.featureTitle}>Analytics</h3>
            <p style={styles.featureDescription}>
              Gain insights into supply chain efficiency, product journey times, and
              quality metrics.
            </p>
          </div>
        </div>
      </div>

      <div style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to Transform Your Supply Chain?</h2>
        <p style={styles.ctaDescription}>
          Join HerbTrace today and bring transparency to botanical traceability.
        </p>
        <Link to="/register" style={styles.ctaButton}>
          Create Free Account
        </Link>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
  },
  hero: {
    backgroundColor: '#2d3748',
    color: 'white',
    padding: '6rem 2rem',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '3.5rem',
    marginBottom: '1rem',
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    opacity: 0.9,
  },
  heroDescription: {
    fontSize: '1.1rem',
    maxWidth: '800px',
    margin: '0 auto 2rem',
    opacity: 0.8,
    lineHeight: '1.6',
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem',
  },
  primaryButton: {
    backgroundColor: '#48bb78',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    transition: 'transform 0.2s',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    border: '2px solid white',
    transition: 'transform 0.2s',
  },
  features: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '4rem 2rem',
  },
  featuresTitle: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '3rem',
    color: '#2d3748',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.5rem',
    color: '#2d3748',
    marginBottom: '1rem',
  },
  featureDescription: {
    color: '#718096',
    lineHeight: '1.6',
  },
  cta: {
    backgroundColor: '#48bb78',
    color: 'white',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  ctaDescription: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    opacity: 0.9,
  },
  ctaButton: {
    backgroundColor: 'white',
    color: '#48bb78',
    padding: '1rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    display: 'inline-block',
  },
};

export default Home;
