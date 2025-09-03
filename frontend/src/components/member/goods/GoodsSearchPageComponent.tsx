import React from "react";
import { useSearchParams } from "next/navigation";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useSortHandler } from "@/hooks/sort/useSortHandler";
import { usePageChange } from "@/hooks/paging/usePageChange";
//コンポーネント
import GoodsList from "@/components/member/goods/GoodsListComponent";
import SearchFilter from "@/components/member/common/SearchFilterComponent";
import AuctionInfo from "@/components/member/schedule/AuctionInfoComponent";
import { CategorySearchComponent } from "@/components/member/common/CategorySearchComponent";
import { ResultHeaderComponent } from "@/components/member/common/GoodsResultHeaderComponent";
import { Container } from "@/components/member/layout/MemberContainerComponent";
//API
import { useGoodsSearchAPI } from "@/hooks/api/common/useGoodsSearchAPI";
import { useGoodsCountAPI } from "@/hooks/api/common/useGoodsCountAPI";
import { useGoodsSearchParams } from "@/hooks/searchParams/common/useGoodsSearchParams";
import { useAuctionKeisaiChuSearchAPI } from "@/hooks/api/common/useAuctionKeisaiChuSearchAPI";

import { useSessionExtension } from "@/hooks/useMemberSessionExtension";
//型定義
import { TPageProps } from "@/types/member/memberPage";
import { TGoodsSelect } from "@/types/common/goods";
import { TAuction } from "@/types/common/MtAuction";
//ボタン
import { SearchButton } from "@/components/ui/buttons/member/searchButton";
import { ClearButton } from "@/components/ui/buttons/member/clearButton";
//スタイル
import formSearchStyles from "@/styles/member/FormSearch.module.css";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

interface MemberGoodsSearchPageProps extends TPageProps {
  isLogin: boolean;
  loginUserId: number;
  canBid: boolean;
}

