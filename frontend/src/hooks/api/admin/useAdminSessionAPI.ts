import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useAdminSessionAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const adminSessionAPI = async () => {
    const { status, data: responseData } = await apiRequest(
      "admin",
      `authCheck`,
      "POST",
      null,
      "",
      true
    );
  };

  return { adminSessionAPI };
};
