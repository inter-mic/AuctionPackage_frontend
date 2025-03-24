import { GetServerSideProps } from 'next';
import breadcrumbStyles from '@/styles/breadcrumb.module.css';
import { Dayjs } from 'dayjs';
import Image from 'next/image';
import { texts } from '@/config/texts';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from 'next/link';
//ホック
import { withAuth } from '@/hocs/withAdminAuth';
import withAdminLayout from '@/hocs/withAdminLayout';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
import { useKengenRedirect } from '@/hooks/useKengenRedirect';
import { useExecutionPermission } from '@/hooks/useExecutionPermission';
//API
import { useAuctionGetInfoAPI } from '@/hooks/api/admin/auction/useAuctionGetInfoAPI';
import { useAuctionRegistAPI } from '@/hooks/api/admin/auction/useAuctionRegistAPI';
import { useAuctionDeleteAPI } from '@/hooks/api/admin/auction/useAuctionDeleteAPI';
//型定義
import { auctionData, initialAuctionData, formatAuctionData } from '@/types/admin/auction/register';
import { PageProps } from '@/types/admin/adminPage';
//コンポーネント
import { CustomDatePicker } from '@/components/ui/dateTime/CustomDatePicker';
import { CustomTimePicker } from '@/components/ui/dateTime/CustomTimePicker';
import { CombineDateTime } from '@/components/ui/dateTime/CombineDateTime';
import { FileUpload } from '@/components/ui/fileUpload/fileUpload';
import ConfirmDialog from '@/components/ui/dialog/confirmDialog';
import { KaisaiListPullDown } from '@/components/ui/pulldowns/KaisaiListPullDown';
import { SpnKbnPullDown } from '@/components/ui/pulldowns/SpnKbnPullDown';
import { RequiredMark } from '@/components/ui/marks/RequiredMark';
//ボタン
import { RegistButton } from '@/components/ui/buttons/admin/registButton';
import { OutPutButton } from '@/components/ui/buttons/admin/outputButton';
import { SearchButton } from '@/components/ui/buttons/admin/searchButton';
import { ResetButton } from '@/components/ui/buttons/admin/resetButton';
import { ShimeOnButton, ShimeOffButton } from '@/components/ui/buttons/admin/shimeButton';
//スタイル
import styles from '@/styles/admin/FormRegister.module.css';


