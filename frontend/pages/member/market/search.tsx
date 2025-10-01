import { GetServerSideProps } from "next";
import { getTexts } from "@/config/texts";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { usePageChange } from "@/hooks/paging/usePageChange";
import { useSortHandler } from "@/hooks/sort/useSortHandler";
//ホック
import { withAuth } from "@/hocs/withMemberAuth";
import withMemberLayout from "@/hocs/withMemberLayout";
//API
import { useMarketSearchAPI } from "@/hooks/api/member/market/useMarketSearchAPI";
import { useMarketCountAPI } from "@/hooks/api/member/market/useMarketCountAPI";
import { useMarketSearchParams } from "@/hooks/searchParams/member/useMarketSearchParams";
import { useYearMonthSearchAPI } from "@/hooks/api/public/useYearMonthSearchAPI";

//コンポーネント
import { Container } from "@/components/member/layout/MemberContainerComponent";
import { PageTitle } from "@/components/member/layout/MemberPageTitleComponent";
import { YearMonthPullDown } from "@/components/ui/pulldowns/YearMonthPullDown";
import MemberMarketCard from "@/components/member/market/MarketCardComponent";
//ボタン
import { SearchButton } from "@/components/ui/buttons/member/searchButton";
import { ClearButton } from "@/components/ui/buttons/member/clearButton";
import { CategorySearchComponent } from "@/components/member/common/CategorySearchComponent";
import { ResultHeaderComponent } from "@/components/member/common/GoodsResultHeaderComponent";
//型定義
import { TPageProps } from "@/types/member/memberPage";
import { TMarketSelect } from "@/types/member/market";
//スタイル
import formSearchStyles from "@/styles/member/FormSearch.module.css";
import memberStyles from "@/styles/member/MemberCommon.module.css";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const { locale } = context;
  const texts = getTexts(locale);
  return {
    props: {
      pageTitle: texts.menu.memberMarket,
    },
  };
});

