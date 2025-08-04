import { GetServerSideProps } from "next";
import React from "react";
import { toast } from "react-toastify";
import { texts } from "@/config/texts.ja";
import Image from "next/image";
import Pagination from "@mui/material/Pagination";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminLayout from "@/hocs/withAdminLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useSort } from "@/hooks/useSort";
import { usePagination } from "@/hooks/usePagination";
import { useCheckboxSelection } from "@/hooks/useCheckboxSelection";
import { useKengenRedirect } from "@/hooks/useKengenRedirect";
import { useExecutionPermission } from "@/hooks/useExecutionPermission";
import { useToGoodsRegist } from "@/hooks/moveScreen/useToGoodsRegist";
import { useToMemberRegist } from "@/hooks/moveScreen/useToMemberRegist";
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
import breadcrumbStyles from "@/styles/breadcrumb.module.css";
import formSearchStyles from "@/styles/admin/FormSearch.module.css";
import adminStyles from "@/styles/admin/AdminCommon.module.css";

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
    setSelectAll(false);
    setSelectedIds([]);
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
  const { selectAll, setSelectAll, selectedIds, setSelectedIds, handleSelectAll, handleSelect } =
    useCheckboxSelection(
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
  const [isBidHistoryModalOpen, setIsBidHistoryModalOpen] = useState(false);
  const [selectedBidHistoryGoodsId, setSelectedBidHistoryGoodsId] = useState<number>(0);
  const [selectedBidHistoryAuctionSeq, setSelectedBidHistoryAuctionSeq] = useState<number>(0);
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);
  const [selectedFavoriteGoodsId, setSelectedFavoriteGoodsId] = useState<number>(0);
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
    setSelectedBidHistoryGoodsId(goodsId);
    setSelectedBidHistoryAuctionSeq(auctionSeq);
    setIsBidHistoryModalOpen(true);
  };

  const handleBidHistoryModalClose = () => {
    setIsBidHistoryModalOpen(false);
  };

  const handleMouseEnterFavoriteCount = (goodsId: number) => {
    setHoveredFavoriteCount(goodsId);
  };

  const handleMouseLeaveFavoriteCount = () => {
    setHoveredFavoriteCount(null);
  };

  const handleFavoriteCountClick = (e: React.MouseEvent<HTMLElement>, goodsId: number) => {
    e.stopPropagation(); // 行のクリックイベントを止める
    setSelectedFavoriteGoodsId(goodsId);
    setIsFavoriteModalOpen(true);
  };

  const handleFavoriteModalClose = () => {
    setIsFavoriteModalOpen(false);
  };

  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminGoodsList}</span>
      </div>
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
        </div>
        <div className="text-right  mt-2">
          <SearchButton onClick={formSearch} />
          <ClearButton onClick={formClear} />
        </div>
      </div>
      {goodsData && goodsData.length > 0 ? (
        <div>
          <div className="block sm:flex flex-col sm:flex-row justify-between items-center p-4 ">
            <div className="text-left">
              <div className={adminStyles.resultContainer}>
                <div className={adminStyles.resultRow}>
                  <span className={adminStyles.resultLabel}>{texts.label.resultKekka}</span>
                  <span>
                    {count} {texts.label.resultCount}
                  </span>
                </div>
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
                    <option value="startPrice">{texts.goods.startPrice}</option>
                    <option value="currentPrice">{texts.goods.currentPrice}</option>
                    <option value="favoriteCount">{texts.goods.favoriteCount}</option>
                    <option value="bidCount">{texts.goods.bidCount}</option>
                    <option value="shuppinUserId">{texts.goods.shuppinUserName}</option>
                    <option value="rakusatsuUserId">{texts.goods.rakusatsuUserName}</option>
                  </select>
                  <select id="sortFlg" className={adminStyles.sort} onChange={handleSortFlgChange}>
                    <option value="asc">{texts.label.asc}</option>
                    <option value="desc">{texts.label.desc}</option>
                  </select>
                </div>
              </div>
            </div>
            {executionPermission(202, 2) && (
              <div className="text-right">
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
              </div>
            )}
          </div>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th rowSpan={2} className="py-2 px-4 border-b">
                  <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                </th>
                <th rowSpan={2} className="py-2 px-4 w-20 border-b">
                  {texts.goods.thumbnailImageUrl}
                </th>
                <th className="py-2 px-4 border-b">{texts.goods.goodsId}</th>
                <th className="py-2 px-4 border-b">{texts.goods.sku}</th>
                <th rowSpan={2} className="py-2 px-4 border-b w-24">
                  {texts.goods.lot}
                </th>
                {goodsData[0].spnKbn === "1" || goodsData[0].spnKbn === "2" ? (
                  <>
                    <th rowSpan={2} className="py-2 px-4 border-b w-44">
                      {texts.goods.startPrice}
                    </th>
                    <th rowSpan={2} className="py-2 px-4 border-b w-44">
                      {texts.goods.rakusatsuPrice}
                    </th>
                  </>
                ) : (
                  <>
                    <th className="py-2 px-4 border-b w-24">{texts.goods.favoriteCount}</th>
                    <th className="py-2 px-4 border-b w-44">{texts.goods.startPrice}</th>
                    <th rowSpan={2} className="py-2 px-4 border-b w-96">
                      {texts.auction.bidKikan}
                    </th>
                  </>
                )}
                <th rowSpan={2} className="py-2 px-4 border-b">
                  {texts.goods.kekkaStatus}
                </th>
                <th className="py-2 px-4 border-b">
                  {texts.goods.shuppinUserName}/{texts.goods.shuppinCompanyName}
                </th>
              </tr>
              <tr>
                <th colSpan={2} className="py-2 px-4 border-b">
                  {texts.goods.goodsName}
                </th>
                {goodsData[0].spnKbn === "1" || goodsData[0].spnKbn === "2" ? (
                  <></>
                ) : (
                  <>
                    <th className="py-2 px-4 border-b w-24">{texts.goods.bidCount}</th>
                    <th className="py-2 px-4 border-b w-44">{texts.goods.currentPrice}</th>
                  </>
                )}
                <th className="py-2 px-4 border-b">
                  {texts.goods.rakusatsuUserName}/{texts.goods.rakusatsuCompanyName}
                </th>
              </tr>
            </thead>
            <tbody>
              {goodsData.length > 0 &&
                goodsData.map((result) => (
                  <React.Fragment key={result.goodsId}>
                    <tr
                      className={`cursor-pointer ${
                        hoveredRow === result.goodsId ? "bg-gray-100" : ""
                      }`}
                      onMouseEnter={() => handleMouseEnterRow(result.goodsId)}
                      onMouseLeave={handleMouseLeaveRow}
                      onClick={(e) => handleRowClick(e, result.goodsId)}
                    >
                      <td
                        rowSpan={2}
                        className="py-2 px-4 border-b text-center"
                        onClick={(e) => {
                          e.stopPropagation(); // チェックボックスでイベントを止める
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(result.goodsId)}
                          onChange={() => handleSelect(result.goodsId)}
                        />
                      </td>
                      <td rowSpan={2} className="py-2 px-4 w-20 border-b text-right">
                        <Image
                          src={
                            result.thumbnailImageUrl && result.thumbnailImageUrl.trim() !== ""
                              ? result.thumbnailImageUrl
                              : "/no_image.png"
                          }
                          alt=""
                          width={100}
                          height={100}
                        />
                      </td>
                      <td className="py-2 px-4 border-b text-left">{result.goodsId}</td>
                      <td className="py-2 px-4 border-b text-left">{result.sku}</td>
                      <td rowSpan={2} className="py-2 px-4 border-b text-left w-24">
                        {result.lot}
                      </td>
                      {goodsData[0].spnKbn === "1" || goodsData[0].spnKbn === "2" ? (
                        <>
                          <td rowSpan={2} className="py-2 px-4 border-b text-right w-44">
                            {result.startPrice}
                          </td>
                          <td rowSpan={2} className="py-2 px-4 border-b text-right w-44">
                            {result.rakusatsuPrice}
                          </td>
                        </>
                      ) : (
                        <>
                          <td
                            className={`py-2 px-4 border-b text-right w-24 cursor-pointer ${
                              hoveredFavoriteCount === result.goodsId ? "bg-blue-100" : ""
                            }`}
                            onMouseEnter={() => handleMouseEnterFavoriteCount(result.goodsId)}
                            onMouseLeave={handleMouseLeaveFavoriteCount}
                            onClick={(e) => handleFavoriteCountClick(e, result.goodsId)}
                          >
                            {result.favoriteCount}
                          </td>
                          <td className="py-2 px-4 border-b text-right w-44">
                            {result.startPrice}
                          </td>
                          <td rowSpan={2} className="py-2 px-4 border-b text-right w-96">
                            {result.bidTime}
                          </td>
                        </>
                      )}
                      <td rowSpan={2} className="py-2 px-4 border-b text-left">
                        {result.auctionKekkaStatusStr}
                      </td>
                      <td
                        className={`py-2 px-4 border-b text-left ${
                          hoveredShuppin === result.goodsId ? "bg-blue-100" : ""
                        }`}
                        onMouseEnter={() => handleMouseEnterShuppin(result.goodsId)}
                        onMouseLeave={handleMouseLeaveShuppin}
                        onClick={(e) => handleRowUserClick(e, result.shuppinUserId)} // 出品者名のクリックでイベントを止める
                      >
                        {result.shuppinUserName} {result.shuppinCompanyName}
                      </td>
                    </tr>

                    <tr
                      className={`cursor-pointer ${
                        hoveredRow === result.goodsId ? "bg-gray-100" : ""
                      }`}
                      onMouseEnter={() => handleMouseEnterRow(result.goodsId)}
                      onMouseLeave={handleMouseLeaveRow}
                      onClick={(e) => handleRowClick(e, result.goodsId)}
                    >
                      <td colSpan={2} className="py-2 px-4 border-b text-left">
                        {result.goodsName}
                      </td>
                      {goodsData[0].spnKbn === "1" || goodsData[0].spnKbn === "2" ? (
                        <></>
                      ) : (
                        <>
                          <td
                            className={`py-2 px-4 border-b text-right w-24 cursor-pointer ${
                              hoveredBidCount === result.goodsId ? "bg-blue-100" : ""
                            }`}
                            onMouseEnter={() => handleMouseEnterBidCount(result.goodsId)}
                            onMouseLeave={handleMouseLeaveBidCount}
                            onClick={(e) =>
                              handleBidCountClick(e, result.goodsId, result.auctionSeq)
                            }
                          >
                            {result.bidCount}
                          </td>
                          <td className="py-2 px-4 border-b text-right w-44">
                            {result.currentPrice}
                          </td>
                        </>
                      )}
                      <td
                        className={`py-2 px-4 border-b text-left ${
                          hoveredRakusatsu === result.goodsId ? "bg-blue-100" : ""
                        }`}
                        onMouseEnter={() => handleMouseEnterRakusatsu(result.goodsId)}
                        onMouseLeave={handleMouseLeaveRakusatsu}
                        onClick={(e) => handleRowUserClick(e, result.rakusatsuUserId)} // 落札者名のクリックでイベントを止める
                      >
                        {result.rakusatsuUserName} {result.rakusatsuCompanyName}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
            </tbody>
          </table>
          <div>
            <Pagination
              className={adminStyles.paginationContainer}
              count={Math.max(1, Math.ceil(count / itemsPerPage))}
              page={currentPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        <p></p>
      )}

      <BidHistoryModal
        isOpen={isBidHistoryModalOpen}
        onClose={handleBidHistoryModalClose}
        goodsId={selectedBidHistoryGoodsId}
        auctionSeq={selectedBidHistoryAuctionSeq}
      />

      <FavoriteModal
        isOpen={isFavoriteModalOpen}
        onClose={handleFavoriteModalClose}
        goodsId={selectedFavoriteGoodsId}
      />
    </div>
  );
};

export default withAdminLayout(Page);
