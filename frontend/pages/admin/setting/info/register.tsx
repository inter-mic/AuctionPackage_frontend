import { GetServerSideProps } from "next";
import breadcrumbStyles from "@/styles/breadcrumb.module.css";
import { Dayjs } from "dayjs";
import { texts } from "@/config/texts.ja";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminLayout from "@/hocs/withAdminLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useKengenRedirect } from "@/hooks/useKengenRedirect";
import { useExecutionPermission } from "@/hooks/useExecutionPermission";
//API
import { useInfoGetInfoAPI } from "@/hooks/api/admin/info/useInfoGetInfoAPI";
import { useInfoRegistAPI } from "@/hooks/api/admin/info/useInfoRegistAPI";
import { useInfoDeleteAPI } from "@/hooks/api/admin/info/useInfoDeleteAPI";

//型定義
import { infoData, initialInfoData, formatInfoData } from "@/types/admin/info/register";
import { PageProps } from "@/types/admin/adminPage";
//コンポーネント
import { CustomDatePicker } from "@/components/ui/dateTime/CustomDatePicker";
import { CustomTimePicker } from "@/components/ui/dateTime/CustomTimePicker";
import { CombineDateTime } from "@/components/ui/dateTime/CombineDateTime";
import { AllInfoListPullDown } from "@/components/ui/pulldowns/AllInfoListPullDown";
import { RequiredMark } from "@/components/ui/marks/RequiredMark";
import ConfirmDialog from "@/components/ui/dialog/confirmDialog";
//ボタン
import { RegistButton } from "@/components/ui/buttons/admin/registButton";
import { SearchButton } from "@/components/ui/buttons/admin/searchButton";
import { ResetButton } from "@/components/ui/buttons/admin/resetButton";
//スタイル
import styles from "@/styles/admin/FormRegister.module.css";

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminInfoRegist,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, texts } = useCommonSetup();
  useKengenRedirect(kengen, 501);
  const { executionPermission } = useExecutionPermission(kengen);

  //検索
  const { data, infoGetInfo } = useInfoGetInfoAPI();
  const [selectedInfoSeq, setSelectedInfoSeq] = useState<string>("-1");
  const formSearch = async () => {
    setFetchedData(initialInfoData);
    await infoGetInfo(Number(selectedInfoSeq));
    setFormErrors({});
  };

  //データセット
  const [fetchedData, setFetchedData] = useState<infoData>(initialInfoData);
  useEffect(() => {
    if (data) {
      setFetchedData(formatInfoData(data));
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFetchedData((prevFetchedData) => ({ ...prevFetchedData, [name]: value }));
    if (errors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleDateChange = (field: keyof infoData) => (date: Dayjs | null, name: string) => {
    setFetchedData((prev) => ({
      ...prev,
      [field]: date,
    }));
    if (errors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };
  const handleTimeChange = (field: keyof infoData) => (time: string | null, name: string) => {
    setFetchedData((prev) => ({
      ...prev,
      [field]: time,
    }));
    if (errors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleInfoSeqChange = (value: string) => {
    setSelectedInfoSeq(value);
  };

  //お知らせ情報登録
  const { errors, infoRegist } = useInfoRegistAPI();
  const handleSubmit = () => {
    const displayStarttime = CombineDateTime(
      fetchedData.displayStartDate,
      fetchedData.displayStarttime
    );
    const displayEndtime = CombineDateTime(fetchedData.displayEndDate, fetchedData.displayEndtime);
    const dataToSubmit = {
      ...fetchedData,
      displayStarttime,
      displayEndtime,
    };
    infoRegist(dataToSubmit);
  };

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (errors) {
      setFormErrors(errors);
    }
  }, [errors]);

  //削除処理
  const { infoDelete } = useInfoDeleteAPI();
  const handleDeleteSubmit = () => {
    infoDelete(fetchedData);
  };

  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminInfoRegist}</span>
      </div>
      <div className="w-full space-y-3 bg-white shadow-md md:max-w-full md:rounded">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 items-end">
              <div className="w-full md:flex-1">
                <label className={styles.label}> {texts.info.naiyo}</label>
                <AllInfoListPullDown
                  onChange={handleInfoSeqChange}
                  className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300`}
                />
              </div>

              <div className="w-full md:w-auto text-center  mx-0 sm:mx-4">
                <SearchButton onClick={formSearch} />
              </div>
              <div className="w-full md:w-auto text-center">
                <ResetButton />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center my-10 bg-gray-100">
        <div className="w-full p-8 space-y-6 bg-white shadow-md md:max-w-full md:rounded">
          <div className="flex">
            <div className="w-full xl:w-1/2">
              <label className={styles.label}>
                <RequiredMark />
                {texts.auction.displayKikan}
              </label>
              <div className="w-full">
                <div className="lg:flex ">
                  <CustomDatePicker
                    name="displayStartDate"
                    selectedDate={fetchedData.displayStartDate}
                    onDateChange={handleDateChange("displayStartDate")}
                    error={!!formErrors?.displayStarttime}
                  />
                  <CustomTimePicker
                    name="displayStarttime"
                    selectedTime={fetchedData.displayStarttime}
                    onTimeChange={handleTimeChange("displayStarttime")}
                    error={!!formErrors?.displayStarttime}
                  />
                  <div className="lg:ml-3 lg:mt-3  text-center">～</div>
                  <CustomDatePicker
                    name="displayEndtime"
                    selectedDate={fetchedData.displayEndDate}
                    onDateChange={handleDateChange("displayEndDate")}
                    error={!!formErrors?.displayEndtime}
                  />
                  <CustomTimePicker
                    name="displayEndtime"
                    selectedTime={fetchedData.displayEndtime}
                    onTimeChange={handleTimeChange("displayEndtime")}
                    error={!!formErrors?.displayEndtime}
                  />
                </div>
                {(formErrors?.displayStarttime || formErrors?.displayEndtime) && (
                  <p className="error-message">
                    {formErrors?.displayStarttime || formErrors?.displayEndtime}
                  </p>
                )}
              </div>

              <div className="xl:w-1/2 sm:w-full"></div>
            </div>
          </div>
          <div>
            <label htmlFor="naiyo" className="block text-sm font-medium text-gray-700">
              <RequiredMark />
              {texts.info.naiyo}
            </label>
            <textarea
              id="naiyo"
              name="naiyo"
              value={fetchedData.naiyo || ""}
              onChange={handleChange}
              className={`${styles.input}  w-full px-3 py-2 mt-1 border rounded-md`}
            />
            {formErrors?.naiyo && <p className="error-message">{formErrors.naiyo}</p>}
          </div>
          <div>
            <label htmlFor="naiyoUrl" className="block text-sm font-medium text-gray-700">
              {texts.info.naiyoUrl}
              {texts.info.note_1}
            </label>
            <input
              id="naiyoUrl"
              name="naiyoUrl"
              value={fetchedData.naiyoUrl || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md "
            />
          </div>

          {executionPermission(501, 2) && (
            <div className="text-right">
              <RegistButton label={texts.button.regist} onClick={handleSubmit} />
            </div>
          )}

          {executionPermission(501, 2) && fetchedData.infoSeq != null && (
            <>
              <div className="divide-y border-gray-500"></div>
              <h1 className="border-t border-gray-300 pt-4"> {texts.label.delete}</h1>
              <div className="flex justify-between items-center">
                <label className="text-gray-500 text-sm">
                  {texts.label.delete_note_1}
                  <br />
                </label>
                <ConfirmDialog
                  title={texts.message.confirmDelete}
                  description={texts.label.delete_note_1}
                  buttonTitle={texts.button.delete}
                  className="bg-red-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg w-40"
                  dialogClassName="bg-red-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg w-40"
                  dialogCancelClassName="lg:ml-2.5 mt-2 lg:mt-0 bg-white border border-solid border-red-500 text-red-500 font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
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
