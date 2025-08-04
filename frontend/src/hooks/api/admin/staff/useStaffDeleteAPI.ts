//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useStaffDeleteAPI = () => {
  const { texts, apiRequest } = useCommonSetup();

  const staffDelete = async (StaffData: any) => {
    const endPoint = `staff/delete/${StaffData.staffId}`;
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
        window.location.href = `/admin/staff/register`;
      }, 1500);
    }
  };

  return { staffDelete };
};
