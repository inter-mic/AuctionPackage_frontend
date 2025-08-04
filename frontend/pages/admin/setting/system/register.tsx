import React from "react";
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
import { useSystemSearchAPI } from "@/hooks/api/admin/system/useSystemSearchAPI";
import { useSystemRegistAPI } from "@/hooks/api/admin/system/useSystemRegistAPI";
import { useFaviconImageRegistAPI } from "@/hooks/api/admin/system/useFaviconImageRegistAPI";
import { useFaviconImageDeleteAPI } from "@/hooks/api/admin/system/useFaviconImageDeleteAPI";
import { useLogoImageRegistAPI } from "@/hooks/api/admin/system/useLogoImageRegistAPI";
import { useLogoImageDeleteAPI } from "@/hooks/api/admin/system/useLogoImageDeleteAPI";
import { useRiyoKiyakuRegistAPI } from "@/hooks/api/admin/system/useRiyoKiyakuRegistAPI";
import { useRiyoKiyakuDeleteAPI } from "@/hooks/api/admin/system/useRiyoKiyakuDeleteAPI";
import { usePrivacyPolicyRegistAPI } from "@/hooks/api/admin/system/usePrivacyPolicyRegistAPI";
import usePrivacyPolicyDeleteAPI from "@/hooks/api/admin/system/usePrivacyPolicyDeleteAPI";
//import { useZipCodeUploadRegistAPI } from "@/hooks/api/admin/system/useZipCodeUploadRegistAPI";

