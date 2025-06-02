import React from "react";
import Modal from "react-modal";
import Pagination from "@mui/material/Pagination";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useSort } from "@/hooks/useSort";
import { usePagination } from "@/hooks/usePagination";
//API
import { useUserSearchAPI } from "@/hooks/api/admin/user/useUserSearchAPI";
import { useUserSearchCountAPI } from "@/hooks/api/admin/user/useUserSearchCountAPI";
import { useUserSearchParams } from "@/hooks/searchParams/admin/useUserSearchParams";
//型定義
import { TAdminUserSelect } from "@/types/admin/member/search";
//ボタン
import { SearchButton } from "@/components/ui/buttons/admin/searchButton";
import { ClearButton } from "@/components/ui/buttons/admin/clearButton";
//スタイル
import formSearchStyles from "@/styles/admin/FormSearch.module.css";
import adminStyles from "@/styles/admin/AdminCommon.module.css";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (member: TAdminUserSelect) => void;
};
export const MemberSearchModal: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
  const { useState, useEffect, useCallback, texts } = useCommonSetup();
  const itemsPerPage = Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`);
  const { memberParams, formChange, resetForm } = useUserSearchParams();

  const { data, userSearchAPI } = useUserSearchAPI();
  const { count, userSearchCountAPI } = useUserSearchCountAPI();
  const [memberData, setMemberData] = useState<TAdminUserSelect[]>([]);
  const formSearch = async () => {
    setMemberData([]);
    setCurrentPage(1);
    const params = {
      ...memberParams,
      pageNumber: 1,
      pageSize: itemsPerPage,
    };
    await userSearchAPI(params);
    await userSearchCountAPI(params);
  };
  const formClear = () => {
    setMemberData([]);
    resetForm();
  };
  useEffect(() => {
    if (data) {
      setMemberData(data);
    }
  }, [data]);
  const { sortName, sortFlg, handleSortNameChange, handleSortFlgChange } = useSort({
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

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>会員検索</h2>
      <div className={`${formSearchStyles.formContainer} !bg-gray-200`}>
        <div className={formSearchStyles.formGrid}>
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
            <label htmlFor="freeWord">{texts.common.freeWord}</label>
            <input
              id="freeWord"
              type="text"
              name="freeWord"
              value={memberParams.freeWord}
              onChange={formChange}
            />
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
            <div className="flex flex-col sm:flex-row justify-between items-center p-4">
              <div className="text-left">
                <div className={adminStyles.resultContainer}>
                  <div className={adminStyles.resultRow}>
                    <span className={adminStyles.resultLabel}>{texts.label.resultKekka}</span>
                    <span>
                      {count} {texts.label.resultCount}
                    </span>
                  </div>
                  <div className={adminStyles.resultRow}>
                    <label className={adminStyles.resultLabel}>{texts.label.sort}</label>
                    <select
                      id="sortName"
                      className={adminStyles.sort}
                      value={sortName}
                      onChange={handleSortNameChange}
                    >
                      <option value="userId">{texts.member.userId}</option>
                      <option value="shoninFlg">{texts.member.shonin}</option>
                    </select>
                    <select
                      id="sortFlg"
                      className={adminStyles.sort}
                      onChange={handleSortFlgChange}
                    >
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
                  <th className="py-2 px-4 border-b"></th>
                  <th className="py-2 px-4 border-b">{texts.member.userId}</th>
                  <th className="py-2 px-4 border-b">{texts.member.userName} </th>
                  <th className="py-2 px-4 border-b">{texts.member.companyName}</th>
                  <th className="py-2 px-4 border-b">{texts.member.adminBiko}</th>
                </tr>
              </thead>
              <tbody>
                {memberData.map((result) => (
                  <tr key={result.userId} className="cursor-pointer hover:bg-gray-100">
                    <td
                      className="py-2 px-4 border-b text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <button
                        className="bg-yellow-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg w-full"
                        onClick={() => {
                          onSelect(result);
                          onClose();
                        }}
                      >
                        {" "}
                        選択
                      </button>
                    </td>
                    <td className="py-1 px-4 border-b text-left">{result.userId}</td>
                    <td className="py-1 px-4 border-b text-left">{result.userName}</td>
                    <td className="py-1 px-4 border-b text-left">{result.companyName}</td>
                    <td className="py-1 px-4 border-b text-left">{result.adminBiko}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <Pagination
              className={adminStyles.paginationContainer}
              count={Math.max(1, Math.ceil(count / itemsPerPage))}
              page={currentPage}
              onChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <span></span>
      )}
    </Modal>
  );
};