const MemberGoodsSearchPage: React.FC<MemberGoodsSearchPageProps> = ({
  isLogin,
  loginUserId,
  canBid,
}) => {
  const { useState, useEffect, useRouter, texts } = useCommonSetup();
  const router = useRouter();
  const { goodsList, goodsSearchAPI } = useGoodsSearchAPI();
  const { goodsCount, goodsCountAPI } = useGoodsCountAPI();
  const [fetchGoodsList, setFetchGoodsList] = useState<TGoodsSelect[]>([]);
  const { goodsParams, formChange, resetForm } = useGoodsSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const toggleFilter = () => setIsFilterOpen((prev) => !prev);
  const params = useSearchParams();
  const paramsAuctionSeq = params ? params.get("auctionSeq") : null;
  const { auctionKeisaiChuList, auctionKeisaiChuSearchAPI } = useAuctionKeisaiChuSearchAPI();
  const [fetchAuctionData, setFetchAuctionData] = useState<TAuction>();
  useEffect(() => {
    if (paramsAuctionSeq) {
      const auctionSeqValue = paramsAuctionSeq !== null ? paramsAuctionSeq : "";
      formChange({
        target: { name: "auctionSeq", value: auctionSeqValue },
      });
      auctionKeisaiChuSearchAPI(Number(paramsAuctionSeq), isLogin);
    } else {
      // paramsAuctionSeqがnullの場合は/loginにリダイレクト
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsAuctionSeq]);

  useEffect(() => {
    if (auctionKeisaiChuList != null && goodsParams.auctionSeq != "") {
      goodsSearchAPI(goodsParams, isLogin);
      goodsCountAPI(goodsParams, isLogin);
      setFetchAuctionData(auctionKeisaiChuList[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionKeisaiChuList]);
  useEffect(() => {
    if (goodsList) {
      setFetchGoodsList(goodsList);
    }
  }, [goodsList]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const [checkboxStates, setCheckboxStates] = useState({
    myBidCheck: false,
    myfavoriteCheck: false,
    chumokuCheck: false,
    nofinishCheck: false,
  });
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCheckboxStates((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };
  const handleCategoryChange = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((categoryId) => categoryId !== id) : [...prev, id]
    );
  };

  const formSearch = async () => {
    const params = {
      ...goodsParams,
      categorySeq: selectedCategories.join(","),
      myBidCheck: checkboxStates.myBidCheck,
      myfavoriteCheck: checkboxStates.myfavoriteCheck,
      chumokuCheck: checkboxStates.chumokuCheck,
      nofinishCheck: checkboxStates.nofinishCheck,
    };
    setCurrentPage(1);
    goodsSearchAPI(params, isLogin);
    goodsCountAPI(params, isLogin);
    setIsFilterOpen(false);
  };
  const formClear = () => {
    resetForm();
    setSelectedCategories([]);
    setCheckboxStates({
      myBidCheck: false,
      myfavoriteCheck: false,
      chumokuCheck: false,
      nofinishCheck: false,
    });
  };

  const sortConfig = {
    LotAsc: { sortKey: "lot", sortFlg: true },
    LotDesc: { sortKey: "lot", sortFlg: false },
    priceAsc: { sortKey: "price", sortFlg: true },
    priceDesc: { sortKey: "price", sortFlg: false },
  };

  const additionalParams = {
    categorySeq: selectedCategories.join(","),
    myBidCheck: checkboxStates.myBidCheck,
    myfavoriteCheck: checkboxStates.myfavoriteCheck,
    chumokuCheck: checkboxStates.chumokuCheck,
    nofinishCheck: checkboxStates.nofinishCheck,
  };

  const { sortOption, handleSortChange } = useSortHandler({
    initialSortOption: "LotAsc",
    sortConfig,
    searchParams: goodsParams,
    searchAPI: (params) => goodsSearchAPI(params, isLogin),
    additionalParams,
  });

  const itemsPerPage = Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`);
  const { currentPage, setCurrentPage, handlePageChange } = usePageChange({
    searchAPI: (params) => goodsSearchAPI(params, isLogin),
    searchParams: params,
    itemsPerPage,
  });

  //タイムアウト防止のためセッション延長
  useSessionExtension({ isLogin });

  return (
    <>
      {fetchAuctionData != null ? (
        <>
          <AuctionInfo auctionData={fetchAuctionData} isToGoodsList={false} isLogin={isLogin} />
        </>
      ) : (
        <div></div>
      )}

      <SearchFilter isOpen={isFilterOpen} toggleFilter={toggleFilter}>
        <div className={formSearchStyles.formContainer}>
          <div className={formSearchStyles.formGrid}>
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
              <label htmlFor="freeWord">{texts.common.freeWord}</label>
              <input
                id="freeWord"
                name="freeWord"
                value={goodsParams.freeWord}
                onChange={formChange}
              />
            </div>
            <div className={formSearchStyles.formItem}>
              <label htmlFor="lot">{texts.goods.lot}</label>
              <input id="lot" name="lot" value={goodsParams.lot} onChange={formChange} />
            </div>
          </div>
          <CategorySearchComponent
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            categoryLabel={texts.goods.category}
          />
          <label>{texts.goods.currentPrice}</label>
          <div className={formSearchStyles.formRow}>
            <div className={formSearchStyles.leftColumn}>
              <div className={formSearchStyles.formItemHalfWidth}>
                <input
                  id="startCurrentPriceFrom"
                  name="startCurrentPriceFrom"
                  value={goodsParams.startCurrentPriceFrom}
                  onChange={formChange}
                />
              </div>

              <div className={formSearchStyles.tilde}>{texts.common.tilde}</div>

              <div className={formSearchStyles.formItemHalfWidth}>
                <input
                  id="startCurrentPriceTo"
                  name="startCurrentPriceTo"
                  value={goodsParams.startCurrentPriceTo}
                  onChange={formChange}
                />
              </div>
            </div>
            <div className={formSearchStyles.rightColumn}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="chumokuCheck"
                    checked={checkboxStates.chumokuCheck}
                    onChange={handleCheckboxChange}
                    sx={{
                      color: "#c7c7c7",
                      "&.Mui-checked": { color: "gray" },
                    }}
                  />
                }
                label={texts.goods.goods_search_3}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="nofinishCheck"
                    checked={checkboxStates.nofinishCheck}
                    onChange={handleCheckboxChange}
                    sx={{
                      color: "#c7c7c7",
                      "&.Mui-checked": { color: "gray" },
                    }}
                  />
                }
                label={texts.goods.goods_search_4}
              />
              {isLogin && (
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="myBidCheck"
                        checked={checkboxStates.myBidCheck}
                        onChange={handleCheckboxChange}
                        sx={{
                          color: "#c7c7c7",
                          "&.Mui-checked": { color: "gray" },
                        }}
                      />
                    }
                    label={texts.goods.goods_search_1}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="myfavoriteCheck"
                        checked={checkboxStates.myfavoriteCheck}
                        onChange={handleCheckboxChange}
                        sx={{
                          color: "#c7c7c7",
                          "&.Mui-checked": { color: "gray" },
                        }}
                      />
                    }
                    label={texts.goods.goods_search_2}
                  />
                </>
              )}
            </div>
          </div>
          <div className="text-center lg:text-right my-5">
            <SearchButton onClick={formSearch} />
            <ClearButton onClear={formClear} />
          </div>
        </div>
      </SearchFilter>
      <Container
        currentPage={currentPage}
        totalCount={goodsCount}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      >
        {fetchGoodsList && fetchGoodsList.length > 0 ? (
          <>
            <ResultHeaderComponent
              count={goodsCount}
              sortOption={sortOption}
              onSortChange={handleSortChange}
              sortOptions={[
                { value: "LotAsc", label: texts.goods.sort_lot_asc },
                { value: "LotDesc", label: texts.goods.sort_lot_desc },
                { value: "priceAsc", label: texts.goods.sort_price_asc },
                { value: "priceDesc", label: texts.goods.sort_price_desc },
              ]}
            />
            <GoodsList
              list={fetchGoodsList}
              isLogin={isLogin}
              loginUserId={loginUserId}
              canBid={canBid}
            />
          </>
        ) : (
          <div></div>
        )}
      </Container>
    </>
  );
};

export default MemberGoodsSearchPage;
