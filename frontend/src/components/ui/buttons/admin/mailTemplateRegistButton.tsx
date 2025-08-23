import { useCallback } from "react";
import { texts } from "@/config/texts.ja";
//API
import useMailTemplateRegistAPI from "@/hooks/api/admin/mail/useMailTemplateRegistAPI";

interface RegistButtonProps {
  templateId: number;
  templateName: string | null;
  subject: string | null;
  bodyPart2: string | null;
  bodyPart4: string | null;
  body: string | null;
}
export const MailTemplateRegistButton: React.FC<RegistButtonProps> = ({
  templateId,
  templateName,
  subject,
  bodyPart2,
  bodyPart4,
  body,
}) => {
  const { mailTemplateRegistAPI } = useMailTemplateRegistAPI();

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault(); // フォーム送信を防止
      e.stopPropagation(); // イベントの伝播を停止

      const requestData = {
        templateName: templateName || "",
        subject: subject || "",
        bodyPart2: bodyPart2 || "",
        bodyPart4: bodyPart4 || "",
        body: body || "",
      };
      await mailTemplateRegistAPI(templateId, requestData);
    },
    [templateId, templateName, subject, bodyPart2, bodyPart4, body, mailTemplateRegistAPI]
  );

  return (
    <button
      onClick={handleClick}
      className="bg-yellow-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-20"
    >
      <span>{texts.button.update}</span>
    </button>
  );
};
