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
import { useBidSearchAPI } from "@/hooks/api/admin/bid/useBidSearchAPI";
import { useBidSearchCountAPI } from "@/hooks/api/admin/bid/useBidSearchCountAPI";
import { useBidCsvAPI } from "@/hooks/api/admin/bid/useBidCsvAPI";
import { useBidSearchParams } from "@/hooks/searchParams/admin/useBidSearchParams";
//型定義
import { TAdminGoodsAuctionBidSelect } from "@/types/admin/goods/bid/search";
import { PageProps } from "@/types/admin/adminPage";
//コンポーネント
import { KaisaiListPullDown } from "@/components/ui/pulldowns/KaisaiListPullDown";
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
import { BidSearchResultTable } from "@/components/admin/bid/BidSearchResultTable";

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminBidList,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, texts } = useCommonSetup();

  useKengenRedirect(kengen, 204);
  const { executionPermission } = useExecutionPermission(kengen);

  const { bidParams, formChange, resetForm } = useBidSearchParams();

  const [bidList, setBidList] = useState<TAdminGoodsAuctionBidSelect[]>([]);
  const [selectedKaisai, setSelectedKaisai] = useState<string>("");

  const handleKaisaiChange = (name: string, value: string) => {
    setSelectedKaisai(value);
    formChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
    if (errors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const itemsPerPage = Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`);
  const { data, errors, bidSearchAPI } = useBidSearchAPI();
  const { count, bidSearchCountAPI } = useBidSearchCountAPI();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const formSearch = async () => {
    // 検索時にチェックボックス選択をリセット
    resetSelection();
    setBidList([]);
    setCurrentPage(1);
    const params = {
      ...bidParams,
      pageNumber: 1,
      pageSize: itemsPerPage,
    };
    await bidSearchAPI(params);
    await bidSearchCountAPI(params);
  };

  useEffect(() => {
    if (data) {
      setBidList(data);
    }
  }, [data]);

  const { data: allSelectData, bidSearchAPI: allSelectSearchAPI } = useBidSearchAPI();
  const [allGoodsData, setAllGoodsData] = useState<TAdminGoodsAuctionBidSelect[]>([]);
  const fetchAllIds = async () => {
    const params = {
      ...bidParams,
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

  useEffect(() => {
    if (errors) {
      setFormErrors(errors);
    }
  }, [errors]);

  const { sortName, handleSortNameChange, handleSortFlgChange } = useSort({
    searchAPI: bidSearchAPI,
    itemsPerPage,
    params: bidParams,
  });
  const { currentPage, setCurrentPage, handlePageChange } = usePagination({
    itemsPerPage,
    searchAPI: bidSearchAPI,
    searchParams: bidParams,
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
    bidList.map((bid) => `${bid.goodsId}-${bid.userId}`),
    allGoodsData.map((bid) => `${bid.goodsId}-${bid.userId}`),
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
  const formClear = () => {
    resetForm();
    setSelectedKaisai("");
    setSelectAll(false);
    setSelectedIds([]);
    setBidList([]);
  };

  //CSV出力
  const { bidCsv } = useBidCsvAPI();
  const handleCsvExport = () => {
    if (selectedIds.length === 0) {
      toast.error(texts.message.selectAtLeastOne);
      return;
    }
    bidCsv(selectedIds);
  };

  return (
    <div>
      <AdminPageHeader title={texts.menu.adminBidList} />
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
              value={bidParams.goodsId}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="goodsName">{texts.goods.goodsName}</label>
            <input
              id="goodsName"
              name="goodsName"
              value={bidParams.goodsName}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="goodsId">{texts.goods.sku}</label>
            <input id="sku" name="sku" maxLength={9} value={bidParams.sku} onChange={formChange} />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="userId">{texts.member.userId}</label>
            <input
              id="userId"
              name="userId"
              maxLength={9}
              value={bidParams.userId}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="userName">{texts.member.userName}</label>
            <input id="userName" name="userName" value={bidParams.userName} onChange={formChange} />
          </div>
          <div className={formSearchStyles.formRow}>
            <div className={formSearchStyles.formItemHalfWidth}>
              <label htmlFor="lotFrom">{texts.goods.lot}</label>
              <input
                id="lotFrom"
                name="lotFrom"
                maxLength={9}
                value={bidParams.lotFrom}
                onChange={formChange}
              />
            </div>
            <div className={formSearchStyles.tilde}>{texts.common.tilde}</div>
            <div className={formSearchStyles.formItemHalfWidth}>
              <input
                id="lotTo"
                name="lotTo"
                maxLength={9}
                value={bidParams.lotTo}
                onChange={formChange}
              />
            </div>
          </div>
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
            {executionPermission(204, 2) && <OutPutButton onClick={handleCsvExport} />}
          </AdminResultHeader>
          <BidSearchResultTable
            bidList={bidList}
            selectAll={selectAll}
            selectedIds={selectedIds}
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
