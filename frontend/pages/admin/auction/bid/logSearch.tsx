import { GetServerSideProps } from 'next';
import { toast } from 'react-toastify';
import { texts } from '@/config/texts';
import Pagination from '@mui/material/Pagination';
//ホック
import { withAuth } from '@/hocs/withAdminAuth';
import withAdminLayout from '@/hocs/withAdminLayout';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
import { useSorting } from '@/hooks/useSort';
import { usePagination  } from '@/hooks/usePagination';
import { useCheckboxSelection } from '@/hooks/useCheckboxSelection';
import { useKengenRedirect } from '@/hooks/useKengenRedirect';
import { useExecutionPermission } from '@/hooks/useExecutionPermission';
import { useToGoodsRegist } from '@/hooks/moveScreen/useToGoodsRegist';
//API
import { useBidLogSearchAPI } from '@/hooks/api/admin/bid/useBidLogSearchAPI';
import { useBidLogCsvAPI } from '@/hooks/api/admin/bid/useBidLogCsvAPI';
import { useBidLogSearchParams } from '@/hooks/api/admin/bid/useBidLogSearchParams';
//型定義
import { Result } from '@/types/admin/bid/logSearch';
import { PageProps } from '@/types/admin/adminPage';
//コンポーネント
import { KaisaiListPullDown } from '@/components/ui/pulldowns/KaisaiListPullDown';
import { RequiredMark } from '@/components/ui/marks/RequiredMark';
//ボタン
import { SearchButton } from '@/components/ui/buttons/admin/searchButton';
import { ClearButton } from '@/components/ui/buttons/admin/clearButton';
import { OutPutButton } from '@/components/ui/buttons/admin/outputButton';
//スタイル
import breadcrumbStyles from '@/styles/breadcrumb.module.css';
import formSearchStyles from '@/styles/admin/FormSearch.module.css';


