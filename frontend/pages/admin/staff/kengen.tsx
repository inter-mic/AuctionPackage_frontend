import { GetServerSideProps } from "next";
import { Box } from "@mui/material";
import { texts } from "@/config/texts.ja";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminLayout from "@/hocs/withAdminLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useKengenRedirect } from "@/hooks/useKengenRedirect";
import { useExecutionPermission } from "@/hooks/useExecutionPermission";
//API
import { useKengenListSearchAPI } from "@/hooks/api/admin/kengen/useKengenListSearchAPI";
import { useKengenGroupRegistAPI } from "@/hooks/api/admin/kengen/useKengenGroupRegistAPI";
import { useKengenGroupDeleteAPI } from "@/hooks/api/admin/kengen/useKengenGroupDeleteAPI";
//型定義
import { Result } from "@/types/admin/kengen/search";
import { PageProps } from "@/types/admin/adminPage";
//コンポーネント
import { KengenListPullDown } from "@/components/ui/pulldowns/KengenPullDown";
import { KengenKbnRadioButton } from "@/components/ui/radioButtons/KengenKbnRadioButton";
import { RequiredMark } from "@/components/ui/marks/RequiredMark";
import ConfirmDialog from "@/components/ui/dialog/confirmDialog";
//ボタン
import { SearchButton } from "@/components/ui/buttons/admin/searchButton";
import { RegistButton } from "@/components/ui/buttons/admin/registButton";
//スタイル
import styles from "@/styles/admin/FormRegister.module.css";
import breadcrumbStyles from "@/styles/breadcrumb.module.css";

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminKengenRegist,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, texts } = useCommonSetup();
  useKengenRedirect(kengen, 403);
  const { executionPermission } = useExecutionPermission(kengen);

  const { data, errors, kengenListSearch } = useKengenListSearchAPI();
  useEffect(() => {
    kengenListSearch("0");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [kengenData, setKengenData] = useState<Result[]>([]);
  useEffect(() => {
    if (kengenData.length > 0) {
      const kengenName = kengenData[0].kengenName;
      const kengenId = kengenData[0].kengenId;
      const kengenList = kengenData.map((result) => ({
        screenId: result.screenId,
        kengenKbn: result.kengenKbn,
      }));
      setFormattedData({ kengenName: kengenName, kengenList: kengenList });
      setKengenIdData(kengenId);
    }
  }, [kengenData]);

  useEffect(() => {
    if (data) {
      setKengenData(data);
    }
  }, [data]);

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (errors) {
      setFormErrors(errors);
    }
  }, [errors]);

  const [selectedKengenId, setSelectedKengenId] = useState<string | null>(null);
  const handleKengenIdChange = (name: string, value: string) => {
    setSelectedKengenId(value);
    if (formErrors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const formSearch = async () => {
    if (!selectedKengenId) {
      setFormErrors({ ["kengenId"]: texts.label.select_note_1 });
      return;
    }
    setKengenData([]);
    await kengenListSearch(selectedKengenId);
  };

  const [formattedData, setFormattedData] = useState<any>(null);
  const handleKengenNameChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value } = e.target;
    setKengenData((prevKengenData) => {
      const newData = [...prevKengenData];
      newData[0].kengenName = value;
      return newData;
    });
  };

  const handleKengenKbnChange = (index: number, newKengenKbn: number) => {
    setKengenData((prevKengenData) => {
      const newData = [...prevKengenData];
      newData[index].kengenKbn = newKengenKbn;
      return newData;
    });
  };

  const [kengenIdData, setKengenIdData] = useState<number>();
  const { kengenGroupRegist } = useKengenGroupRegistAPI();
  const handleSubmit = () => {
    if (kengenIdData) {
      kengenGroupRegist(kengenIdData, formattedData);
    }
  };

  const { kengenGroupDelete } = useKengenGroupDeleteAPI();
  const handleDeleteSubmit = () => {
    if (kengenIdData) {
      kengenGroupDelete(kengenIdData);
    }
  };

  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminKengenRegist}</span>
      </div>
      <div className="w-full space-y-3 bg-white shadow-md md:max-w-full md:rounded">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 items-end">
              <div className="w-full md:flex-1">
                <KengenListPullDown
                  className={`w-full px-3 py-2 mt-1 border rounded-md`}
                  onChange={(value) => handleKengenIdChange("kengenId", value)}
                  selectedId={selectedKengenId !== null ? String(selectedKengenId) : ""}
                />
                {formErrors?.kengenId && <p className="error-message">{formErrors.kengenId}</p>}
              </div>
              <div className="w-full md:w-auto text-center  mx-0 sm:mx-4">
                <SearchButton onClick={formSearch} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {kengenData && kengenData.length > 0 ? (
        <div className="flex flex-col items-center justify-center my-3 bg-gray-100">
          <div className="w-full space-y-3 bg-white shadow-md md:max-w-full md:rounded">
            <div className="p-4 xl:w-1/5 sm:w-full">
              <label className={styles.label}>
                <RequiredMark />
                {texts.kengen.kengenName}
              </label>
              <input
                id="kengenName"
                name="kengenName"
                type="text"
                value={kengenData[0]?.kengenName || ""}
                onChange={handleKengenNameChange}
                className={`${styles.input}`}
              />
              {errors?.kengenName && <p className="error-message">{errors.kengenName}</p>}
            </div>
            <div className="p-4">
              <div className="mx-2 text-left">{texts.kengen.kengen_note_1}</div>
              <div className="mx-2 text-left">{texts.kengen.kengen_note_2}</div>
              <table className="xl:w-1/2 bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 w-1/2 border-b">{texts.kengen.screenName}</th>
                    <th className="py-2 px-4 w-1/2 border-b">{texts.kengen.kengen} </th>
                  </tr>
                </thead>
                <tbody>
                  {kengenData.map((result, index) => (
                    <tr key={`${result.kengenId}-${result.screenId}`}>
                      <td className="py-1 px-4 border-b text-center">{result.screenName}</td>
                      <td className="py-1 px-4 border-b text-center">
                        <KengenKbnRadioButton
                          kengenKbn={result.kengenKbn}
                          onChange={(newKengenKbn) => handleKengenKbnChange(index, newKengenKbn)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {executionPermission(403, 2) && (
                <Box
                  className="p-4 gap-4 flex flex-col xl:flex-row xl:float-right"
                  display="flex"
                  alignItems="right"
                >
                  <RegistButton label={texts.button.regist} onClick={handleSubmit} />
                  {selectedKengenId && selectedKengenId !== "" && selectedKengenId !== "0" && (
                    <ConfirmDialog
                      title={texts.message.confirmDelete}
                      description={texts.label.delete_note_1}
                      buttonTitle={texts.button.delete}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-40"
                      dialogCancelClassName="lg:ml-2.5 mt-2 lg:mt-0 bg-white border border-solid border-red-500 text-red-500 font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
                      dialogClassName="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg w-40"
                      onSubmit={handleDeleteSubmit}
                      buttonText={texts.button.delete}
                    />
                  )}
                </Box>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default withAdminLayout(Page);
