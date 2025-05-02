import { GetServerSideProps } from 'next';
import { texts } from '@/config/texts';
import Pagination from '@mui/material/Pagination';
//ホック
import { withAuth } from '@/hocs/withAdminAuth';
import withAdminLayout from '@/hocs/withAdminLayout';

//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
import { useSort } from '@/hooks/useSort';
import { usePagination } from '@/hooks/usePagination';
import { useKengenRedirect } from '@/hooks/useKengenRedirect';
import { useExecutionPermission } from '@/hooks/useExecutionPermission';
//API
import { usePaddleSearchAPI } from '@/hooks/api/admin/paddle/usePaddleSearchAPI';
import { usePaddleSearchCountAPI } from '@/hooks/api/admin/paddle/usePaddleSearchCountAPI';
import { usePaddleSearchParams } from '@/hooks/searchParams/admin/usePaddleSearchParams';
import { useUserGetInfoAPI } from '@/hooks/api/admin/user/useUserGetInfoAPI';
import { usePaddleRegistAPI } from '@/hooks/api/admin/paddle/usePaddleRegistAPI';
import { useNextPaddleNoSearchAPI } from '@/hooks/api/admin/paddle/useNextPaddleNoSearchAPI';
import { usePaddleDeleteAPI } from '@/hooks/api/admin/paddle/usePaddleDeleteAPI';

//型定義
import { TAdminPaddleSelect, TAdminPaddleRegistRequest, TAdminNextPaddleSearchRequest } from '@/types/admin/paddle/management';
import { TAdminUserSelect } from '@/types/admin/member/search';
import { PageProps } from '@/types/admin/adminPage';
//ボタン
import { SearchButton } from '@/components/ui/buttons/admin/searchButton';
import { ClearButton } from '@/components/ui/buttons/admin/clearButton';
import { RegistButton } from '@/components/ui/buttons/admin/registButton';
//コンポーネント
import { RequiredMark } from '@/components/ui/marks/RequiredMark';
import { KaisaiListPullDown } from '@/components/ui/pulldowns/KaisaiListPullDown';
import { PaddleKbnPullDown } from '@/components/ui/pulldowns/PaddleKbnPullDown';
import { MemberSearchModal } from '@/components/admin/MemberSearchModalComponent';
//スタイル
import breadcrumbStyles from '@/styles/breadcrumb.module.css';
import formSearchStyles from '@/styles/admin/FormSearch.module.css';
import adminStyles from '@/styles/admin/AdminCommon.module.css';


export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.adminPaddleManagement
    },
  };
});


