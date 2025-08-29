import { GetServerSideProps } from "next";
import { toast } from "react-toastify";
import { texts } from "@/config/texts.ja";
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
import { useToTorihikiMeisai } from "@/hooks/moveScreen/useToTorihikiMeisai";
//API
import { useTorihikiJissekiSearchAPI } from "@/hooks/api/admin/torihikiJisseki/useTorihikiJissekiSearchAPI";
import { useTorihikiJissekiSearchCountAPI } from "@/hooks/api/admin/torihikiJisseki/useTorihikiJissekiSearchCountAPI";
import { useTorihikiJissekiCsvAPI } from "@/hooks/api/admin/torihikiJisseki/useTorihikiJissekiCsvAPI";
import { useInvoicePdfAPI } from "@/hooks/api/admin/pdf/useInvoicePdfAPI";
//型定義
import {
  TAdminTorihikiJissekiRequest,
  TVTorihikiJisseki,
} from "@/types/admin/torihikiJisseki/search";
import { PageProps } from "@/types/admin/adminPage";
//コンポーネント
import { KaisaiListPullDown } from "@/components/ui/pulldowns/KaisaiListPullDown";
import { RequiredMark } from "@/components/ui/marks/RequiredMark";
//ボタン
import { SearchButton } from "@/components/ui/buttons/admin/searchButton";
import { OutPutButton } from "@/components/ui/buttons/admin/outputButton";

//スタイル
import formSearchStyles from "@/styles/admin/FormSearch.module.css";

