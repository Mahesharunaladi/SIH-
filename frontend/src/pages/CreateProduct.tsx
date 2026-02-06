import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    description: '',
    category: '',
    quantity: '',
    unit: 'kg',
    harvestDate: '',
    batchNumber: '',
    originLatitude: '',
    originLongitude: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = {
        name: formData.name,
        scientificName: formData.scientificName || undefined,
        description: formData.description || undefined,
        category: formData.category || undefined,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        harvestDate: formData.harvestDate || undefined,
        batchNumber: formData.batchNumber,
        originLatitude: formData.originLatitude ? parseFloat(formData.originLatitude) : undefined,
        originLongitude: formData.originLongitude ? parseFloat(formData.originLongitude) : undefined,
      };

      await productService.createProduct(data);
      navigate('/products');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create New Product</h1>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="e.g., Ashwagandha Root"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Scientific Name</label>
            <input
              type="text"
              name="scientificName"
              value={formData.scientificName}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g., Withania somnifera"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{ ...styles.input, minHeight: '100px' }}
              placeholder="Describe the product..."
            />
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g., Medicinal Herb"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Batch Number *</label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g., ASH-2026-001"
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                style={styles.input}
                placeholder="100"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Unit *</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="ton">Tons</option>
                <option value="lbs">Pounds (lbs)</option>
                <option value="pcs">Pieces</option>
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Harvest Date</label>
            <input
              type="datetime-local"
              name="harvestDate"
              value={formData.harvestDate}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Origin Latitude</label>
              <input
                type="number"
                name="originLatitude"
                value={formData.originLatitude}
                onChange={handleChange}
                step="any"
                style={styles.input}
                placeholder="e.g., 28.6139"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Origin Longitude</label>
              <input
                type="number"
                name="originLongitude"
                value={formData.originLongitude}
                onChange={handleChange}
                step="any"
                style={styles.input}
                placeholder="e.g., 77.2090"
              />
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate('/products')}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" disabled={isLoading} style={styles.submitButton}>
              {isLoading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
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
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '2rem',
    color: '#2d3748',
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
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1,
  },
  row: {
    display: 'flex',
    gap: '1rem',
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
    marginTop: '1rem',
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
  submitButton: {
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
};

export default CreateProduct;
