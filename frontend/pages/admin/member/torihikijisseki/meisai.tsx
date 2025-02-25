import { GetServerSideProps } from 'next';
import { texts } from '@/config/texts';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import dayjs, { Dayjs } from 'dayjs';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
//ホック
import { withAuth } from '@/hocs/withAdminAuth';
import withAdminLayout from '@/hocs/withAdminLayout';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
import { useSorting } from '@/hooks/useSorting';
import { useCheckboxSelection } from '@/hooks/useCheckboxSelection';
import { useKengenRedirect } from '@/hooks/useKengenRedirect';
import { useExecutionPermission } from '@/hooks/useExecutionPermission';
import { useToGoodsRegist } from '@/hooks/moveScreen/useToGoodsRegist';

//API
import { useTorihikiJissekiMeisaiShuppinSearchAPI } from '@/hooks/api/admin/torihikiJisseki/useTorihikiJissekiMeisaiShuppinSearchAPI';
import { useTorihikiJissekiMeisaiRakusatsuSearchAPI } from '@/hooks/api/admin/torihikiJisseki/useTorihikiJissekiMeisaiRakusatsuSearchAPI';
import { useTorihikiJissekiMeisaiDateUpdateAPI } from '@/hooks/api/admin/torihikiJisseki/useTorihikiJissekiMeisaiDateUpdateAPI';
//型定義
import { TAdminTorihikiJissekiRequest, TTorihikiJissekiMeisaiRakusatsuSelect, TTorihikiJissekiMeisaiShuppinSelect } from '@/types/admin/torihikiJisseki/search';
import { PageProps } from '@/types/admin/adminPage';
//コンポーネント
import { CustomDatePicker } from '@/components/ui/dateTime/CustomDatePicker';
//ボタン
import { RegistButton } from '@/components/ui/buttons/admin/registButton';
import { OutPutButton } from '@/components/ui/buttons/admin/outputButton';
//スタイル
import breadcrumbStyles from '@/styles/breadcrumb.module.css';
import formSearchStyles from '@/styles/admin/FormSearch.module.css';
import styles from '@/styles/admin/TorihikiJissekiMeisai.module.css';


