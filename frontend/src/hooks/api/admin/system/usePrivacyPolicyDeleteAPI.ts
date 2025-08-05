import { useCommonSetup } from "@/hooks/useCommonSetup";

export const usePrivacyPolicyDeleteAPI = () => {
  const { texts, apiRequest } = useCommonSetup();
  const privacyPolicyDeleteAPI = async (systemSeq: any) => {
    const endPoint = `system/privacyPolicy/delete/${systemSeq}`;
    const { status } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      null,
      texts.message.delete,
      false
    );
    if (status == 200) {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };
  return { privacyPolicyDeleteAPI };
};

export default usePrivacyPolicyDeleteAPI;
