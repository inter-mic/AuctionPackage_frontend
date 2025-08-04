import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useMailTemplateRegistAPI = () => {
  const { texts, apiRequest } = useCommonSetup();

  const mailTemplateRegistAPI = async (templateId: any, mailTemplates: any) => {
    const endPoint = `mailTemplate/update/${templateId}`;
    await apiRequest("admin", endPoint, "POST", mailTemplates, texts.message.regist, false);
  };
  return { mailTemplateRegistAPI };
};

export default useMailTemplateRegistAPI;
