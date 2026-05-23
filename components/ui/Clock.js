'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return <div style={{ height: '80px' }} /> // placeholder to avoid layout shift
  }

  const formatTime = (date) => {
    const pad = (num) => String(num).padStart(2, '0');
    return {
      hours: pad(date.getHours()),
      minutes: pad(date.getMinutes()),
      seconds: pad(date.getSeconds())
    };
  };

  const { hours, minutes, seconds } = formatTime(time);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{
        fontSize: 'clamp(40px, 6vw, 72px)',
        fontWeight: 500,
        letterSpacing: '4px',
        color: '#1a1a1a',
        display: 'flex',
        alignItems: 'baseline',
        fontVariantNumeric: 'tabular-nums'
      }}>
        {hours} <span style={{ opacity: 0.5, margin: '0 8px' }}>:</span> {minutes} <span style={{ opacity: 0.5, margin: '0 8px' }}>:</span> <span style={{ fontSize: '0.6em' }}>{seconds}</span>
      </div>
      <div style={{ display: 'flex', gap: '32px', color: '#666', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', paddingLeft: '8px' }}>
        <span>Hour</span>
        <span>Minute</span>
        <span>Second</span>
      </div>
    </div>
  );
}
