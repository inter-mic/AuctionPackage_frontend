import { GetServerSideProps } from 'next';
import { texts } from '@/config/texts';
import Pagination from '@mui/material/Pagination';
import { useRef } from "react";
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
import { TAdminPaddleSelect, TAdminPaddleRegistRequest, TAdminNextPaddleSearchRequest, initialTAdminPaddleRegistRequest } from '@/types/admin/paddle/management';
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
import ConfirmDialog from '@/components/ui/dialog/confirmDialog';
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

  const inputRef = useRef<HTMLInputElement>(null);
  //登録
  const [selectedRegistKaisai, setSelectedRegistKaisai] = useState<string>('');
  const [registErrors, setRegistErrors] = useState<{ [key: string]: string }>({});
  const [paddleInsertRequest, setPaddleInsertRequest] = useState<TAdminPaddleRegistRequest>();
  const [nextPaddleSearchRequest, setNextPaddleSearchRequest] = useState<TAdminNextPaddleSearchRequest>();
  const { userName: registUserName, companyName: registCompanyName, userGetInfo } = useUserGetInfoAPI();
  const handleRegistDataChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, checked?: boolean) => {

    const { name, value, type } = e.target;
    setPaddleInsertRequest((prevGoodsData) => ({ ...prevGoodsData, [name]: value }));
    if (name === 'userId') {
      setPaddleInsertRequest(prevData => ({
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
  const { responseStatus, errors: insertResponseErrors, paddleRegistAPI: insertPaddleRegistAPI } = usePaddleRegistAPI();
  const paddleDataInsert = () => {
    if (paddleInsertRequest) {
      insertPaddleRegistAPI(paddleInsertRequest, false);
    }
  };
  useEffect(() => {
    if (responseStatus == 200) {
      setPaddleInsertRequest(initialTAdminPaddleRegistRequest);
      inputRef.current?.focus();
    }
  }, [responseStatus]);
  useEffect(() => {
    if (insertResponseErrors) { setRegistErrors(insertResponseErrors); }
  }, [insertResponseErrors]);

  //会員検索
  const [isModalOpen, setModalOpen] = useState(false);
  const handleSelectMember = (member: TAdminUserSelect) => {
    setPaddleInsertRequest(prevData => ({
      ...prevData,
      userId: member.userId.toString(),
      userName: member.userName,
      companyName: member.companyName
    }));
  };
  useEffect(() => {
    if (registUserName) {
      setPaddleInsertRequest(prevData => ({
        ...prevData,
        userName: registUserName,
      }));
    }
    if (registCompanyName) {
      setPaddleInsertRequest(prevData => ({
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
    if (nextPaddleSearchRequest) {
      nextPaddleNoSearchAPI(nextPaddleSearchRequest);
    }
  }
  useEffect(() => {
    if (nextPaddleNo) {
      setPaddleInsertRequest(prevData => ({
        ...prevData,
        paddleNo: nextPaddleNo,
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
  const registClear = () => {
    setSelectedRegistKaisai("");
    setSelectedRegistPaddleKbn("");
    setPaddleInsertRequest(initialTAdminPaddleRegistRequest);
  }
  useEffect(() => {
    if (data) {
      setfetchedData(data);
    }
  }, [data]);
  useEffect(() => {
    if (errors) { setFormErrors(errors); }
  }, [errors]);
  useEffect(() => {
    if (fetchedData.length > 0) {
      const initialEditableRows = fetchedData.reduce((acc, row) => {
        acc[row.userId] = {
          paddleKbn: row.paddleKbn,
          paddleNo: row.paddleNo,
        };
        return acc;
      }, {} as Record<string, { paddleKbn: string; paddleNo: string }>);
      
      setEditableRows(initialEditableRows);
    }
  }, [fetchedData]);

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
  const [editableRows, setEditableRows] = useState<Record<string, { paddleKbn: string; paddleNo: string }>>({});
  const handleUpdateChange = (userId: string, field: keyof TAdminPaddleRegistRequest, value: string) => {
    setEditableRows(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }));
  };

  //更新
  const { responseStatus: updateResponseStatus, errors: updateResponseErrors, paddleRegistAPI: updatePaddleRegistAPI } = usePaddleRegistAPI();
  const [updateErrors, setUpdateErrors] = useState<{ [key: string]: string }>({});
  const [paddleUpdateRequest, setPaddleUpdateRequest] = useState<TAdminPaddleRegistRequest>();
  const paddleDataUpdate = (row: TAdminPaddleRegistRequest) => {
    
    if (!row.userId) { return; }
    const updated = editableRows[row.userId];
   
    if (!updated) return;
    setPaddleUpdateRequest(prevData => ({
      ...prevData,
      userId: row.userId,
      auctionSeq: row.auctionSeq,
      paddleKbn: updated.paddleKbn,
      paddleNo: updated.paddleNo
    }));
   
    if (paddleUpdateRequest) {
      updatePaddleRegistAPI(paddleUpdateRequest, true);
    }
  };
  useEffect(() => {
    if (updateResponseErrors) { setUpdateErrors(updateResponseErrors); }
  }, [updateResponseErrors]);

  //削除処理
  const { paddleDeleteAPI } = usePaddleDeleteAPI();
  const handleDeleteSubmit = (auctionSeq: string, userId: string) => {
    paddleDeleteAPI(auctionSeq, userId);
  };

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
            <label htmlFor="userId" ><RequiredMark />{texts.member.userId}</label>
            <div className={formSearchStyles.formRow}>
              <input
                ref={inputRef}
                id="userId"
                type="number"
                name="userId"
                maxLength={9}
                value={paddleUpdateRequest?.userId}
                onChange={handleRegistDataChange}
              />
              <button type="button" className="bg-gray-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg w-40" onClick={() => setModalOpen(true)}>
                会員検索
              </button>

            </div>
            {registErrors?.userId && <p className="error-message">{registErrors.userId}</p>}

          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="registUserName"> {texts.member.userName} </label>
            <input
              id="registUserName"
              type="text"
              name="registUserName"
              value={paddleUpdateRequest?.userName}
              disabled
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="registUserName"> {texts.member.companyName} </label>
            <input
              id="registCompanyName"
              type="text"
              name="registCompanyName"
              value={paddleUpdateRequest?.companyName}
              disabled
            />
          </div>
        </div>
        <div className={`${formSearchStyles.formGrid} !mt-2`}>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="auction" ><RequiredMark />{texts.paddle.paddleKbn}</label>
            <PaddleKbnPullDown
              onChange={(value) => handlePaddleKbnChange('paddleKbn', value, true)}
              selectedId={selectedRegistPaddleKbn !== null ? String(selectedRegistPaddleKbn) : ''}
            />
            {nextPaddleErrors?.paddleKbn && <p className="error-message">{nextPaddleErrors.paddleKbn}</p>}
            {registErrors?.paddleKbn && <p className="error-message">{registErrors.paddleKbn}</p>}
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="paddleNo" ><RequiredMark />{texts.paddle.paddleNo}</label>
            <div className={formSearchStyles.formRow}>
              <input
                id="paddleNo"
                type="text"
                name="paddleNo"
                value={paddleUpdateRequest?.paddleNo}
                onChange={handleRegistDataChange}
              />
              <button type="button" className="bg-gray-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg w-40" onClick={getNextPaddleNo}>
                自動採番
              </button>
            </div>
            {registErrors?.paddleNo && <p className="error-message">{registErrors.paddleNo}</p>}
          </div>


        </div>
        <div className="text-right mt-2" >
          <RegistButton label={texts.button.regist} onClick={paddleDataInsert} />
          <ClearButton onClick={registClear} />
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
              type="number"
              name="searchUserId"
              maxLength={9}
              value={paddleParams.userId}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="searchUserName" >{texts.member.userName}/{texts.member.companyName}</label>
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
                  <th className="py-2 px-4 border-b" >{texts.member.userId} </th>
                  <th className="py-2 px-4 border-b" >{texts.member.userName}/{texts.member.companyName} </th>
                  <th className="py-2 px-4 border-b" >{texts.paddle.paddleKbn}</th>
                  <th className="py-2 px-4 border-b" >{texts.paddle.paddleNo}</th>
                  <th className="py-2 px-4 border-b" ></th>
                  <th className="py-2 px-4 border-b" ></th>
                  <th className="py-2 px-4 border-b" ></th>
                </tr>
              </thead>
              <tbody>
                {fetchedData.map((result) => (
                  <tr
                    key={result.userId}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <td className="py-1 px-4 border-b text-left">{result.userId}</td>
                    <td className="py-1 px-4 border-b text-left">{result.userName}/{result.companyName}</td>
                    <td className="py-1 px-4 border-b text-left">
                      <PaddleKbnPullDown
                        onChange={(value) => handleUpdateChange(result.userId, 'paddleKbn', value)}
                        selectedId={editableRows[result.userId]?.paddleKbn ?? result.paddleKbn}
                        className={adminStyles.tabelCellInput}
                      />

                    </td>
                    <td className="py-1 px-4 border-b">
                      <input
                        type="text"
                        value={editableRows[result.userId]?.paddleNo ?? result.paddleNo}
                        onChange={(e) => handleUpdateChange(result.userId, "paddleNo", e.target.value)}
                        className={adminStyles.tabelCellInput}
                      />
                      {result.userId == paddleUpdateRequest?.userId && updateErrors?.paddleNo && <p className="error-message">{updateErrors.paddleNo}</p>}
                    </td>
                    <td className="py-1 px-4 border-b text-center">

                    </td>
                    <td className="py-1 px-4 border-b text-center">
                      <RegistButton
                        label={texts.button.update} onClick={() => paddleDataUpdate(result)}
                      />
                    </td>
                    <td className="py-1 px-4 border-b text-center">
                      <ConfirmDialog
                        title={texts.message.confirmDelete}
                        description={texts.label.delete_note_1}
                        buttonTitle={texts.button.delete}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-40"
                        dialogCancelClassName="lg:ml-2.5 mt-2 lg:mt-0 bg-white border border-solid border-red-500 text-red-500 font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
                        dialogClassName="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg w-40"
                        onSubmit={() => handleDeleteSubmit(result.auctionSeq, result.userId)}
                        buttonText={texts.button.delete}
                      />


                    </td>
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