import { GetServerSideProps } from "next";
import React from "react";
import { toast } from "react-toastify";
import { texts } from "@/config/texts.ja";
import Image from "next/image";
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
import { useToMemberRegist } from "@/hooks/moveScreen/useToMemberRegist";
import { useModalManagement } from "@/hooks/useModalManagement";
import { BidHistoryModal } from "@/components/ui/dialog/bidHistoryModal";
import { FavoriteModal } from "@/components/ui/dialog/favoriteModal";
//API
import { useGoodsSearchAPI } from "@/hooks/api/admin/goods/useGoodsSearchAPI";
import { useGoodsSearchCountAPI } from "@/hooks/api/admin/goods/useGoodsSearchCountAPI";
import { useGoodsCsvAPI } from "@/hooks/api/admin/goods/useGoodsCsvAPI";
import { useGoodsCsvForAdminGoodsRegistAPI } from "@/hooks/api/admin/goods/useGoodsCsvForAdminGoodsRegistAPI";
import { useGoodsCsvForTesuryoAPI } from "@/hooks/api/admin/goods/useGoodsCsvForTesuryoAPI";
import { useGoodsSearchParams } from "@/hooks/searchParams/admin/useGoodsSearchParams";
//型定義
import { TAdminGoodsSelect } from "@/types/admin/goods/search";
import { PageProps } from "@/types/admin/adminPage";
//コンポーネント
import { CategoryListPullDown } from "@/components/ui/pulldowns/CategoryPullDown";
import { KaisaiListPullDown } from "@/components/ui/pulldowns/KaisaiListPullDown";
import { KekkaStatusPullDown } from "@/components/ui/pulldowns/KekkaStatusPullDown";
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
import { GoodsSearchResultTable } from "@/components/admin/goods/GoodsSearchResultTable";

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminGoodsList,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect } = useCommonSetup();

  useKengenRedirect(kengen, 202);
  const { executionPermission } = useExecutionPermission(kengen);

  // モーダル管理
  const {
    isBidHistoryModalOpen,
    isFavoriteModalOpen,
    selectedBidHistoryGoodsId,
    selectedBidHistoryAuctionSeq,
    selectedFavoriteGoodsId,
    openBidHistoryModal,
    closeBidHistoryModal,
    openFavoriteModal,
    closeFavoriteModal,
  } = useModalManagement();

  const { goodsParams, formChange, resetForm } = useGoodsSearchParams();

  const [goodsData, setGoodsData] = useState<TAdminGoodsSelect[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const handleCategoryChange = (name: string, value: string) => {
    setSelectedCategory(value);
    formChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
  };
  const [selectedKekkaStatus, setSelectedKekkaStatus] = useState<string | null>(null);
  const handleKekkaStatusChange = (name: string, value: string) => {
    setSelectedKekkaStatus(value);
    formChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
  };
  const [selectedKaisai, setSelectedKaisai] = useState<string>("");
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
  };
  const itemsPerPage = Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`);
  const { data, errors, goodsSearchAPI } = useGoodsSearchAPI();
  const { count, goodsSearchCountAPI } = useGoodsSearchCountAPI();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const formSearch = async () => {
    // 検索時にチェックボックス選択をリセット
    resetSelection();
    setGoodsData([]);
    setCurrentPage(1);
    const params = {
      ...goodsParams,
      pageNumber: 1,
      pageSize: itemsPerPage,
    };
    await goodsSearchAPI(params);
    await goodsSearchCountAPI(params);
  };

  const formClear = () => {
    setSelectedKaisai("");
    setSelectedCategory("");
    setSelectedKekkaStatus("");
    setSelectAll(false);
    setSelectedIds([]);
    setGoodsData([]);
    resetForm();
  };

  useEffect(() => {
    if (data) {
      setGoodsData(data);
    }
  }, [data]);

  useEffect(() => {
    if (errors) {
      setFormErrors(errors);
    }
  }, [errors]);

  const { data: allSelectData, goodsSearchAPI: allSelectGoodsSearchAPI } = useGoodsSearchAPI();
  const [allGoodsData, setAllGoodsData] = useState<TAdminGoodsSelect[]>([]);
  const fetchAllIds = async () => {
    const params = {
      ...goodsParams,
      pageNumber: 1,
      pageSize: count,
    };
    await allSelectGoodsSearchAPI(params);
  };
  useEffect(() => {
    if (allSelectData) {
      setAllGoodsData(allSelectData);
    }
  }, [allSelectData]);

  //ソート設定
  const { sortName, handleSortNameChange, handleSortFlgChange } = useSort({
    searchAPI: goodsSearchAPI,
    itemsPerPage,
    params: goodsParams,
  });
  const { currentPage, setCurrentPage, handlePageChange } = usePagination({
    itemsPerPage,
    searchAPI: goodsSearchAPI,
    searchParams: goodsParams,
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
    goodsData.map((goods) => goods.goodsId),
    allGoodsData.map((goods) => goods.goodsId),
    fetchAllIds
  );
  //商品登録画面に遷移
  const { toGoodsRegist } = useToGoodsRegist(kengen);
  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>, goodsId: number) => {
    toGoodsRegist(e, goodsId);
  };
  //会員登録画面に遷移
  const { toMemberRegist } = useToMemberRegist(kengen);
  const handleRowUserClick = (e: React.MouseEvent<HTMLElement>, userId: string) => {
    toMemberRegist(e, Number(userId));
  };
  //CSV出力
  const { goodsCsv } = useGoodsCsvAPI();
  const handleCsvExport = () => {
    if (selectedIds.length === 0) {
      toast.error(texts.message.selectAtLeastOne);
      return;
    }
    goodsCsv(selectedIds);
  };

  //商品一括取込用CSV出力
  const { goodsCsvForAdminGoodsRegist } = useGoodsCsvForAdminGoodsRegistAPI();
  const handleCsvForAdminGoodsRegistExport = () => {
    if (selectedIds.length === 0) {
      toast.error(texts.message.selectAtLeastOne);
      return;
    }
    goodsCsvForAdminGoodsRegist(selectedIds);
  };
  //落札手数料取込用CSV出力
  const { goodsCsvForTesuryo } = useGoodsCsvForTesuryoAPI();
  const handleCsvForTesuryoExport = () => {
    if (selectedIds.length === 0) {
      toast.error(texts.message.selectAtLeastOne);
      return;
    }
    goodsCsvForTesuryo(selectedIds);
  };

  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredShuppin, setHoveredShuppin] = useState<number | null>(null); // 出品者ホバー状態
  const [hoveredRakusatsu, setHoveredRakusatsu] = useState<number | null>(null); // 落札者ホバー状態
  const [hoveredBidCount, setHoveredBidCount] = useState<number | null>(null); // 入札数ホバー状態
  const [hoveredFavoriteCount, setHoveredFavoriteCount] = useState<number | null>(null); // お気に入り数ホバー状態
  const handleMouseEnterRow = (goodsId: number) => {
    setHoveredRow(goodsId);
  };

  const handleMouseLeaveRow = () => {
    setHoveredRow(null);
  };

  const handleMouseEnterShuppin = (goodsId: number) => {
    setHoveredShuppin(goodsId);
  };

  const handleMouseLeaveShuppin = () => {
    setHoveredShuppin(null);
  };

  const handleMouseEnterRakusatsu = (goodsId: number) => {
    setHoveredRakusatsu(goodsId);
  };

  const handleMouseLeaveRakusatsu = () => {
    setHoveredRakusatsu(null);
  };

  const handleMouseEnterBidCount = (goodsId: number) => {
    setHoveredBidCount(goodsId);
  };

  const handleMouseLeaveBidCount = () => {
    setHoveredBidCount(null);
  };

  const handleBidCountClick = (
    e: React.MouseEvent<HTMLElement>,
    goodsId: number,
    auctionSeq: number
  ) => {
    e.stopPropagation(); // 行のクリックイベントを止める
    openBidHistoryModal(goodsId, auctionSeq);
  };

  const handleMouseEnterFavoriteCount = (goodsId: number) => {
    setHoveredFavoriteCount(goodsId);
  };

  const handleMouseLeaveFavoriteCount = () => {
    setHoveredFavoriteCount(null);
  };

  const handleFavoriteCountClick = (e: React.MouseEvent<HTMLElement>, goodsId: number) => {
    e.stopPropagation(); // 行のクリックイベントを止める
    openFavoriteModal(goodsId);
  };

  return (
    <div>
      <AdminPageHeader title={texts.menu.adminGoodsList} />
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
              type="number"
              id="goodsId"
              name="goodsId"
              maxLength={9}
              value={goodsParams.goodsId}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="goodsName">{texts.goods.goodsName}</label>
            <input
              id="goodsName"
              name="goodsName"
              value={goodsParams.goodsName}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="goodsId">{texts.goods.sku}</label>
            <input
              id="sku"
              name="sku"
              maxLength={9}
              value={goodsParams.sku}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="category">{texts.goods.category}</label>
            <CategoryListPullDown
              onChange={(value) => handleCategoryChange("categorySeq", value)}
              selectedId={selectedCategory !== null ? String(selectedCategory) : ""}
            />
          </div>
          <div className={formSearchStyles.formRow}>
            <div className={formSearchStyles.formItemHalfWidth}>
              <label htmlFor="lotFrom">{texts.goods.lot}</label>
              <input
                type="number"
                id="lotFrom"
                name="lotFrom"
                maxLength={9}
                value={goodsParams.lotFrom}
                onChange={formChange}
              />
            </div>
            <div className={formSearchStyles.tilde}>{texts.common.tilde}</div>
            <div className={formSearchStyles.formItemHalfWidth}>
              <input
                type="number"
                id="lotTo"
                name="lotTo"
                maxLength={9}
                value={goodsParams.lotTo}
                onChange={formChange}
              />
            </div>
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="freeWord">{texts.common.freeWord}</label>
            <input
              id="freeWord"
              name="freeWord"
              value={goodsParams.freeWord}
              onChange={formChange}
            />
          </div>

          <div className={formSearchStyles.formItem}>
            <label htmlFor="kekkaStatus">{texts.goods.kekkaStatus}</label>
            <KekkaStatusPullDown
              onChange={(value) => handleKekkaStatusChange("kekkaStatus", value)}
              selectedId={selectedKekkaStatus !== null ? String(selectedKekkaStatus) : ""}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="shuppinUserId">{texts.goods.shuppinUserId}</label>
            <input
              type="number"
              id="shuppinUserId"
              name="shuppinUserId"
              maxLength={9}
              value={goodsParams.shuppinUserId}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="shuppinUserName">
              {texts.goods.shuppinUserName}/{texts.goods.shuppinCompanyName}
            </label>
            <input
              id="shuppinUserName"
              name="shuppinUserName"
              value={goodsParams.shuppinUserName}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="rakusatsuUserId">{texts.goods.rakusatsuUserId}</label>
            <input
              type="number"
              id="rakusatsuUserId"
              name="rakusatsuUserId"
              maxLength={9}
              value={goodsParams.rakusatsuUserId}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="rakusatsuUserName">
              {texts.goods.rakusatsuUserName}/{texts.goods.rakusatsuCompanyName}
            </label>
            <input
              id="rakusatsuUserName"
              name="rakusatsuUserName"
              value={goodsParams.rakusatsuUserName}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="teishiFlg">{texts.label.image}</label>
            <select
              id="imageFlg"
              name="imageFlg"
              value={goodsParams.imageFlg}
              onChange={formChange}
            >
              <option value="">---</option>
              <option value="1">{texts.label.torokuzumi}</option>
              <option value="0">{texts.label.mitoroku}</option>
            </select>
          </div>
        </div>
        <div className="text-right  mt-2">
          <SearchButton onClick={formSearch} />
          <ClearButton onClick={formClear} />
        </div>
      </div>
      {goodsData && goodsData.length > 0 ? (
        <div>
          <AdminResultHeader
            count={count}
            sortName={sortName}
            onSortNameChange={handleSortNameChange}
            onSortFlgChange={handleSortFlgChange}
            sortOptions={[
              { value: "lot", label: texts.goods.lot },
              { value: "sku", label: texts.goods.sku },
              { value: "startPrice", label: texts.goods.startPrice },
              { value: "currentPrice", label: texts.goods.currentPrice },
              { value: "favoriteCount", label: texts.goods.favoriteCount },
              { value: "bidCount", label: texts.goods.bidCount },
              { value: "shuppinUserId", label: texts.goods.shuppinUserName },
              { value: "rakusatsuUserId", label: texts.goods.rakusatsuUserName },
            ]}
            ascText={texts.label.asc}
            descText={texts.label.desc}
          >
            {executionPermission(202, 2) && (
              <>
                <div>
                  <OutPutButton onClick={handleCsvExport} />
                  <OutPutButton
                    onClick={handleCsvForAdminGoodsRegistExport}
                    text={texts.button.csvForAdminGoodsRegist}
                  />
                  <OutPutButton
                    onClick={handleCsvForTesuryoExport}
                    text={texts.button.csvForTesuryo}
                  />
                </div>
                <div className="text-right">
                  <div>
                    <span className="text-sm">
                      {texts.common.asterisk}
                      {texts.button.csv}
                      {texts.common.colon}
                      {texts.label.csvBtn_note_1}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm">
                      {texts.common.asterisk}
                      {texts.button.csvForAdminGoodsRegist},{texts.button.csvForTesuryo}
                      {texts.common.colon}
                      {texts.label.csvForAdminGoodsRegistBtn_note_1}
                    </span>
                  </div>
                </div>
              </>
            )}
          </AdminResultHeader>
          <GoodsSearchResultTable
            goodsData={goodsData}
            selectAll={selectAll}
            selectedIds={selectedIds}
            hoveredRow={hoveredRow}
            hoveredShuppin={hoveredShuppin}
            hoveredRakusatsu={hoveredRakusatsu}
            hoveredBidCount={hoveredBidCount}
            hoveredFavoriteCount={hoveredFavoriteCount}
            onSelectAll={handleSelectAll}
            onSelect={handleSelect}
            onRowClick={handleRowClick}
            onUserClick={handleRowUserClick}
            onMouseEnterRow={handleMouseEnterRow}
            onMouseLeaveRow={handleMouseLeaveRow}
            onMouseEnterShuppin={handleMouseEnterShuppin}
            onMouseLeaveShuppin={handleMouseLeaveShuppin}
            onMouseEnterRakusatsu={handleMouseEnterRakusatsu}
            onMouseLeaveRakusatsu={handleMouseLeaveRakusatsu}
            onMouseEnterBidCount={handleMouseEnterBidCount}
            onMouseLeaveBidCount={handleMouseLeaveBidCount}
            onBidCountClick={handleBidCountClick}
            onMouseEnterFavoriteCount={handleMouseEnterFavoriteCount}
            onMouseLeaveFavoriteCount={handleMouseLeaveFavoriteCount}
            onFavoriteCountClick={handleFavoriteCountClick}
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

      <BidHistoryModal
        isOpen={isBidHistoryModalOpen}
        onClose={closeBidHistoryModal}
        goodsId={selectedBidHistoryGoodsId}
        auctionSeq={selectedBidHistoryAuctionSeq}
      />

      <FavoriteModal
        isOpen={isFavoriteModalOpen}
        onClose={closeFavoriteModal}
        goodsId={selectedFavoriteGoodsId}
      />
    </div>
  );
};

export default withAdminLayout(Page);
