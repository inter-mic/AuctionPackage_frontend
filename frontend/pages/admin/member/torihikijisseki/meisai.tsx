import { GetServerSideProps } from "next";
import { texts } from "@/config/texts.ja";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import CurrencyYenIcon from "@mui/icons-material/CurrencyYen";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminLayout from "@/hocs/withAdminLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useSort } from "@/hooks/useSort";
import { useCheckboxSelection } from "@/hooks/useCheckboxSelection";
import { useKengenRedirect } from "@/hooks/useKengenRedirect";
import { useExecutionPermission } from "@/hooks/useExecutionPermission";
import { useToGoodsRegist } from "@/hooks/moveScreen/useToGoodsRegist";
//API
import { useTorihikiJissekiMeisaiShuppinSearchAPI } from "@/hooks/api/admin/torihikiJisseki/useTorihikiJissekiMeisaiShuppinSearchAPI";
import { useTorihikiJissekiMeisaiRakusatsuSearchAPI } from "@/hooks/api/admin/torihikiJisseki/useTorihikiJissekiMeisaiRakusatsuSearchAPI";
import { useTorihikiJissekiMeisaiDateUpdateAPI } from "@/hooks/api/admin/torihikiJisseki/useTorihikiJissekiMeisaiDateUpdateAPI";
import { useInvoicePdfAPI } from "@/hooks/api/admin/pdf/useInvoicePdfAPI";
//型定義
import { TAdminTorihikiJissekiRequest } from "@/types/admin/torihikiJisseki/search";
import { PageProps } from "@/types/admin/adminPage";
//コンポーネント
import { CustomDatePicker } from "@/components/ui/dateTime/CustomDatePicker";
import { TorihikiJissekiTableComponent } from "@/components/admin/torihikiJisseki/TorihikiJissekiTableComponent";
//ボタン
import { RegistButton } from "@/components/ui/buttons/admin/registButton";
import { OutPutButton } from "@/components/ui/buttons/admin/outputButton";
import { MemberRegisterButton } from "@/components/ui/buttons/admin/memberRegisterButton";
//スタイル
import breadcrumbStyles from "@/styles/breadcrumb.module.css";
import formSearchStyles from "@/styles/admin/FormSearch.module.css";
import styles from "@/styles/admin/TorihikiJissekiMeisai.module.css";
import adminStyles from "@/styles/admin/AdminCommon.module.css";

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminTorihikiJissekiMeisai,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen, optionInvoice }) => {
  const { useState, useEffect, texts } = useCommonSetup();

  useKengenRedirect(kengen, 105);
  const { executionPermission } = useExecutionPermission(kengen);
  const itemsPerPage = Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`);
  const { rakusatsuList, torihikiJissekiMeisaiRakusatsuSearchAPI } =
    useTorihikiJissekiMeisaiRakusatsuSearchAPI();
  const { shuppinList, torihikiJissekiMeisaiShuppinSearchAPI } =
    useTorihikiJissekiMeisaiShuppinSearchAPI();
  const params = useSearchParams();
  const paramsAuctionSeq = params ? params.get("auctionSeq") : null;
  const paramsUserId = params ? params.get("userId") : null;

  // 表示用の状態管理
  const [displayRakusatsuList, setDisplayRakusatsuList] = useState<any[]>([]);
  const [displayShuppinList, setDisplayShuppinList] = useState<any[]>([]);

  useEffect(() => {
    if (paramsAuctionSeq && paramsUserId) {
      const requestParams: TAdminTorihikiJissekiRequest = {
        auctionSeq: Number(paramsAuctionSeq),
        userId: paramsUserId,
        pageNumber: 1,
        pageSize: itemsPerPage,
      };
      torihikiJissekiMeisaiRakusatsuSearchAPI(requestParams);
      torihikiJissekiMeisaiShuppinSearchAPI(requestParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsAuctionSeq, paramsUserId]);

  // APIレスポンスを表示用状態に反映
  useEffect(() => {
    if (rakusatsuList) {
      setDisplayRakusatsuList(rakusatsuList);
    }
  }, [rakusatsuList]);

  useEffect(() => {
    if (shuppinList) {
      setDisplayShuppinList(shuppinList);
    }
  }, [shuppinList]);

  //ソート設定
  const { sortName, handleSortNameChange, handleSortFlgChange } = useSort({
    searchAPI: torihikiJissekiMeisaiRakusatsuSearchAPI,
    itemsPerPage,
    params: {
      auctionSeq: Number(paramsAuctionSeq),
      userId: paramsUserId,
    },
  });

  // 出品明細専用のソート設定
  const {
    sortName: shuppinSortName,
    handleSortNameChange: handleShuppinSortNameChange,
    handleSortFlgChange: handleShuppinSortFlgChange,
  } = useSort({
    searchAPI: torihikiJissekiMeisaiShuppinSearchAPI,
    itemsPerPage,
    params: {
      auctionSeq: Number(paramsAuctionSeq),
      userId: paramsUserId,
    },
  });

  //チェックボックス
  const {
    selectAll: rakusatsuSelectAll,
    setSelectAll: rakusatsuSetSelectAll,
    selectedIds: rakusatsuSelectedIds,
    setSelectedIds: rakusatsuSetSelectedIds,
    handleSelectAll: rakusatsuHandleSelectAll,
    handleSelect: rakusatsuHandleSelect,
  } = useCheckboxSelection(
    displayRakusatsuList.map((goods) => goods.goodsId),
    displayRakusatsuList.map((goods) => goods.goodsId),
    () => Promise.resolve()
  );

  //商品登録画面に遷移
  const { toGoodsRegist } = useToGoodsRegist(kengen);
  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>, goodsId: number) => {
    toGoodsRegist(e, goodsId);
  };
  //日付登録
  const [rakusatsuUpdateKbn, setRakusatsuUpdateKbn] = useState<string>("");
  const handleRakusatsuUpdateKbnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRakusatsuUpdateKbn(event.target.value);
  };
  const [rakusatsuDate, setRakusatsuDate] = useState<Dayjs | null>(null);
  const [paramsRakusatsuDate, setParamsRakusatsuDate] = useState<string | null>(null);
  const handleRakusatsuDateChange = () => (date: Dayjs | null) => {
    if (date) {
      const localDate = dayjs(date).format("YYYY-MM-DDT00:00:00"); // JavaScriptのDateオブジェクト
      setRakusatsuDate(date); // ローカルタイムで表示
      setParamsRakusatsuDate(localDate); // ローカルタイムで表示
    }
  };
  const [shuppinUpdateKbn, setShuppinUpdateKbn] = useState<string>("");
  const handleShuppinUpdateKbnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setShuppinUpdateKbn(event.target.value);
  };
  const [shuppinDate, setShuppinDate] = useState<Dayjs | null>(null);
  const [paramsShuppinDate, setParamsShuppinDate] = useState<string | null>(null);
  const handleShuppinDateChange = () => (date: Dayjs | null) => {
    if (date) {
      const localDate = dayjs(date).format("YYYY-MM-DDT00:00:00"); // JavaScriptのDateオブジェクト
      setShuppinDate(date); // ローカルタイムで表示
      setParamsShuppinDate(localDate); // ローカルタイムで表示
    }
  };
  const { torihikiJissekiMeisaiDateUpdateAPI, rakusatsuResponseData, shuppinResponseData } =
    useTorihikiJissekiMeisaiDateUpdateAPI();
  const handleDateUpdate = (isRakusatsu: boolean) => {
    if (isRakusatsu) {
      if (rakusatsuSelectedIds.length === 0) {
        toast.error(texts.message.selectAtLeastOne);
        return;
      }
      torihikiJissekiMeisaiDateUpdateAPI(
        rakusatsuSelectedIds,
        paramsRakusatsuDate,
        rakusatsuUpdateKbn,
        paramsAuctionSeq,
        paramsUserId
      );
    } else {
      if (shuppinSelectedIds.length === 0) {
        toast.error(texts.message.selectAtLeastOne);
        return;
      }
      torihikiJissekiMeisaiDateUpdateAPI(
        shuppinSelectedIds,
        paramsShuppinDate,
        shuppinUpdateKbn,
        paramsAuctionSeq,
        paramsUserId
      );
    }
  };

  useEffect(() => {
    if (rakusatsuResponseData) {
      rakusatsuSetSelectAll(false);
      rakusatsuSetSelectedIds([]);
      // 日付更新後のデータを表示用状態に反映
      setDisplayRakusatsuList(rakusatsuResponseData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rakusatsuResponseData]);
  useEffect(() => {
    if (shuppinResponseData) {
      shuppinSetSelectAll(false);
      shuppinSetSelectedIds([]);
      // 日付更新後のデータを表示用状態に反映
      setDisplayShuppinList(shuppinResponseData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuppinResponseData]);

  const { invoicePdfAPI } = useInvoicePdfAPI();
  const handleInvoice = () => {
    const userIds = paramsUserId ? [Number(paramsUserId)] : [];
    invoicePdfAPI(Number(paramsAuctionSeq), userIds);
  };

  // 出品リスト用のチェックボックス
  const {
    selectAll: shuppinSelectAll,
    setSelectAll: shuppinSetSelectAll,
    selectedIds: shuppinSelectedIds,
    setSelectedIds: shuppinSetSelectedIds,
    handleSelectAll: shuppinHandleSelectAll,
    handleSelect: shuppinHandleSelect,
  } = useCheckboxSelection(
    displayShuppinList.map((goods) => goods.goodsId),
    displayShuppinList.map((goods) => goods.goodsId),
    () => Promise.resolve()
  );

  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>
          {texts.menu.adminTorihikiJissekiMeisai}
        </span>
      </div>
      <div className={styles.container}>
        <div className={formSearchStyles.formGrid}>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="auction">{texts.goods.auctionName}</label>
            {displayRakusatsuList && displayRakusatsuList.length > 0
              ? displayRakusatsuList[0].auctionName
              : displayShuppinList && displayShuppinList.length > 0
              ? displayShuppinList[0].auctionName
              : ""}
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="userId">{texts.member.userId}</label>
            {displayRakusatsuList && displayRakusatsuList.length > 0
              ? displayRakusatsuList[0].userId
              : displayShuppinList && displayShuppinList.length > 0
              ? displayShuppinList[0].userId
              : ""}
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="userName">{texts.member.userName}</label>
            {displayRakusatsuList && displayRakusatsuList.length > 0
              ? displayRakusatsuList[0].userName
              : displayShuppinList && displayShuppinList.length > 0
              ? displayShuppinList[0].userName
              : ""}
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="companyName">{texts.member.companyName}</label>
            {displayRakusatsuList && displayRakusatsuList.length > 0
              ? displayRakusatsuList[0].companyName
              : displayShuppinList && displayShuppinList.length > 0
              ? displayShuppinList[0].companyName
              : ""}
          </div>
        </div>
        <div className="text-right flex gap-2 justify-end">
          {paramsUserId && <MemberRegisterButton userId={paramsUserId} />}
          {optionInvoice && (
            <OutPutButton onClick={() => handleInvoice()} text={texts.button.invoicePdf} />
          )}
        </div>
      </div>

      {displayRakusatsuList && displayRakusatsuList.length > 0 ? (
        <div className={styles.container}>
          <div className="flex flex-col sm:flex-row justify-start sm:justify-between sm:items-center p-1">
            <div className="text-left">
              <label className={styles.title}>{texts.torihikiJisseki.rakusatsuMeisai}</label>
              <div className={adminStyles.resultContainer}>
                <div className={adminStyles.resultRow}>
                  <label className={adminStyles.resultLabel}>{texts.label.sort}</label>
                  <select
                    id="sortName"
                    className={adminStyles.sort}
                    value={sortName}
                    onChange={handleSortNameChange}
                  >
                    <option value="lot">{texts.goods.lot}</option>
                    <option value="sku">{texts.goods.sku}</option>
                    <option value="rakusatsuPrice">{texts.torihikiJisseki.rakusatsuPrice}</option>
                    <option value="rakusatsuKessaibi">{texts.torihikiJisseki.nyukinbi}</option>
                    <option value="rakusatsuHassobi">{texts.torihikiJisseki.hassobi}</option>
                  </select>
                  <select id="sortFlg" className={adminStyles.sort} onChange={handleSortFlgChange}>
                    <option value="asc">{texts.label.asc}</option>
                    <option value="desc">{texts.label.desc}</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="text-right flex flex-col sm:flex-row">
              <label className="sm:ml-4 flex items-center">
                {texts.torihikiJisseki.rakusatsusu}:
                <span className="text-xl font-bold mx-1">
                  {displayRakusatsuList.length}
                  {texts.label.resultCount}
                </span>
              </label>
              <label className="sm:ml-2 flex items-center">
                {texts.torihikiJisseki.rakusatsuTotalPrice}:
                <span className="text-xl font-bold mx-1">
                  <CurrencyYenIcon />
                  {displayRakusatsuList
                    .reduce((acc, result) => {
                      const price = parseFloat(result.rakusatsuTotalPrice.replace(/,/g, "")) || 0;
                      return acc + price;
                    }, 0)
                    .toLocaleString()}
                </span>
              </label>
            </div>
          </div>

          <div className="xl:flex justify-end">
            {executionPermission(207, 2) ? (
              <>
                <div className="flex flex-col sm:flex-row justify-start sm:justify-between sm:items-center p-1">
                  <label className="sm:items-center ">{texts.torihikiJisseki.updateDate}</label>
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
                  <RegistButton
                    label={texts.button.regist}
                    onClick={() => handleDateUpdate(true)}
                  />
                </div>
              </>
            ) : null}
          </div>

          <TorihikiJissekiTableComponent
            data={displayRakusatsuList}
            selectedIds={rakusatsuSelectedIds}
            selectAll={rakusatsuSelectAll}
            onSelectAll={rakusatsuHandleSelectAll}
            onSelect={rakusatsuHandleSelect}
            onRowClick={handleRowClick}
            columns={[
              { key: "sku", label: texts.goods.sku, width: "w-48" },
              { key: "lot", label: texts.goods.lot, width: "w-24" },
              { key: "goodsName", label: texts.goods.goodsName },
              {
                key: "rakusatsuPrice",
                label: texts.torihikiJisseki.rakusatsuPrice,
                width: "w-48",
                align: "right",
              },
              {
                key: "rakusatsuTesuryoPrice",
                label: texts.torihikiJisseki.rakusatsuTesuryoPrice,
                width: "w-48",
                align: "right",
              },
              {
                key: "rakusatsuTotalPrice",
                label: texts.torihikiJisseki.rakusatsuTotalPrice,
                width: "w-48",
                align: "right",
              },
              {
                key: "rakusatsuKessaibi",
                label: texts.torihikiJisseki.nyukinbi,
                width: "w-32",
                align: "center",
              },
              {
                key: "rakusatsuHassobi",
                label: texts.torihikiJisseki.hassobi,
                width: "w-32",
                align: "center",
              },
            ]}
            isRakusatsu={true}
          />
        </div>
      ) : (
        <p></p>
      )}
      {displayShuppinList && displayShuppinList.length > 0 ? (
        <div className={styles.container}>
          <div className="flex flex-col sm:flex-row justify-start sm:justify-between sm:items-center p-1">
            <div className="text-left">
              <label className={styles.title}>{texts.torihikiJisseki.shuppinMeisai}</label>
              <div className={adminStyles.resultContainer}>
                <div className={adminStyles.resultRow}>
                  <label className={adminStyles.resultLabel}>{texts.label.sort}</label>
                  <select
                    id="sortName"
                    className={adminStyles.sort}
                    value={shuppinSortName}
                    onChange={handleShuppinSortNameChange}
                  >
                    <option value="lot">{texts.goods.lot}</option>
                    <option value="sku">{texts.goods.sku}</option>
                    <option value="rakusatsuPrice">{texts.torihikiJisseki.shuppinPrice}</option>
                    <option value="shuppinKessaibi">{texts.torihikiJisseki.shiharaibi}</option>
                  </select>
                  <select
                    id="sortFlg"
                    className={adminStyles.sort}
                    onChange={handleShuppinSortFlgChange}
                  >
                    <option value="asc">{texts.label.asc}</option>
                    <option value="desc">{texts.label.desc}</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="text-right flex flex-col sm:flex-row">
              <label className="sm:ml-4 flex items-center">
                {texts.torihikiJisseki.shuppinsu}:
                <span className="text-xl font-bold mx-1">
                  {displayShuppinList.length}
                  {texts.label.resultCount}
                </span>
              </label>
              <label className="sm:ml-4 flex items-center">
                {texts.torihikiJisseki.rakusatsusu}:
                <span className="text-xl font-bold mx-1">
                  {displayShuppinList.filter((result) => result.rakusatsuUserId !== "").length}
                  {texts.label.resultCount}
                </span>
              </label>
              <label className="sm:ml-2 flex items-center">
                {texts.torihikiJisseki.shuppinTotalPrice}:
                <span className="text-xl font-bold mx-1">
                  <CurrencyYenIcon />
                  {displayShuppinList
                    .reduce((acc, result) => {
                      const price = parseFloat(result.shuppinTotalPrice.replace(/,/g, "")) || 0;
                      return acc + price;
                    }, 0)
                    .toLocaleString()}
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

          <TorihikiJissekiTableComponent
            data={displayShuppinList}
            selectedIds={shuppinSelectedIds}
            selectAll={shuppinSelectAll}
            onSelectAll={shuppinHandleSelectAll}
            onSelect={shuppinHandleSelect}
            onRowClick={handleRowClick}
            columns={[
              {
                key: "sku",
                label: texts.goods.sku,
                width: "w-48",
              },
              {
                key: "lot",
                label: texts.goods.lot,
                width: "w-24",
              },
              {
                key: "goodsName",
                label: texts.goods.goodsName,
              },
              {
                key: "shuppinPrice",
                label: texts.torihikiJisseki.shuppinPrice,
                width: "w-48",
                align: "right",
              },
              {
                key: "shuppinTesuryoPrice",
                label: texts.torihikiJisseki.shuppinTesuryoPrice,
                width: "w-48",
                align: "right",
              },
              {
                key: "shuppinTotalPrice",
                label: texts.torihikiJisseki.shuppinTotalPrice,
                width: "w-48",
                align: "right",
              },
              {
                key: "shuppinKessaibi",
                label: texts.torihikiJisseki.shiharaibi,
                width: "w-32",
                align: "center",
              },
            ]}
            isRakusatsu={false}
          />
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default withAdminLayout(Page);
