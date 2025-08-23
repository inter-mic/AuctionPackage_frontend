import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useMemberSessionAPI = () => {
  const { apiRequest } = useCommonSetup();
  const memberSessionAPI = async () => {
    await apiRequest("member", `authCheck`, "POST", null, "", true);
  };

  return { memberSessionAPI };
};