export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.adminTorihikiJissekiMeisai
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();

  useKengenRedirect(kengen, 105);
  const { executionPermission } = useExecutionPermission(kengen);

  const { rakusatsuList, torihikiJissekiMeisaiRakusatsuSearchAPI } = useTorihikiJissekiMeisaiRakusatsuSearchAPI();
  const { shuppinList, torihikiJissekiMeisaiShuppinSearchAPI } = useTorihikiJissekiMeisaiShuppinSearchAPI();
  const params = useSearchParams();
  const paramsAuctionSeq = params ? params.get('auctionSeq') : null;
  const paramsUserId = params ? params.get('userId') : null;
  useEffect(() => {
    if (paramsAuctionSeq && paramsUserId) {
      const requestParams: TAdminTorihikiJissekiRequest = {
        auctionSeq: Number(paramsAuctionSeq),
        userId: Number(paramsUserId),
      };
      torihikiJissekiMeisaiRakusatsuSearchAPI(requestParams);
      ////torihikiJissekiMeisaiShuppinSearchAPI(requestParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsAuctionSeq, paramsUserId]);
  const [fetchRakusatsuList, setFetchRakusatsuList] = useState<TTorihikiJissekiMeisaiRakusatsuSelect[]>([]);
  const [fetchShuppinList, setFetchShuppinList] = useState<TTorihikiJissekiMeisaiShuppinSelect[]>([]);
  useEffect(() => {
    if (rakusatsuList.length > 0) { setFetchRakusatsuList(rakusatsuList); }
  }, [rakusatsuList]);
  useEffect(() => {
    if (shuppinList.length > 0) { setFetchShuppinList(shuppinList); }
  }, [shuppinList]);
  
  //ソート設定
  const { data: rakusatsuSortedData, handleSort: handleSortRakusatsu } = useSorting(fetchRakusatsuList, 'lot', 'asc');
  const { data: shuppinSortedData, handleSort: handleSortShuppin } = useSorting(fetchShuppinList, 'lot', 'asc');
  
  //チェックボックス
  const { selectAll: rakusatsuSelectAll, setSelectAll: rakusatsuSetSelectAll, selectedIds: rakusatsuSelectedIds, setSelectedIds: rakusatsuSetSelectedIds, handleSelectAll: rakusatsuHandleSelectAll, handleSelect: rakusatsuHandleSelect } = useCheckboxSelection(rakusatsuSortedData.map(goods => goods.goodsId));
  const { selectAll: shuppinSelectAll, setSelectAll: shuppinSetSelectAll, selectedIds: shuppinSelectedIds, setSelectedIds: shuppinSetSelectedIds, handleSelectAll: shuppinHandleSelectAll, handleSelect: shuppinHandleSelect } = useCheckboxSelection(shuppinSortedData.map(goods => goods.goodsId));
  //商品登録画面に遷移
  const { toGoodsRegist } = useToGoodsRegist(kengen);
  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>, goodsId: number) => {
    toGoodsRegist(e, goodsId);
  };
  //日付登録
  const [rakusatsuUpdateKbn, setRakusatsuUpdateKbn] = useState<string>('');
  const handleRakusatsuUpdateKbnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRakusatsuUpdateKbn(event.target.value);
  };
  const [rakusatsuDate, setRakusatsuDate] = useState<Dayjs | null>(null);
  const [paramsRakusatsuDate, setParamsRakusatsuDate] = useState<string | null>(null);
  const handleRakusatsuDateChange = () => (date: Dayjs | null) => {
    if (date) {
      const localDate = dayjs(date).format('YYYY-MM-DDT00:00:00'); // JavaScriptのDateオブジェクト
      setRakusatsuDate(date); // ローカルタイムで表示
      setParamsRakusatsuDate(localDate); // ローカルタイムで表示

    }
  };
  const [shuppinUpdateKbn, setShuppinUpdateKbn] = useState<string>('');
  const handleShuppinUpdateKbnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setShuppinUpdateKbn(event.target.value);
  };
  const [shuppinDate, setShuppinDate] = useState<Dayjs | null>(null);
  const [paramsShuppinDate, setParamsShuppinDate] = useState<string | null>(null);
  const handleShuppinDateChange = () => (date: Dayjs | null) => {
    if (date) {
      const localDate = dayjs(date).format('YYYY-MM-DDT00:00:00'); // JavaScriptのDateオブジェクト
      setShuppinDate(date); // ローカルタイムで表示
      setParamsShuppinDate(localDate); // ローカルタイムで表示
    }
  };
  const { torihikiJissekiMeisaiDateUpdateAPI, errors , rakusatsuResponseData, shuppinResponseData} = useTorihikiJissekiMeisaiDateUpdateAPI();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const handleDateUpdate = (isRakusatsu: boolean) => {
    if (isRakusatsu) {
      if (rakusatsuSelectedIds.length === 0) {
        toast.error(texts.message.selectAtLeastOne);
        return;
      }
      torihikiJissekiMeisaiDateUpdateAPI(rakusatsuSelectedIds, paramsRakusatsuDate, rakusatsuUpdateKbn, paramsAuctionSeq, paramsUserId);
    } else {
      if (shuppinSelectedIds.length === 0) {
        toast.error(texts.message.selectAtLeastOne);
        return;
      }
      torihikiJissekiMeisaiDateUpdateAPI(shuppinSelectedIds, paramsShuppinDate, shuppinUpdateKbn, paramsAuctionSeq, paramsUserId);
    }

  };
  useEffect(() => {
    if (errors) { setFormErrors(errors); }
  }, [errors]);
  useEffect(() => {
    if (rakusatsuResponseData) { 
      setFetchRakusatsuList(rakusatsuResponseData); 
      rakusatsuSetSelectAll(false);
      rakusatsuSetSelectedIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rakusatsuResponseData]);
  // useEffect(() => {
  //   if (shuppinResponseData) {
  //      setFetchShuppinList(shuppinResponseData); 
  //      shuppinSetSelectAll(false);
  //      shuppinSetSelectedIds([]);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [shuppinResponseData]);
  

  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminTorihikiJissekiMeisai}</span>
      </div>
      <div className={styles.container}>
        <div className={formSearchStyles.formGrid}>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="auction" >{texts.goods.auctionName}</label>
            {rakusatsuList && rakusatsuList.length > 0
              ? rakusatsuList[0].auctionName
              : shuppinList && shuppinList.length > 0
                ? shuppinList[0].auctionName
                : ""}
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="userId" >{texts.member.userId}</label>
            {rakusatsuList && rakusatsuList.length > 0
              ? rakusatsuList[0].userId
              : shuppinList && shuppinList.length > 0
                ? shuppinList[0].userId
                : ""}
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="userName" >{texts.member.userName}</label>
            {rakusatsuList && rakusatsuList.length > 0
              ? rakusatsuList[0].userName
              : shuppinList && shuppinList.length > 0
                ? shuppinList[0].userName
                : ""}
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="companyName" >{texts.member.companyName}</label>
            {rakusatsuList && rakusatsuList.length > 0
              ? rakusatsuList[0].companyName
              : shuppinList && shuppinList.length > 0
                ? shuppinList[0].companyName
                : ""}
          </div>

        </div>
      </div>

      {rakusatsuList && rakusatsuList.length > 0 ? (
        <div className={styles.container}>
          <div className="flex flex-col sm:flex-row justify-start sm:justify-between sm:items-center p-1">
            <div className="text-left">
              <label className={styles.title}>{texts.torihikiJisseki.rakusatsuMeisai}</label>
            </div>
            <div className="text-right flex flex-col sm:flex-row">
              <label className="sm:ml-4 flex items-center">
                {texts.torihikiJisseki.rakusatsusu}:
                <span className="text-xl font-bold mx-1">
                  {rakusatsuList.length}{texts.label.resultCount}
                </span>
              </label>
              <label className="sm:ml-2 flex items-center">
                {texts.torihikiJisseki.rakusatsuTotalPrice}:
                <span className="text-xl font-bold mx-1">
                  {rakusatsuList.reduce((acc, result) => {
                    const price = parseFloat(result.rakusatsuTotalPrice.replace(/,/g, '')) || 0;
                    return acc + price;
                  }, 0).toLocaleString()}
                </span>
              </label>
            </div>
          </div>

          <div className="xl:flex justify-end">
            {executionPermission(207, 2) ? (
              <>
              <div className="flex flex-col sm:flex-row justify-start sm:justify-between sm:items-center p-1">
                <label className="sm:items-center ">{texts.torihikiJisseki.updateDate}</label>
                {formErrors?.updateKbn && <p className="error-message">{formErrors.updateKbn}</p>}
                <div className="flex items-center mb-2 sm:mb-0">
                  <select
                    id="updateKbn"
                    name="updateKbn"
                    value={rakusatsuUpdateKbn}
                    onChange={handleRakusatsuUpdateKbnChange}
                    className={`${styles.updateDateInput} w-48 `}
                  >
                    <option value="">---</option>
                    <option value="1">{texts.torihikiJisseki.nyukinbi}</option>
                    <option value="2">{texts.torihikiJisseki.hassobi}</option>
                  </select>
                  <CustomDatePicker
                    name="date"
                    selectedDate={rakusatsuDate}
                    onDateChange={handleRakusatsuDateChange()}
                  />
                </div>
                <RegistButton label={texts.button.regist} onClick={() => handleDateUpdate(true)} />
              </div>
              
              </>
            ) : null}
          </div>


          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b  w-24" >
                  <input
                    type="checkbox"
                    checked={rakusatsuSelectAll}
                    onChange={rakusatsuHandleSelectAll}
                  />
                </th>
                <th className="py-2 px-4 border-b w-48" onClick={() => handleSortRakusatsu('sku')}>{texts.goods.sku}</th>
                <th className="py-2 px-4 border-b w-24" onClick={() => handleSortRakusatsu('lot')}>{texts.goods.lot}</th>
                <th className="py-2 px-4 border-b" onClick={() => handleSortRakusatsu('goodsName')}>{texts.goods.goodsName}</th>
                <th className="py-2 px-4 border-b w-48" onClick={() => handleSortRakusatsu('rakusatsuPrice')}>{texts.torihikiJisseki.rakusatsuPrice}</th>
                <th className="py-2 px-4 border-b w-48" onClick={() => handleSortRakusatsu('rakusatsuTesuryoPrice')}>{texts.torihikiJisseki.rakusatsuTesuryoPrice}</th>
                <th className="py-2 px-4 border-b w-48" onClick={() => handleSortRakusatsu('rakusatsuTotalPrice')}>{texts.torihikiJisseki.rakusatsuTotalPrice}</th>
                <th className="py-2 px-4 border-b w-32" onClick={() => handleSortRakusatsu('rakusatsuKessaibi')}>{texts.torihikiJisseki.nyukinbi}</th>
                <th className="py-2 px-4 border-b w-32" onClick={() => handleSortRakusatsu('rakusatsuHassobi')}>{texts.torihikiJisseki.hassobi}</th>
              </tr>
            </thead>
            <tbody>
              {rakusatsuSortedData.length > 0 && rakusatsuSortedData.map((result) => (
                <tr
                  key={result.goodsId}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={(e) => handleRowClick(e, result.goodsId)}
                >
                  <td
                    className="py-2 px-4 border-b text-center  w-24"
                    onClick={(e) => {
                      e.stopPropagation(); // チェックボックスでイベントを止める
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={rakusatsuSelectedIds.includes(result.goodsId)}
                      onChange={() => rakusatsuHandleSelect(result.goodsId)}
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-left w-48">{result.sku}</td>
                  <td className="py-2 px-4 border-b text-left w-24">{result.lot}</td>
                  <td className="py-2 px-4 border-b text-left">{result.goodsName}</td>
                  <td className="py-2 px-4 border-b text-right w-48">{result.rakusatsuPrice}</td>
                  <td className="py-2 px-4 border-b text-right w-48">{result.rakusatsuTesuryoPrice}</td>
                  <td className="py-2 px-4 border-b text-right w-48">{result.rakusatsuTotalPrice}</td>
                  <td className="py-2 px-4 border-b text-center w-32">{result.rakusatsuKessaibi}</td>
                  <td className="py-2 px-4 border-b text-center w-32">{result.rakusatsuHassobi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p></p>
      )}
      {/* {shuppinList && shuppinList.length > 0 ? (
        <div className={styles.container}>
           <div className="flex flex-col sm:flex-row justify-start sm:justify-between sm:items-center p-1">
            <div className="text-left">
              <label className={styles.title}>{texts.torihikiJisseki.shuppinMeisai}</label>
            </div>
            <div className="text-right flex flex-col sm:flex-row">
              <label className="sm:ml-4 flex items-center">
                {texts.torihikiJisseki.shuppinsu}:
                <span className="text-xl font-bold mx-1">
                  {shuppinList.length}{texts.label.resultCount}
                </span>
              </label>
              <label className="sm:ml-4 flex items-center">
                {texts.torihikiJisseki.rakusatsusu}:
                <span className="text-xl font-bold mx-1">
                {shuppinList.filter(result => result.rakusatsuUserId !== "").length}{texts.label.resultCount}
                </span>
              </label>
              <label className="sm:ml-2 flex items-center">
                {texts.torihikiJisseki.shuppinTotalPrice}:
                <span className="text-xl font-bold mx-1">
                  {shuppinList.reduce((acc, result) => {
                    const price = parseFloat(result.shuppinTotalPrice.replace(/,/g, '')) || 0;
                    return acc + price;
                  }, 0).toLocaleString()}
                </span>
              </label>
            </div>
          </div>
          <div className="xl:flex justify-end">
            {executionPermission(207, 2) ? (
              <div className="flex flex-col sm:flex-row justify-start sm:justify-between sm:items-center p-1">
                <label className="sm:items-center ">{texts.torihikiJisseki.updateDate}</label>
                <div className="flex items-center mb-2 sm:mb-0">
                  <select
                    id="updateKbn"
                    name="updateKbn"
                    value={shuppinUpdateKbn}
                    onChange={handleShuppinUpdateKbnChange}
                    className={`${styles.updateDateInput} w-48`}
                  >
                    <option value="">---</option>
                    <option value="3">{texts.torihikiJisseki.shiharaibi}</option>
                  </select>
                  <CustomDatePicker
                    name="date"
                    selectedDate={shuppinDate}
                    onDateChange={handleShuppinDateChange()}
                  />
                </div>
                <RegistButton label={texts.button.regist} onClick={() => handleDateUpdate(false)} />
              </div>
            ) : null}
          </div>
          
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b  w-24" >
                  <input
                    type="checkbox"
                    checked={shuppinSelectAll}
                    onChange={shuppinHandleSelectAll}
                  />
                </th>
                <th className="py-2 px-4 border-b w-48" onClick={() => handleSortShuppin('sku')}>{texts.goods.sku}</th>
                <th className="py-2 px-4 border-b w-24" onClick={() => handleSortShuppin('lot')}>{texts.goods.lot}</th>
                <th className="py-2 px-4 border-b" onClick={() => handleSortShuppin('goodsName')}>{texts.goods.goodsName}</th>
                <th className="py-2 px-4 border-b w-48" onClick={() => handleSortShuppin('shuppinPrice')}>{texts.torihikiJisseki.shuppinPrice}</th>
                <th className="py-2 px-4 border-b w-48" onClick={() => handleSortShuppin('shuppinTesuryoPrice')}>{texts.torihikiJisseki.shuppinTesuryoPrice}</th>
                <th className="py-2 px-4 border-b w-48" onClick={() => handleSortShuppin('shuppinTotalPrice')}>{texts.torihikiJisseki.shuppinTotalPrice}</th>
                <th className="py-2 px-4 border-b w-32" onClick={() => handleSortRakusatsu('shuppinKessaibi')}>{texts.torihikiJisseki.shiharaibi}</th>
              </tr>
            </thead>
            <tbody>
              {shuppinSortedData.length > 0 && shuppinSortedData.map((result) => (
                <tr
                  key={result.goodsId}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={(e) => handleRowClick(e, result.goodsId)}
                >
                  <td
                    className="py-2 px-4 border-b text-center  w-24"
                    onClick={(e) => {
                      e.stopPropagation(); // チェックボックスでイベントを止める
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={shuppinSelectedIds.includes(result.goodsId)}
                      onChange={() => shuppinHandleSelect(result.goodsId)}
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-left w-48">{result.sku}</td>
                  <td className="py-2 px-4 border-b text-center w-24">{result.lot}</td>
                  <td className="py-2 px-4 border-b text-left">{result.goodsName}</td>
                  <td className="py-2 px-4 border-b text-right w-48">{result.shuppinPrice}</td>
                  <td className="py-2 px-4 border-b text-right w-48">{result.shuppinTesuryoPrice}</td>
                  <td className="py-2 px-4 border-b text-right w-48">{result.shuppinTotalPrice}</td>
                  <td className="py-2 px-4 border-b text-center w-32">{result.shuppinKessaibi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p></p>
      )} */}
    </div>
  );
};

export default withAdminLayout(Page);