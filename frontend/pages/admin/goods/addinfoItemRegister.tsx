import { GetServerSideProps } from "next";
import { texts } from "@/config/texts.ja";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminLayout from "@/hocs/withAdminLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useKengenRedirect } from "@/hooks/useKengenRedirect";
import { useExecutionPermission } from "@/hooks/useExecutionPermission";
//API
import { useGoodsAddinfoItemSearchAPI } from "@/hooks/api/admin/goods/useGoodsAddinfoItemSearchAPI";
//型定義
import { PageProps } from "@/types/admin/adminPage";
//ボタン
import { GoodsAddinfoItemRegistButton } from "@/components/ui/buttons/admin/goodsAddinfoItemRegistButton";
//スタイル
import breadcrumbStyles from "@/styles/breadcrumb.module.css";

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminGoodsAddinfoItemRegist,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, texts } = useCommonSetup();
  useKengenRedirect(kengen, 206);
  const { executionPermission } = useExecutionPermission(kengen);
  const { data, goodsAddinfoItemSearch } = useGoodsAddinfoItemSearchAPI();
  useEffect(() => {
    goodsAddinfoItemSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [addinfoItems, setAddinfoItems] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (data) {
      const initialState = data.reduce((acc: any, item: any) => {
        acc[`goodsAddinfo_${item.seq}`] = item.goodsAddinfo || "";
        return acc;
      }, {});
      setAddinfoItems(initialState);
    }
  }, [data]);

  const handleChange = (seq: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAddinfoItems((prevItems) => ({
      ...prevItems,
      [`goodsAddinfo_${seq}`]: value,
    }));
  };

  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>
          {texts.menu.adminGoodsAddinfoItemRegist}
        </span>
      </div>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <div className="w-full p-4 space-y-6 bg-white shadow-md md:max-w-full md:rounded">
          <div>{texts.addInfoItem.item_note_1}</div>
          <div>{texts.addInfoItem.item_note_3}</div>
          <table className="w-full sm:w-1/2 bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 w-3/4 border-b">{texts.addInfoItem.item}</th>
                <th className="py-2 px-4 w-1/4 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }, (_, index) => {
                const seq = index + 1;
                return (
                  <tr key={seq}>
                    <td>
                      <input
                        id={`goodsAddinfo_${seq}`}
                        name={`goodsAddinfo_${seq}`}
                        type="text"
                        value={addinfoItems[`goodsAddinfo_${seq}`] || ""}
                        onChange={handleChange(seq)}
                        className="w-full px-3 py-2 mt-1 border rounded-md "
                      />
                    </td>
                    <td>
                      {executionPermission(206, 2) ? (
                        <GoodsAddinfoItemRegistButton
                          seq={seq}
                          goodsAddinfo={addinfoItems[`goodsAddinfo_${seq}`] || ""}
                        />
                      ) : (
                        <></>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(Page);
