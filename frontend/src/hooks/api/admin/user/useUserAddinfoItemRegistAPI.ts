import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useUserAddinfoItemRegistAPI = () => {
  const { texts, apiRequest } = useCommonSetup();
  const userAddinfoItemRegistAPI = async (seq: any, UserAddinfo: any) => {
    const endPoint = `userAddinfoItem/update/${seq}`;
    await apiRequest("admin", endPoint, "POST", UserAddinfo, texts.message.regist, false);
  };
  return { userAddinfoItemRegistAPI };
};

export default useUserAddinfoItemRegistAPI;
