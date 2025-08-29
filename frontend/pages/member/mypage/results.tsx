import { GetServerSideProps } from "next";
import { getTexts } from "@/config/texts";
import React from "react";
//ホック
import { withAuth } from "@/hocs/withMemberAuth";
import withMemberLayout from "@/hocs/withMemberLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { usePageChange } from "@/hooks/paging/usePageChange";
//API
import { useResultsSearchAPI } from "@/hooks/api/member/mypage/useResultsSearchAPI";
import { useResultsCountAPI } from "@/hooks/api/member/mypage/useResultsCountAPI";
import { useResultsSearchParams } from "@/hooks/searchParams/member/useResultsSearchParams";
//型定義
import { TPageProps } from "@/types/member/memberPage";
import { TResultsSelect } from "@/types/member/results";
//共通コンポーネント
import { PageTitle } from "@/components/member/layout/MemberPageTitleComponent";
import { Container } from "@/components/member/layout/MemberContainerComponent";
import { MyPageResultCount } from "@/components/member/layout/MyPageResultCountComponent";
import { MemberSearchForm } from "@/components/member/common/MemberSearchForm";
import { ResultsSearchResultTable } from "@/components/member/results/ResultsSearchResultTable";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const { locale } = context;
  const texts = getTexts(locale);
  return {
    props: {
      pageTitle: texts.menu.memberRakusatsu,
    },
  };
});

const Page: React.FC<TPageProps> = () => {
  const { useState, useEffect, texts } = useCommonSetup();
  const { searchParams, formChange, resetForm } = useResultsSearchParams();
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
  const [fetchResultList, setFetchResultList] = useState<TResultsSelect[]>([]);
  const { resultsList, errors, resultsSearchAPI } = useResultsSearchAPI();
  const { resultsCount, resultsCountAPI } = useResultsCountAPI();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const itemsPerPage = Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`);
  const formSearch = async () => {
    setCurrentPage(1);
    setFetchResultList([]);
    const params = {
      ...searchParams,
      pageNumber: 1,
      pageSize: itemsPerPage,
    };
    await resultsSearchAPI(params);
    await resultsCountAPI(params);
  };
  const { currentPage, setCurrentPage, handlePageChange } = usePageChange({
    searchAPI: resultsSearchAPI,
    searchParams,
    itemsPerPage,
  });
  const formClear = () => {
    resetForm();
    setSelectedKaisai("");
    setFetchResultList([]);
  };
  useEffect(() => {
    if (errors) {
      setFormErrors(errors);
    }
  }, [errors]);
  useEffect(() => {
    if (resultsList) {
      setFetchResultList(resultsList);
    }
  }, [resultsList]);

  return (
    <>
      <PageTitle title={texts.menu.memberRakusatsu} />
      <Container
        currentPage={currentPage}
        totalCount={resultsCount}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      >
        <MemberSearchForm
          searchParams={searchParams}
          formChange={formChange}
          onSearch={formSearch}
          onClear={formClear}
          formErrors={formErrors}
          fields={[
            {
              name: "auctionSeq",
              label: texts.goods.auctionName,
              type: "select",
              required: true,
            },
            {
              name: "lot",
              label: texts.goods.lot,
              type: "input",
            },
            {
              name: "goodsName",
              label: texts.goods.goodsName,
              type: "input",
            },
          ]}
          selectedKaisai={selectedKaisai}
          onKaisaiChange={handleKaisaiChange}
          kaisaiStatus={1}
          isLogin={true}
        />
        {fetchResultList && fetchResultList.length > 0 ? (
          <>
            <MyPageResultCount
              count={resultsCount}
              totalPrice={fetchResultList
                .reduce((acc, result) => {
                  const price = parseFloat(result.rakusatsuPrice.replace(/,/g, "")) || 0;
                  return acc + price;
                }, 0)
                .toLocaleString()}
              totalPriceLabel={texts.mypageResult.rakusatsuTotalPrice}
            />
            <div className="w-full sm:w-3/5 mx-auto">
              <ResultsSearchResultTable resultsList={fetchResultList} texts={texts} />
            </div>
          </>
        ) : (
          <p></p>
        )}
      </Container>
    </>
  );
};

export default withMemberLayout(Page);
