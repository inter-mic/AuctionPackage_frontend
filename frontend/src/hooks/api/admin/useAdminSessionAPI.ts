import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useAdminSessionAPI = () => {
  const { apiRequest } = useCommonSetup();
  const adminSessionAPI = async () => {
    await apiRequest("admin", `authCheck`, "POST", null, "", true);
  };

  return { adminSessionAPI };
};
