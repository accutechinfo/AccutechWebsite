import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { customerRequest } from '../services/customerAuth';
import './CustomerAuth.css';
export default function CustomerVerify() {
  const location = useLocation(); const navigate = useNavigate();
  const purpose = location.pathname.includes('forgot_password') ? 'reset' : 'signup';
  const [channel, setChannel] = useState('mobile');
  const [identity, setIdentity] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState('choose');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(''); const [notice, setNotice] = useState('');
  useEffect(() => { let mounted = true; customerRequest('/otp-status').then(r => { if (mounted && r.pending && r.purpose === purpose) setStage('otp'); }).catch(() => {}); return () => { mounted = false; }; }, [purpose]);
  async function send(e) {
    e.preventDefault(); setBusy(true); setError(''); setNotice('');
    try { const result = await customerRequest('/start', { purpose, channel, identity }); setNotice(result.message); if (result.step === 'sent') setStage('otp'); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  async function verify(e) {
    e.preventDefault(); setBusy(true); setError('');
    try { const result = await customerRequest('/verify', { otp }); navigate(result.redirect); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  async function back() { setBusy(true); try { await customerRequest('/back', {}); setStage('choose'); setOtp(''); setNotice(''); setError(''); } catch(err) { setError(err.message); } finally { setBusy(false); } }
  return <section className="customer-auth-page"><div className="customer-auth-card">
    <h1>Verification Now</h1><p className="subtitle">Verify using your registered mobile number or email address</p>
    {notice && <div role="status" className="customer-auth-alert customer-auth-success">{notice}</div>}
    {error && <div role="alert" className="customer-auth-alert">{error}</div>}
    {stage === 'choose' ? <form onSubmit={send}>
      <div className="customer-auth-switch"><label><input type="radio" checked={channel === 'mobile'} onChange={() => { setChannel('mobile'); setIdentity(''); }} /> Mobile Number</label><label><input type="radio" checked={channel === 'email'} onChange={() => { setChannel('email'); setIdentity(''); }} /> Email Address</label></div>
      <div className="customer-auth-field"><label htmlFor="ca-identity">{channel === 'mobile' ? 'Mobile No.' : 'Email'}</label><input id="ca-identity" value={identity} onChange={e => setIdentity(e.target.value)} type={channel === 'email' ? 'email' : 'tel'} placeholder={channel === 'email' ? 'Enter Email' : 'Enter Mobile No.'} required /></div>
      <button className="customer-auth-button" disabled={busy}>{busy ? 'Sending...' : 'Send OTP'}</button>
    </form> : <form onSubmit={verify}>
      <div className="customer-auth-field"><label htmlFor="ca-otp">Enter OTP</label><input id="ca-otp" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0,4))} maxLength={4} inputMode="numeric" required placeholder="Enter OTP" /></div>
      <p>Didn't get the code? <button type="button" className="customer-auth-textbutton" onClick={send} disabled={busy}>Resend</button></p>
      <button className="customer-auth-button" disabled={busy}>{busy ? 'Verifying...' : 'Verify & Proceed'}</button>
      <p className="customer-auth-centered"><button className="customer-auth-textbutton" type="button" onClick={back}>← Back to Previous</button></p>
    </form>}
    <p className="customer-auth-centered"><Link to="/login">Existing User? Sign In</Link></p>
  </div></section>;
}
