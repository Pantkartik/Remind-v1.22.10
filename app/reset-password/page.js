'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import { Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Invalid or missing reset token');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');

      setMessage('Password successfully reset. Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '380px', width: '100%', margin: '0 auto' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '8px' }}>
        Reset Password
      </h2>
      <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>
        Please enter your new password below.
      </p>

      {error && (
        <div role="alert" style={{
          background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626',
          padding: '12px 16px', borderRadius: '12px', fontSize: '14px',
          fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <span style={{ width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%', flexShrink: 0 }} />
          {error}
        </div>
      )}

      {message && (
        <div role="status" style={{
          background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534',
          padding: '12px 16px', borderRadius: '12px', fontSize: '14px',
          fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <span style={{ width: '8px', height: '8px', background: '#22C55E', borderRadius: '50%', flexShrink: 0 }} />
          {message}
        </div>
      )}

      {!token ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ color: '#DC2626', fontWeight: 600, marginBottom: '16px' }}>Invalid link</p>
          <Link href="/login" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>Go back to login</Link>
        </div>
      ) : (
        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            id="password"
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={<Lock size={16} />}
          />
          <Input
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            icon={<Lock size={16} />}
          />

          <button
            type="submit"
            disabled={loading || !!message}
            style={{
              width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
              background: (loading || !!message) ? '#e2e8f0' : '#3b82f6',
              color: (loading || !!message) ? '#94a3b8' : '#fff',
              fontSize: '15px', fontWeight: 600, cursor: (loading || !!message) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'all 0.2s ease',
              boxShadow: (loading || !!message) ? 'none' : '0 4px 14px rgba(59,130,246,0.3)',
              marginTop: '8px',
            }}
          >
            {loading ? (
              <span style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid #94a3b8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
            ) : (
              <>Reset Password <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f1f5f9',
      color: '#0f172a',
      fontFamily: 'var(--font-display)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2vw'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'relative', zIndex: 1,
          backgroundColor: '#ffffff', borderRadius: '40px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          width: '100%', maxWidth: '600px',
          overflow: 'hidden',
        }}
      >
        <div style={{
          padding: '64px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <Suspense fallback={<div style={{ textAlign: 'center' }}>Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}
