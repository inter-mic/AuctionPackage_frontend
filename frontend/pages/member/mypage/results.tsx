import { GetServerSideProps } from 'next';
import { texts } from '@/config/texts';
import React from 'react';
import Image from 'next/image';
//ホック
import { withAuth } from '@/hocs/withMemberAuth';
import withMemberLayout from '@/hocs/withMemberLayout';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//API
import { useResultsSearchAPI } from '@/hooks/api/member/mypage/useResultsSearchAPI';
import { useResultsSearchParams } from '@/hooks/searchParams/member/useResultsSearchParams';
//型定義
import { TPageProps } from '@/types/member/memberPage';
import { TResultsSelect } from '@/types/member/results';
//コンポーネント
import { KaisaiListPullDown } from '@/components/ui/pulldowns/MemberKaisaiListPullDown';
import { RequiredMark } from '@/components/ui/marks/RequiredMark';
//ボタン
import { SearchButton } from '@/components/ui/buttons/member/searchButton';
import { ClearButton } from '@/components/ui/buttons/member/clearButton';
//スタイル
import formSearchStyles from '@/styles/member/FormSearch.module.css';
import memberStyles from '@/styles/member/MemberCommon.module.css';


export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.memberRakusatsu
    },
  };
});

const Page: React.FC<TPageProps> = (isLogin) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const { searchParams, formChange, resetForm } = useResultsSearchParams();
  const [selectedKaisai, setSelectedKaisai] = useState<string>('');
  const handleKaisaiChange = (name: string, value: string) => {
    setSelectedKaisai(value);
    formChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
    if (errors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };
  const [fetchResultList, setFetchResultList] = useState<TResultsSelect[]>([]);
  const { resultsList, errors, registesultsSearchAPI } = useResultsSearchAPI();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const formSearch = async () => {
    await registesultsSearchAPI(searchParams);
  };
  const formClear = () => {
    resetForm();
    setSelectedKaisai("");
    setFetchResultList([]);
  };
  useEffect(() => {
    if (errors) { setFormErrors(errors); }
  }, [errors]);
  useEffect(() => {
    if (resultsList) {
      setFetchResultList(resultsList);
    }
  }, [resultsList]);



  return (
    <>
<div className={memberStyles.mainTitleContainer}>
      <span className={memberStyles.mainTitle}>{texts.menu.memberRakusatsu}</span>
      </div>
    <div className={memberStyles.memberContainer}>

      <div className={formSearchStyles.formContainer}>
        <div className={formSearchStyles.formGrid}>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="auction" ><RequiredMark />{texts.goods.auctionName}</label>
            <KaisaiListPullDown
              className={""}
              onChange={(value) => handleKaisaiChange('auctionSeq', value)}
              selectedId={selectedKaisai !== null ? String(selectedKaisai) : ''}
              kaisaiStatus={1}
              isLogin={true}
            />
            {formErrors?.auctionSeq && <p className="error-message">{formErrors.auctionSeq}</p>}
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="lot" >{texts.goods.lot}</label>
            <input
              id="lot"
              name="lot"
              value={searchParams.lot}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="goodsName" >{texts.goods.goodsName}</label>
            <input
              id="goodsName"
              name="goodsName"
              value={searchParams.goodsName}
              onChange={formChange}
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
        <div className="w-full flex flex-row justify-between items-center p-4">
            <div className="text-left">
              {texts.label.resultKekka} {resultsList.length} {texts.label.resultCount}
            </div>
            <div className="text-right">
                <span className="font-bold">
                {texts.mypageResult.rakusatsuTotalPrice} :
            {resultsList.reduce((acc, result) => {
                const price = parseFloat(result.rakusatsuPrice.replace(/,/g, '')) || 0;
                return acc + price;
              }, 0).toLocaleString()}
            </span>
            </div>
            
          </div>
        <div className="w-full">
        <table className="w-full bg-white">
        <thead>
          <tr>
        <th className="py-2 px-4 border-b" >{texts.goods.thumbnailImageUrl}</th>
        <th className="py-2 px-4 border-b" >{texts.goods.lot}</th>
        <th className="py-2 px-4 border-b" >{texts.goods.goodsName}</th>
        <th className="py-2 px-4 border-b" >{texts.goods.rakusatsuPrice}</th>
        </tr>
        </thead>
            <tbody>
            {resultsList.length > 0 && resultsList.map((result) => (
              <React.Fragment key={result.goodsId}>
                <tr>
                <td className="py-2 px-4  border-b text-right">
                    <Image
                      src={result.thumbnailImageUrl && result.thumbnailImageUrl.trim() !== "" ? result.thumbnailImageUrl : "/no_image.png"}
                      alt=""
                      width={100}
                      height={100}
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-right">{result.lot}</td>
                  <td className="py-2 px-4 border-b text-right">{result.goodsName}</td>
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
    </div>
    </>
  );
};

export default withMemberLayout(Page);