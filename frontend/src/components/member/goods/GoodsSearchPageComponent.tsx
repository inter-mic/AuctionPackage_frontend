import React from 'react';
import { useSearchParams } from 'next/navigation';
import Pagination from '@mui/material/Pagination';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';

//コンポーネント
import GoodsList from '@/components/member/goods/GoodsListComponent';
import SearchFilter from '@/components/member/common/SearchFilterComponent';
import AuctionInfo from '@/components/member/schedule/AuctionInfoComponent';
//API
import { useGoodsSearchAPI } from '@/hooks/api/common/useGoodsSearchAPI';
import { useGoodsCountAPI } from '@/hooks/api/common/useGoodsCountAPI';
import { useGoodsSearchParams } from '@/hooks/searchParams/common/useGoodsSearchParams';
import { useAuctionKeisaiChuSearchAPI } from '@/hooks/api/common/useAuctionKeisaiChuSearchAPI';
import { useCategorySearchAPI } from '@/hooks/api/public/useCategorySearchAPI';
import { useMemberSessionAPI } from '@/hooks/api/member/useMemberSessionAPI';
//型定義
import { TPageProps } from '@/types/member/memberPage';
import { TGoodsSelect } from '@/types/common/goods';
import { TAuction } from '@/types/common/MtAuction';
//ボタン
import { SearchButton } from '@/components/ui/buttons/member/searchButton';
import { ClearButton } from '@/components/ui/buttons/member/clearButton';
//スタイル
import formSearchStyles from '@/styles/member/FormSearch.module.css';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import memberStyles from '@/styles/member/MemberCommon.module.css';
import styles from '@/styles/member/goods/GoodsList.module.css';

interface MemberGoodsSearchPageProps extends TPageProps {
  isLogin: boolean;
  loginUserId: number;
}


