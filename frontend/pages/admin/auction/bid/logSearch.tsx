import { GetServerSideProps } from "next";
import { toast } from "react-toastify";
import { texts } from "@/config/texts.ja";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminLayout from "@/hocs/withAdminLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useSort } from "@/hooks/sort/useSort";
import { usePagination } from "@/hooks/paging/usePagination";
import { useCheckboxSelection } from "@/hooks/useCheckboxSelection";
import { useKengenRedirect } from "@/hooks/useKengenRedirect";
import { useExecutionPermission } from "@/hooks/useExecutionPermission";
import { useToGoodsRegist } from "@/hooks/moveScreen/useToGoodsRegist";
//API
import { useBidLogSearchAPI } from "@/hooks/api/admin/bid/useBidLogSearchAPI";
import { useBidLogSearchCountAPI } from "@/hooks/api/admin/bid/useBidLogSearchCountAPI";
import { useBidLogCsvAPI } from "@/hooks/api/admin/bid/useBidLogCsvAPI";
import { useBidLogSearchParams } from "@/hooks/searchParams/admin/useBidLogSearchParams";
import { useAuctionGetInfoAPI } from "@/hooks/api/admin/auction/useAuctionGetInfoAPI";
//型定義
import { TAdminLogBidSelect } from "@/types/admin/goods/bid/logSearch";
import { PageProps } from "@/types/admin/adminPage";
//コンポーネント
import { KaisaiListPullDown } from "@/components/ui/pulldowns/KaisaiListPullDown";
import { BidKbnPullDown } from "@/components/ui/pulldowns/BidKbnPullDown";
import { RequiredMark } from "@/components/ui/marks/RequiredMark";
//ボタン
import { SearchButton } from "@/components/ui/buttons/admin/searchButton";
import { ClearButton } from "@/components/ui/buttons/admin/clearButton";
import { OutPutButton } from "@/components/ui/buttons/admin/outputButton";
//スタイル
import formSearchStyles from "@/styles/admin/FormSearch.module.css";

