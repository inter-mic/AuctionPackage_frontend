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
import { usePaddleRegistAPI } from '@/hooks/api/admin/paddle/usePaddleRegistAPI';
import { usePaddleDeleteAPI } from '@/hooks/api/admin/paddle/usePaddleDeleteAPI';
import { useOnlineBidShoninAPI } from '@/hooks/api/admin/paddle/useOnlineBidShoninAPI';
import { usePaddleNumberSearchAPI } from '@/hooks/api/public/usePaddleNumberSearchAPI';
//型定義
import { TAdminPaddleSelect, TAdminPaddleRegistRequest, TAdminPaddleShoninRequest } from '@/types/admin/paddle/management';
import { PageProps } from '@/types/admin/adminPage';
//ボタン
import { SearchButton } from '@/components/ui/buttons/admin/searchButton';
import { ClearButton } from '@/components/ui/buttons/admin/clearButton';
import { RegistButton } from '@/components/ui/buttons/admin/registButton';
//コンポーネント
import { RequiredMark } from '@/components/ui/marks/RequiredMark';
import { KaisaiListPullDown } from '@/components/ui/pulldowns/KaisaiListPullDown';
import { PaddleKbnPullDown } from '@/components/ui/pulldowns/PaddleKbnPullDown';
import ConfirmDialog from '@/components/ui/dialog/confirmDialog';
import PaddleRegistrationFormAccordion from '@/components/admin/paddle/PaddleRegistrationFormAccordion';
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

 const { paddleKbnList } = usePaddleNumberSearchAPI();


  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  //開催回プルダウン
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

  //パドル区分プルダウン
  const [selectedSearchPaddleKbn, setSelectedSearchPaddleKbn] = useState<string | null>(null);
  const handlePaddleKbnChange = (name: string, value: string) => {
    setSelectedSearchPaddleKbn(value);
    formChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
    if (errors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };
  //ページネーション
  const itemsPerPage = Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`);
  const { paddleParams, formChange, resetForm } = usePaddleSearchParams();
  const { data, errors, paddleSearchAPI } = usePaddleSearchAPI();
  const { count, paddleSearchCountAPI } = usePaddleSearchCountAPI();
  const [fetchedData, setfetchedData] = useState<TAdminPaddleSelect[]>([]);

  //検索
  const formSearch = async () => {
    setfetchedData([]);
    setCurrentPage(1);
    setUpdateErrors({}); 
    const params = {
      ...paddleParams,
      pageNumber: 1,
      pageSize: itemsPerPage,
    };
    await paddleSearchAPI(params);
    await paddleSearchCountAPI(params);
  };

  //検索クリア
  const formClear = () => {
    setfetchedData([]);
    resetForm();
    setFormErrors({});
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
  const handleUpdateChange = (userId: string, field: keyof TAdminPaddleRegistRequest, value: string) => {
    setfetchedData(prevData =>
      prevData.map(item =>
        item.userId === userId
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  //更新
  const { responseStatus: updateResponseStatus, errors: updateResponseErrors, paddleRegistAPI: updatePaddleRegistAPI } = usePaddleRegistAPI();
  const [updateErrors, setUpdateErrors] = useState<{ [key: string]: string }>({});
  const [paddleUpdateRequest, setPaddleUpdateRequest] = useState<TAdminPaddleRegistRequest>();
  const paddleDataUpdate = (row: TAdminPaddleRegistRequest) => {

    const current = fetchedData.find(item => item.userId === row.userId);
    if (!current) return;
    const requestData: TAdminPaddleRegistRequest = {
      userId: current.userId,
      auctionSeq: current.auctionSeq,
      paddleKbn: current.paddleKbn,
      paddleNo: current.paddleNo,
    };
  
    setPaddleUpdateRequest(requestData);
    updatePaddleRegistAPI(requestData, true);
  };
  useEffect(() => {
    if (updateResponseErrors) { setUpdateErrors(updateResponseErrors); }
  }, [updateResponseErrors]);


  //承認
  const { responseStatus: onlineBidShoninResponseStatus, errors: onlineBidShoninResponseErrors, onlineBidShoninAPI } = useOnlineBidShoninAPI();
  const [onlineBidShoninErrors, setOnlineBidShoninErrors] = useState<{ [key: string]: string }>({});
  const [onlineBidShoninRequest, setOnlineBidShoninRequest] = useState<TAdminPaddleShoninRequest>();

  const onlineBidShoninUpdate = (row: TAdminPaddleShoninRequest) => {

    const current = fetchedData.find(item => item.userId === row.userId);
    if (!current) return;
    const requestData: TAdminPaddleRegistRequest = {
      userId: current.userId,
      auctionSeq: current.auctionSeq,
      paddleKbn: current.paddleKbn,
      paddleNo: current.paddleNo,
    };
    onlineBidShoninAPI(requestData);
  };
  useEffect(() => {
    if (onlineBidShoninResponseStatus == 200) {
      const params = {
        ...paddleParams,
        pageNumber: currentPage,
        pageSize: itemsPerPage,
      };
      paddleSearchAPI(params);
      setUpdateErrors({});    
    }
  }, [onlineBidShoninResponseStatus]);
  useEffect(() => {
    if (onlineBidShoninResponseErrors) { setOnlineBidShoninErrors(onlineBidShoninResponseErrors); }
  }, [onlineBidShoninResponseErrors]);

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

      <PaddleRegistrationFormAccordion paddleKbnList={paddleKbnList}/>

      <div className={`${formSearchStyles.formContainer} mt-5`}>
        <div className={formSearchStyles.formGrid}>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="auction" ><RequiredMark />{texts.goods.auctionName}</label>
            <KaisaiListPullDown
              onChange={(value) => handleKaisaiChange('auctionSeq', value)}
              selectedId={selectedKaisai !== null ? String(selectedKaisai) : ''}
              kaisaiStatus={5}
              defaultSetOption={1}
              spnKbns={["1"]}
            />
            {formErrors?.auctionSeq && <p className="error-message">{formErrors.auctionSeq}</p>}
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="userId" >{texts.member.userId}</label>
            <input
              id="userId"
              type="number"
              name="userId"
              maxLength={9}
              value={paddleParams.userId}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="userName" >{texts.member.userName}/{texts.member.companyName}</label>
            <input
              id="userName"
              type="text"
              name="userName"
              value={paddleParams.userName}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="auction" >{texts.paddle.paddleKbn}</label>
            <PaddleKbnPullDown
              onChange={(value) => handlePaddleKbnChange('paddleKbn', value)}
              selectedId={selectedSearchPaddleKbn !== null ? String(selectedSearchPaddleKbn) : ''}
              paddleKbnList={paddleKbnList} 
            />

          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="paddleNo" >{texts.paddle.paddleNo}</label>
            <input
              id="paddleNo"
              type="text"
              name="paddleNo"
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
                      <option value="paddleKbn">{texts.paddle.paddleKbn}</option>
                      <option value="paddleNo">{texts.paddle.paddleNo}</option>
                    </select>
                    <select id="sortFlg" className={adminStyles.sort} onChange={handleSortFlgChange}>
                      <option value="asc">{texts.label.asc}</option>
                      <option value="desc">{texts.label.desc}</option>
                    </select>
                  </div>
                </div>
              </div>
               <div className="text-right">
                  <div>
                    <span className="text-sm">{texts.paddle.onlineBidshonin}:{texts.paddle.onlineBidshonin_note_1}</span>
                  </div>
                  
                </div>


            </div>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b" >{texts.member.userId} </th>
                  <th className="py-2 px-4 border-b" >{texts.member.userName}</th>
                  <th className="py-2 px-4 border-b" >{texts.member.companyName} </th>
                  <th className="py-2 px-4 border-b w-72" >{texts.paddle.paddleKbn}</th>
                  <th className="py-2 px-4 border-b w-40" >{texts.paddle.paddleNo}</th>
                  <th className="py-2 px-4 border-b w-48" >{texts.paddle.onlineBidshonin}</th>
                  <th className="py-2 px-4 border-b w-40" ></th>
                  <th className="py-2 px-4 border-b w-40" ></th>
                </tr>
              </thead>
              <tbody>
                {fetchedData.map((result) => (
                  <tr
                    key={result.userId}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <td className="py-1 px-4 border-b text-left">{result.userId}</td>
                    <td className="py-1 px-4 border-b text-left">{result.userName}</td>
                    <td className="py-1 px-4 border-b text-left">{result.companyName}</td>
                    <td className="py-1 px-4 border-b text-left">
                      <PaddleKbnPullDown
                        onChange={(value) => handleUpdateChange(result.userId, 'paddleKbn', value)}
                        selectedId={result.paddleKbn}
                        className={adminStyles.tabelCellInput}
                        paddleKbnList={paddleKbnList} 
                      />

                    </td>
                    <td className="py-1 px-4 border-b w-40">

                      <input
                        type="text"
                        value={result.paddleNo}
                        onChange={(e) => handleUpdateChange(result.userId, "paddleNo", e.target.value)}
                        className={adminStyles.tabelCellInput}
                      />
                      {result.userId == paddleUpdateRequest?.userId && updateErrors?.paddleNo && <p className="error-message">{updateErrors.paddleNo}</p>}
                      {result.userId == onlineBidShoninRequest?.userId && onlineBidShoninErrors?.paddleNo && <p className="error-message">{updateErrors.paddleNo}</p>}
                    </td>
                    <td className="py-1 px-4 border-b text-center">
                      {result.paddleKbn == '3' ? (
                        result.onlinebidShohinFlg ? (
                          <span>{texts.paddle.shoninzumi}</span>
                        ) : (
                          <RegistButton
                            label={texts.button.onlineBidshoninOn}
                            onClick={() => onlineBidShoninUpdate(result)}
                          />
                        )
                      ) : null}
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

    </div>

  );
};

export default withAdminLayout(Page);