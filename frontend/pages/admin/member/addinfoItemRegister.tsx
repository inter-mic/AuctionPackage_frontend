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
import { useUserAddinfoItemSearchAPI } from "@/hooks/api/admin/user/useUserAddinfoItemSearchAPI";
//型定義
import { PageProps } from "@/types/admin/adminPage";
//コンポーネント
//ボタン
import { UserAddinfoItemRegistButton } from "@/components/ui/buttons/admin/userAddinfoItemRegistButton";
//スタイル
import breadcrumbStyles from "@/styles/breadcrumb.module.css";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.adminMemberAddinfoItemRegist,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect } = useCommonSetup();
  useKengenRedirect(kengen, 103);
  const { executionPermission } = useExecutionPermission(kengen);
  const { data, userAddinfoItemSearch } = useUserAddinfoItemSearchAPI();
  useEffect(() => {
    userAddinfoItemSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [addinfoItems, setAddinfoItems] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (data) {
      const initialState = data.reduce((acc: any, item: any) => {
        acc[`userAddinfo_${item.seq}`] = item.userAddinfo || "";
        return acc;
      }, {});
      setAddinfoItems(initialState);
    }
  }, [data]);

  const handleChange = (seq: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAddinfoItems((prevItems) => ({
      ...prevItems,
      [`userAddinfo_${seq}`]: value,
    }));
  };

  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>
          {texts.menu.adminMemberAddinfoItemRegist}
        </span>
      </div>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <div className="w-full p-4 space-y-6 bg-white shadow-md md:max-w-full md:rounded">
          <div>{texts.addInfoItem.item_note_1}</div>
          <div>{texts.addInfoItem.item_note_2}</div>
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
                        id={`userAddinfo_${seq}`}
                        name={`userAddinfo_${seq}`}
                        type="text"
                        value={addinfoItems[`userAddinfo_${seq}`] || ""}
                        onChange={handleChange(seq)}
                        className="w-full px-3 py-2 mt-1 border rounded-md "
                      />
                    </td>
                    <td>
                      {executionPermission(103, 2) ? (
                        <UserAddinfoItemRegistButton
                          seq={seq}
                          userAddinfo={addinfoItems[`userAddinfo_${seq}`] || ""}
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
