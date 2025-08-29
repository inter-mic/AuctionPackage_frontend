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
import { useSpnSearchAPI } from "@/hooks/api/member/mypage/useSpnSearchAPI";
import { useSpnCountAPI } from "@/hooks/api/member/mypage/useSpnCountAPI";
import { useShuppinSearchParams } from "@/hooks/searchParams/member/useShuppinSearchParams";
//型定義
import { TPageProps } from "@/types/member/memberPage";
import { TSpnSelect } from "@/types/member/shuppin";
//共通コンポーネント
import { PageTitle } from "@/components/member/layout/MemberPageTitleComponent";
import { Container } from "@/components/member/layout/MemberContainerComponent";
import { MyPageResultCount } from "@/components/member/layout/MyPageResultCountComponent";
import { MemberSearchForm } from "@/components/member/common/MemberSearchForm";
import { ShuppinSearchResultTable } from "@/components/member/shuppin/ShuppinSearchResultTable";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const { locale } = context;
  const texts = getTexts(locale);
  return {
    props: {
      pageTitle: texts.menu.memberShuppin,
    },
  };
});

const Page: React.FC<TPageProps> = () => {
  const { useState, useEffect, texts } = useCommonSetup();
  const { searchParams, formChange, resetForm } = useShuppinSearchParams();
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
  const [selectedKekkaStatus, setSelectedKekkaStatus] = useState<string | null>(null);
  const handleKekkaStatusChange = (name: string, value: string) => {
    setSelectedKekkaStatus(value);
    formChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
  };
  const [fetchResultList, setFetchResultList] = useState<TSpnSelect[]>([]);
  const { resultsList, errors, spnSearchAPI } = useSpnSearchAPI();
  const { spnCount, spnCountAPI } = useSpnCountAPI();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const itemsPerPage = Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`);
  const { currentPage, setCurrentPage, handlePageChange } = usePageChange({
    searchAPI: spnSearchAPI,
    searchParams,
    itemsPerPage,
  });

  const formSearch = async () => {
    setCurrentPage(1);
    setFetchResultList([]);
    const params = {
      ...searchParams,
      pageNumber: 1,
      pageSize: itemsPerPage,
    };
    await spnSearchAPI(params);
    await spnCountAPI(params);
  };
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
      <PageTitle title={texts.menu.memberShuppin} />
      <Container
        currentPage={currentPage}
        totalCount={spnCount}
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
            {
              name: "kekkaStatus",
              label: texts.goods.kekkaStatus,
              type: "kekkaStatus",
            },
          ]}
          selectedKaisai={selectedKaisai}
          onKaisaiChange={handleKaisaiChange}
          selectedKekkaStatus={selectedKekkaStatus}
          onKekkaStatusChange={handleKekkaStatusChange}
          kaisaiStatus={1}
          isLogin={true}
        />
        {fetchResultList && fetchResultList.length > 0 ? (
          <>
            <MyPageResultCount count={spnCount} />
            <ShuppinSearchResultTable resultsList={resultsList} texts={texts} />
          </>
        ) : (
          <p></p>
        )}
      </Container>
    </>
  );
};

export default withMemberLayout(Page);
