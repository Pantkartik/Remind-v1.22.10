import Link from 'next/link';

export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-primary)',
      padding: '24px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glowing orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 60%)',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(244,63,94,0.1) 0%, transparent 60%)',
        zIndex: 0
      }} />

      <main style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 24px',
          background: 'rgba(23, 23, 23, 0.6)',
          border: '1px solid var(--color-border-medium)',
          borderRadius: 'var(--radius-full)',
          backdropFilter: 'blur(10px)',
          marginBottom: '16px'
        }}>
          <span style={{ fontSize: '24px' }}>⚡</span>
          <span style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>RemindKaro</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 8vw, 64px)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          maxWidth: '800px',
          color: 'var(--color-text-primary)'
        }}>
          The Intelligent Dashboard for <span style={{ color: 'var(--color-info)' }}>Deadlines</span>.
        </h1>

        <p style={{
          fontSize: '18px',
          color: 'var(--color-text-secondary)',
          maxWidth: '600px',
          lineHeight: 1.6,
          marginTop: '8px'
        }}>
          Track coding tests, assignments, interviews, and hackathons with native voice entry and smart AI urgency escalation.
        </p>

        <div style={{ display: 'flex', gap: '16px', marginTop: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/login" style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '14px 32px',
            fontSize: '16px',
            fontWeight: 600,
            background: 'var(--color-info)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            Get Started — It's Free
          </Link>
          <Link href="/dashboard" style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '14px 32px',
            fontSize: '16px',
            fontWeight: 600,
            background: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-medium)',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}>
            View Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
