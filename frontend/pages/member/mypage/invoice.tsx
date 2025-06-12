import { GetServerSideProps } from "next";
import { getTexts } from "@/config/texts";
import Pagination from "@mui/material/Pagination";
import React from "react";
//ホック
import { withAuth } from "@/hocs/withMemberAuth";
import withMemberLayout from "@/hocs/withMemberLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { usePagination } from "@/hooks/usePagination";
//API
import { useTorihikiJissekiSearchAPI } from "@/hooks/api/member/mypage/useTorihikiJissekiSearchAPI";
import { useTorihikiJissekiSearchCountAPI } from "@/hooks/api/member/mypage/useTorihikiJissekiSearchCountAPI";
import { useInvoicePdfAPI } from "@/hooks/api/member/mypage/useInvoicePdfAPI";
//型定義
import {
  TAdminTorihikiJissekiRequest,
  TVTorihikiJisseki,
} from "@/types/admin/torihikiJisseki/search";
import { TPageProps } from "@/types/member/memberPage";

//ボタン
import { OutPutButton } from "@/components/ui/buttons/member/outputButton";

//スタイル
import memberStyles from "@/styles/member/MemberCommon.module.css";

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
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const itemsPerPage = Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`);
  const [searchParams, setSearchParams] = useState<TAdminTorihikiJissekiRequest>({
    auctionSeq: 0,
    pageNumber: 1,
    pageSize: itemsPerPage,
  });

  const { torihikiList, torihikiJissekiSearchAPI } = useTorihikiJissekiSearchAPI();
  const { count, torihikiJissekiSearchCountAPI } = useTorihikiJissekiSearchCountAPI();
  useEffect(() => {
    const params = {
      pageNumber: 1,
      pageSize: itemsPerPage,
    };
    torihikiJissekiSearchAPI(params);
    torihikiJissekiSearchCountAPI(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { currentPage, handlePageChange } = usePagination({
    itemsPerPage,
    searchAPI: torihikiJissekiSearchAPI,
    searchParams: searchParams,
  });

  const { invoicePdfAPI } = useInvoicePdfAPI();
  const handleInvoice = (auctionSeq: number) => {
    invoicePdfAPI(auctionSeq);
  };

  return (
    <>
      <div className={memberStyles.mainTitleContainer}>
        <span className={memberStyles.mainTitle}>{texts.menu.memberInvoice}</span>
      </div>
      <div className={memberStyles.memberContainer}>
        {torihikiList && torihikiList.length > 0 ? (
          <>
            <div className="w-full mt-4">
              <table className="w-full sm:w-3/4 bg-white mx-auto">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">{texts.auction.auctionName}</th>
                    <th className="py-2 px-4 border-b w-24">{texts.torihikiJisseki.rakusatsusu}</th>
                    <th className="py-2 px-4 border-b w-56">
                      {texts.torihikiJisseki.rakusatsuTotalPrice}
                    </th>
                    <th className="py-2 px-4 border-b w-56"></th>
                  </tr>
                </thead>
                <tbody>
                  {torihikiList.length > 0 &&
                    torihikiList.map((result) => (
                      <React.Fragment key={result.auctionSeq}>
                        <tr>
                          <td className="py-2 px-4 border-b text-left">{result.auctionName}</td>
                          <td className="py-2 px-4 border-b text-right w-24">
                            {result.rakusatsusu}
                          </td>
                          <td className="py-2 px-4 border-b text-right w-56">
                            {result.rakusatsuTotalPrice}
                          </td>
                          <td className="py-2 px-4 border-b text-center w-56">
                            <OutPutButton
                              onClick={() => handleInvoice(result.auctionSeq)}
                              text={texts.button.invoice}
                            />
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
              <div>
                <Pagination
                  className={memberStyles.paginationContainer}
                  count={Math.max(1, Math.ceil(count / itemsPerPage))}
                  page={currentPage}
                  onChange={handlePageChange}
                />
              </div>
            </div>
          </>
        ) : (
          <p></p>
        )}
      </div>
    </>
  );
};

export default withMemberLayout(Page);
