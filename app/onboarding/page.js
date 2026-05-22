'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Briefcase,
  Code2,
  Globe,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

const ROLES = [
  {
    id: 'student',
    label: 'Student',
    desc: 'Managing assignments, exams & hackathons',
    icon: GraduationCap,
  },
  {
    id: 'professional',
    label: 'Professional',
    desc: 'Work tasks, meetings & client deadlines',
    icon: Briefcase,
  },
  {
    id: 'developer',
    label: 'Developer',
    desc: 'Side projects, sprints & coding contests',
    icon: Code2,
  },
];

const TIMEZONES = [
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST, UTC+5:30)' },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
  { value: 'America/New_York', label: 'Eastern Time (ET, UTC-5)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT, UTC-8)' },
  { value: 'America/Chicago', label: 'Central Time (CT, UTC-6)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT, UTC+0)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET, UTC+1)' },
  { value: 'Asia/Singapore', label: 'Singapore Time (SGT, UTC+8)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST, UTC+9)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AEST, UTC+10)' },
];

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = role, 2 = timezone, 3 = done
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Kolkata');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFinish = async () => {
    if (!selectedRole || !selectedTimezone) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole, timezone: selectedTimezone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save preferences');
      setStep(3);
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0f1a 50%, #0a0a0f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient background orbs */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
      }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '560px',
      }}>
        {/* Progress bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '12px',
          }}>
            <span style={{ color: '#6366f1', fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {step < 3 ? `Step ${step} of 2` : 'Complete!'}
            </span>
            <span style={{ color: '#4a4a6a', fontSize: '13px', fontWeight: 500 }}>
              {step === 1 ? 'Your role' : step === 2 ? 'Your timezone' : 'All set!'}
            </span>
          </div>
          <div style={{
            height: '4px', background: '#1a1a2e', borderRadius: '100px', overflow: 'hidden',
          }}>
            <motion.div
              animate={{ width: step === 1 ? '50%' : '100%' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                borderRadius: '100px',
              }}
            />
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
        }}>
          <AnimatePresence mode="wait">
            {/* STEP 1: Role Selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ padding: '48px 40px 40px' }}
              >
                <h1 style={{
                  fontSize: '28px', fontWeight: 800, color: '#f1f5f9',
                  letterSpacing: '-0.5px', marginBottom: '8px',
                }}>
                  What best describes you?
                </h1>
                <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '32px', lineHeight: 1.6 }}>
                  This helps us personalise your RemindKaro experience.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {ROLES.map(({ id, label, desc, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedRole(id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        padding: '20px 24px', borderRadius: '16px', border: 'none',
                        cursor: 'pointer', textAlign: 'left', width: '100%',
                        background: selectedRole === id
                          ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))'
                          : 'rgba(255,255,255,0.04)',
                        boxShadow: selectedRole === id
                          ? '0 0 0 1.5px rgba(99,102,241,0.6), inset 0 0 20px rgba(99,102,241,0.05)'
                          : '0 0 0 1px rgba(255,255,255,0.07)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: selectedRole === id
                          ? 'rgba(99,102,241,0.25)'
                          : 'rgba(255,255,255,0.06)',
                        color: selectedRole === id ? '#818cf8' : '#6b7280',
                        transition: 'all 0.2s ease',
                      }}>
                        <Icon size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '15px', fontWeight: 700,
                          color: selectedRole === id ? '#e0e7ff' : '#cbd5e1',
                          marginBottom: '2px',
                        }}>{label}</div>
                        <div style={{
                          fontSize: '13px', color: '#6b7280', lineHeight: 1.4,
                        }}>{desc}</div>
                      </div>
                      {selectedRole === id && (
                        <CheckCircle2 size={20} style={{ color: '#6366f1', flexShrink: 0 }} />
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedRole}
                  style={{
                    width: '100%', marginTop: '28px', padding: '16px',
                    borderRadius: '14px', border: 'none', cursor: selectedRole ? 'pointer' : 'not-allowed',
                    background: selectedRole
                      ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                      : 'rgba(255,255,255,0.06)',
                    color: selectedRole ? '#fff' : '#4a4a6a',
                    fontSize: '15px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedRole ? '0 8px 24px rgba(99,102,241,0.35)' : 'none',
                  }}
                >
                  Continue <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {/* STEP 2: Timezone */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ padding: '48px 40px 40px' }}
              >
                <h1 style={{
                  fontSize: '28px', fontWeight: 800, color: '#f1f5f9',
                  letterSpacing: '-0.5px', marginBottom: '8px',
                }}>
                  Your timezone
                </h1>
                <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '32px', lineHeight: 1.6 }}>
                  We use this to send deadline alerts at the right time.
                </p>

                <div style={{ position: 'relative' }}>
                  <Globe size={16} style={{
                    position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                    color: '#6366f1', pointerEvents: 'none', zIndex: 1,
                  }} />
                  <select
                    value={selectedTimezone}
                    onChange={(e) => setSelectedTimezone(e.target.value)}
                    style={{
                      width: '100%', padding: '16px 44px 16px 44px',
                      borderRadius: '14px', border: '1px solid rgba(99,102,241,0.3)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#e2e8f0', fontSize: '15px', fontWeight: 500,
                      cursor: 'pointer', appearance: 'none', outline: 'none',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value} style={{ background: '#0d0f1a', color: '#e2e8f0' }}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} style={{
                    position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                    color: '#6366f1', pointerEvents: 'none',
                  }} />
                </div>

                <div style={{
                  marginTop: '16px', padding: '16px 20px', borderRadius: '12px',
                  background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <Clock size={16} style={{ color: '#818cf8', flexShrink: 0 }} />
                  <span style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5 }}>
                    Your current selection: <strong style={{ color: '#c7d2fe' }}>{selectedTimezone.replace('_', ' ')}</strong>
                  </span>
                </div>

                {error && (
                  <div style={{
                    marginTop: '16px', padding: '12px 16px', borderRadius: '12px',
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                    color: '#fca5a5', fontSize: '14px',
                  }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      flex: 1, padding: '16px', borderRadius: '14px',
                      border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
                      background: 'transparent', color: '#94a3b8',
                      fontSize: '15px', fontWeight: 600, transition: 'all 0.2s ease',
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinish}
                    disabled={loading}
                    style={{
                      flex: 2, padding: '16px', borderRadius: '14px', border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      background: loading ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: loading ? '#4a4a6a' : '#fff',
                      fontSize: '15px', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                      transition: 'all 0.2s ease',
                      boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.35)',
                    }}
                  >
                    {loading ? (
                      <span style={{
                        display: 'inline-block', width: '18px', height: '18px',
                        border: '2px solid #4a4a6a', borderTopColor: 'transparent',
                        borderRadius: '50%', animation: 'spin 0.6s linear infinite',
                      }} />
                    ) : (
                      <>Finish Setup <ArrowRight size={18} /></>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Done */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'backOut' }}
                style={{
                  padding: '64px 40px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 200 }}
                  style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))',
                    border: '2px solid rgba(99,102,241,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <CheckCircle2 size={36} style={{ color: '#818cf8' }} />
                </motion.div>
                <h2 style={{
                  fontSize: '26px', fontWeight: 800, color: '#f1f5f9',
                  letterSpacing: '-0.5px', textAlign: 'center',
                }}>
                  You're all set!
                </h2>
                <p style={{ color: '#6b7280', fontSize: '15px', textAlign: 'center', lineHeight: 1.6 }}>
                  Taking you to your dashboard…
                </p>
                <div style={{
                  width: '48px', height: '4px', borderRadius: '100px',
                  background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginTop: '8px',
                }}>
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.6, ease: 'easeInOut' }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                      borderRadius: '100px',
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
