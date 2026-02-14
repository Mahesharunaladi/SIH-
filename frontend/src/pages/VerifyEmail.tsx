import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. Please check your email or request a new verification link.');
        return;
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/verify-email`, {
          token,
        });

        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');

        // Start countdown for redirect
        let counter = 5;
        const timer = setInterval(() => {
          counter -= 1;
          setCountdown(counter);
          if (counter === 0) {
            clearInterval(timer);
            navigate('/login');
          }
        }, 1000);

        return () => clearInterval(timer);
      } catch (error: any) {
        setStatus('error');
        setMessage(
          error.response?.data?.error ||
            'Verification failed. The link may be expired or invalid.'
        );
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const handleResendVerification = async () => {
    // You might want to prompt for email first
    navigate('/login?resend=true');
  };

  return (
    <div className="page-container">
      <div className="auth-container">
        <div className="auth-card">
          <div className="herb-brand">
            <span className="herb-icon">🌿</span>
            <h1>HerbTrace</h1>
          </div>

          {status === 'verifying' && (
            <div className="verify-status">
              <div className="spinner"></div>
              <h2>Verifying your email...</h2>
              <p>Please wait while we verify your email address.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="verify-status success">
              <div className="success-icon">✓</div>
              <h2>Email Verified!</h2>
              <p>{message}</p>
              <p className="countdown-text">
                Redirecting to login in {countdown} seconds...
              </p>
              <button 
                className="btn-primary" 
                onClick={() => navigate('/login')}
                style={{ marginTop: '20px' }}
              >
                Go to Login Now
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="verify-status error">
              <div className="error-icon">✕</div>
              <h2>Verification Failed</h2>
              <p>{message}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button 
                  className="btn-secondary" 
                  onClick={handleResendVerification}
                >
                  Resend Verification
                </button>
                <button 
                  className="btn-primary" 
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
