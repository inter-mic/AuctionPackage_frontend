import { GetServerSideProps } from "next";
import { useSearchParams } from "next/navigation";
import { texts } from "@/config/texts.ja";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminLayout from "@/hocs/withAdminLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//API
import { useStaffGetInfoAPI } from "@/hooks/api/admin/staff/useStaffGetInfoAPI";
import { useStaffRegistAPI } from "@/hooks/api/admin/staff/useStaffRegistAPI";
import { useStaffDeleteAPI } from "@/hooks/api/admin/staff/useStaffDeleteAPI";
//型定義
import { StaffData } from "@/types/admin/staff/register";
import { PageProps } from "@/types/admin/adminPage";
//コンポーネント
import { RequiredMark } from "@/components/ui/marks/RequiredMark";
import { useKengenRedirect } from "@/hooks/useKengenRedirect";
import { useExecutionPermission } from "@/hooks/useExecutionPermission";
import { KengenListPullDown } from "@/components/ui/pulldowns/KengenPullDown";
import ConfirmDialog from "@/components/ui/dialog/confirmDialog";
//ボタン
import { RegistButton } from "@/components/ui/buttons/admin/registButton";
import {
  StaffTeishiOnButton,
  StaffTeishiOffButton,
} from "@/components/ui/buttons/admin/staffTeishiButton";
//スタイル
import breadcrumbStyles from "@/styles/breadcrumb.module.css";
import styles from "@/styles/CommonRegister.module.css";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const otherData = {};
  return {
    props: {
      pageTitle: texts.menu.adminStaffRegist,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();

  useKengenRedirect(kengen, 401);
  const { executionPermission } = useExecutionPermission(kengen);

  const { data, staffGetInfo } = useStaffGetInfoAPI();
  const params = useSearchParams();
  const paramsStaffId = params ? params.get("staffId") : null;
  useEffect(() => {
    if (paramsStaffId) {
      staffGetInfo(paramsStaffId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsStaffId]);
  const [staff, setStaff] = useState<StaffData>({});
  useEffect(() => {
    if (data) {
      setStaff(data[0]);
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setStaff((prevStaff) => ({ ...prevStaff, [name]: value }));
    // エラーメッセージが存在する場合、対応するエラーメッセージをクリア
    if (errors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const [selectedKengenId, setSelectedKengenId] = useState<string | null>(null);
  const handleKengenIdChange = (name: string, value: string) => {
    setSelectedKengenId(value);
    setStaff((prevStaff) => ({ ...prevStaff, [name]: value }));
    if (formErrors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const { responseData, errors, staffRegist } = useStaffRegistAPI();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    staffRegist(staff);
  };
  useEffect(() => {
    if (responseData && responseData.length > 0) {
      setStaff(responseData[0]);
    }
  }, [responseData]);

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (errors) {
      setFormErrors(errors);
    }
  }, [errors]);
  //停止処理
  const updateTeishiFlg = useCallback((userId: number, newFlg: boolean) => {
    setStaff((prevStaff) => {
      return { ...prevStaff, teishiFlg: newFlg };
    });
  }, []);
  //削除処理
  const { staffDelete } = useStaffDeleteAPI();
  const handleDeleteSubmit = () => {
    staffDelete(staff);
  };

  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminStaffRegist}</span>
      </div>
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <div className="w-full p-8 space-y-6 bg-white shadow-md md:max-w-full md:rounded">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center">
                <RequiredMark />
                <label htmlFor="loginId" className="formlabel">
                  {texts.staff.loginId}
                </label>
              </div>
              <input
                id="loginId"
                name="loginId"
                type="text"
                value={staff.loginId || ""}
                onChange={handleChange}
                className={`${styles.commonInput} ${styles.input50}`}
              />
              {formErrors?.loginId && (
                <p className={`error-message ${styles.input50}`}>{formErrors.loginId}</p>
              )}
            </div>
            <div>
              <div className="flex items-center">
                <RequiredMark />
                <label htmlFor="staffName" className="formlabel">
                  {texts.staff.staffName}
                </label>
              </div>
              <input
                id="staffName"
                name="staffName"
                type="text"
                value={staff.staffName || ""}
                onChange={handleChange}
                className={`${styles.commonInput} ${styles.input50}`}
              />
              {formErrors?.staffName && (
                <p className={`error-message ${styles.input50}`}>{formErrors.staffName}</p>
              )}
            </div>
            <div>
              <div className="flex items-center">
                <RequiredMark />
                <label htmlFor="mail" className="formlabel">
                  {texts.common.mail}
                </label>
              </div>

              <input
                id="mail"
                name="mail"
                type="email"
                value={staff.mail || ""}
                onChange={handleChange}
                className={`${styles.commonInput} ${styles.input50}`}
              />
              {formErrors?.mail && (
                <p className={`error-message ${styles.input50}`}>{formErrors.mail}</p>
              )}
            </div>
            <div className="xl:w-1/5 sm:w-full">
              <div className="flex items-center">
                <RequiredMark />
                <label htmlFor="kengenId" className="formlabel">
                  {texts.staff.kengenId}
                </label>
              </div>
              <div>
                <KengenListPullDown
                  className={`${styles.commonInput} ${styles.input50}`}
                  onChange={(value) => handleKengenIdChange("kengenId", value)}
                  selectedId={
                    staff.kengenId === "0" ||
                    staff.kengenId === null ||
                    staff.kengenId === undefined
                      ? ""
                      : String(staff.kengenId)
                  }
                />
              </div>
              {formErrors?.kengenId && (
                <p className={`error-message ${styles.input50}`}>{formErrors.kengenId}</p>
              )}
            </div>
            {executionPermission(401, 2) && (
              <div className="text-right">
                <RegistButton label={texts.button.regist} />
              </div>
            )}
          </form>

          {executionPermission(401, 2) && staff.staffId !== undefined && (
            <>
              <div className="divide-y border-gray-500"></div>
              <h1 className="border-t border-gray-300 pt-4"> {texts.label.teishi}</h1>
              <div className="sm:flex sm:justify-between sm:items-center">
                <label className="text-gray-500 text-sm">
                  {texts.label.teishi_note_1}
                  <br />
                </label>

                {staff.staffId !== undefined &&
                  (staff.teishiFlg ? (
                    <StaffTeishiOffButton staffId={staff.staffId} onUpdate={updateTeishiFlg} />
                  ) : (
                    <StaffTeishiOnButton staffId={staff.staffId} onUpdate={updateTeishiFlg} />
                  ))}
              </div>

              <div className="divide-y border-gray-500"></div>
              <h1 className="border-t border-gray-300 pt-4"> {texts.label.delete}</h1>
              <div className="sm:flex sm:justify-between sm:items-center">
                <label className="text-gray-500 text-sm">
                  {texts.label.delete_note_1}
                  <br />
                </label>
                <ConfirmDialog
                  title={texts.message.confirmDelete}
                  description={texts.label.delete_note_1}
                  buttonTitle={texts.button.delete}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-40"
                  dialogCancelClassName="lg:ml-2.5 mt-2 lg:mt-0 bg-white border border-solid border-red-500 text-red-500 font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
                  dialogClassName="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg w-40"
                  onSubmit={handleDeleteSubmit}
                  buttonText={texts.button.delete}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(Page);