const MemberGoodsSearchPage: React.FC<MemberGoodsSearchPageProps> = ({ isLogin, loginUserId }) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const { goodsList, goodsSearchAPI } = useGoodsSearchAPI();
  const { goodsCount, goodsCountAPI } = useGoodsCountAPI();
  const [fetchGoodsList, setFetchGoodsList] = useState<TGoodsSelect[]>([]);
  const { goodsParams, formChange, resetForm } = useGoodsSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const toggleFilter = () => setIsFilterOpen((prev) => !prev);
  const params = useSearchParams();
  const paramsAuctionSeq = params ? params.get('auctionSeq') : null;
  const { auctionKeisaiChuList, auctionKeisaiChuSearchAPI } = useAuctionKeisaiChuSearchAPI();
  const [fetchAuctionData, setFetchAuctionData] = useState<TAuction>();
  const { category } = useCategorySearchAPI();
  useEffect(() => {
    if (paramsAuctionSeq) {
      const auctionSeqValue = paramsAuctionSeq !== null ? paramsAuctionSeq : '';
      formChange({
        target: { name: 'auctionSeq', value: auctionSeqValue },
      });
      auctionKeisaiChuSearchAPI(Number(paramsAuctionSeq), isLogin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsAuctionSeq]);

  useEffect(() => {
    if (auctionKeisaiChuList != null && goodsParams.auctionSeq != '') {
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [checkboxStates, setCheckboxStates] = useState({ myBidCheck: false, myfavoriteCheck: false, chumokuCheck: false, nofinishCheck: false });
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCheckboxStates(prevState => ({
      ...prevState,
      [name]: checked,
    }));
  };
  const handleCategoryChange = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((categoryId) => categoryId !== id) : [...prev, id]
    );
  };
  const formSearch = async () => {
    const params = {
      ...goodsParams,
      categorySeq: selectedCategories.join(','),
      myBidCheck: checkboxStates.myBidCheck,
      myfavoriteCheck: checkboxStates.myfavoriteCheck,
      chumokuCheck: checkboxStates.chumokuCheck,
      nofinishCheck: checkboxStates.nofinishCheck,
    };
    goodsSearchAPI(params, isLogin);
    goodsCountAPI(params, isLogin);
    setIsFilterOpen(false);
  };
  const formClear = () => {
    resetForm();
    setSelectedCategories([]);
    setCheckboxStates({ myBidCheck: false, myfavoriteCheck: false, chumokuCheck: false, nofinishCheck: false });
  };

  const [sortOption, setSortOption] = useState<string>('LotAsc');
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;
    setSortOption(option);
    let sortKey = 'Lot';
    let sortFlg = true;

    switch (option) {
      case 'LotDesc':
        sortKey = 'lot';
        sortFlg = false;
        break;
      case 'priceAsc':
        sortKey = 'price';
        sortFlg = true;
        break;
      case 'priceDesc':
        sortKey = 'price';
        sortFlg = false;
        break;
     
    }

    const params = {
      ...goodsParams,
      sortKey,
      sortFlg,
    };
    goodsSearchAPI(params, isLogin);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    const params = {
      ...goodsParams,
      pageNumber: page,
      pageSize: itemsPerPage,
    };
    goodsSearchAPI(params, isLogin);
  };


  //タイムアウト防止のためセッション延長
  const { memberSessionAPI } = useMemberSessionAPI();
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isLogin) {
        memberSessionAPI();
      }
    }, 300000);
    return () => clearInterval(intervalId);
  }, [isLogin, memberSessionAPI]);

  return (
    <>
      {fetchAuctionData != null ? (
        <AuctionInfo auctionData={fetchAuctionData} isToGoodsList={false} isLogin={isLogin} />
      ) : (
        <div></div>
      )}
      <SearchFilter isOpen={isFilterOpen} toggleFilter={toggleFilter}>
        <div className={formSearchStyles.formContainer}>
          <div className={formSearchStyles.formGrid}>
            <div className={formSearchStyles.formItem}>
              <label htmlFor="goodsName" >{texts.goods.goodsName}</label>
              <input
                id="goodsName"
                name="goodsName"
                value={goodsParams.goodsName}
                onChange={formChange}
              />
            </div>
            <div className={formSearchStyles.formItem}>
              <label htmlFor="freeWord" >{texts.common.freeWord}</label>
              <input
                id="freeWord"
                name="freeWord"
                value={goodsParams.freeWord}
                onChange={formChange}
              />
            </div>
            <div className={formSearchStyles.formItem}>
              <label htmlFor="lot" >{texts.goods.lot}</label>
              <input
                id="lot"
                name="lot"
                value={goodsParams.lot}
                onChange={formChange}
              />
            </div>
          </div>
          <div className={formSearchStyles.formItem}>
            <label className="mt-5" htmlFor="category">{texts.goods.category}</label>
            <div className={formSearchStyles.categoryGrid}>
              {category.map((data) => (
                <FormControlLabel
                  key={data.categorySeq}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(data.categorySeq)}
                      onChange={() => handleCategoryChange(data.categorySeq)}
                      sx={{ color: '#c7c7c7', '&.Mui-checked': { color: 'gray' } }}
                    />
                  }
                  label={data.categoryName}
                />
              ))}
            </div>
          </div>
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
                    sx={{ color: '#c7c7c7', '&.Mui-checked': { color: 'gray' } }}
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
                    sx={{ color: '#c7c7c7', '&.Mui-checked': { color: 'gray' } }}
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
                        sx={{ color: '#c7c7c7', '&.Mui-checked': { color: 'gray' } }}
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
                        sx={{ color: '#c7c7c7', '&.Mui-checked': { color: 'gray' } }}
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


      {fetchGoodsList && fetchGoodsList.length > 0 ? (
        <>
          <div className={`${memberStyles.memberContainer} py-5`}>
            <div className={styles.headerContainer}>
              <span>{goodsCount} {texts.label.resultCount}</span>
              <div className={styles.sortContainer}>
                <label htmlFor="sort">{texts.label.sort}</label>
                <select id="sort" value={sortOption} onChange={handleSortChange}>
                  <option value="LotAsc">{texts.goods.sort_lot_asc}</option>
                  <option value="LotDesc">{texts.goods.sort_lot_desc}</option>
                  <option value="priceAsc">{texts.goods.sort_price_asc}</option>
                  <option value="priceDesc">{texts.goods.sort_price_desc}</option>
                </select>
              </div>
            </div>
          </div>
          <GoodsList list={fetchGoodsList} isLogin={isLogin} loginUserId={loginUserId} />

          <div className={memberStyles.paginationContainer}>
            <Pagination
              count={Math.ceil(goodsCount / itemsPerPage)} // 総ページ数
              page={currentPage} // 現在のページ
              onChange={handlePageChange} // ページ変更イベント

            />
          </div>
        </>
      ) : (
        <div></div>
      )}

    </>
  );
};

export default MemberGoodsSearchPage;