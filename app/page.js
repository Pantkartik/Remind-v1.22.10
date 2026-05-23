import LandingClient from '@/components/LandingClient';
import { cookies } from 'next/headers';

export default async function LandingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const isLoggedIn = !!token;

  return <LandingClient isLoggedIn={isLoggedIn} />;
}
