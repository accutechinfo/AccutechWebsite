import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { customerRequest } from '../services/customerAuth';
import './CustomerAuth.css';
export default function CustomerPassword() {
  const navigate = useNavigate(); const location = useLocation();
  const reset = location.pathname.endsWith('update_password');
  const [password, setPassword] = useState(''); const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setError(''); if (password !== confirmation) { setError('Passwords do not match.'); return; }
    setBusy(true);
    try { const result = await customerRequest('/complete', { password, password_confirmation: confirmation }); navigate(result.redirect || '/'); }
    catch(err) { setError(err.message); } finally { setBusy(false); }
  }
  return <section className="customer-auth-page"><div className="customer-auth-card" style={{maxWidth: 440}}>
    <h1>{reset ? 'Update Password' : 'Create Password'}</h1>
    {error && <p className="customer-auth-alert" role="alert">{error}</p>}
    <form onSubmit={submit}>
      <div className="customer-auth-field"><label htmlFor="ca-p1">Enter Password</label><input id="ca-p1" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter Password" /></div>
      <div className="customer-auth-field"><label htmlFor="ca-p2">Confirm Password</label><input id="ca-p2" type="password" autoComplete="new-password" minLength={8} required value={confirmation} onChange={e => setConfirmation(e.target.value)} placeholder="Confirm Password" /></div>
      <button className="customer-auth-button" disabled={busy}>{busy ? 'Saving...' : reset ? 'UPDATE PASSWORD' : 'CREATE PASSWORD'}</button>
    </form>
    <p className="customer-auth-centered"><Link to="/login">Back to Login</Link></p>
  </div></section>;
}
