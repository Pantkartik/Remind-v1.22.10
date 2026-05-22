'use client';

import { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <div style={{ maxWidth: '380px', width: '100%', margin: '0 auto' }}>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px', textDecoration: 'none', marginBottom: '32px', fontWeight: 600 }}>
              <ArrowLeft size={16} /> Back to login
            </Link>
            
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '8px' }}>
              Forgot Password
            </h2>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>
              Enter your email address and we'll send you a link to reset your password.
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

            <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Input
                id="email"
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<Mail size={16} />}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                  background: loading ? '#e2e8f0' : '#3b82f6',
                  color: loading ? '#94a3b8' : '#fff',
                  fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  transition: 'all 0.2s ease',
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(59,130,246,0.3)',
                  marginTop: '8px',
                }}
              >
                {loading ? (
                  <span style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid #94a3b8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                ) : (
                  <>Send Reset Link <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
