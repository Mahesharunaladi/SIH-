import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          🌿 HerbTrace
        </Link>
        
        <div style={styles.menu}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={styles.link}>Dashboard</Link>
              
              {/* Show different menu items based on role */}
              {user?.role === 'consumer' ? (
                <>
                  <Link to="/scan" style={styles.link}>🔍 Scan QR</Link>
                  <Link to="/trace" style={styles.link}>Trace Products</Link>
                </>
              ) : (
                <>
                  {(user?.role === 'farmer' || user?.role === 'manufacturer' || user?.role === 'admin') && (
                    <Link to="/products/create" style={styles.link}>➕ Add Product</Link>
                  )}
                  <Link to="/products" style={styles.link}>Products</Link>
                  <Link to="/trace" style={styles.link}>Trace</Link>
                </>
              )}
              
              <Link to="/profile" style={styles.link}>Profile</Link>
              <div style={styles.userInfo}>
                <span style={styles.userName}>{user?.name}</span>
                <span style={styles.userRole}>({user?.role})</span>
              </div>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    backgroundColor: '#2d3748',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginLeft: '1rem',
    paddingLeft: '1rem',
    borderLeft: '1px solid rgba(255,255,255,0.2)',
  },
  userName: {
    fontWeight: '500',
  },
  userRole: {
    fontSize: '0.9rem',
    opacity: 0.8,
  },
  logoutBtn: {
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
  },
};

export default Navbar;
