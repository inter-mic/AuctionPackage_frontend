import { useCommonSetup } from '@/hooks/useCommonSetup';

export const useMemberSessionAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const memberSessionAPI = async () => {
      const { status, data: responseData } = await apiRequest("member", `authCheck`, 'POST', null, "", true);

  };

  return {  memberSessionAPI }
};

