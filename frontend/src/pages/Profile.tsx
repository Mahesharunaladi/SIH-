import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    organization: user?.organization || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        organization: user.organization || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const updatedUser = await authService.updateProfile(formData);
      updateUser(updatedUser);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: { [key: string]: string } = {
      farmer: '#48bb78',
      manufacturer: '#4299e1',
      processor: '#9f7aea',
      distributor: '#ed8936',
      retailer: '#38b2ac',
      consumer: '#718096',
      admin: '#f56565',
    };
    return colors[role] || '#718096';
  };

  if (!user) {
    return <div style={styles.loading}>Loading profile...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Profile</h1>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <div style={styles.card}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={styles.headerInfo}>
            <h2 style={styles.name}>{user.name}</h2>
            <p style={styles.email}>{user.email}</p>
            <span
              style={{
                ...styles.roleBadge,
                backgroundColor: getRoleBadgeColor(user.role),
              }}
            >
              {user.role.toUpperCase()}
            </span>
          </div>
        </div>

        {!isEditing ? (
          <div style={styles.infoSection}>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Organization</span>
                <span style={styles.infoValue}>
                  {user.organization || 'Not specified'}
                </span>
              </div>

              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Phone</span>
                <span style={styles.infoValue}>
                  {user.phone || 'Not specified'}
                </span>
              </div>

              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Account Status</span>
                <span style={styles.infoValue}>
                  {user.verified ? '✅ Verified' : '⏳ Pending Verification'}
                </span>
              </div>

              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Member Since</span>
                <span style={styles.infoValue}>
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button onClick={() => setIsEditing(true)} style={styles.editButton}>
              ✏️ Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Organization</label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                style={styles.input}
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
              />
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user.name,
                    organization: user.organization || '',
                    phone: user.phone || '',
                  });
                }}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button type="submit" disabled={isLoading} style={styles.saveButton}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Account Information */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Account Information</h3>
        <div style={styles.accountInfo}>
          <div style={styles.accountItem}>
            <span style={styles.accountLabel}>User ID:</span>
            <span style={styles.accountValue}>{user.id}</span>
          </div>
          <div style={styles.accountItem}>
            <span style={styles.accountLabel}>Email:</span>
            <span style={styles.accountValue}>{user.email}</span>
          </div>
          <div style={styles.accountItem}>
            <span style={styles.accountLabel}>Role:</span>
            <span style={styles.accountValue}>{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.1rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2d3748',
    marginBottom: '2rem',
  },
  error: {
    backgroundColor: '#fed7d7',
    color: '#c53030',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  success: {
    backgroundColor: '#c6f6d5',
    color: '#22543d',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  profileHeader: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
    paddingBottom: '2rem',
    borderBottom: '1px solid #e2e8f0',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#48bb78',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: '1.8rem',
    color: '#2d3748',
    margin: '0 0 0.5rem 0',
  },
  email: {
    color: '#718096',
    margin: '0 0 1rem 0',
  },
  roleBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'white',
    display: 'inline-block',
  },
  infoSection: {
    marginTop: '2rem',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  infoLabel: {
    color: '#718096',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  infoValue: {
    color: '#2d3748',
    fontSize: '1.1rem',
  },
  editButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  form: {
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
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
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
  },
  cancelButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#e2e8f0',
    color: '#2d3748',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: '1.3rem',
    color: '#2d3748',
    marginBottom: '1.5rem',
  },
  accountInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  accountItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #e2e8f0',
  },
  accountLabel: {
    color: '#718096',
    fontWeight: '500',
  },
  accountValue: {
    color: '#2d3748',
    fontFamily: 'monospace',
  },
};

export default Profile;