const Page: React.FC<TPageProps> = () => {
  const { useEffect, useState, texts } = useCommonSetup();
  const { yearMonth } = useYearMonthSearchAPI();
  const { marketList, marketSearchAPI } = useMarketSearchAPI();
  const { marketCount, marketCountAPI } = useMarketCountAPI();
  const { marketParams, formChange, resetForm } = useMarketSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const handleCategoryChange = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((categoryId) => categoryId !== id) : [...prev, id]
    );
  };

  // YearMonthPullDownのデフォルト値をmarketParamsに反映
  useEffect(() => {
    if (yearMonth && yearMonth.length > 0) {
      // 6ヶ月前の年月を計算
      const getSixMonthsAgo = (): string => {
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        const year = sixMonthsAgo.getFullYear();
        const month = String(sixMonthsAgo.getMonth() + 1).padStart(2, '0');
        return `${year}${month}`;
      };

      const sixMonthsAgo = getSixMonthsAgo();
      const sixMonthsAgoIndex = yearMonth.findIndex(item => item.yearMonth >= sixMonthsAgo);
      const defaultFromValue = sixMonthsAgoIndex !== -1 ? yearMonth[sixMonthsAgoIndex].yearMonth : yearMonth[yearMonth.length - 1].yearMonth;
      const defaultToValue = yearMonth[0].yearMonth;

      // marketParamsにデフォルト値を設定
      if (!marketParams.auctionKikanFrom) {
        formChange({ target: { name: "auctionKikanFrom", value: defaultFromValue } } as React.ChangeEvent<HTMLInputElement>);
      }
      if (!marketParams.auctionKikanTo) {
        formChange({ target: { name: "auctionKikanTo", value: defaultToValue } } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  }, [yearMonth, marketParams.auctionKikanFrom, marketParams.auctionKikanTo, formChange]);

  const [fetchMarketList, setFetchMarketList] = useState<TMarketSelect[]>([]);
  const formSearch = async () => {
    const params = {
      ...marketParams,
      categorySeq: selectedCategories.join(","),
    };
    setCurrentPage(1);
    marketSearchAPI(params);
    marketCountAPI(params);
  };
  useEffect(() => {
    if (marketList) {
      setFetchMarketList(marketList);
    }
  }, [marketList]);
  const formClear = () => {
    resetForm();
    setSelectedCategories([]);
    setSelectedAuctionKikanFrom(null);
    setSelectedAuctionKikanTo(null);
  };
  const itemsPerPage = Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`);
  const sortConfig = {
    LotDesc: { sortKey: "lot", sortFlg: false },
    dateAsc: { sortKey: "lot", sortFlg: true },
    priceAsc: { sortKey: "price", sortFlg: true },
    priceDesc: { sortKey: "price", sortFlg: false },
  };

  const { sortOption, handleSortChange } = useSortHandler({
    initialSortOption: "dateAsc",
    sortConfig,
    searchParams: marketParams,
    searchAPI: marketSearchAPI,
  });
  const { currentPage, setCurrentPage, handlePageChange } = usePageChange({
    searchAPI: marketSearchAPI,
    searchParams: marketParams,
    itemsPerPage,
  });

  const [selectedAuctionKikanFrom, setSelectedAuctionKikanFrom] = useState<string | null>(null);
  const [selectedAuctionKikanTo, setSelectedAuctionKikanTo] = useState<string | null>(null);
  const handleAuctionKikan = (name: string, value: string, isFrom: boolean) => {
    if (isFrom) {
      setSelectedAuctionKikanFrom(value);
    } else {
      setSelectedAuctionKikanTo(value);
    }
    formChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <>
      <PageTitle title={texts.menu.memberMarket} />
      <div className={memberStyles.memberContainer}>
        <div className={formSearchStyles.formContainer}>
          <div className={formSearchStyles.formRowHalf}>
            <div className={formSearchStyles.blockColumn}>
              <div className={formSearchStyles.formItemHalfWidth}>
                <label htmlFor="freeWord">{texts.common.freeWord}</label>
                <input
                  id="freeWord"
                  name="freeWord"
                  value={marketParams.freeWord}
                  onChange={formChange}
                />
              </div>
            </div>
            <div className={formSearchStyles.formRow}>
              <div className={formSearchStyles.blockColumn}>
                <div className={formSearchStyles.formItemHalfWidth}>
                  <label>{texts.auction.auctionDate}</label>
                  <YearMonthPullDown
                    onChange={(value) => handleAuctionKikan("auctionKikanFrom", value, true)}
                    selectedId={
                      selectedAuctionKikanFrom !== null ? String(selectedAuctionKikanFrom) : marketParams.auctionKikanFrom
                    }
                    yearMonth={yearMonth}
                    isFrom={true}
                  />
                </div>
                <div className={formSearchStyles.tilde}>{texts.common.tilde}</div>
                <div className={formSearchStyles.formItemHalfWidth}>
                  <YearMonthPullDown
                    onChange={(value) => handleAuctionKikan("auctionKikanTo", value, false)}
                    selectedId={
                      selectedAuctionKikanTo !== null ? String(selectedAuctionKikanTo) : marketParams.auctionKikanTo
                    }
                    yearMonth={yearMonth}
                    isFrom={false}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={formSearchStyles.formRowHalf}>
            <div className={formSearchStyles.blockColumn}>
              <CategorySearchComponent
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                categoryLabel={texts.goods.category}
              />
            </div>

            <div className={formSearchStyles.formRow}>
              <div className={formSearchStyles.blockColumn}>
                <div className={formSearchStyles.formItemHalfWidth}>
                  <label className="mt-5">{texts.goods.rakusatsuPrice}</label>
                  <input
                    id="rakusatsuPriceFrom"
                    name="rakusatsuPriceFrom"
                    value={marketParams.rakusatsuPriceFrom}
                    onChange={formChange}
                  />
                </div>
                <div className={formSearchStyles.tilde}>{texts.common.tilde}</div>
                <div className={formSearchStyles.formItemHalfWidth}>
                  <input
                    id="rakusatsuPriceTo"
                    name="rakusatsuPriceTo"
                    value={marketParams.rakusatsuPriceTo}
                    onChange={formChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="text-center lg:text-right my-5">
            <SearchButton onClick={formSearch} />
            <ClearButton onClear={formClear} />
          </div>
        </div>

        <Container
          currentPage={currentPage}
          totalCount={marketCount}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        >
          {fetchMarketList && fetchMarketList.length > 0 ? (
            <>
              <ResultHeaderComponent
                count={marketCount}
                sortOption={sortOption}
                onSortChange={handleSortChange}
                sortOptions={[
                  { value: "LotDesc", label: texts.goods.sort_kaisaibi_asc },
                  { value: "dateAsc", label: texts.goods.sort_kaisaibi_desc },
                  { value: "priceAsc", label: texts.goods.sort_rakusatsu_price_asc },
                  { value: "priceDesc", label: texts.goods.sort_rakusatsu_price_desc },
                ]}
              />
              <div className={memberStyles.memberContainer}>
                {fetchMarketList.map((data) => (
                  <MemberMarketCard key={data.goodsId} data={data} texts={texts} />
                ))}
              </div>
            </>
          ) : (
            <div></div>
          )}
        </Container>
      </div>
    </>
  );
};

export default withMemberLayout(Page);
