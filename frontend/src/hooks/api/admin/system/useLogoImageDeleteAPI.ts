import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useLogoImageDeleteAPI = () => {
  const { texts, apiRequest } = useCommonSetup();
  const logoImageDeleteAPI = async (systemSeq: any) => {
    const endPoint = `system/logoImage/delete/${systemSeq}`;
    const { status } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      null,
      texts.message.regist,
      false
    );
    if (status == 200) {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };
  return { logoImageDeleteAPI };
};

export default useLogoImageDeleteAPI;
