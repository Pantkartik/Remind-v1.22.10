'use client';
import styles from './layout.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/');
      }
    } catch (err) {
      console.error('Logout failed', err);
    }
  };
  return (
    <div className={styles.layout}>
      <header className={styles.topbar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          RemindKaro
        </div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
        </nav>
      </header>
      
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
