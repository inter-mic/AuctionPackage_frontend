import { useCallback } from 'react';

export const useExecutionPermission = (kengen: any[]) => {
  const executionPermission = useCallback((screenId: number, kengenKbn: number) => {
    return kengen.some((k) => k.screenId === screenId && k.kengenKbn === kengenKbn);
  }, [kengen]);

  return { executionPermission };
};