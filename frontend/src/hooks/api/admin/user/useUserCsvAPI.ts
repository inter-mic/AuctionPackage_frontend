//コンフィグ
import { getTexts } from "@/config/texts";
//API
import { useCsvApiRequest } from "@/hooks/api/useCsvApiRequest";

export const useUserCsvAPI = () => {
  const { csvApiRequest } = useCsvApiRequest();
  const userCsv = async (selectedUserIds: number[]) => {
    const endPoint = `user/csv`;
    await csvApiRequest("admin", endPoint, "POST", selectedUserIds);
  };

  return { userCsv };
};
