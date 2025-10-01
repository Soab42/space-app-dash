
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log(token);
      if (token) {
        try {
          const res = await fetch('/api/auth/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });

          if (res.ok) {
            setIsAuthorized(true);
          } else {
            router.push('/login');
          }
        } catch (error) {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuthorized) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}
