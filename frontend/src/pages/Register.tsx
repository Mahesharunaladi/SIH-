import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'farmer',
    organization: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🌿 Create Account</h1>
        <p style={styles.subtitle}>Join HerbTrace Platform</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="John Doe"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="john@example.com"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Strong password"
              minLength={8}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="farmer">Farmer</option>
              <option value="manufacturer">Manufacturer</option>
              <option value="processor">Processor</option>
              <option value="distributor">Distributor</option>
              <option value="retailer">Retailer</option>
              <option value="consumer">Consumer</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Organization</label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              style={styles.input}
              placeholder="Your Company Name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
              placeholder="+1234567890"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={{ ...styles.input, minHeight: '80px' }}
              placeholder="Full address"
            />
          </div>

          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7fafc',
    padding: '2rem 1rem',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '0.5rem',
    textAlign: 'center',
    color: '#2d3748',
  },
  subtitle: {
    textAlign: 'center',
    color: '#718096',
    marginBottom: '2rem',
  },
  error: {
    backgroundColor: '#fed7d7',
    color: '#c53030',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontWeight: '500',
    color: '#2d3748',
    fontSize: '0.9rem',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #cbd5e0',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#48bb78',
    color: 'white',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
    marginTop: '1rem',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#718096',
  },
  link: {
    color: '#48bb78',
    textDecoration: 'none',
    fontWeight: '500',
  },
};

export default Register;
