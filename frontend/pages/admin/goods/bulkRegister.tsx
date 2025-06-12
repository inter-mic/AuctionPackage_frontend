import React from "react";
import { GetServerSideProps } from "next";
import { Box } from "@mui/material";
import { texts } from "@/config/texts.ja";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminLayout from "@/hocs/withAdminLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useKengenRedirect } from "@/hooks/useKengenRedirect";
import { useExecutionPermission } from "@/hooks/useExecutionPermission";
//API
import { useGoodsCsvUploadAPI } from "@/hooks/api/admin/goods/useGoodsCsvUploadAPI";
import { useGoodsCsvTesuryoUploadAPI } from "@/hooks/api/admin/goods/useGoodsCsvTesuryoUploadAPI";
import { useGoodsZipUploadAPI } from "@/hooks/api/admin/goods/useGoodsZipUploadAPI";
import { useGoodsZipSearchAPI } from "@/hooks/api/admin/goods/useGoodsZipSearchAPI";
//型定義
import { PageProps } from "@/types/admin/adminPage";
import { CsvUpdateData } from "@/types/admin/goods/csvUpdate";
import { ZipUpdateData } from "@/types/admin/goods/zipUpdate";
//コンポーネント
import { FileUpload } from "@/components/ui/fileUpload/fileUpload";
import { KaisaiDefaultListPullDown } from "@/components/ui/pulldowns/KaisaiDefaultListPullDown";
import { RegistKbnPullDown } from "@/components/ui/pulldowns/RegistKbnPullDown";
import CircularProgressWithLabel from "@/components/ui/progress/CircularProgressWithLabel";
//ボタン
import { UploadButton } from "@/components/ui/buttons/admin/uploadButton";
import { CancelButton } from "@/components/ui/buttons/cancelButton";
import { ShiyoshoButton } from "@/components/ui/buttons/admin/shiyoshoButton";
//スタイル
import breadcrumbStyles from "@/styles/breadcrumb.module.css";
import styles from "@/styles/admin/FormSearch.module.css";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const otherData = {};
  return {
    props: {
      pageTitle: texts.menu.adminGoodsBulkRegist,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();

  useKengenRedirect(kengen, 203);
  const { executionPermission } = useExecutionPermission(kengen);

  const { data, goodsZipSearch } = useGoodsZipSearchAPI();
  useEffect(() => {
    goodsZipSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleZipClear = () => {
    setSelectedCsvFile(null);
    setSelectedZipFile(null);
    setSelectedZipKaisai("");
    setSelectedRegistKbn("1");
  };
  const [csvErrors, setCsvErrors] = useState<{ [key: string]: string }>({});
  const [zipErrors, setZipErrors] = useState<{ [key: string]: string }>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  //商品情報
  const [csvUpdateData, setCsvUpdateData] = useState<CsvUpdateData>({});
  const [selectedCsvKaisai, setSelectedCsvKaisai] = useState<string>("");
  const handleCsvKaisaiChange = (name: string, value: string) => {
    setSelectedCsvKaisai(value);
    setCsvUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  const [selectedCsvFile, setSelectedCsvFile] = useState<File | null>(null);
  const handleCsvFileChange = (csvFile: File | null) => {
    setSelectedCsvFile(csvFile);
  };
  const { csvUploadErrors, goodsCsvUpload } = useGoodsCsvUploadAPI();
  const goodsUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await goodsCsvUpload(csvUpdateData, selectedCsvFile);
  };
  useEffect(() => {
    if (csvUploadErrors) {
      setCsvErrors(csvUploadErrors);
    }
  }, [csvUploadErrors]);

  //落札手数料一括更新
  const [selectedCsvTesuryoFile, setSelectedCsvTesuryoFile] = useState<File | null>(null);

  const handleCsvTesuryoFileChange = (csvFile: File | null) => {
    setSelectedCsvTesuryoFile(csvFile);
  };
  const { csvTesuryoUploadErrors, goodsCsvTesuryoUpload } = useGoodsCsvTesuryoUploadAPI();
  const tesuryoUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await goodsCsvTesuryoUpload(selectedCsvTesuryoFile);
  };
  useEffect(() => {
    if (csvTesuryoUploadErrors) {
      setCsvErrors(csvTesuryoUploadErrors);
    }
  }, [csvTesuryoUploadErrors]);

  const [zipUpdateData, setZipUpdateData] = useState<ZipUpdateData>({});
  const [selectedZipKaisai, setSelectedZipKaisai] = useState<string>("");
  const handleZipKaisaiChange = (name: string, value: string) => {
    setSelectedZipKaisai(value);
    setZipUpdateData((prev) => ({ ...prev, [name]: value }));
  };
  const [selectedRegistKbn, setSelectedRegistKbn] = useState<string>("1");
  const handleRegistKbnChange = (name: string, value: string) => {
    setSelectedRegistKbn(value);
    setZipUpdateData((prev) => ({ ...prev, [name]: value }));
  };
  const [selectedZipFile, setSelectedZipFile] = useState<File | null>(null);
  const handleZipFileChange = (file: File | null) => {
    setSelectedZipFile(file);
  };
  const {
    zipUploadErrors,
    goodsZipUpload,
    loading: zipLoading,
    progress: zipProgress,
  } = useGoodsZipUploadAPI();
  const goodsImgUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedZipFile) {
      const MAX_ZIP_SIZE = 2 * 1024 * 1024 * 1024; // 3GB
      if (selectedZipFile.size > MAX_ZIP_SIZE) {
        toast.error("ファイルサイズが 2GB を超えています。");
        setSelectedZipFile(null);
        return;
      }
    }
    await goodsZipUpload(zipUpdateData, selectedZipFile);
  };
  useEffect(() => {
    if (zipUploadErrors) {
      setZipErrors(zipUploadErrors);
    }
  }, [zipUploadErrors]);

  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminGoodsBulkRegist}</span>
      </div>

      <div className="flex flex-col items-center justify-center my-3 bg-gray-100">
        <div className="w-full space-y-6 bg-white shadow-md md:max-w-full md:rounded">
          <div className="p-4">
            <div className="w-full space-y-20">
              <div className="content-area space-y-4">
                <div>
                  {texts.goods.goodsUpload_note_1}
                  <br />
                  {texts.goods.goodsUpload_note_6}
                  <br />
                  {texts.goods.goodsUpload_note_7}
                </div>
                <div className="font-bold text-lg">{texts.goods.goodsInfo}</div>
                <form onSubmit={goodsUpload} className="space-y-5">
                  {executionPermission(203, 2) && (
                    <>
                      <KaisaiDefaultListPullDown
                        className={`px-3 py-2 mt-1 w-1/6 border rounded-md focus:outline-none focus:ring focus:border-blue-300`}
                        onChange={(value) => handleCsvKaisaiChange("auctionSeq", value)}
                        selectedId={selectedCsvKaisai !== null ? String(selectedCsvKaisai) : ""}
                        kaisaiStatus={3}
                      />
                      <Box className="space-x-4" display="flex" alignItems="center">
                        <FileUpload
                          onFileChange={handleCsvFileChange}
                          allowedExtensions={["csv"]}
                        />
                        <UploadButton />
                        <CancelButton />
                        <ShiyoshoButton />
                      </Box>
                    </>
                  )}
                </form>
                <div className="font-bold text-lg">{texts.goods.tesuryoUpdate}</div>
                <form onSubmit={tesuryoUpload} className="space-y-20">
                  {executionPermission(203, 2) && (
                    <Box className="space-x-4" display="flex" alignItems="center">
                      <FileUpload
                        onFileChange={handleCsvTesuryoFileChange}
                        allowedExtensions={["csv"]}
                      />
                      <UploadButton />
                      <CancelButton />
                      <ShiyoshoButton
                        fileUrl="/tesuryo_regist_csv.xlsx"
                        fileName="落札手数料一括取込仕様書.xlsx"
                      />
                    </Box>
                  )}
                </form>
                {Object.keys(csvErrors).length > 0 && (
                  <div>
                    <table className="w-1/2 table-auto">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 border">{texts.common.errorMsg}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(csvErrors).map(([key, value]) => (
                          <tr key={key}>
                            <td className="text-left px-4 py-2 border">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <form onSubmit={goodsImgUpload} className="space-y-20">
                <div className="content-area space-y-4">
                  <div className="font-bold text-lg">{texts.goods.goodsImage}</div>
                  <div>
                    {texts.goods.goodsUpload_note_2}
                    <br />
                    {texts.goods.goodsUpload_note_3}
                  </div>
                  <div>{texts.goods.info2}</div>
                  {executionPermission(203, 2) && (
                    <>
                      <Box className="space-x-4" display="flex" alignItems="center">
                        <label>{texts.goods.registFolderName}</label>
                        <RegistKbnPullDown
                          className={`px-3 py-2 mt-1 w-1/6 border rounded-md focus:outline-none focus:ring focus:border-blue-300`}
                          onChange={(value) => handleRegistKbnChange("registKbn", value)}
                          selectedId={selectedRegistKbn !== null ? String(selectedRegistKbn) : ""}
                        />
                        {selectedRegistKbn === "2" && (
                          <KaisaiDefaultListPullDown
                            className={`px-3 py-2 mt-1 w-1/6 border rounded-md focus:outline-none focus:ring focus:border-blue-300`}
                            onChange={(value) => handleZipKaisaiChange("auctionSeq", value)}
                            selectedId={selectedZipKaisai !== null ? String(selectedZipKaisai) : ""}
                            kaisaiStatus={3}
                          />
                        )}
                      </Box>
                      <Box className="space-x-4" display="flex" alignItems="center">
                        <FileUpload
                          onFileChange={handleZipFileChange}
                          allowedExtensions={["zip"]}
                        />
                        {zipLoading && <CircularProgressWithLabel value={zipProgress} />}
                        <UploadButton />
                        <CancelButton />
                      </Box>

                      <div>
                        {formErrors?.auctionSeq && (
                          <p className="error-message">{formErrors.auctionSeq}</p>
                        )}
                      </div>
                      {Object.keys(zipErrors).length > 0 && (
                        <div>
                          <table className="w-1/2 table-auto">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 border">{texts.common.errorMsg}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(zipErrors).map(([key, value]) => (
                                <tr key={key}>
                                  <td className="text-left px-4 py-2 border">{value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </form>
            </div>
            <div className="content-area space-y-4">
              <div className="font-bold text-lg">{texts.goods.goodsRegistStatus}</div>
              <div>
                {texts.goods.goodsUpload_note_4}
                <br />
                {texts.goods.goodsUpload_note_5}
                <br />
                {texts.goods.goodsUpload_note_9}
                <br />
                {texts.goods.goodsUpload_note_10}
                <br />
                {texts.goods.goodsUpload_note_11}
              </div>
              <div>
                <table className="w-3/4 table-auto">
                  <thead>
                    <tr>
                      <th className="w-1/6 px-4 py-2 border">{texts.goods.registDatetime}</th>
                      <th className="w-1/6 px-4 py-2 border">{texts.goods.registFolderName}</th>
                      <th className="w-1/6 px-4 py-2 border">{texts.goods.registStatus}</th>
                      <th className="w-3/6 px-4 py-2 border">{texts.common.errorMsg}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data).map(([key, value]) => (
                      <tr key={key}>
                        <td className="text-center px-4 py-2 border">{value.createTime}</td>
                        <td className="text-center px-4 py-2 border">{value.folderName}</td>
                        <td className="text-center px-4 py-2 border">
                          {(() => {
                            if (value.registStatus == "0") return texts.goods.mishori;
                            if (value.registStatus == "1") return texts.goods.shorichu;
                            if (value.registStatus == "2") {
                              return value.errorMessage ? texts.goods.error : texts.goods.shorizumi;
                            }
                            if (value.registStatus == "3") return texts.goods.error;
                            return "";
                          })()}
                        </td>
                        <td className="text-left px-4 py-2 border">{value.errorMessage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(Page);
