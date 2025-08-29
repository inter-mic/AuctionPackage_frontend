import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { texts } from "@/config/texts.ja";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminLayout from "@/hocs/withAdminLayout";

//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useSort } from "@/hooks/sort/useSort";
import { usePagination } from "@/hooks/paging/usePagination";
import { useCheckboxSelection } from "@/hooks/useCheckboxSelection";
import { useKengenRedirect } from "@/hooks/useKengenRedirect";
import { useExecutionPermission } from "@/hooks/useExecutionPermission";
import { useToMemberRegist } from "@/hooks/moveScreen/useToMemberRegist";
//API
import { useUserSearchAPI } from "@/hooks/api/admin/user/useUserSearchAPI";
import { useUserSearchCountAPI } from "@/hooks/api/admin/user/useUserSearchCountAPI";
import { useUserCsvAPI } from "@/hooks/api/admin/user/useUserCsvAPI";
import { useUserSearchParams } from "@/hooks/searchParams/admin/useUserSearchParams";
//型定義
import { TAdminUserSelect } from "@/types/admin/member/search";
import { PageProps } from "@/types/admin/adminPage";
//ボタン
import { SearchButton } from "@/components/ui/buttons/admin/searchButton";
import { ClearButton } from "@/components/ui/buttons/admin/clearButton";
import { OutPutButton } from "@/components/ui/buttons/admin/outputButton";
import { AddressCopyButton } from "@/components/ui/buttons/admin/addressCopyButton";
import {
  MemberShoninOnButton,
  MemberShoninOffButton,
} from "@/components/ui/buttons/admin/memberShoninButton";
//スタイル
import formSearchStyles from "@/styles/admin/FormSearch.module.css";

