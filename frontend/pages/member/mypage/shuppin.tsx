import { GetServerSideProps } from "next";
import { getTexts } from "@/config/texts";
import React from "react";
import Image from "next/image";
//ホック
import { withAuth } from "@/hocs/withMemberAuth";
import withMemberLayout from "@/hocs/withMemberLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { usePageChange } from "@/hooks/usePageChange";
//API
import { useSpnSearchAPI } from "@/hooks/api/member/mypage/useSpnSearchAPI";
import { useSpnCountAPI } from "@/hooks/api/member/mypage/useSpnCountAPI";
import { useShuppinSearchParams } from "@/hooks/searchParams/member/useShuppinSearchParams";
//型定義
import { TPageProps } from "@/types/member/memberPage";
import { TSpnSelect } from "@/types/member/shuppin";
//コンポーネント
import { KaisaiListPullDown } from "@/components/ui/pulldowns/MemberKaisaiListPullDown";
import { KekkaStatusPullDown } from "@/components/ui/pulldowns/KekkaStatusPullDown";
import { RequiredMark } from "@/components/ui/marks/RequiredMark";
//ボタン
import { SearchButton } from "@/components/ui/buttons/member/searchButton";
import { ClearButton } from "@/components/ui/buttons/member/clearButton";
//スタイル
import formSearchStyles from "@/styles/member/FormSearch.module.css";

//共通コンポーネント
import { PageTitle } from "@/components/member/layout/MemberPageTitleComponent";
import { Container } from "@/components/member/layout/MemberContainerComponent";
import { MyPageResultCount } from "@/components/member/layout/MyPageResultCountComponent";

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
        <div className={formSearchStyles.formContainer}>
          <div className={formSearchStyles.formGrid}>
            <div className={formSearchStyles.formItem}>
              <label htmlFor="auction">
                <RequiredMark />
                {texts.goods.auctionName}
              </label>
              <KaisaiListPullDown
                className={""}
                onChange={(value) => handleKaisaiChange("auctionSeq", value)}
                selectedId={selectedKaisai !== null ? String(selectedKaisai) : ""}
                kaisaiStatus={1}
                isLogin={true}
              />
              {formErrors?.auctionSeq && <p className="error-message">{formErrors.auctionSeq}</p>}
            </div>
            <div className={formSearchStyles.formItem}>
              <label htmlFor="lot">{texts.goods.lot}</label>
              <input id="lot" name="lot" value={searchParams.lot} onChange={formChange} />
            </div>
            <div className={formSearchStyles.formItem}>
              <label htmlFor="goodsName">{texts.goods.goodsName}</label>
              <input
                id="goodsName"
                name="goodsName"
                value={searchParams.goodsName}
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
          </div>
          <div className="text-center lg:text-right">
            <SearchButton onClick={formSearch} />
            <ClearButton onClear={formClear} />
          </div>
        </div>
        {fetchResultList && fetchResultList.length > 0 ? (
          <>
            <MyPageResultCount count={spnCount} />
            <div className="w-full">
              <table className="w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">{texts.goods.thumbnailImageUrl}</th>
                    <th className="py-2 px-4 border-b">{texts.goods.lot}</th>
                    <th className="py-2 px-4 border-b">{texts.goods.goodsName}</th>
                    <th className="py-2 px-4 border-b">{texts.goods.startPrice}</th>
                    {resultsList[0].spnKbn === "3" ? (
                      <>
                        <th className="py-2 px-4 border-b">{texts.goods.currentPrice}</th>
                      </>
                    ) : (
                      <></>
                    )}

                    <th className="py-2 px-4 border-b">{texts.goods.kekkaStatus}</th>
                    <th className="py-2 px-4 border-b">{texts.goods.rakusatsuPrice}</th>
                  </tr>
                </thead>
                <tbody>
                  {resultsList.length > 0 &&
                    resultsList.map((result) => (
                      <React.Fragment key={result.goodsId}>
                        <tr>
                          <td className="py-2 px-4  border-b">
                            <Image
                              src={
                                result.thumbnailImageUrl && result.thumbnailImageUrl.trim() !== ""
                                  ? result.thumbnailImageUrl
                                  : "/no_image.png"
                              }
                              alt=""
                              width={50}
                              height={50}
                            />
                          </td>
                          <td className="py-2 px-4 border-b text-left">{result.lot}</td>
                          <td className="py-2 px-4 border-b text-left">{result.goodsName}</td>
                          <td className="py-2 px-4 border-b text-right">{result.startPrice}</td>
                          {resultsList[0].spnKbn === "3" ? (
                            <>
                              <td className="py-2 px-4 border-b text-right">
                                {result.currentPrice}
                              </td>
                            </>
                          ) : (
                            <></>
                          )}
                          <td className="py-2 px-4 border-b text-right">
                            {result.auctionKekkaStatusName}
                          </td>
                          <td className="py-2 px-4 border-b text-right">{result.rakusatsuPrice}</td>
                        </tr>
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
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
