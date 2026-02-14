import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    transition: 'all var(--transition-base)',
    fontFamily: 'inherit',
    opacity: disabled || isLoading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
  };

  const sizeStyles = {
    sm: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
    },
    md: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
    },
    lg: {
      padding: '1rem 2rem',
      fontSize: '1.125rem',
    },
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
      color: 'white',
      boxShadow: 'var(--shadow-md)',
    },
    secondary: {
      background: 'linear-gradient(135deg, var(--color-secondary) 0%, #3182ce 100%)',
      color: 'white',
      boxShadow: 'var(--shadow-md)',
    },
    success: {
      background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
      color: 'white',
      boxShadow: 'var(--shadow-md)',
    },
    danger: {
      background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
      color: 'white',
      boxShadow: 'var(--shadow-md)',
    },
    outline: {
      background: 'white',
      color: 'var(--color-primary)',
      border: '2px solid var(--color-primary)',
      boxShadow: 'var(--shadow-sm)',
    },
  };

  const styles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return (
    <button
      style={styles}
      disabled={disabled || isLoading}
      className={className}
      {...props}
    >
      {isLoading && (
        <span style={{
          width: '1rem',
          height: '1rem',
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite',
        }} />
      )}
      {children}
    </button>
  );
};