export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.adminKaisaiRegist
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, useCallback, texts } = useCommonSetup();
  useKengenRedirect(kengen, 301);
  const { executionPermission } = useExecutionPermission(kengen);

  //検索
  const { data, auctionGetInfo } = useAuctionGetInfoAPI();
  const formSearch = async () => {
    setFetchedData(initialAuctionData);
    await auctionGetInfo(Number(selectedKaisai));
    setFormErrors({});
  };

  //データセット
  const [fetchedData, setFetchedData] = useState<auctionData>(initialAuctionData);
  useEffect(() => {
    if (data) {
      setFetchedData(formatAuctionData(data));
      if (data.spnKbn) { setSelectedSpnKbn(data.spnKbn.toString()); }
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFetchedData((prevFetchedData) => ({ ...prevFetchedData, [name]: value }));
    if (errors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleDateChange = (field: keyof auctionData) => (date: Dayjs | null, name: string) => {
    setFetchedData((prev) => ({ ...prev, [field]: date }));
    if (errors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleTimeChange = (field: keyof auctionData) => (time: string | null, name: string) => {
    setFetchedData((prev) => ({ ...prev, [field]: time }));
    if (errors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const handleImageFileChange = (file: File | null) => {
    setSelectedImageFile(file);
  };
  const [selectedListFile, setSelectedListFile] = useState<File | null>(null);
  const handleListFileChange = (file: File | null) => {
    setSelectedListFile(file);
  };
  const [selectedKaisai, setSelectedKaisai] = useState<string>('-1');
  const handleKaisaiChange = (value: string) => {
    setSelectedKaisai(value);

  };

  const [selectedSpnKbn, setSelectedSpnKbn] = useState<string>('');
  const handleSpnKbnChange = (name: string, value: string) => {
    setSelectedSpnKbn(value);
    setFetchedData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prevFormErrors) => ({
        ...prevFormErrors,
        [name]: '',
      }));
    }

  };

  //開催情報登録
  const { responseData, errors, auctionRegist } = useAuctionRegistAPI();
  const handleSubmit =  () => {
    const auctionDatetime = CombineDateTime(fetchedData.auctionDate, fetchedData.auctionDatetime);
    const displayStarttime = CombineDateTime(fetchedData.displayStartDate, fetchedData.displayStarttime);
    const displayEndtime = CombineDateTime(fetchedData.displayEndDate, fetchedData.displayEndtime);
    const bidStarttime = CombineDateTime(fetchedData.bidStartDate, fetchedData.bidStarttime);
    const bidEndtime = CombineDateTime(fetchedData.bidEndDate, fetchedData.bidEndtime);
    const dataToSubmit = {
      ...fetchedData,
      auctionDatetime,
      displayStarttime,
      displayEndtime,
      bidStarttime,
      bidEndtime,
      auctionDate: null,
      displayStartDate: null,
      displayEndDate: null,
      bidStartDate: null,
      bidEndDate: null,
    };
    auctionRegist(dataToSubmit, selectedImageFile, selectedListFile);
  };
  const handleDeleteCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFetchedData((prevData) => ({ ...prevData, [name]: checked }));
  };
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (errors) { setFormErrors(errors); }
  }, [errors]);

  //削除処理
  const { auctionDelete } = useAuctionDeleteAPI();
  const handleDeleteSubmit = () => {
    auctionDelete(fetchedData);
  };
  //締め処理
  const updateShimeFlg = useCallback((auctionSeq: number, shimeFlg: boolean) => {
    setFetchedData((prevFetchedData) => {
      return { ...prevFetchedData, shimeFlg: shimeFlg };
    });
  }, []);

  const handleGoodsList  = () => {
    if (fetchedData.auctionListUrl) {
      location.href = fetchedData.auctionListUrl;
    }
  }

  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminKaisaiRegist}</span>
      </div>
      <div className="w-full space-y-3 bg-white shadow-md md:max-w-full md:rounded">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 items-end">
              <div className="w-full md:flex-1">
                <label htmlFor="auction" className={styles.label}>{texts.goods.auctionName}</label>
                <KaisaiListPullDown onChange={handleKaisaiChange} className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300`} kaisaiStatus={0} />
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
              <div className="xl:w-1/5 sm:w-full">
                <label htmlFor="spnKbn" className={styles.label}><RequiredMark />{texts.auction.spnKbn}</label>
                <SpnKbnPullDown
                  className={`${styles.input}`}
                  onChange={(value) => handleSpnKbnChange('spnKbn', value)}
                  selectedId={selectedSpnKbn !== null ? String(selectedSpnKbn) : null}
                />
                {formErrors?.spnKbn && <p className="error-message">{formErrors.spnKbn}</p>}
              </div>
            </div>
            <div className="xl:flex">
             
              <div className="xl:w-1/3 sm:w-full">
                <label htmlFor="auctionName" className={styles.label}><RequiredMark />{texts.auction.auctionName}</label>
                <input
                  id="auctionName"
                  name="auctionName"
                  value={fetchedData.auctionName || ''}
                  onChange={handleChange}
                  className={`${styles.input} `}
                />
                {formErrors?.auctionName && <p className="error-message">{formErrors.auctionName}</p>}
              </div>
            </div>
            {(selectedSpnKbn === "1" || selectedSpnKbn === "2") && (
              <div>
                <label htmlFor="auctionDate" className={styles.label}>
                <RequiredMark />{texts.auction.auctionDate}
                </label>
                <div className="xl:w-1/4 sm:w-full xl:flex items-center mt-1">
                  <CustomDatePicker
                    name="auctionDate"
                    selectedDate={fetchedData.auctionDate}
                    onDateChange={handleDateChange("auctionDate")}
                  />
                  <CustomTimePicker
                    name="auctionDate"
                    selectedTime={fetchedData.auctionDatetime}
                    onTimeChange={handleTimeChange("auctionDatetime")}
                  />
                </div>
                {(formErrors?.auctionDate || formErrors?.auctionDate) && (
                    <p className="error-message">
                      {formErrors?.auctionDate || formErrors?.auctionDate}
                    </p>
                  )}
              </div>
            )}
            <div className="flex">
              <div className="w-full xl:w-1/2">
                <label className={styles.label}>
                  <RequiredMark />{texts.auction.displayKikan}<br />
                <span >{texts.auction.displayKikan_note_1}</span><br />
                </label>
                <div className="w-full mt-1">
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
                    <div className="lg:ml-3 lg:mt-3  text-center" >～</div>
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
              </div>
            </div>
            <div className="flex">
              <div className="w-full xl:w-1/2">
                <label className={styles.label}><RequiredMark />{texts.auction.bidKikan}</label>
                <div className="w-full mt-1">
                  <div className="lg:flex">
                    <CustomDatePicker
                      name="bidStarttime"
                      selectedDate={fetchedData.bidStartDate}
                      onDateChange={handleDateChange("bidStartDate")}
                      error={!!formErrors?.bidStarttime}
                    />
                    <CustomTimePicker
                      name="bidStarttime"
                      selectedTime={fetchedData.bidStarttime}
                      onTimeChange={handleTimeChange("bidStarttime")}
                      error={!!formErrors?.bidStarttime}
                    />
                    <div className="lg:ml-3 lg:mt-3  text-center" >～</div>
                    <CustomDatePicker
                      name="bidEndtime"
                      selectedDate={fetchedData.bidEndDate}
                      onDateChange={handleDateChange("bidEndDate")}
                      error={!!formErrors?.bidEndtime}
                    />
                    <CustomTimePicker
                      name="bidEndtime"
                      selectedTime={fetchedData.bidEndtime}
                      onTimeChange={handleTimeChange("bidEndtime")}
                      error={!!formErrors?.bidEndtime}
                    />
                  </div>

                </div>
                {(formErrors?.bidStarttime || formErrors?.bidEndtime) && (
                    <p className="error-message">
                      {formErrors?.bidStarttime || formErrors?.bidEndtime}
                    </p>
                  )}
              </div>
            </div>
            <div>
                <label htmlFor="paymentDeadlineDate" className={styles.label}>
                  {texts.auction.paymentDeadlineDate}
                </label>
                <div className="xl:w-1/4 sm:w-full xl:flex items-center mt-1">
                  <CustomDatePicker
                    name="paymentDeadlineDate"
                    selectedDate={fetchedData.paymentDeadlineDate}
                    onDateChange={handleDateChange("paymentDeadlineDate")}
                  />
                </div>
                {(formErrors?.paymentDeadlineDate) && (
                  <p className="error-message">
                    {formErrors?.paymentDeadlineDate}
                  </p>
                )}
              </div>
            <div>
              <label htmlFor="auctionGaiyo" className={styles.label}>
                {texts.auction.auctionGaiyo}<br/>
                {texts.label.text_note_1}
              </label>
              <textarea
                id="auctionGaiyo"
                name="auctionGaiyo"
                value={fetchedData.auctionGaiyo || ''}
                onChange={handleChange}
                rows={10}
                className="w-full px-3 py-2 mt-1 border rounded-md "
              />
                 <label htmlFor="auctionGaiyo" className={styles.label}>
                {texts.auction.auctionGaiyoPreview}
              </label>
               <div
                className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-100"
                style={{ whiteSpace: 'pre-wrap', overflowY: 'auto', height: '200px' }}
                dangerouslySetInnerHTML={{ __html: fetchedData.auctionGaiyo || '' }}
              />
           
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {texts.auction.auctionImage}
              </label>
              <FileUpload
                onFileChange={handleImageFileChange}
                allowedExtensions={['jpg', 'jpeg', 'png']}
              />
              <span >{texts.auction.auctionImage_note_1}</span><br />
              <span >{texts.auction.auctionImage_note_2}</span>
              {fetchedData.auctionImageUrl && (
                <>
                <Image
                  src={fetchedData.auctionImageUrl}
                  alt=""
                  width={100}
                  height={100}
                  className="object-cover rounded"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      name="auctionImageIsDelete"
                      onChange={handleDeleteCheckboxChange}
                    />
                  }
                  className={styles.label}
                  label={<span>{texts.button.delete}</span>}
                />
                  </>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {texts.auction.goodsListUrl}
              </label>
              <FileUpload
                onFileChange={handleListFileChange}
                allowedExtensions={['pdf', 'xlsx']}
              />
              <span >{texts.auction.goodsListUrl_note_1}</span><br />
              <span >{texts.auction.goodsListUrl_note_2}</span>
              {fetchedData.auctionListUrl && (
                <>
                <div>
                  <Link className="text-blue-600 underline" href={fetchedData.auctionListUrl} target="_blank">
                  {texts.auction.goodsListUrl}
                  </Link>
                  
                </div>
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="auctionListIsDelete"
                        onChange={handleDeleteCheckboxChange}
                      />
                    }
                    className={styles.label}
                    label={<span>{texts.button.delete}</span>}
                  />
                  </div>
                  </>
              )}
            </div>
            {executionPermission(301, 2) && fetchedData.shimeTime == null ? (
              <div className="text-right">
                <RegistButton onClick={handleSubmit} label={texts.button.regist} />
              </div>
            ) : (
              <></>
            )}
        
          {executionPermission(301, 2) && fetchedData.auctionSeq != null && (
            <>
              <div className="divide-y border-gray-500"></div>
              <h1 className="border-t border-gray-300 pt-4"> {texts.auction.shime}</h1>
              <div className="sm:flex sm:justify-between sm:items-center">
                <label className="text-gray-500 text-sm">
                  {texts.auction.shime_note_1}<br />
                </label>
                {fetchedData.shimeTime == null ? (
                  <ShimeOnButton
                    auctionSeq={fetchedData.auctionSeq}
                    onUpdate={updateShimeFlg}
                  />
                ) : (
                  <ShimeOffButton
                    auctionSeq={fetchedData.auctionSeq}
                    onUpdate={updateShimeFlg}
                  />
                )}
              </div>
              <div className="divide-y border-gray-500"></div>
              <h1 className="border-t border-gray-300 pt-4"> {texts.label.delete}</h1>
              <div className="sm:flex sm:justify-between sm:items-center">
                <label className="text-gray-500 text-sm">
                  {texts.label.delete_note_1}<br />
                </label>
                <ConfirmDialog
                  title={texts.message.confirmDelete}
                  description={texts.label.delete_note_1}
                  buttonTitle={texts.button.delete}
                  className="bg-red-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
                  dialogClassName="bg-red-500 hover:bg-opacity-50 text-white font-bold py-4 px-4 rounded-lg w-40"
                  dialogCancelClassName="bg-white hover:bg-opacity-50 border border-solid border-red-500 text-red-500 py-4 px-4 rounded-lg w-40"
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