'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import { User, Mail, Lock, ArrowRight, Shield, Cpu, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      // Auto-login after registration
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (loginRes.ok) {
        // New users always go to onboarding first
        router.push('/onboarding');
        router.refresh();
      } else {
        router.push('/login');
      }
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
      {/* Huge Background Static Text to match landing page */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '40px', opacity: 0.1 }}>
        <div style={{ fontSize: '15vw', fontWeight: 900, whiteSpace: 'nowrap', color: '#1e3a8a', transform: 'translateX(-10%)', lineHeight: 0.8 }}>
          START FOR FREE
        </div>
        <div style={{ fontSize: '15vw', fontWeight: 900, whiteSpace: 'nowrap', color: '#1e3a8a', transform: 'translateX(-5%)', lineHeight: 0.8 }}>
          MASTER DEADLINES
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'relative', zIndex: 1,
          backgroundColor: '#ffffff', borderRadius: '40px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          width: '100%', maxWidth: '1000px',
          display: 'grid', gridTemplateColumns: '1fr 1.2fr',
          overflow: 'hidden',
          minHeight: '600px'
        }}
      >
        {/* LEFT PANEL - Branding (Light Theme to match) */}
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid #e2e8f0'
        }}>
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '40px' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>RemindKaro</span>
            </Link>

            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, letterSpacing: '-1px', marginBottom: '24px' }}>
              Join the most<br />organized students.
            </h1>

            <p style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.6, marginBottom: '40px' }}>
              Create an account for free and never miss another coding test or assignment.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: <Bell size={18} />, label: "Smart urgency escalation" },
                { icon: <Cpu size={18} />, label: "Voice-powered task entry" },
                { icon: <Shield size={18} />, label: "End-to-end encrypted" },
              ].map((perk, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: '#3b82f6', flexShrink: 0 }}>{perk.icon}</div>
                  <span style={{ color: '#475569', fontSize: '15px', fontWeight: 500 }}>{perk.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Form */}
        <div style={{
          padding: '64px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div style={{ maxWidth: '380px', width: '100%', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '8px' }}>
              Create an account
            </h2>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>
              Start tracking your deadlines intelligently.
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

            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Input
                id="name"
                label="Full Name"
                type="text"
                placeholder="e.g., Alex Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                icon={<User size={16} />}
              />
              <Input
                id="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<Mail size={16} />}
              />
              <Input
                id="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<Lock size={16} />}
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
                  <>Create Account <ArrowRight size={18} /></>
                )}
              </button>
            </form>

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <span style={{ color: '#64748b', fontSize: '15px' }}>Already have an account? </span>
              <Link href="/login" style={{ color: '#3b82f6', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