export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.adminBidLogList
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();

  useKengenRedirect(kengen, 204);
  const { executionPermission } = useExecutionPermission(kengen);

  const { bidLogParams, formChange, resetForm } = useBidLogSearchParams();

  const [bidList, setBidList] = useState<Result[]>([]);
  const [selectedKaisai, setSelectedKaisai] = useState<string>('');

  const handleKaisaiChange = (name: string, value: string) => {
    setSelectedKaisai(value);
    formChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
    // エラーメッセージが存在する場合、対応するエラーメッセージをクリア
    if (errors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const { data, errors, bidLogSearch } = useBidLogSearchAPI();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const formSearch = async () => {
    setSelectAll(false);
    setSelectedIds([]);
    setBidList([]);
    await bidLogSearch(bidLogParams);
  };

  const formClear = () => {
    resetForm();
    setSelectedKaisai("");
    setSelectAll(false);
    setSelectedIds([]);
    setBidList([]);
  };

  useEffect(() => {
    if (data) {
      setBidList(data);
    }
  }, [data]);

  useEffect(() => {
    if (errors) { setFormErrors(errors); }
  }, [errors]);

  //ソート設定
  const { data: sortedData, handleSort } = useSorting(bidList, 'seq', 'asc');
  const { currentPage, paginatedData, totalPageCount, handlePageChange } = usePagination(sortedData);
  //チェックボックス
  const { selectAll, setSelectAll, selectedIds, setSelectedIds, handleSelectAll, handleSelect } = useCheckboxSelection(bidList.map(bid => bid.seq));
  //商品登録画面に遷移
  const {toGoodsRegist } = useToGoodsRegist(kengen);
  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>, goodsId: number) => {
    toGoodsRegist(e, goodsId);
  };
  //会員登録画面に遷移
  const handleRowUserClick = ( e: React.MouseEvent<HTMLElement>, userId: string) => {
    if (e.target instanceof HTMLInputElement) return;
    const hasClickKengen = kengen.some(
      (k) => k.screenId === 101 && (k.kengenKbn === 1 || k.kengenKbn === 2)
    );
    if (hasClickKengen) {
      window.open(`/admin/member/register?userId=${userId}`, '_blank');
    } 
  };

  //CSV出力
  const { bidLogCsv } = useBidLogCsvAPI();
  const handleCsvExport = () => {
    if (selectedIds.length === 0) {
      toast.error(texts.message.selectAtLeastOne);
      return;
    }
    bidLogCsv(selectedIds);
  };

  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminBidLogList}</span>
      </div>
      <div className={formSearchStyles.formContainer}>
        <div className={formSearchStyles.formGrid}>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="auction" ><RequiredMark />{texts.goods.auctionName}</label>
            <KaisaiListPullDown
              onChange={(value) => handleKaisaiChange('auctionSeq', value)}
              selectedId={selectedKaisai !== null ? String(selectedKaisai) : ''}
              kaisaiStatus={0}
              defaultSetOption={1}
            />
            {formErrors?.auctionSeq && <p className="error-message">{formErrors.auctionSeq}</p>}
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="goodsId" >{texts.goods.goodsId}</label>
            <input
              id="goodsId"
              name="goodsId"
              maxLength={9}
              value={bidLogParams.goodsId}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="goodsId" >{texts.goods.sku}</label>
            <input
              id="sku"
              name="sku"
              maxLength={9}
              value={bidLogParams.sku}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="goodsName" >{texts.goods.goodsName}</label>
            <input
              id="goodsName"
              name="goodsName"
              value={bidLogParams.goodsName}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formRow}>
            <div className={formSearchStyles.formItemHalfWidth}>
              <label htmlFor="lotFrom">{texts.goods.lot}</label>
              <input
                id="lotFrom"
                name="lotFrom"
                maxLength={9}
                value={bidLogParams.lotFrom}
                onChange={formChange}
              />
            </div>
            <div className={formSearchStyles.tilde}>
              {texts.common.tilde}
            </div>
            <div className={formSearchStyles.formItemHalfWidth}>
              <input
                id="lotTo"
                name="lotTo"
                maxLength={9}
                value={bidLogParams.lotTo}
                onChange={formChange}
              />
            </div>
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="userId" >{texts.member.userId}</label>
            <input
              id="userId"
              name="userId"
              maxLength={9}
              value={bidLogParams.userId}
              onChange={formChange}
            />
          </div>
          <div className={formSearchStyles.formItem}>
            <label htmlFor="userName" >{texts.member.userName}/{texts.member.companyName}</label>
            <input
              id="userName"
              name="userName"
              value={bidLogParams.userName}
              onChange={formChange}
            />
          </div>
          
        </div>
        <div className="text-right mt-2" >
          <SearchButton onClick={formSearch} />
          <ClearButton onClick={formClear} />
        </div>
      </div>
      {paginatedData && paginatedData.length > 0 ? (
        <div>
          <div className="flex justify-between items-center p-4">
            <div className="text-left">
              {texts.label.resultKekka} {bidList.length} {texts.label.resultCount}
            </div>
            {executionPermission(204, 2) && (
              <div className="text-right">
                <OutPutButton onClick={handleCsvExport} />
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
                <th className="py-2 px-4 border-b w-52" onClick={() => handleSort('auctionName')}>{texts.goods.auctionName}</th>
                <th className="py-2 px-4 border-b w-24" onClick={() => handleSort('goodsId')}>{texts.goods.goodsId}</th>
                <th className="py-2 px-4 border-b w-52" onClick={() => handleSort('sku')}>{texts.goods.sku}</th>
                <th className="py-2 px-4 border-b " onClick={() => handleSort('goodsName')}>{texts.goods.goodsName}</th>
                <th className="py-2 px-4 border-b w-24" onClick={() => handleSort('lot')}>{texts.goods.lot}</th>
                <th className="py-2 px-4 border-b w-44" onClick={() => handleSort('bidPrice')}>{texts.bid.bidPrice}</th>
                <th className="py-2 px-4 border-b w-52" onClick={() => handleSort('bidTime')}>{texts.bid.bidTime}</th>
                <th className="py-2 px-4 border-b" onClick={() => handleSort('userName')}>{texts.member.userName}/{texts.member.companyName}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 && paginatedData.map((result) => (
                <tr
                  key={result.seq}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={(e) => handleRowClick(e, result.goodsId)}
                >
                  <td
                    className="py-2 px-4 border-b text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(result.seq)}
                      onChange={() => handleSelect(result.seq)}
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-left">{result.auctionName}</td>
                  <td className="py-2 px-4 border-b text-left">{result.goodsId}</td>
                  <td className="py-2 px-4 border-b text-left">{result.sku}</td>
                  <td className="py-2 px-4 border-b text-left">{result.goodsName}</td>
                  <td className="py-2 px-4 border-b text-left">{result.lot}</td>
                  <td className="py-2 px-4 border-b text-right">{result.bidPrice}</td>
                  <td className="py-2 px-4 border-b text-right">{result.bidTime}</td>
                  <td className="py-2 px-4 border-b text-left hover:bg-blue-100 hover:cursor-pointer" // ホバー時に色とカーソル変更
                    onClick={(e) => handleRowUserClick(e, result.userId)} // 新しいクリックイベント
                >
                  {result.userName}
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default withAdminLayout(Page);