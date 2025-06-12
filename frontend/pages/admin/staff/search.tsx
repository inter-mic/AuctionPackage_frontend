import { GetServerSideProps } from "next";
import { texts } from "@/config/texts.ja";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminLayout from "@/hocs/withAdminLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useKengenRedirect } from "@/hooks/useKengenRedirect";
//API
import { useStaffSearchAPI } from "@/hooks/api/admin/staff/useStaffSearchAPI";
//型定義
import { PageProps } from "@/types/admin/adminPage";
//スタイル
import breadcrumbStyles from "@/styles/breadcrumb.module.css";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const otherData = {};
  return {
    props: {
      pageTitle: texts.menu.adminStaffList,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();

  useKengenRedirect(kengen, 402);

  const { data, staffSearch } = useStaffSearchAPI();

  useEffect(() => {
    staffSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //スタッフ登録画面に遷移
  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>, staffId: number) => {
    if (e.target instanceof HTMLInputElement) return;
    window.open(`/admin/staff/register?staffId=${staffId}`, "_blank");
  };

  return (
    <div>
      <div>
        <div className={breadcrumbStyles.breadcrumb}>
          <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminStaffList}</span>
        </div>
        {data && data.length > 0 ? (
          <div>
            <div className="flex justify-between items-center p-4">
              <div className="text-left">
                {texts.label.resultKekka} {data.length} {texts.label.resultCount}
              </div>
            </div>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">{texts.staff.staffId}</th>
                  <th className="py-2 px-4 border-b">{texts.staff.loginId}</th>
                  <th className="py-2 px-4 border-b">{texts.staff.staffName}</th>
                  <th className="py-2 px-4 border-b">{texts.common.mail}</th>
                  <th className="py-2 px-4 border-b">{texts.staff.kengenName}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((result) => (
                  <tr
                    key={result.staffId}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={(e) => handleRowClick(e, result.staffId)}
                  >
                    <td className="py-2 px-4 border-b text-left">{result.staffId}</td>
                    <td className="py-2 px-4 border-b text-left">{result.loginId}</td>
                    <td className="py-2 px-4 border-b text-left">{result.staffName}</td>
                    <td className="py-2 px-4 border-b text-left">{result.mail}</td>
                    <td className="py-2 px-4 border-b text-left">{result.kengenName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default withAdminLayout(Page);
