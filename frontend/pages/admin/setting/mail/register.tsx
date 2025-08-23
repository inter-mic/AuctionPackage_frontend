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
import { useMailTemplateSearchAPI } from "@/hooks/api/admin/mail/useMailTemplateSearchAPI";
import { useMailShomeiSearchAPI } from "@/hooks/api/admin/mail/useMailShomeiSearchAPI";
import { useMailShomeiRegistAPI } from "@/hooks/api/admin/mail/useMailShomeiRegistAPI";
//型定義
import { PageProps } from "@/types/admin/adminPage";
import { TemplateData, ShomeiData, initialShomeiData } from "@/types/admin/mail/register";
//ボタン
import { MailTemplateRegistButton } from "@/components/ui/buttons/admin/mailTemplateRegistButton";
import { MailShomeiRegistButton } from "@/components/ui/buttons/admin/mailShomeiRegistButton";
//スタイル
import breadcrumbStyles from "@/styles/breadcrumb.module.css";

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminMailRegist,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, texts } = useCommonSetup();

  useKengenRedirect(kengen, 505);
  const { executionPermission } = useExecutionPermission(kengen);

  const { templateData, mailTemplateSearch } = useMailTemplateSearchAPI();
  const { shomeiData, mailShomeiSearch } = useMailShomeiSearchAPI();
  useEffect(() => {
    mailTemplateSearch();
    mailShomeiSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (templateData) {
      const initialState = templateData.reduce((acc: any, item: any) => {
        acc[`subject_${item.templateId}`] = item.subject || "";
        acc[`bodyPart2_${item.templateId}`] = item.bodyPart2 || "";
        acc[`bodyPart4_${item.templateId}`] = item.bodyPart4 || "";
        acc[`body_${item.templateId}`] = item.body || "";
        return acc;
      }, {});
      setTemplateItems(initialState);
    }
  }, [templateData]);

  const [shomei, setShomei] = useState<ShomeiData>(initialShomeiData);
  useEffect(() => {
    if (shomeiData) {
      setShomei(shomeiData);
    }
  }, [shomeiData]);

  const [templateItems, setTemplateItems] = useState<{ [key: string]: string }>({});
  const [bodyParts, setBodyParts] = useState<{ [key: string]: string }>({});
  const handleBodyPartChange = (
    templateId: number,
    partName: "bodyPart2" | "bodyPart4",
    newValue: string
  ) => {
    setBodyParts((prev) => ({
      ...prev,
      [`${templateId}_${partName}`]: newValue,
    }));
  };

  const handleChange = (templateId: number, fieldName: string) => (newValue: string) => {
    setTemplateItems((prevItems) => ({
      ...prevItems,
      [`${fieldName}_${templateId}`]: newValue,
    }));
  };

  const getDynamicBody = (result: TemplateData) => {
    const bodyPart2 = bodyParts[`${result.templateId}_bodyPart2`] || result.bodyPart2;
    const bodyPart4 = bodyParts[`${result.templateId}_bodyPart4`] || result.bodyPart4;

    const parts = [
      result.bodyPart1 ? result.bodyPart1.replace(/(\r\n|\n|\r)/g, "<br>") : "",
      bodyPart2 ? bodyPart2.replace(/(\r\n|\n|\r)/g, "<br>").replace(/(<br>\s*)+$/, "") : "",
      result.bodyPart3 ? result.bodyPart3.replace(/(\r\n|\n|\r)/g, "<br>") : "",
      bodyPart4 ? bodyPart4.replace(/(\r\n|\n|\r)/g, "<br>").replace(/(<br>\s*)+$/, "") : "",
    ].filter((part) => part); // 空文字列を除外

    return parts.join("<br>").replace(/(<br>\s*)+$/, ""); // 最後の不要な `<br>` を削除
  };

  const handleShomeiChange = (name: string, value: string) => {
    setShomei((prevShomei) => ({ ...prevShomei, [name]: value }));
  };

  const { shomeiRegist } = useMailShomeiRegistAPI();
  const handleShomeiSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await shomeiRegist(shomei);
  };

  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminMailRegist}</span>
      </div>

      <div className="flex flex-col items-center justify-center my-3 bg-gray-100">
        <div className="w-full space-y-6 bg-white shadow-md md:max-w-full md:rounded">
          <div className="p-4">
            <div className="w-full space-y-20">
              <form className="space-y-10">
                <div className="content-area space-y-2">
                  <div>{texts.label.text_note_1}</div>
                  <div>{texts.mail.mail_note_2}</div>
                  <table className="w-full bg-white">
                    <thead>
                      <tr>
                        <th rowSpan={4} className="py-2 px-4 w-1/12 border-b">
                          {texts.mail.templateSetsumei}
                        </th>
                        <th rowSpan={4} className="py-2 px-4 w-2/12 border-b">
                          {texts.mail.subject}
                        </th>
                        <th className="py-2 px-4 w-1/12 border-b">{texts.mail.bodyPart1}</th>
                        <th rowSpan={4} className="py-2 px-4 w-3/12 border-b">
                          {texts.mail.body}
                        </th>
                        <th rowSpan={4} className="py-2 px-4 border-b"></th>
                      </tr>
                      <tr>
                        <th className="py-2 px-4 w-2/12 border-b">{texts.mail.bodyPart2}</th>
                      </tr>
                      <tr>
                        <th className="py-2 px-4 w-1/12 border-b">{texts.mail.bodyPart3}</th>
                      </tr>
                      <tr>
                        <th className="py-2 px-4 w-2/12 border-b">{texts.mail.bodyPart4}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templateData &&
                        templateData.map((result) => (
                          <React.Fragment key={result.templateId}>
                            <tr key={`${result.templateId}-row1`}>
                              <td
                                rowSpan={4}
                                className="py-2 px-4 w-1/12 bg-gray-100 border-b text-center align-text-top"
                              >
                                {result.templateSetsumei}
                              </td>
                              <td
                                rowSpan={4}
                                className="w-1/12 border text-left align-text-top"
                                style={{ whiteSpace: "pre-wrap" }}
                                contentEditable={true}
                                suppressContentEditableWarning={true}
                                onInput={(e) => {
                                  const newValue = (e.target as HTMLElement).innerText;
                                  handleChange(result.templateId, "subject")(newValue);
                                }}
                              >
                                {result.subject}
                              </td>
                              <td className="py-2 px-4 w-4/12 bg-gray-100 border-b text-left align-text-top">
                                {result.bodyPart1}
                              </td>
                              <td
                                rowSpan={4}
                                className="py-2 px-4 w-4/12 bg-gray-100 border-b text-left align-text-top"
                                onInput={(e) => {
                                  const newValue = (e.target as HTMLElement).innerText;
                                  handleChange(result.templateId, "body")(newValue);
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: getDynamicBody(result),
                                }}
                              ></td>
                              <td rowSpan={4}>
                                {executionPermission(505, 2) && (
                                  <div className="text-right">
                                    <MailTemplateRegistButton
                                      templateId={result.templateId}
                                      templateName={
                                        templateItems[`templateName_${result.templateId}`] || ""
                                      }
                                      subject={templateItems[`subject_${result.templateId}`] || ""}
                                      bodyPart2={
                                        templateItems[`bodyPart2_${result.templateId}`] || ""
                                      }
                                      bodyPart4={
                                        templateItems[`bodyPart4_${result.templateId}`] || ""
                                      }
                                      body={getDynamicBody(result)}
                                    />
                                  </div>
                                )}
                              </td>
                            </tr>
                            <tr key={`${result.templateId}-row2`}>
                              <td
                                className="w-4/12 border text-left align-text-top"
                                style={{ whiteSpace: "pre-wrap" }}
                                contentEditable={true}
                                suppressContentEditableWarning={true}
                                onInput={(e) => {
                                  const newValue = (e.target as HTMLElement).innerText;
                                  handleChange(result.templateId, "bodyPart2")(newValue);
                                  handleBodyPartChange(result.templateId, "bodyPart2", newValue);
                                }}
                              >
                                {result.bodyPart2}
                              </td>
                            </tr>
                            <tr key={`${result.templateId}-row3`}>
                              <td
                                className="py-2 px-4 w-4/12 bg-gray-100 border-b text-left align-text-top"
                                style={{ whiteSpace: "pre-wrap" }}
                                dangerouslySetInnerHTML={{
                                  __html: result.bodyPart3,
                                }}
                              ></td>
                            </tr>
                            <tr key={`${result.templateId}-row4`}>
                              <td
                                className="w-4/12 border text-left align-text-top"
                                style={{ whiteSpace: "pre-wrap" }}
                                contentEditable={true}
                                suppressContentEditableWarning={true}
                                onInput={(e) => {
                                  const newValue = (e.target as HTMLElement).innerText;
                                  handleChange(result.templateId, "bodyPart4")(newValue);
                                  handleBodyPartChange(result.templateId, "bodyPart4", newValue);
                                }}
                              >
                                {result.bodyPart4}
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                    </tbody>
                  </table>
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
              <form onSubmit={handleShomeiSubmit} className="space-y-10">
                <div className="content-area space-y-2">
                  <div>{texts.mail.shomei}</div>
                  <table className="w-1/2 bg-white">
                    <tbody>
                      <tr key={shomeiData && shomeiData.shomeiId}>
                        <td
                          className="w-11/12 border text-left align-text-top"
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onInput={(e) => {
                            const newValue = (e.target as HTMLElement).innerText;
                            handleShomeiChange("shomei", newValue);
                          }}
                          dangerouslySetInnerHTML={{
                            __html: shomeiData?.shomei?.replace(/(\r\n|\n|\r)/g, "<br>") || "",
                          }}
                        ></td>
                        <td>
                          {executionPermission(505, 2) && (
                            <div className="text-right">
                              <MailShomeiRegistButton label={texts.button.update} />
                            </div>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
