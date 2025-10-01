
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function EditButton({ publicationId }: { publicationId: number }) {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('/api/auth/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });

          if (res.ok) {
            setIsAuthorized(true);
          }
        } catch (error) {
          // Not authorized
        }
      }
    };

    checkAuth();
  }, []);

  if (!isAuthorized) {
    return null;
  }

  return (
    <Link href={`/publications/${publicationId}/edit`}>
      <button className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700">
        Edit
      </button>
    </Link>
  );
}
