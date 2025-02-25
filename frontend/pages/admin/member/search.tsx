import { GetServerSideProps } from 'next';
import { toast } from 'react-toastify';
import { texts } from '@/config/texts';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import Pagination from '@mui/material/Pagination';
//ホック
import { withAuth } from '@/hocs/withAdminAuth';
import withAdminLayout from '@/hocs/withAdminLayout';

//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
import { useSorting } from '@/hooks/useSorting';
import { usePagination } from '@/hooks/usePagination';
import { useCheckboxSelection } from '@/hooks/useCheckboxSelection';
import { useKengenRedirect } from '@/hooks/useKengenRedirect';
import { useExecutionPermission } from '@/hooks/useExecutionPermission';
import { useToMemberRegist } from '@/hooks/moveScreen/useToMemberRegist';
//API
import { useUserSearchAPI } from '@/hooks/api/admin/user/useUserSearchAPI';
import { useUserCsvAPI } from '@/hooks/api/admin/user/useUserCsvAPI';
import { useUserSearchParams } from '@/hooks/searchParams/admin/useUserSearchParams';
//型定義
import { Result } from '@/types/admin/member/search';
import { PageProps } from '@/types/admin/adminPage';
//ボタン
import { SearchButton } from '@/components/ui/buttons/admin/searchButton';
import { ClearButton } from '@/components/ui/buttons/admin/clearButton';
import { OutPutButton } from '@/components/ui/buttons/admin/outputButton';
import { AddressCopyButton } from '@/components/ui/buttons/admin/addressCopyButton';
import { ShoninOnButton, ShoninOffButton } from '@/components/ui/buttons/admin/shoninButton';
//スタイル
import breadcrumbStyles from '@/styles/breadcrumb.module.css';
import formSearchStyles from '@/styles/admin/FormSearch.module.css';
import adminStyles from '@/styles/admin/AdminCommon.module.css';


export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.adminMemberList
    },
  };
});


