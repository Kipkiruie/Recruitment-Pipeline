import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Automatically clear the success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // 3 seconds
      return () => clearTimeout(timer); // Cleanup timeout on component unmount or when successMessage changes
    }
  }, [successMessage]);

  const handleLogin = async () => {
    try {
      // Reset error and success states
      setError('');
      setSuccessMessage('');
      setLoading(true);

      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      // Handle successful login
      setSuccessMessage('Login successful!'); // Set only once
      onLogin(response.data.token); // Pass the token to the parent component or save it
    } catch (err) {
      setError('Invalid username or password.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h2>Admin Login</h2>
      {/* Display error and success messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
};

export default Login;
