import React from 'react';

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  padding = 'md',
  className = '',
  onClick,
}) => {
  const paddingStyles = {
    sm: 'var(--spacing-md)',
    md: 'var(--spacing-xl)',
    lg: 'var(--spacing-2xl)',
  };

  const styles: React.CSSProperties = {
    background: 'white',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    padding: paddingStyles[padding],
    transition: 'all var(--transition-base)',
    cursor: onClick ? 'pointer' : 'default',
  };

  return (
    <div
      style={styles}
      className={`card ${hover ? 'card-hover' : ''} ${className}`}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
          e.currentTarget.style.transform = 'translateY(-4px)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {children}
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
}) => {
  const variantStyles = {
    success: {
      backgroundColor: '#c6f6d5',
      color: '#22543d',
    },
    warning: {
      backgroundColor: '#feebc8',
      color: '#744210',
    },
    danger: {
      backgroundColor: '#fed7d7',
      color: '#742a2a',
    },
    info: {
      backgroundColor: '#bee3f8',
      color: '#2c5282',
    },
    primary: {
      backgroundColor: '#9ae6b4',
      color: '#22543d',
    },
  };

  const sizeStyles = {
    sm: {
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
    },
    md: {
      padding: '0.375rem 0.75rem',
      fontSize: '0.875rem',
    },
  };

  const styles: React.CSSProperties = {
    display: 'inline-block',
    borderRadius: 'var(--radius-full)',
    fontWeight: '600',
    lineHeight: '1',
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return <span style={styles}>{children}</span>;
};

interface AlertProps {
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  onClose,
}) => {
  const variantStyles = {
    success: {
      backgroundColor: '#c6f6d5',
      borderColor: 'var(--color-success)',
      color: '#22543d',
    },
    error: {
      backgroundColor: '#fed7d7',
      borderColor: 'var(--color-danger)',
      color: '#742a2a',
    },
    warning: {
      backgroundColor: '#feebc8',
      borderColor: 'var(--color-warning)',
      color: '#744210',
    },
    info: {
      backgroundColor: '#bee3f8',
      borderColor: 'var(--color-secondary)',
      color: '#2c5282',
    },
  };

  const styles: React.CSSProperties = {
    padding: 'var(--spacing-md)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--spacing-md)',
    borderLeft: '4px solid',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    animation: 'slideIn 0.3s ease-in-out',
    ...variantStyles[variant],
  };

  const iconMap = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div style={styles} role="alert">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.25rem' }}>{iconMap[variant]}</span>
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.25rem',
            color: 'inherit',
            opacity: 0.7,
            transition: 'opacity var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
        >
          ×
        </button>
      )}
    </div>
  );
};

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: '24px',
    md: '40px',
    lg: '56px',
  };

  const styles: React.CSSProperties = {
    display: 'inline-block',
    width: sizes[size],
    height: sizes[size],
    border: '4px solid var(--color-gray-200)',
    borderTopColor: 'var(--color-primary)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  };

  return <div style={styles} role="status" aria-label="Loading" />;
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const inputStyles: React.CSSProperties = {
    padding: '0.75rem',
    border: `2px solid ${error ? 'var(--color-danger)' : 'var(--color-gray-300)'}`,
    borderRadius: 'var(--radius-md)',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'all var(--transition-base)',
    background: 'white',
    width: '100%',
  };

  return (
    <div style={{ marginBottom: 'var(--spacing-md)' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: 'var(--spacing-sm)',
          fontWeight: '600',
          color: 'var(--color-gray-700)',
        }}>
          {label}
          {props.required && <span style={{ color: 'var(--color-danger)' }}> *</span>}
        </label>
      )}
      <input
        style={inputStyles}
        className={className}
        {...props}
      />
      {error && (
        <p style={{
          marginTop: 'var(--spacing-xs)',
          fontSize: '0.875rem',
          color: 'var(--color-danger)',
        }}>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p style={{
          marginTop: 'var(--spacing-xs)',
          fontSize: '0.875rem',
          color: 'var(--color-gray-500)',
        }}>
          {helperText}
        </p>
      )}
    </div>
  );
};
