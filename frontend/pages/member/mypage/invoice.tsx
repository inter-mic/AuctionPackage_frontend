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
import { useTorihikiJissekiSearchAPI } from "@/hooks/api/member/mypage/useTorihikiJissekiSearchAPI";
import { useTorihikiJissekiSearchCountAPI } from "@/hooks/api/member/mypage/useTorihikiJissekiSearchCountAPI";
import { useInvoicePdfAPI } from "@/hooks/api/member/mypage/useInvoicePdfAPI";
//型定義
import { TAdminTorihikiJissekiRequest } from "@/types/admin/torihikiJisseki/search";
import { TPageProps } from "@/types/member/memberPage";
//コンポーネント
import { PageTitle } from "@/components/member/layout/MemberPageTitleComponent";
import { Container } from "@/components/member/layout/MemberContainerComponent";
import { InvoiceSearchResultTable } from "@/components/member/invoice/InvoiceSearchResultTable";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const { locale } = context;
  const texts = getTexts(locale);
  return {
    props: {
      pageTitle: texts.menu.memberInvoice,
    },
  };
});

const Page: React.FC<TPageProps> = () => {
  const { useState, useEffect, texts } = useCommonSetup();
  const itemsPerPage = Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`);
  const [searchParams] = useState<TAdminTorihikiJissekiRequest>({
    auctionSeq: 0,
    pageNumber: 1,
    pageSize: itemsPerPage,
  });

  const { torihikiList, torihikiJissekiSearchAPI } = useTorihikiJissekiSearchAPI();
  const { count, torihikiJissekiSearchCountAPI } = useTorihikiJissekiSearchCountAPI();

  useEffect(() => {
    setCurrentPage(1);
    const params = {
      pageNumber: 1,
      pageSize: itemsPerPage,
    };
    torihikiJissekiSearchAPI(params);
    torihikiJissekiSearchCountAPI(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { currentPage, setCurrentPage, handlePageChange } = usePageChange({
    searchAPI: torihikiJissekiSearchAPI,
    searchParams,
    itemsPerPage,
  });

  const { invoicePdfAPI } = useInvoicePdfAPI();
  const handleInvoice = (auctionSeq: number) => {
    invoicePdfAPI(auctionSeq);
  };

  return (
    <>
      <PageTitle title={texts.menu.memberInvoice} />
      <Container
        currentPage={currentPage}
        totalCount={count}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      >
        {torihikiList && torihikiList.length > 0 ? (
          <InvoiceSearchResultTable
            torihikiList={torihikiList}
            texts={texts}
            onInvoiceClick={handleInvoice}
          />
        ) : (
          <p></p>
        )}
      </Container>
    </>
  );
};

export default withMemberLayout(Page);