//共通コンポーネント
import { AdminPageHeader } from "@/components/admin/common/AdminPageHeader";
import { AdminPagination } from "@/components/admin/common/AdminPagination";
import { AdminResultHeader } from "@/components/admin/common/AdminResultHeader";

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminMemberList,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, useCallback, texts } = useCommonSetup();
  const router = useRouter();

  useKengenRedirect(kengen, 102);
  const { executionPermission } = useExecutionPermission(kengen);

  const itemsPerPage = Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`);
  const { memberParams, formChange, resetForm } = useUserSearchParams();
  const { data, userSearchAPI } = useUserSearchAPI();
  const { count, userSearchCountAPI } = useUserSearchCountAPI();
  const [memberData, setMemberData] = useState<TAdminUserSelect[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const formSearch = useCallback(async () => {
    // 検索時にチェックボックス選択をリセット
    resetSelection();
    setMemberData([]); // useState の setter は安定参照なので依存に不要
    setCurrentPage(1);

    const params = {
      ...memberParams,
      pageNumber: 1,
      pageSize: itemsPerPage,
    };

    await userSearchAPI(params);
    await userSearchCountAPI(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberParams, itemsPerPage]);

  const formClear = async () => {
    setSelectAll(false);
    setSelectedIds([]);
    setMemberData([]);
    await resetForm();
    resetForm();
  };

  // URLパラメータから検索条件をセットして自動検索
  useEffect(() => {
    if (!isInitialized && router.isReady) {
      const { shoninFlg, teishiFlg } = router.query;

      if (shoninFlg || teishiFlg) {
        // URLパラメータがある場合、検索条件をセット
        if (shoninFlg) {
          formChange({
            target: {
              name: "shoninFlg",
              value: shoninFlg as string,
            },
          } as React.ChangeEvent<HTMLSelectElement>);
        }
        if (teishiFlg) {
          formChange({
            target: {
              name: "teishiFlg",
              value: teishiFlg as string,
            },
          } as React.ChangeEvent<HTMLSelectElement>);
        }

        // URLパラメータがある場合のみ自動検索を実行
        setTimeout(() => {
          // 直接パラメータを指定して検索を実行
          const params = {
            ...memberParams,
            shoninFlg: (shoninFlg as string) || "",
            teishiFlg: (teishiFlg as string) || "",
            pageNumber: 1,
            pageSize: itemsPerPage,
          };

          resetSelection();
          setMemberData([]);
          setCurrentPage(1);

          userSearchAPI(params);
          userSearchCountAPI(params);
        }, 1000);
      }

      setIsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query, isInitialized, formChange, formSearch]);

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

  const { data: allSelectData, userSearchAPI: allSelectSearchAPI } = useUserSearchAPI();
  const [allData, setAllData] = useState<TAdminUserSelect[]>([]);
  const fetchAllIds = async () => {
    const params = {
      ...memberParams,
      pageNumber: 1,
      pageSize: count,
    };
    await allSelectSearchAPI(params);
  };
  useEffect(() => {
    if (allSelectData) {
      setAllData(allSelectData);
    }
  }, [allSelectData]);

  const { sortName, handleSortNameChange, handleSortFlgChange } = useSort({
    searchAPI: userSearchAPI,
    initialSortName: "userId",
    itemsPerPage,
    params: memberParams,
  });
  const { currentPage, setCurrentPage, handlePageChange } = usePagination({
    itemsPerPage,
    searchAPI: userSearchAPI,
    searchParams: memberParams,
  });
  //チェックボックス
  const {
    selectAll,
    setSelectAll,
    selectedIds,
    setSelectedIds,
    handleSelectAll,
    handleSelect,
    resetSelection,
  } = useCheckboxSelection(
    memberData.map((member) => member.userId),
    allData.map((member) => member.userId),
    fetchAllIds
  );

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
    const selectedMails = memberData
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
      <AdminPageHeader title={texts.menu.adminMemberList} />
      <div className={formSearchStyles.formContainer}>
        <div className={formSearchStyles.formGrid}>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="userId">{texts.member.userId}</label>
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
            <label htmlFor="userName">{texts.member.userName}</label>
            <input
              id="userName"
              type="text"
              name="userName"
              value={memberParams.userName}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="companyName">{texts.member.companyName}</label>
            <input
              id="companyName"
              type="text"
              name="companyName"
              value={memberParams.companyName}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="address">{texts.member.address}</label>
            <input
              id="address"
              type="text"
              name="address"
              value={memberParams.address}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="freeWord">{texts.common.freeWord}</label>
            <input
              id="freeWord"
              type="text"
              name="freeWord"
              value={memberParams.freeWord}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="shoninFlg">{texts.member.shonin}</label>
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
          <div className={formSearchStyles.formItem}>
            <label htmlFor="bidFlg">{texts.label.bidFlg}</label>
            <select id="bidFlg" name="bidFlg" value={memberParams.bidFlg} onChange={formChange}>
              <option value="">---</option>
              <option value="0">{texts.member.bidFlgOff}</option>
              <option value="1">{texts.member.bidFlgOn}</option>
            </select>
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="teishiFlg">{texts.label.teishi}</label>
            <select
              id="teishiFlg"
              name="teishiFlg"
              value={memberParams.teishiFlg}
              onChange={formChange}
            >
              <option value="">---</option>
              <option value="0">{texts.member.teishiOff}</option>
              <option value="1">{texts.member.teishiOn}</option>
            </select>
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="auctionMailJushinFlg">{texts.member.auctionMailJushinFlg}</label>
            <select
              id="auctionMailJushinFlg"
              name="auctionMailJushinFlg"
              value={memberParams.auctionMailJushinFlg}
              onChange={formChange}
            >
              <option value="">---</option>
              <option value="1">{texts.common.mailJushinOn}</option>
              <option value="0">{texts.common.mailJushinOff}</option>
            </select>
          </div>
        </div>
        <div className="text-right mt-2">
          <SearchButton onClick={formSearch} />
          <ClearButton onClick={formClear} />
        </div>
      </div>

      {memberData && memberData.length > 0 ? (
        <>
          <div>
            <AdminResultHeader
              count={count}
              sortName={sortName}
              onSortNameChange={handleSortNameChange}
              onSortFlgChange={handleSortFlgChange}
              sortOptions={[
                { value: "userId", label: texts.member.userId },
                { value: "shoninFlg", label: texts.member.shonin },
              ]}
              ascText={texts.label.asc}
              descText={texts.label.desc}
            >
              {executionPermission(102, 2) && (
                <>
                  <div>
                    <OutPutButton onClick={handleCsvExport} />
                    <AddressCopyButton onClick={handleAddressCopy} />
                  </div>
                  <div className="lg:text-right">{texts.member.mailcopy_note}</div>
                </>
              )}
            </AdminResultHeader>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">
                    <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                  </th>
                  <th className="py-2 px-4 border-b">{texts.member.userId}</th>
                  <th className="py-2 px-4 border-b">{texts.member.userName} </th>
                  <th className="py-2 px-4 border-b">{texts.member.companyName}</th>
                  <th className="py-2 px-4 border-b">{texts.member.address}</th>
                  <th className="py-2 px-4 border-b">{texts.common.mail}</th>
                  <th className="py-2 px-4 border-b">{texts.member.adminBiko}</th>
                  <th className="py-2 px-4 border-b">{texts.member.auctionMailJushinFlg}</th>
                  <th className="py-2 px-4 border-b">{texts.member.shonin}</th>
                </tr>
              </thead>
              <tbody>
                {memberData.map((result) => (
                  <tr
                    key={result.userId}
                    className={`cursor-pointer hover:bg-gray-100 ${
                      result.teishiFlg ? "bg-gray-300" : ""
                    }`}
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
                      {result.auctionMailJushinFlg
                        ? texts.common.mailJushinOn
                        : texts.common.mailJushinOff}
                    </td>
                    <td className="py-1 px-4 border-b text-center">
                      {executionPermission(102, 2) ? (
                        result.shoninFlg ? (
                          <MemberShoninOffButton
                            userId={result.userId}
                            onUpdate={updateShoninFlg}
                          />
                        ) : (
                          <MemberShoninOnButton userId={result.userId} onUpdate={updateShoninFlg} />
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
          <AdminPagination
            count={count}
            page={currentPage}
            onChange={handlePageChange}
            itemsPerPage={itemsPerPage}
          />
        </>
      ) : (
        <p></p>
      )}
      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        sx={{
          "& .MuiDialog-paper": {
            width: "700px",
            height: "1000px",
          },
        }}
      >
        <DialogTitle>{texts.member.mailcopy}</DialogTitle>
        <DialogContent>
          <TextField value={modalContent} multiline fullWidth rows={20} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(modalContent);
              alert("テキストがコピーされました");
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
