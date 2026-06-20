import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect straight to admin dashboard
  useEffect(() => {
    axios.get('/api/auth/check')
      .then(res => {
        if (res.data.authenticated) {
          window.location.replace('/admin');
        }
      });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    axios.post('/api/login', { email, password })
      .then(res => {
        if (res.data.success) {
          window.location.replace('/admin');
        } else {
          setError(res.data.message);
        }
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Login failed. Please check credentials.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <span className="admin-logo">JPCS</span>
          <h2>Administrator Login</h2>
          <p>Access the control panel to edit page content</p>
        </div>
        <form onSubmit={handleLogin} className="admin-login-form">
          {error && <div className="admin-error-box">{error}</div>}
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="admin@jpcs.org" 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="••••••••" 
            />
          </div>
          <button type="submit" disabled={loading} className="btn-admin-submit">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}