const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, useCallback, texts } = useCommonSetup();

  useKengenRedirect(kengen, 102);
  const { executionPermission } = useExecutionPermission(kengen);

  const { memberParams, formChange, resetForm } = useUserSearchParams();
  const { data, userSearch } = useUserSearchAPI();

  const [memberData, setMemberData] = useState<Result[]>([]);

  const formSearch = async () => {
    setSelectAll(false);
    setSelectedIds([]);
    setMemberData([]);
    await userSearch(memberParams);
  };
  const formClear = () => {
    setSelectAll(false);
    setSelectedIds([]);
    setMemberData([]);
    resetForm();
  };
  useEffect(() => {
    if (data) {
      setMemberData(data);
    }
  }, [data]);
  //承認処理
  const updateShoninFlg = useCallback((userId: number, newFlg: boolean) => {
    setMemberData((prevData) =>
      prevData.map((member) =>
        member.userId === userId ? { ...member, shoninFlg: newFlg } : member
      )
    );
  }, []);

  //ソート設定
  const { data: sortedData, handleSort } = useSorting(memberData, 'userId', 'asc');
  const { currentPage, paginatedData, totalPageCount, handlePageChange } = usePagination(sortedData);
  //チェックボックス
  const { selectAll, setSelectAll, selectedIds, setSelectedIds, handleSelectAll, handleSelect } = useCheckboxSelection(memberData.map(member => member.userId));
  //会員登録画面に遷移
  const { toMemberRegist } = useToMemberRegist(kengen);
  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>, userId: number) => {
    toMemberRegist(e, userId);
  };

  const { userCsv } = useUserCsvAPI();
  const handleCsvExport = () => {
    if (selectedIds.length === 0) {
      toast.error(texts.message.selectAtLeastOne);
      return;
    }
    userCsv(selectedIds);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const handleAddressCopy = () => {
    if (selectedIds.length === 0) {
      toast.error(texts.message.selectAtLeastOne);
      return;
    }
    const selectedMails = sortedData
      .filter((result) => selectedIds.includes(result.userId))
      .map((result) => result.mail)
      .filter((mail) => !!mail);

    setModalContent(selectedMails.join("; "));
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false); // モーダルを閉じる
  };
  return (

    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminMemberList}</span>
      </div>
      <div className={formSearchStyles.formContainer}>
        <div className={formSearchStyles.formGrid}>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="userId" >{texts.member.userId}</label>
            <input
              id="userId"
              type="text"
              name="userId"
              maxLength={9}
              value={memberParams.userId}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="userName" >{texts.member.userName}</label>
            <input
              id="userName"
              type="text"
              name="userName"
              value={memberParams.userName}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="companyName" >{texts.member.companyName}</label>
            <input
              id="companyName"
              type="text"
              name="companyName"
              value={memberParams.companyName}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="freeWord" >{texts.common.freeWord}</label>
            <input
              id="freeWord"
              type="text"
              name="freeWord"
              value={memberParams.freeWord}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="shoninFlg" >{texts.member.shonin}</label>
            <select
              id="shoninFlg"
              name="shoninFlg"
              value={memberParams.shoninFlg}
              onChange={formChange}
            >
              <option value="">---</option>
              <option value="0">{texts.member.shoninOff}</option>
              <option value="1">{texts.member.shoninOn}</option>
            </select>
          </div>
        </div>
        <div className="text-right mt-2" >
          <SearchButton onClick={formSearch} />
          <ClearButton onClick={formClear} />
        </div>
      </div>

      {paginatedData && paginatedData.length > 0 ? (
        <>
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center p-4">
              <div className="text-left">
                {texts.label.resultKekka} {memberData.length} {texts.label.resultCount}
              </div>
              {executionPermission(102, 2) && (
                <div className="lg:text-right">
                  <div>
                    <OutPutButton onClick={handleCsvExport} />
                    <AddressCopyButton onClick={handleAddressCopy} />
                  </div>
                  <div className="lg:text-right">
                    {texts.member.mailcopy_note}
                  </div>
                </div>
              )}
            </div>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-2 px-4 border-b" onClick={() => handleSort('userId')}>{texts.member.userId}</th>
                  <th className="py-2 px-4 border-b" onClick={() => handleSort('userName')}>{texts.member.userName} </th>
                  <th className="py-2 px-4 border-b" onClick={() => handleSort('companyName')}>{texts.member.companyName}</th>
                  <th className="py-2 px-4 border-b" onClick={() => handleSort('fullAddress')}>{texts.member.address}</th>
                  <th className="py-2 px-4 border-b" onClick={() => handleSort('mail')}>{texts.common.mail}</th>
                  <th className="py-2 px-4 border-b" onClick={() => handleSort('adminBiko')}>{texts.member.adminBiko}</th>
                  <th className="py-2 px-4 border-b" onClick={() => handleSort('shoninFlg')}>{texts.member.shonin}</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((result) => (
                  <tr
                    key={result.userId}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={(e) => handleRowClick(e, result.userId)}
                  >
                    <td
                      className="py-2 px-4 border-b text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(result.userId)}
                        onChange={() => handleSelect(result.userId)}
                      />
                    </td>
                    <td className="py-1 px-4 border-b text-left">{result.userId}</td>
                    <td className="py-1 px-4 border-b text-left">{result.userName}</td>
                    <td className="py-1 px-4 border-b text-left">{result.companyName}</td>
                    <td className="py-1 px-4 border-b text-left">{result.fullAddress}</td>
                    <td className="py-1 px-4 border-b text-left">{result.mail}</td>
                    <td className="py-1 px-4 border-b text-left">{result.adminBiko}</td>
                    <td className="py-1 px-4 border-b text-center">
                      {executionPermission(102, 2) ? (
                        result.shoninFlg ? (
                          <ShoninOffButton
                            userId={result.userId}
                            onUpdate={updateShoninFlg}
                          />
                        ) : (
                          <ShoninOnButton
                            userId={result.userId}
                            onUpdate={updateShoninFlg}
                          />
                        )
                      ) : (
                        <span></span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
          <div >
            <Pagination className={adminStyles.paginationContainer}
              count={totalPageCount}
              page={currentPage}
              onChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <p></p>
      )}
      <Dialog open={isModalOpen} onClose={closeModal}
        sx={{
          '& .MuiDialog-paper': {
            width: '700px',
            height: '1000px',
          },
        }}>
        <DialogTitle>{texts.member.mailcopy}</DialogTitle>
        <DialogContent>
          <TextField
            value={modalContent}
            multiline
            fullWidth
            rows={20}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(modalContent);
              alert('テキストがコピーされました');
            }}
          >
            {texts.member.mailcopy}
          </Button>
          <Button onClick={closeModal}>{texts.button.close}</Button>
        </DialogActions>
      </Dialog>
    </div>

  );
};

export default withAdminLayout(Page);