//共通コンポーネント
import { AdminPageHeader } from "@/components/admin/common/AdminPageHeader";
import { AdminPagination } from "@/components/admin/common/AdminPagination";
import { AdminResultHeader } from "@/components/admin/common/AdminResultHeader";

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminTorihikiJisseki,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen, optionInvoice }) => {
  const { useState, useEffect, texts } = useCommonSetup();

  useKengenRedirect(kengen, 104);
  const { executionPermission } = useExecutionPermission(kengen);
  const itemsPerPage = Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`);
  const [searchParams, setSearchParams] = useState<TAdminTorihikiJissekiRequest>({
    auctionSeq: 0,
    pageNumber: 1,
    pageSize: itemsPerPage,
  });

  const handleInputChange = (name: string, value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [selectedKaisai, setSelectedKaisai] = useState<string>("");
  const handleKaisaiChange = (name: string, value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSelectedKaisai(value);
    if (errors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const { torihikiList, errors, torihikiJissekiSearchAPI } = useTorihikiJissekiSearchAPI();
  const { count, torihikiJissekiSearchCountAPI } = useTorihikiJissekiSearchCountAPI();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const formSearch = async () => {
    // 検索時にチェックボックス選択をリセット
    resetSelection();

    const params = {
      ...searchParams,
      pageNumber: 1,
      pageSize: itemsPerPage,
    };
    await torihikiJissekiSearchAPI(params);
    await torihikiJissekiSearchCountAPI(params);
  };
  useEffect(() => {
    if (errors) {
      setFormErrors(errors);
    }
  }, [errors]);

  const { torihikiList: allSelectData, torihikiJissekiSearchAPI: allSelectSearchAPI } =
    useTorihikiJissekiSearchAPI();
  const [allData, setAllData] = useState<TVTorihikiJisseki[]>([]);
  const fetchAllIds = async () => {
    const params = {
      ...searchParams,
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

  //チェックボックス
  const { selectAll, selectedIds, handleSelectAll, handleSelect, resetSelection } =
    useCheckboxSelection(
      torihikiList.map((torihiki) => torihiki.userId),
      allData.map((torihiki) => torihiki.userId),
      fetchAllIds
    );

  //ソート設定
  const { sortName, handleSortNameChange, handleSortFlgChange } = useSort({
    searchAPI: torihikiJissekiSearchAPI,
    initialSortName: "userId",
    itemsPerPage,
    params: {
      ...searchParams,
      pageNumber: 1,
      pageSize: itemsPerPage,
    },
  });
  const { currentPage, handlePageChange } = usePagination({
    itemsPerPage,
    searchAPI: torihikiJissekiSearchAPI,
    searchParams: searchParams,
  });

  const { torihikiJissekiCsv } = useTorihikiJissekiCsvAPI();
  const handleTorihikiCsvExport = (csvKbn: number) => {
    if (selectedIds.length === 0) {
      toast.error(texts.message.selectAtLeastOne);
      return;
    }
    torihikiJissekiCsv(Number(selectedKaisai), selectedIds, csvKbn);
  };
  const { invoicePdfAPI } = useInvoicePdfAPI();

  const handleInvoice = () => {
    if (selectedIds.length === 0) {
      toast.error(texts.message.selectAtLeastOne);
      return;
    }
    invoicePdfAPI(Number(selectedKaisai), selectedIds);
  };
  const { toTorihikiMeisai } = useToTorihikiMeisai(kengen);
  const handleRowClick = (
    e: React.MouseEvent<HTMLTableRowElement>,
    auctionSeq: number,
    userId: number
  ) => {
    toTorihikiMeisai(e, auctionSeq, userId);
  };

  return (
    <div>
      <AdminPageHeader title={texts.menu.adminTorihikiJisseki} />
      <div className={formSearchStyles.formContainer}>
        <div className={formSearchStyles.formGrid}>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="auction">
              <RequiredMark />
              {texts.goods.auctionName}
            </label>
            <KaisaiListPullDown
              className=""
              onChange={(value) => handleKaisaiChange("auctionSeq", value)}
              selectedId={selectedKaisai !== null ? String(selectedKaisai) : ""}
              kaisaiStatus={0}
            />
            {formErrors?.auctionSeq && <p className="error-message">{formErrors.auctionSeq}</p>}
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="userId">{texts.member.userId}</label>
            <input
              id="userId"
              name="userId"
              maxLength={9}
              value={searchParams.userId}
              onChange={(e) => handleInputChange("userId", e.target.value)}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="userName">
              {texts.member.userName}/{texts.member.companyName}
            </label>
            <input
              id="userName"
              name="userName"
              value={searchParams.userName}
              onChange={(e) => handleInputChange("userName", e.target.value)}
            />
          </div>
        </div>
        <div className="text-right  mt-2">
          <SearchButton onClick={formSearch} />
        </div>
      </div>
      {torihikiList && torihikiList.length > 0 ? (
        <div>
          <AdminResultHeader
            count={count}
            sortName={sortName}
            onSortNameChange={handleSortNameChange}
            onSortFlgChange={handleSortFlgChange}
            sortOptions={[
              { value: "userId", label: texts.member.userId },
              { value: "rakusatsusu", label: texts.torihikiJisseki.rakusatsusu },
              { value: "rakusatsuPrice", label: texts.torihikiJisseki.rakusatsuPrice },
            ]}
            ascText={texts.label.asc}
            descText={texts.label.desc}
          >
            {executionPermission(102, 2) && (
              <>
                {optionInvoice && (
                  <OutPutButton onClick={() => handleInvoice()} text={texts.button.invoicePdf} />
                )}
                <OutPutButton
                  onClick={() => handleTorihikiCsvExport(1)}
                  text={texts.button.torihikiCsv}
                />
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
                <th className="py-2 px-4 border-b">{texts.member.userName}</th>
                <th className="py-2 px-4 border-b">{texts.member.companyName}</th>
                <th className="py-2 px-4 border-b">{texts.torihikiJisseki.shuppinsu}</th>
                <th className="py-2 px-4 border-b">{texts.torihikiJisseki.shuppinPrice}</th>
                <th className="py-2 px-4 border-b">{texts.torihikiJisseki.shuppinTesuryoPrice}</th>
                <th className="py-2 px-4 border-b">{texts.torihikiJisseki.shuppinTotalPrice}</th>
                <th className="py-2 px-4 border-b">{texts.torihikiJisseki.rakusatsusu}</th>
                <th className="py-2 px-4 border-b">{texts.torihikiJisseki.rakusatsuPrice}</th>
                <th className="py-2 px-4 border-b">
                  {texts.torihikiJisseki.rakusatsuTesuryoPrice}
                </th>
                <th className="py-2 px-4 border-b">{texts.torihikiJisseki.rakusatsuTotalPrice}</th>
              </tr>
            </thead>
            <tbody>
              {torihikiList.length > 0 &&
                torihikiList.map((result) => (
                  <tr
                    key={result.userId}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={(e) => handleRowClick(e, result.auctionSeq, result.userId)}
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
                    <td className="py-2 px-4 border-b text-right">{result.userId}</td>
                    <td className="py-2 px-4 border-b text-right">{result.userName}</td>
                    <td className="py-2 px-4 border-b text-right">{result.companyName}</td>
                    <td className="py-2 px-4 border-b text-right">{result.shuppinsu}</td>
                    <td className="py-2 px-4 border-b text-right">{result.shuppinPrice}</td>
                    <td className="py-2 px-4 border-b text-right">{result.shuppinTesuryoPrice}</td>
                    <td className="py-2 px-4 border-b text-right">{result.shuppinTotalPrice}</td>
                    <td className="py-2 px-4 border-b text-right">{result.rakusatsusu}</td>
                    <td className="py-2 px-4 border-b text-right">{result.rakusatsuPrice}</td>
                    <td className="py-2 px-4 border-b text-right">
                      {result.rakusatsuTesuryoPrice}
                    </td>
                    <td className="py-2 px-4 border-b text-right">{result.rakusatsuTotalPrice}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <AdminPagination
            count={count}
            page={currentPage}
            onChange={handlePageChange}
            itemsPerPage={itemsPerPage}
          />
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default withAdminLayout(Page);
