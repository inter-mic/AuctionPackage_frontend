import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Kengen } from '@/types/admin/adminPage'; // Assuming the type is defined here

export const useKengenRedirect = (kengen: Kengen[], screenId: number, redirectPath = '/admin/dashboard') => {
  const router = useRouter();

  useEffect(() => {
    const hasRedirectKengen = kengen.some(
      (k) => k.screenId === screenId && k.kengenKbn === 0
    );
    if (hasRedirectKengen) {
      router.push(redirectPath); // Redirect to the specified path
    }
  }, [kengen, screenId, router, redirectPath]);
};
