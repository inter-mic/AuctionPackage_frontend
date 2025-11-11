import { GetServerSideProps } from "next";
import breadcrumbStyles from "@/styles/breadcrumb.module.css";
import { texts } from "@/config/texts.ja";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminLayout from "@/hocs/withAdminLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useKengenRedirect } from "@/hooks/useKengenRedirect";
import { useExecutionPermission } from "@/hooks/useExecutionPermission";
//API
import { useAuctionBidUnitSearchAPI } from "@/hooks/api/admin/auction/bidunit/useAuctionBidUnitSearchAPI";
import { useAuctionBidUnitInsertAPI } from "@/hooks/api/admin/auction/bidunit/useAuctionBidUnitInsertAPI";
import { useAuctionBidUnitUpdateAPI } from "@/hooks/api/admin/auction/bidunit/useAuctionBidUnitUpdateAPI";
//型定義
import { PageProps } from "@/types/admin/adminPage";
import { TMtLiveBidUnit } from "@/types/common/bidUnit";
//コンポーネント
import { BidUnitManagementComponent } from "@/components/admin/bidunit/BidUnitManagementComponent";

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminAuctionBidUnitRegist,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, texts } = useCommonSetup();
  useKengenRedirect(kengen, 302);
  const { executionPermission } = useExecutionPermission(kengen);
  const { auctionBidUnitList } = useAuctionBidUnitSearchAPI();
  const [newAuctionBidUnit, setNewAuctionBidUnit] = useState<TMtLiveBidUnit>({
    seq: 0,
    unitFrom: "",
    unitTo: "",
    bitUnit: "",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleNewAuctionBidUnitChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const numericWithCommaRegex = /^[0-9,]*$/;
    if (!numericWithCommaRegex.test(value)) {
      return; // 無効な入力は無視
    }
    setNewAuctionBidUnit((prev) => ({ ...prev, [name]: value.replace(/[^0-9]/g, "") }));
  };

  const handleInputChange = (seq: number, field: keyof TMtLiveBidUnit, value: string) => {
    // カンマを除去して数値のみを取得
    const numericValue = value.replace(/[^0-9]/g, "");

    // 空文字列の場合は0を設定
    const finalValue = numericValue === "" ? 0 : parseInt(numericValue, 10);

    // NaNチェック
    if (isNaN(finalValue)) {
      return;
    }

    setFetchList((prev) =>
      prev.map((item) => (item.seq === seq ? { ...item, [field]: finalValue } : item))
    );
  };

  const handleDelete = (seq: number) => {
    setFetchList((prev) => prev.filter((item) => item.seq !== seq)); // 指定した seq のアイテムを削除
  };

  const { errors, auctionBidUnitInsertAPI } = useAuctionBidUnitInsertAPI();
  const handleNewSubmit = () => {
    if (!newAuctionBidUnit) {
      return;
    }
    auctionBidUnitInsertAPI(newAuctionBidUnit);
  };

  useEffect(() => {
    if (errors) {
      setFormErrors(errors);
    }
  }, [errors]);

  const [fetchList, setFetchList] = useState<TMtLiveBidUnit[]>([]);
  useEffect(() => {
    if (auctionBidUnitList) {
      setFetchList(auctionBidUnitList);
    }
  }, [auctionBidUnitList]);

  const { updateErrors, auctionBidUnitUpdateAPI } = useAuctionBidUnitUpdateAPI();
  const handleUpdateSubmit = () => {
    if (!newAuctionBidUnit) {
      return;
    }
    auctionBidUnitUpdateAPI(fetchList);
  };
  useEffect(() => {
    if (updateErrors) {
      setFormErrors(updateErrors);
    }
  }, [updateErrors]);

  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>
          {texts.menu.adminAuctionBidUnitRegist}
        </span>
      </div>
      <BidUnitManagementComponent
        breadcrumbText={texts.menu.adminAuctionBidUnitRegist}
        kengenId={302}
        executionPermission={executionPermission}
        fetchList={fetchList}
        newLiveBidUnit={newAuctionBidUnit}
        formErrors={formErrors}
        onNewLiveBidUnitChange={handleNewAuctionBidUnitChange}
        onInputChange={handleInputChange}
        onDelete={handleDelete}
        onNewSubmit={handleNewSubmit}
        onUpdateSubmit={handleUpdateSubmit}
      />
    </div>
  );
};

export default withAdminLayout(Page);


