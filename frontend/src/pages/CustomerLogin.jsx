import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { customerRequest } from '../services/customerAuth';
import './CustomerAuth.css';
export default function CustomerLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try { const result = await customerRequest('/login', { username, password }); navigate(result.redirect || '/'); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <section className="customer-auth-page customer-auth-page--login"><div className="customer-auth-card customer-login-card">
    <div className="customer-auth-brand"><span>◢</span> ACCUTECH <sup>ERP</sup></div>
    {error && <p role="alert" className="customer-auth-alert">{error}</p>}
    <form onSubmit={submit}>
      <div className="customer-auth-field"><label htmlFor="ca-username">User ID</label><input id="ca-username" value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" /></div>
      <div className="customer-auth-field"><label htmlFor="ca-pass">Password</label><input id="ca-pass" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" /></div>
      <div className="customer-auth-links" style={{ justifyContent: 'flex-end', marginTop: 0, marginBottom: 16 }}><Link to="/login/forgot_password">Forgot Password</Link></div>
      <button className="customer-auth-button" disabled={busy}>{busy ? 'Signing in...' : 'SIGN IN'}</button>
    </form>
    <p className="customer-auth-centered">Don't have account? <Link to="/login/verify_user">Sign Up</Link></p>
  </div></section>;
}