//共通コンポーネント
import { AdminPageHeader } from "@/components/admin/common/AdminPageHeader";
import { AdminPagination } from "@/components/admin/common/AdminPagination";
import { AdminResultHeader } from "@/components/admin/common/AdminResultHeader";
import { BidLogSearchResultTable } from "@/components/admin/bid/BidLogSearchResultTable";

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminBidLogList,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, texts } = useCommonSetup();

  useKengenRedirect(kengen, 204);
  const { executionPermission } = useExecutionPermission(kengen);

  const { bidLogParams, formChange, resetForm } = useBidLogSearchParams();

  const [bidList, setBidList] = useState<TAdminLogBidSelect[]>([]);
  const [selectedKaisai, setSelectedKaisai] = useState<string>("");
  const [selectedBidKbn, setSelectedBidKbn] = useState<string>("");

  const [spnKbn, setSpnkbn] = useState<string>("");
  const [searchSpnKbn, setSearchSpnKbn] = useState<string>("");
  const { data: auctionData, auctionGetInfo } = useAuctionGetInfoAPI();
  const handleKaisaiChange = (name: string, value: string) => {
    setSelectedKaisai(value);
    formChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
    // エラーメッセージが存在する場合、対応するエラーメッセージをクリア
    if (errors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
    auctionGetInfo(Number(value));
  };

  const handleBidKbnChange = (name: string, value: string) => {
    setSelectedBidKbn(value);
    formChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
    // エラーメッセージが存在する場合、対応するエラーメッセージをクリア
    if (errors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };
  useEffect(() => {
    if (auctionData && auctionData.spnKbn !== null && auctionData.spnKbn !== undefined) {
      setSpnkbn(auctionData.spnKbn);
    }
  }, [auctionData]);

  const itemsPerPage = Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`);
  const { data, errors, bidLogSearchAPI } = useBidLogSearchAPI();
  const { count, bidLogSearchCountAPI } = useBidLogSearchCountAPI();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const formSearch = async () => {
    // 検索時にチェックボックス選択をリセット
    resetSelection();
    setBidList([]);
    setCurrentPage(1);
    setSearchSpnKbn(spnKbn);
    const params = {
      ...bidLogParams,
      pageNumber: 1,
      pageSize: itemsPerPage,
    };
    await bidLogSearchAPI(params);
    await bidLogSearchCountAPI(params);
  };

  const formClear = () => {
    resetForm();
    setSelectedKaisai("");
    setSelectedBidKbn("");
    setSearchSpnKbn("");
    setSelectAll(false);
    setSelectedIds([]);
    setBidList([]);
  };

  useEffect(() => {
    if (data) {
      setBidList(data);
    }
  }, [data]);

  useEffect(() => {
    if (errors) {
      setFormErrors(errors);
    }
  }, [errors]);

  const { data: allSelectData, bidLogSearchAPI: allSelectSearchAPI } = useBidLogSearchAPI();
  const [allGoodsData, setAllGoodsData] = useState<TAdminLogBidSelect[]>([]);
  const fetchAllIds = async () => {
    const params = {
      ...bidLogParams,
      pageNumber: 1,
      pageSize: count,
    };
    await allSelectSearchAPI(params);
  };
  useEffect(() => {
    if (allSelectData) {
      setAllGoodsData(allSelectData);
    }
  }, [allSelectData]);

  const { sortName, handleSortNameChange, handleSortFlgChange } = useSort({
    searchAPI: bidLogSearchAPI,
    itemsPerPage,
    params: bidLogParams,
  });
  const { currentPage, setCurrentPage, handlePageChange } = usePagination({
    itemsPerPage,
    searchAPI: bidLogSearchAPI,
    searchParams: bidLogParams,
  });
  //チェックボックス
  const {
    selectAll,
    setSelectAll,
    selectedIds,
    setSelectedIds,
    handleSelectAll,
    handleSelect,
    resetSelection,
  } = useCheckboxSelection(
    bidList.map((bid) => bid.seq),
    allGoodsData.map((bid) => bid.seq),
    fetchAllIds
  );

  //商品登録画面に遷移
  const { toGoodsRegist } = useToGoodsRegist(kengen);
  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>, goodsId: number) => {
    toGoodsRegist(e, goodsId);
  };
  //会員登録画面に遷移
  const handleRowUserClick = (e: React.MouseEvent<HTMLElement>, userId: string) => {
    if (e.target instanceof HTMLInputElement) return;
    const hasClickKengen = kengen.some(
      (k) => k.screenId === 101 && (k.kengenKbn === 1 || k.kengenKbn === 2)
    );
    if (hasClickKengen) {
      window.open(`/admin/member/register?userId=${userId}`, "_blank");
    }
  };

  //CSV出力
  const { bidLogCsv } = useBidLogCsvAPI();
  const handleCsvExport = () => {
    if (selectedIds.length === 0) {
      toast.error(texts.message.selectAtLeastOne);
      return;
    }
    bidLogCsv(selectedKaisai, selectedIds);
  };

  return (
    <div>
      <AdminPageHeader title={texts.menu.adminBidLogList} />
      <div className={formSearchStyles.formContainer}>
        <div className={formSearchStyles.formGrid}>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="auction">
              <RequiredMark />
              {texts.goods.auctionName}
            </label>
            <KaisaiListPullDown
              onChange={(value) => handleKaisaiChange("auctionSeq", value)}
              selectedId={selectedKaisai !== null ? String(selectedKaisai) : ""}
              kaisaiStatus={0}
              defaultSetOption={1}
            />
            {formErrors?.auctionSeq && <p className="error-message">{formErrors.auctionSeq}</p>}
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="goodsId">{texts.goods.goodsId}</label>
            <input
              id="goodsId"
              name="goodsId"
              maxLength={9}
              value={bidLogParams.goodsId}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="goodsId">{texts.goods.sku}</label>
            <input
              id="sku"
              name="sku"
              maxLength={9}
              value={bidLogParams.sku}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="goodsName">{texts.goods.goodsName}</label>
            <input
              id="goodsName"
              name="goodsName"
              value={bidLogParams.goodsName}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formRow}>
            <div className={formSearchStyles.formItemHalfWidth}>
              <label htmlFor="lotFrom">{texts.goods.lot}</label>
              <input
                id="lotFrom"
                name="lotFrom"
                maxLength={9}
                value={bidLogParams.lotFrom}
                onChange={formChange}
              />
            </div>
            <div className={formSearchStyles.tilde}>{texts.common.tilde}</div>
            <div className={formSearchStyles.formItemHalfWidth}>
              <input
                id="lotTo"
                name="lotTo"
                maxLength={9}
                value={bidLogParams.lotTo}
                onChange={formChange}
              />
            </div>
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="userId">{texts.member.userId}</label>
            <input
              id="userId"
              name="userId"
              maxLength={9}
              value={bidLogParams.userId}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="userName">
              {texts.member.userName}/{texts.member.companyName}
            </label>
            <input
              id="userName"
              name="userName"
              value={bidLogParams.userName}
              onChange={formChange}
            />
          </div>
          {spnKbn === "1" && (
            <div className={formSearchStyles.formItem}>
              <label htmlFor="paddleNo">{texts.paddle.paddleNo}</label>
              <input
                id="paddleNo"
                name="paddleNo"
                maxLength={9}
                value={bidLogParams.paddleNo}
                onChange={formChange}
              />
            </div>
          )}
          {(spnKbn === "1" || spnKbn === "2") && (
            <div className={formSearchStyles.formItem}>
              <label htmlFor="bidKbn">{texts.bid.bidKbn}</label>
              <BidKbnPullDown
                onChange={(value) => handleBidKbnChange("bidKbn", value)}
                selectedId={selectedBidKbn !== null ? String(selectedBidKbn) : ""}
                spnKbn={spnKbn}
              />
            </div>
          )}
        </div>
        <div className="text-right mt-2">
          <SearchButton onClick={formSearch} />
          <ClearButton onClick={formClear} />
        </div>
      </div>
      {bidList && bidList.length > 0 ? (
        <div>
          <AdminResultHeader
            count={count}
            sortName={sortName}
            onSortNameChange={handleSortNameChange}
            onSortFlgChange={handleSortFlgChange}
            sortOptions={[
              { value: "lot", label: texts.goods.lot },
              { value: "userId", label: texts.member.userName },
              { value: "bidPrice", label: texts.bid.bidPrice },
              { value: "bidTime", label: texts.bid.bidTime },
            ]}
            ascText={texts.label.asc}
            descText={texts.label.desc}
          >
            {executionPermission(204, 2) && (
              <div>
                <OutPutButton onClick={handleCsvExport} />
              </div>
            )}
          </AdminResultHeader>
          <BidLogSearchResultTable
            bidList={bidList}
            selectAll={selectAll}
            selectedIds={selectedIds}
            searchSpnKbn={searchSpnKbn}
            onSelectAll={handleSelectAll}
            onSelect={handleSelect}
            onRowClick={handleRowClick}
            onUserClick={handleRowUserClick}
            texts={texts}
          />
          <AdminPagination
            count={count}
            page={currentPage}
            onChange={handlePageChange}
            itemsPerPage={itemsPerPage}
          />
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default withAdminLayout(Page);