const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, useCallback, texts } = useCommonSetup();

  useKengenRedirect(kengen, 102);
  const { executionPermission } = useExecutionPermission(kengen);

  //登録
  const [selectedRegistKaisai, setSelectedRegistKaisai] = useState<string>('');
  const [registErrors, setRegistErrors] = useState<{ [key: string]: string }>({});
  const [paddleRegistRequest, setPaddleRegistRequest] = useState<TAdminPaddleRegistRequest>();
  const [nextPaddleSearchRequest, setNextPaddleSearchRequest] = useState<TAdminNextPaddleSearchRequest>();
  const { userName: registUserName, companyName: registCompanyName, userGetInfo } = useUserGetInfoAPI();
  const handleRegistDataChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, checked?: boolean) => {

    const { name, value, type } = e.target;
    setPaddleRegistRequest((prevGoodsData) => ({ ...prevGoodsData, [name]: value }));
    if (name === 'registUserId') {
      setPaddleRegistRequest(prevData => ({
        ...prevData,
        userName: "",
        companyName: "",
      }));
      if (value) {
        userGetInfo(value);
      }
    }
    if (registErrors?.[name]) {
      setRegistErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };
  const { responseStatus, errors: registResponseErrors, paddleRegistAPI } = usePaddleRegistAPI();
  const paddleDataRegist = () => {
    if(paddleRegistRequest){
      paddleRegistAPI(paddleRegistRequest, false);
    }
  };

  //会員検索
  const [isModalOpen, setModalOpen] = useState(false);
  const handleSelectMember = (member: TAdminUserSelect) => {
    setPaddleRegistRequest(prevData => ({
      ...prevData,
      userId: member.userId,
      userName: member.userName,
      companyName: member.companyName
    }));
  };
  useEffect(() => {
    if (registUserName) {
      setPaddleRegistRequest(prevData => ({
        ...prevData,
        userName: registUserName,
      }));
    }
    if (registCompanyName) {
      setPaddleRegistRequest(prevData => ({
        ...prevData,
        companyName: registCompanyName,
      }));
    }

  }, [registUserName, registCompanyName]);



  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  //開催回プルダウン
  const [selectedKaisai, setSelectedKaisai] = useState<string>('');
  const handleKaisaiChange = (name: string, value: string, isRegist: boolean) => {
    if (isRegist) {
      setSelectedRegistKaisai(value);
      handleRegistDataChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
      setNextPaddleSearchRequest(prevData => ({
        ...prevData,
        auctionSeq: value
      }));
      if (errors?.[name]) {
        setRegistErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    } else {
      setSelectedKaisai(value);
      formChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
      if (errors?.[name]) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }

  };

  //パドル区分プルダウン
  const [selectedRegistPaddleKbn, setSelectedRegistPaddleKbn] = useState<string | null>(null);
  const [selectedSearchPaddleKbn, setSelectedSearchPaddleKbn] = useState<string | null>(null);
  const handlePaddleKbnChange = (name: string, value: string, isRegist: boolean) => {
    if (isRegist) {
      setSelectedRegistPaddleKbn(value);
      handleRegistDataChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
      setNextPaddleSearchRequest(prevData => ({
        ...prevData,
        paddleKbn: value
      }));
      if (errors?.[name]) {
        setRegistErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    } else {
      setSelectedSearchPaddleKbn(value);
      formChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
      if (errors?.[name]) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }
  };

  //自動採番
  const { nextPaddleNo, errors: nextPaddleResponseErrors, nextPaddleNoSearchAPI } = useNextPaddleNoSearchAPI();
  const getNextPaddleNo = () => {
    if(nextPaddleSearchRequest){
      nextPaddleNoSearchAPI(nextPaddleSearchRequest);
    }
  }
  useEffect(() => {
    if (nextPaddleNo) {
      setPaddleRegistRequest(prevData => ({
        ...prevData,
        paddleNo : nextPaddleNo,
      }));
    }
  }, [nextPaddleNo]);
  const [nextPaddleErrors, setNextPaddleErrors] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (nextPaddleResponseErrors) { setNextPaddleErrors(nextPaddleResponseErrors); }
  }, [nextPaddleResponseErrors]);

  const itemsPerPage = Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`);
  const { paddleParams, formChange, resetForm } = usePaddleSearchParams();
  const { data, errors, paddleSearchAPI } = usePaddleSearchAPI();
  const { count, paddleSearchCountAPI } = usePaddleSearchCountAPI();
  const [fetchedData, setfetchedData] = useState<TAdminPaddleSelect[]>([]);

  const formSearch = async () => {
    setfetchedData([]);
    setCurrentPage(1);
    const params = {
      ...paddleParams,
      pageNumber: 1,
      pageSize: itemsPerPage,
    };
    await paddleSearchAPI(params);
    await paddleSearchCountAPI(params);
  };
  const formClear = () => {

    setfetchedData([]);
    resetForm();
  };
  useEffect(() => {
    if (data) {
      setfetchedData(data);
    }
  }, [data]);
  useEffect(() => {
    if (errors) { setFormErrors(errors); }
  }, [errors]);


  const { sortName, sortFlg, handleSortNameChange, handleSortFlgChange } = useSort({
    searchAPI: paddleSearchAPI,
    initialSortName: "userId",
    itemsPerPage,
    params: paddleParams,
  });
  const { currentPage, setCurrentPage, handlePageChange } = usePagination({
    itemsPerPage,
    searchAPI: paddleSearchAPI,
    searchParams: paddleParams,
  });



  return (

    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminPaddleManagement}</span>
      </div>
      {texts.label.newRegist}
      <div className={formSearchStyles.formContainer}>
        <div className={formSearchStyles.formGrid}>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="auction" ><RequiredMark />{texts.goods.auctionName}</label>
            <KaisaiListPullDown
              onChange={(value) => handleKaisaiChange('auctionSeq', value, true)}
              selectedId={selectedRegistKaisai !== null ? String(selectedRegistKaisai) : ''}
              kaisaiStatus={5}
              defaultSetOption={1}
              spnKbns={["1"]}
            />
            {registErrors?.auctionSeq && <p className="error-message">{registErrors.auctionSeq}</p>}
            {nextPaddleErrors?.auctionSeq && <p className="error-message">{nextPaddleErrors.auctionSeq}</p>}
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="registUserId" >{texts.member.userId}</label>
            <div className={formSearchStyles.formRow}>
              <input
                id="registUserId"
                type="text"
                name="registUserId"
                maxLength={9}
                value={paddleRegistRequest?.userId}
                onChange={handleRegistDataChange}
              />
              <button type="button" className="bg-gray-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg w-40" onClick={() => setModalOpen(true)}>
                会員検索
              </button>

            </div>

          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="registUserName"> {texts.member.userName} </label>
            <input
              id="registUserName"
              type="text"
              name="registUserName"
              value={paddleRegistRequest?.userName}
              disabled
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="registUserName"> {texts.member.companyName} </label>
            <input
              id="registCompanyName"
              type="text"
              name="registCompanyName"
              value={paddleRegistRequest?.companyName}
              disabled
            />
          </div>
        </div>
        <div className={`${formSearchStyles.formGrid} !mt-2`}>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="auction" >{texts.paddle.paddleKbn}</label>
            <PaddleKbnPullDown
              onChange={(value) => handlePaddleKbnChange('paddleKbn', value, true)}
              selectedId={selectedRegistPaddleKbn !== null ? String(selectedRegistPaddleKbn) : ''}
            />
            {nextPaddleErrors?.paddleKbn && <p className="error-message">{nextPaddleErrors.paddleKbn}</p>}
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="registPaddleNo" >{texts.paddle.paddleNo}</label>
            <div className={formSearchStyles.formRow}>
              <input
                id="registPaddleNo"
                type="text"
                name="registPaddleNo"
                value={paddleRegistRequest?.paddleNo}
                onChange={handleRegistDataChange}
              />
              <button type="button" className="bg-gray-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg w-40" onClick={getNextPaddleNo}>
                自動採番
              </button>
            </div>
            
          </div>
          

        </div>
        <div className="text-right mt-2" >
           <RegistButton label={texts.button.regist} onClick={paddleDataRegist} />
        </div>
      </div>
     
      <div className={formSearchStyles.formContainer}>
        <div className={formSearchStyles.formGrid}>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="auction" ><RequiredMark />{texts.goods.auctionName}</label>
            <KaisaiListPullDown
              onChange={(value) => handleKaisaiChange('auctionSeq', value, false)}
              selectedId={selectedKaisai !== null ? String(selectedKaisai) : ''}
              kaisaiStatus={5}
              defaultSetOption={1}
              spnKbns={["1"]}
            />
            {formErrors?.auctionSeq && <p className="error-message">{formErrors.auctionSeq}</p>}
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="searchUserId" >{texts.member.userId}</label>
            <input
              id="searchUserId"
              type="text"
              name="searchUserId"
              maxLength={9}
              value={paddleParams.userId}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="searchUserName" >{texts.member.userName}</label>
            <input
              id="searchUserName"
              type="text"
              name="searchUserName"
              value={paddleParams.userName}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="auction" >{texts.paddle.paddleKbn}</label>
            <PaddleKbnPullDown
              onChange={(value) => handlePaddleKbnChange('paddleKbn', value, false)}
              selectedId={selectedSearchPaddleKbn !== null ? String(selectedSearchPaddleKbn) : ''}
            />

          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="searchPaddleNo" >{texts.paddle.paddleNo}</label>
            <input
              id="searchPaddleNo"
              type="text"
              name="searchPaddleNo"
              value={paddleParams.paddleNo}
              onChange={formChange}
            />
          </div>

        </div>
        <div className="text-right mt-2" >
          <SearchButton onClick={formSearch} />
          <ClearButton onClick={formClear} />
        </div>
      </div>

      {fetchedData && fetchedData.length > 0 ? (
        <>
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center p-4">
              <div className="text-left">
                <div className={adminStyles.resultContainer}>
                  <div className={adminStyles.resultRow}>
                    <span className={adminStyles.resultLabel}>{texts.label.resultKekka}</span>
                    <span>{count} {texts.label.resultCount}</span>
                  </div>
                  <div className={adminStyles.resultRow}>
                    <label className={adminStyles.resultLabel}>{texts.label.sort}</label>
                    <select id="sortName" className={adminStyles.sort} value={sortName} onChange={handleSortNameChange}>
                      <option value="userId">{texts.member.userId}</option>
                      <option value="shoninFlg">{texts.member.shonin}</option>
                    </select>
                    <select id="sortFlg" className={adminStyles.sort} onChange={handleSortFlgChange}>
                      <option value="asc">{texts.label.asc}</option>
                      <option value="desc">{texts.label.desc}</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b" >{texts.member.userName}/{texts.member.companyName} </th>
                  <th className="py-2 px-4 border-b" >{texts.paddle.paddleKbn}</th>
                  <th className="py-2 px-4 border-b" >{texts.paddle.paddleNo}</th>
                </tr>
              </thead>
              <tbody>
                {fetchedData.map((result) => (
                  <tr
                    key={result.userId}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <td className="py-1 px-4 border-b text-left">{result.userName}/{result.companyName}</td>
                    <td className="py-1 px-4 border-b text-left">{result.paddleKbnName}</td>
                    <td className="py-1 px-4 border-b text-left">{result.paddleNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
          <div >
            <Pagination className={adminStyles.paginationContainer}
              count={Math.max(1, Math.ceil(count / itemsPerPage))}
              page={currentPage}
              onChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <p></p>
      )}
      <MemberSearchModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleSelectMember}
      />
    </div>

  );
};

export default withAdminLayout(Page);