//型定義
import { PageProps } from "@/types/admin/adminPage";
import { SystemData, initialSystemData } from "@/types/admin/system/register";
//コンポーネント
import { FileUpload } from "@/components/ui/fileUpload/fileUpload";
import { MemberRegistrationPullDown } from "@/components/ui/pulldowns/MemberRegistrationPullDown";
import { MemberApprovalPullDown } from "@/components/ui/pulldowns/MemberApprovalPullDown";
import { NologinViewPullDown } from "@/components/ui/pulldowns/NologinViewPullDown";
//ボタン
import { SystemSettingRegistButton } from "@/components/ui/buttons/admin/systemSettingRegistButton";
import {
  FaviconImageRegistButton,
  FaviconImageDeleteButton,
} from "@/components/ui/buttons/admin/faviconImageButton";
import {
  LogoImageRegistButton,
  LogoImageDeleteButton,
} from "@/components/ui/buttons/admin/logoImageButton";
import {
  RiyoKiyakuRegistButton,
  RiyoKiyakuDeleteButton,
} from "@/components/ui/buttons/admin/riyoKiyakuButton";
import {
  PrivacyPolicyRegistButton,
  PrivacyPolicyDeleteButton,
} from "@/components/ui/buttons/admin/privacyPolicyButton";
//スタイル
import breadcrumbStyles from "@/styles/breadcrumb.module.css";

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminSystemRegist,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen, optionLiveYoutube }) => {
  const { useState, useEffect, useCallback, texts } = useCommonSetup();

  useKengenRedirect(kengen, 503);
  const { executionPermission } = useExecutionPermission(kengen);

  const { data, systemSearch } = useSystemSearchAPI();
  const [faviconImageFlg, setFaviconImageFlg] = useState(false);
  const [logoImageFlg, setLogoImageFlg] = useState(false);
  const [riyoKiyakuFlg, setriyoKiyakuFlg] = useState(false);
  const [privacyPolicyFlg, setPrivacyPolicyFlg] = useState(false);

  useEffect(() => {
    systemSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (data) {
      setSystemData(data);
      if (data.memberRegistrationFlg) {
        setSelectedMemberRegistration(data.memberRegistrationFlg.toString());
      }
      if (data.memberApprovalFlg) {
        setSelectedMemberApproval(data.memberApprovalFlg.toString());
      }
      if (data.nologinView) {
        setSelectedNologinView(data.nologinView.toString());
      }
      if (data.faviconImagePath) {
        setFaviconImageFlg(true);
      }
      if (data.logoImagePath) {
        setLogoImageFlg(true);
      }
      if (data.kiyakuPath) {
        setriyoKiyakuFlg(true);
      }
      if (data.privacyPolicyPath) {
        setPrivacyPolicyFlg(true);
      }
    }
  }, [data]);

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [systemData, setSystemData] = useState<SystemData>(initialSystemData);
  const { systemRegist } = useSystemRegistAPI();
  const handleSystemSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await systemRegist(systemData);
  };

  const [selectedMemberRegistration, setSelectedMemberRegistration] = useState<string>("0");
  const handleMemberRegistrationChange = (name: string, value: string) => {
    setSelectedMemberRegistration(value);
    setSystemData((prevSystemData) => ({ ...prevSystemData, [name]: value }));
  };

  const [selectedMemberApproval, setSelectedMemberApproval] = useState<string>("0");
  const handleMemberApprovalChange = (name: string, value: string) => {
    setSelectedMemberApproval(value);
    setSystemData((prevSystemData) => ({ ...prevSystemData, [name]: value }));
  };

  const [selectedNologinView, setSelectedNologinView] = useState<string>("0");
  const handleNologinViewChange = (name: string, value: string) => {
    setSelectedNologinView(value);
    setSystemData((prevSystemData) => ({ ...prevSystemData, [name]: value }));
  };

  const handleYouTubeChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setSystemData((prevSystemData) => ({ ...prevSystemData, [name]: value }));
  };

  const { faviconErrors, faviconRegist } = useFaviconImageRegistAPI();
  useEffect(() => {
    if (faviconErrors) {
      setFormErrors(faviconErrors);
    }
  }, [faviconErrors]);
  const [selectedFaviconImage, setSelectedFaviconImage] = useState<File | null>(null);
  const handleFaviconRegist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await faviconRegist(systemData, selectedFaviconImage);
  };
  const handleFaviconImageChange = (faviconImage: File | null) => {
    setSelectedFaviconImage(faviconImage);
    if (faviconErrors) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        ["faviconImage"]: "",
      }));
    }
  };
  const { faviconImageDeleteAPI } = useFaviconImageDeleteAPI();
  const handleFaviconDelete = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation(); // イベントの伝播を停止
      await faviconImageDeleteAPI(systemData.systemSeq);
    },
    [systemData, faviconImageDeleteAPI]
  );

  const { logoErrors, logoRegist } = useLogoImageRegistAPI();
  useEffect(() => {
    if (logoErrors) {
      setFormErrors(logoErrors);
    }
  }, [logoErrors]);
  const [selectedLogoImage, setSelectedLogoImage] = useState<File | null>(null);
  const handleLogoRegist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await logoRegist(systemData, selectedLogoImage);
  };

  const handleLogoImageChange = (logoImage: File | null) => {
    setSelectedLogoImage(logoImage);
    if (logoErrors) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        ["logoImage"]: "",
      }));
    }
  };
  const { logoImageDeleteAPI } = useLogoImageDeleteAPI();
  const handleLogoDelete = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation(); // イベントの伝播を停止
      await logoImageDeleteAPI(systemData.systemSeq);
    },
    [systemData, logoImageDeleteAPI]
  );

  const { riyoKiyakuErrors, riyoKiyakuRegist } = useRiyoKiyakuRegistAPI();
  useEffect(() => {
    if (riyoKiyakuErrors) {
      setFormErrors(riyoKiyakuErrors);
    }
  }, [riyoKiyakuErrors]);
  const [selectedRiyoKiyaku, setSelectedRiyoKiyaku] = useState<File | null>(null);
  const handleRiyoKiyakuRegist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await riyoKiyakuRegist(systemData, selectedRiyoKiyaku);
  };
  const handleRiyoKiyakuChange = (riyoKiyaku: File | null) => {
    setSelectedRiyoKiyaku(riyoKiyaku);
    if (riyoKiyakuErrors) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        ["riyoKiyaku"]: "",
      }));
    }
  };

  const { riyoKiyakuDeleteAPI } = useRiyoKiyakuDeleteAPI();
  const handleRiyoKiyakuDelete = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation(); // イベントの伝播を停止
      await riyoKiyakuDeleteAPI(systemData.systemSeq);
    },
    [systemData, riyoKiyakuDeleteAPI]
  );

  const { privacyPolicyErrors, privacyPolicyRegist } = usePrivacyPolicyRegistAPI();
  useEffect(() => {
    if (privacyPolicyErrors) {
      setFormErrors(privacyPolicyErrors);
    }
  }, [privacyPolicyErrors]);
  const [selectedPrivacyPolicy, setSelectedPrivacyPolicy] = useState<File | null>(null);
  const handlePrivacyPolicyRegist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await privacyPolicyRegist(systemData, selectedPrivacyPolicy);
  };
  const handlePrivacyPolicyChange = (privacyPolicy: File | null) => {
    setSelectedPrivacyPolicy(privacyPolicy);
    if (privacyPolicyErrors) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        ["privacyPolicy"]: "",
      }));
    }
  };
  const { privacyPolicyDeleteAPI } = usePrivacyPolicyDeleteAPI();
  const handlePrivacyPolicyDelete = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation(); // イベントの伝播を停止
      await privacyPolicyDeleteAPI(systemData.systemSeq);
    },
    [systemData, privacyPolicyDeleteAPI]
  );

  // const { zipCodeUploadRegistAPI } = useZipCodeUploadRegistAPI();
  // const [selectedZipCode, setSelectedZipCode] = useState<File | null>(null);
  // const handleZipCodeChange = (selectedZipCode: File | null) => {
  //   setSelectedZipCode(selectedZipCode);
  //   if (selectedZipCode) {
  //     setFormErrors((prevErrors) => ({
  //       ...prevErrors,
  //       ["selectedZipCode"]: "",
  //     }));
  //   }
  // };
  // const handleZipUploadRegist = async () => {
  //   await zipCodeUploadRegistAPI(selectedZipCode);
  // };
  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminSystemRegist}</span>
      </div>

      <div className="flex flex-col items-center justify-center my-3 bg-gray-100">
        <div className="w-full space-y-6 bg-white shadow-md md:max-w-full md:rounded">
          <div className="p-4">
            <div className="w-full space-y-20">
              <form onSubmit={handleSystemSubmit} className="space-y-10">
                <div className="content-area space-y-2">
                  <div>{texts.system.memberRegistration}</div>
                  <MemberRegistrationPullDown
                    className={`w-80 px-3 py-2 mt-1 border rounded-md `}
                    onChange={(value) =>
                      handleMemberRegistrationChange("memberRegistrationFlg", value)
                    }
                    selectedId={
                      selectedMemberRegistration !== null ? String(selectedMemberRegistration) : ""
                    }
                  />
                  <div>{texts.system.systemRegist_note_1}</div>
                </div>

                <div className="content-area space-y-2">
                  <div className="">{texts.system.memberApproval}</div>
                  <MemberApprovalPullDown
                    className={`w-80 px-3 py-2 mt-1 border rounded-md `}
                    onChange={(value) => handleMemberApprovalChange("memberApprovalFlg", value)}
                    selectedId={
                      selectedMemberApproval !== null ? String(selectedMemberApproval) : ""
                    }
                  />
                  <div>{texts.system.systemRegist_note_2}</div>
                  <div>{texts.system.systemRegist_note_3}</div>
                </div>

                <div className="content-area space-y-2">
                  <div>{texts.system.nologinView}</div>
                  <NologinViewPullDown
                    className={`w-80 px-3 py-2 mt-1 border rounded-md `}
                    onChange={(value) => handleNologinViewChange("nologinView", value)}
                    selectedId={selectedNologinView !== null ? String(selectedNologinView) : ""}
                  />
                  <div>{texts.system.systemRegist_note_4}</div>
                </div>

                {optionLiveYoutube && (
                  <div className="content-area space-y-2">
                    <div>{texts.system.youtubeLink}</div>
                    <textarea
                      id="youtubeIframe"
                      name="youtubeIframe"
                      value={systemData.youtubeIframe || ""}
                      onChange={handleYouTubeChange}
                      rows={10}
                      className="w-full px-3 py-2 mt-1 border rounded-md "
                    />
                    <div>{texts.system.systemRegist_note_4}</div>
                  </div>
                )}

                {executionPermission(503, 2) && (
                  <div className="text-right">
                    <SystemSettingRegistButton label={texts.button.systemSettingRegist} />
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center my-3 bg-gray-100">
        <div className="w-full space-y-6 bg-white shadow-md md:max-w-full md:rounded">
          <div className="p-4">
            <div className="w-full space-y-20">
              <form className="space-y-10">
                <div className="content-area space-y-2">
                  <div>{texts.system.faviconImage}</div>
                  {executionPermission(503, 2) && data && (
                    <>
                      {!faviconImageFlg ? (
                        <>
                          <FileUpload
                            onFileChange={handleFaviconImageChange}
                            allowedExtensions={["ico"]}
                          />
                          {formErrors?.faviconImage && (
                            <p className="error-message">{formErrors.faviconImage}</p>
                          )}
                          <div>{texts.system.systemRegist_note_6}</div>
                          <div className="text-right">
                            <FaviconImageRegistButton onClick={handleFaviconRegist} />
                          </div>
                        </>
                      ) : (
                        <div className="text-right">
                          <FaviconImageDeleteButton onClick={handleFaviconDelete} />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center my-3 bg-gray-100">
        <div className="w-full space-y-6 bg-white shadow-md md:max-w-full md:rounded">
          <div className="p-4">
            <div className="w-full space-y-20">
              <form className="space-y-10">
                <div className="content-area space-y-2">
                  <div>{texts.system.logoImage}</div>
                  {executionPermission(503, 2) && data && (
                    <>
                      {!logoImageFlg ? (
                        <>
                          <FileUpload
                            onFileChange={handleLogoImageChange}
                            allowedExtensions={["jpg", "png"]}
                          />
                          {formErrors?.logoImage && (
                            <p className="error-message">{formErrors.logoImage}</p>
                          )}
                          <div>{texts.system.systemRegist_note_7}</div>
                          <div className="text-right">
                            <LogoImageRegistButton onClick={handleLogoRegist} />
                          </div>
                        </>
                      ) : (
                        <div className="text-right">
                          <LogoImageDeleteButton onClick={handleLogoDelete} />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center my-3 bg-gray-100">
        <div className="w-full space-y-6 bg-white shadow-md md:max-w-full md:rounded">
          <div className="p-4">
            <div className="w-full space-y-20">
              <form className="space-y-10">
                <div className="content-area space-y-2">
                  <div>{texts.system.riyoKiyaku}</div>
                  {executionPermission(503, 2) && data && (
                    <>
                      {!riyoKiyakuFlg ? (
                        <>
                          <FileUpload
                            onFileChange={handleRiyoKiyakuChange}
                            allowedExtensions={["pdf"]}
                          />
                          {formErrors?.riyoKiyaku && (
                            <p className="error-message">{formErrors.riyoKiyaku}</p>
                          )}
                          <div>{texts.system.systemRegist_note_8}</div>
                          <div className="text-right">
                            <RiyoKiyakuRegistButton onClick={handleRiyoKiyakuRegist} />
                          </div>
                        </>
                      ) : (
                        <div className="text-right">
                          <RiyoKiyakuDeleteButton onClick={handleRiyoKiyakuDelete} />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center my-3 bg-gray-100">
        <div className="w-full space-y-6 bg-white shadow-md md:max-w-full md:rounded">
          <div className="p-4">
            <div className="w-full space-y-20">
              <form className="space-y-10">
                <div className="content-area space-y-2">
                  <div>{texts.system.privacyPolicy}</div>
                  {executionPermission(503, 2) && data && (
                    <>
                      {!privacyPolicyFlg ? (
                        <>
                          <FileUpload
                            onFileChange={handlePrivacyPolicyChange}
                            allowedExtensions={["pdf"]}
                          />
                          {formErrors?.privacyPolicy && (
                            <p className="error-message">{formErrors.privacyPolicy}</p>
                          )}
                          <div>{texts.system.systemRegist_note_8}</div>
                          <div className="text-right">
                            <PrivacyPolicyRegistButton onClick={handlePrivacyPolicyRegist} />
                          </div>
                        </>
                      ) : (
                        <div className="text-right">
                          <PrivacyPolicyDeleteButton onClick={handlePrivacyPolicyDelete} />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(Page);
