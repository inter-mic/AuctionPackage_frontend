import { GetServerSideProps } from "next";
import { texts } from "@/config/texts.ja";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminLayout from "@/hocs/withAdminLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useKengenRedirect } from "@/hooks/useKengenRedirect";
import { useExecutionPermission } from "@/hooks/useExecutionPermission";
//コンポーネント
import { LoginKbnRadioButton } from "@/components/ui/radioButtons/LoginKbnRadioButton";
import { FileUpload } from "@/components/ui/fileUpload/fileUpload";
//API
import { usePageSettingSearchAPI } from "@/hooks/api/admin/pagesetting/usePageSettingSearchAPI";
import { usePageSettingRegistAPI } from "@/hooks/api/admin/pagesetting/usePageSettingRegistAPI";
//型定義
import { PageProps } from "@/types/admin/adminPage";
import { TTtPageSetting } from "@/types/admin/pagesetting/search";
//ボタン
import { PageSettingUpdateButton } from "@/components/ui/buttons/admin/PageSettingUpdateButton";
//スタイル
import breadcrumbStyles from "@/styles/breadcrumb.module.css";

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminPageSetting,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, texts } = useCommonSetup();
  useKengenRedirect(kengen, 506);
  const { executionPermission } = useExecutionPermission(kengen);
  const { data, pageSettingSearchAPI } = usePageSettingSearchAPI();
  useEffect(() => {
    pageSettingSearchAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [pageList, setPageList] = useState<TTtPageSetting[]>(
    Array.from({ length: 5 }, (_, index) => ({
      pageSeq: index + 1, // 必須プロパティ pageSeq を追加
      pageName: "",
      pageUrl: "",
      pageLoginFlg: false,
    }))
  );

  useEffect(() => {
    if (data) {
      setPageList(data);
    }
  }, [data]);

  const handleChange = (seq: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPageList((prevList) =>
      prevList.map((item, index) =>
        index === seq - 1
          ? {
              ...item,
              [name.includes("pageName") ? "pageName" : "pageUrl"]: value,
            }
          : item
      )
    );
  };

  const handleLoginFlgChange = (index: number, newPageLoginFlg: boolean) => {
    setPageList((prevList) =>
      prevList.map((item, idx) =>
        idx === index ? { ...item, pageLoginFlg: newPageLoginFlg } : item
      )
    );
  };

  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | null }>({});

  const handleFileChange = (seq: number) => (file: File | null) => {
    setSelectedFiles((prevFiles) => ({
      ...prevFiles,
      [seq]: file,
    }));
  };
  const { pageSettingRegistAPI } = usePageSettingRegistAPI();
  const handleSubmit = async (seq: number, data: TTtPageSetting) => {
    const file = selectedFiles[seq] || null;

    // データとファイルを指定して送信
    await pageSettingRegistAPI(data, file);
  };

  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminPageSetting}</span>
      </div>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <div className="w-full p-8 space-y-6 bg-white shadow-md md:max-w-full md:rounded">
          {texts.page.note_1}
          <br />
          {texts.page.note_2}
          <br />
          {texts.page.note_3}
          <br />
          {texts.page.note_4}
          <table className="w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4  w-96 border-b">{texts.page.name}</th>
                <th className="py-2 px-4  w-96  border-b">{texts.page.url}</th>
                <th className="py-2 px-4  border-b">{texts.page.file}</th>
                <th className="py-2 px-4  border-b"></th>
                <th className="py-2 px-4  border-b"></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }, (_, index) => {
                const seq = index + 1;
                const data = pageList[index] || {};
                return (
                  <tr key={seq}>
                    <td>
                      <input
                        id={`pageName_${seq}`}
                        name={`pageName_${seq}`}
                        type="text"
                        value={data.pageName || ""}
                        onChange={handleChange(seq)}
                        className="w-96  px-3 py-2 mt-1 border rounded-md "
                      />
                    </td>
                    <td>
                      <input
                        id={`pageUrl_${seq}`}
                        name={`pageUrl_${seq}`}
                        type="text"
                        value={data.pageUrl || ""}
                        onChange={handleChange(seq)}
                        className="w-96  px-3 py-2 mt-1 border rounded-md "
                      />
                    </td>
                    <td>
                      <FileUpload
                        onFileChange={handleFileChange(seq)}
                        allowedExtensions={["pdf"]}
                      />
                    </td>
                    <td className="py-1 px-4 border-b text-center">
                      <LoginKbnRadioButton
                        pageLoginFlg={data.pageLoginFlg || false}
                        onChange={(newPageLoginFlg) => handleLoginFlgChange(index, newPageLoginFlg)}
                      />
                    </td>
                    <td>
                      {executionPermission(301, 2) ? (
                        <PageSettingUpdateButton
                          pageSeq={seq}
                          registData={data}
                          onSubmit={() => handleSubmit(seq, data)}
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
