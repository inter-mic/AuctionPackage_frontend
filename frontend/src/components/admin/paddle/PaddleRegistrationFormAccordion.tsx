import React from "react";
import { useRef } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//API
import { useUserGetInfoAPI } from "@/hooks/api/admin/user/useUserGetInfoAPI";
import { usePaddleRegistAPI } from "@/hooks/api/admin/paddle/usePaddleRegistAPI";
import { useNextPaddleNoSearchAPI } from "@/hooks/api/admin/paddle/useNextPaddleNoSearchAPI";
//ボタン
import { ClearButton } from "@/components/ui/buttons/admin/clearButton";
import { RegistButton } from "@/components/ui/buttons/admin/registButton";
//コンポーネント
import { RequiredMark } from "@/components/ui/marks/RequiredMark";
import { KaisaiListPullDown } from "@/components/ui/pulldowns/KaisaiListPullDown";
import { PaddleKbnPullDown } from "@/components/ui/pulldowns/PaddleKbnPullDown";
import { MemberSearchModal } from "@/components/admin/MemberSearchModalComponent";
//スタイル
import formSearchStyles from "@/styles/admin/FormSearch.module.css";
//型定義
import {
  TAdminPaddleRegistRequest,
  TAdminNextPaddleSearchRequest,
  initialTAdminPaddleRegistRequest,
} from "@/types/admin/paddle/management";
import { TAdminUserSelect } from "@/types/admin/member/search";
import { TMtPaddleNumber } from "@/types/public/paddleNumber";

export interface Props {
  paddleKbnList: TMtPaddleNumber[];
}
const PaddleRegistrationFormAccordion: React.FC<Props> = ({ paddleKbnList }) => {
  const { useState, useEffect, texts } = useCommonSetup();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleKaisaiChange = (name: string, value: string) => {
    setSelectedRegistKaisai(value);
    handleRegistDataChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
    setNextPaddleSearchRequest((prevData) => ({
      ...prevData,
      auctionSeq: value,
    }));
    if (registErrors?.[name]) {
      setRegistErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };
  //登録
  const [selectedRegistKaisai, setSelectedRegistKaisai] = useState<string>("");
  const [registErrors, setRegistErrors] = useState<{ [key: string]: string }>({});
  const [paddleInsertRequest, setPaddleInsertRequest] = useState<TAdminPaddleRegistRequest>(
    initialTAdminPaddleRegistRequest
  );
  const [nextPaddleSearchRequest, setNextPaddleSearchRequest] =
    useState<TAdminNextPaddleSearchRequest>();
  const {
    userName: registUserName,
    companyName: registCompanyName,
    userGetInfo,
  } = useUserGetInfoAPI();
  const handleRegistDataChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaddleInsertRequest((prevGoodsData) => ({ ...prevGoodsData, [name]: value }));
    if (name === "userId") {
      setPaddleInsertRequest((prevData) => ({
        ...prevData,
        userName: "",
        companyName: "",
      }));
      if (value) {
        userGetInfo(value);
      }
    }
    if (registErrors?.[name]) {
      setRegistErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };
  const {
    responseStatus,
    setResponseStatus,
    errors: insertResponseErrors,
    paddleRegistAPI: insertPaddleRegistAPI,
  } = usePaddleRegistAPI();
  const paddleDataInsert = () => {
    if (paddleInsertRequest) {
      insertPaddleRegistAPI(paddleInsertRequest, false);
    }
  };
  useEffect(() => {
    if (responseStatus == 200) {
      setRegistErrors({});
      setPaddleInsertRequest(initialTAdminPaddleRegistRequest);
      setPaddleInsertRequest((prevData) => ({
        ...prevData,
        auctionSeq: selectedRegistKaisai,
        paddleKbn: selectedRegistPaddleKbn ?? undefined,
      }));
      setResponseStatus(undefined);
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus]);
  useEffect(() => {
    if (insertResponseErrors) {
      setRegistErrors(insertResponseErrors);
    }
  }, [insertResponseErrors]);

  //会員検索
  const [isModalOpen, setModalOpen] = useState(false);
  const handleSelectMember = (member: TAdminUserSelect) => {
    setPaddleInsertRequest((prevData) => ({
      ...prevData,
      userId: member.userId.toString(),
      userName: member.userName,
      companyName: member.companyName,
    }));
  };
  useEffect(() => {
    if (registUserName) {
      setPaddleInsertRequest((prevData) => ({
        ...prevData,
        userName: registUserName,
      }));
    }
    if (registCompanyName) {
      setPaddleInsertRequest((prevData) => ({
        ...prevData,
        companyName: registCompanyName,
      }));
    }
  }, [registUserName, registCompanyName]);
  //自動採番
  const {
    nextPaddleNo,
    errors: nextPaddleResponseErrors,
    nextPaddleNoSearchAPI,
  } = useNextPaddleNoSearchAPI();
  const getNextPaddleNo = () => {
    if (nextPaddleSearchRequest) {
      nextPaddleNoSearchAPI(nextPaddleSearchRequest);
    }
  };
  useEffect(() => {
    if (nextPaddleNo) {
      setPaddleInsertRequest((prevData) => ({
        ...prevData,
        paddleNo: nextPaddleNo,
      }));
    }
  }, [nextPaddleNo]);
  const [nextPaddleErrors, setNextPaddleErrors] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (nextPaddleResponseErrors) {
      setNextPaddleErrors(nextPaddleResponseErrors);
    }
  }, [nextPaddleResponseErrors]);

  //パドル区分プルダウン
  const [selectedRegistPaddleKbn, setSelectedRegistPaddleKbn] = useState<string | null>(null);
  const handlePaddleKbnChange = (name: string, value: string) => {
    setSelectedRegistPaddleKbn(value);
    handleRegistDataChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
    setNextPaddleSearchRequest((prevData) => ({
      ...prevData,
      paddleKbn: value,
    }));
    if (registErrors?.[name]) {
      setRegistErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  //登録クリア
  const registClear = () => {
    setSelectedRegistKaisai("");
    setSelectedRegistPaddleKbn("");
    setPaddleInsertRequest(initialTAdminPaddleRegistRequest);
    setRegistErrors({});
  };

  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">{texts.label.newRegist}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: "#f0f0f0" }}>
          <div className={formSearchStyles.formContainer}>
            <div className={formSearchStyles.formGrid}>
              <div className={formSearchStyles.formItem}>
                <label htmlFor="auction">
                  <RequiredMark />
                  {texts.goods.auctionName}
                </label>
                <KaisaiListPullDown
                  onChange={(value) => handleKaisaiChange("auctionSeq", value)}
                  selectedId={selectedRegistKaisai !== null ? String(selectedRegistKaisai) : ""}
                  kaisaiStatus={5}
                  defaultSetOption={1}
                  spnKbns={["1"]}
                />
                {registErrors?.auctionSeq && (
                  <p className="error-message">{registErrors.auctionSeq}</p>
                )}
                {nextPaddleErrors?.auctionSeq && (
                  <p className="error-message">{nextPaddleErrors.auctionSeq}</p>
                )}
              </div>

              <div className={formSearchStyles.formItem}>
                <label htmlFor="userId">
                  <RequiredMark />
                  {texts.member.userId}
                </label>
                <div className={formSearchStyles.formRow}>
                  <input
                    ref={inputRef}
                    id="userId"
                    type="number"
                    name="userId"
                    maxLength={9}
                    value={paddleInsertRequest?.userId}
                    onChange={handleRegistDataChange}
                  />
                  <button
                    type="button"
                    className="bg-gray-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg w-40"
                    onClick={() => setModalOpen(true)}
                  >
                    {texts.button.memberSearchModal}
                  </button>
                </div>
                {registErrors?.userId && <p className="error-message">{registErrors.userId}</p>}
              </div>

              <div className={formSearchStyles.formItem}>
                <label htmlFor="registUserName">{texts.member.userName}</label>
                <input
                  id="registUserName"
                  type="text"
                  name="registUserName"
                  value={paddleInsertRequest?.userName}
                  disabled
                />
              </div>

              <div className={formSearchStyles.formItem}>
                <label htmlFor="registCompanyName">{texts.member.companyName}</label>
                <input
                  id="registCompanyName"
                  type="text"
                  name="registCompanyName"
                  value={paddleInsertRequest?.companyName}
                  disabled
                />
              </div>
            </div>

            <div className={`${formSearchStyles.formGrid} !mt-2`}>
              <div className={formSearchStyles.formItem}>
                <label htmlFor="paddleKbn">
                  <RequiredMark />
                  {texts.paddle.paddleKbn}
                </label>
                <PaddleKbnPullDown
                  onChange={(value) => handlePaddleKbnChange("paddleKbn", value)}
                  selectedId={
                    selectedRegistPaddleKbn !== null ? String(selectedRegistPaddleKbn) : ""
                  }
                  paddleKbnList={paddleKbnList}
                />
                {texts.paddle.paddleKbn_note_1}
                {nextPaddleErrors?.paddleKbn && (
                  <p className="error-message">{nextPaddleErrors.paddleKbn}</p>
                )}
                {registErrors?.paddleKbn && (
                  <p className="error-message">{registErrors.paddleKbn}</p>
                )}
              </div>
              <div className={formSearchStyles.formItem}>
                <label htmlFor="paddleNo">
                  <RequiredMark />
                  {texts.paddle.paddleNo}
                </label>
                <div className={formSearchStyles.formRow}>
                  <input
                    id="paddleNo"
                    type="text"
                    name="paddleNo"
                    value={paddleInsertRequest?.paddleNo}
                    onChange={handleRegistDataChange}
                  />
                  <button
                    type="button"
                    className="bg-gray-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg w-40"
                    onClick={getNextPaddleNo}
                  >
                    自動採番
                  </button>
                </div>
                {registErrors?.paddleNo && <p className="error-message">{registErrors.paddleNo}</p>}
              </div>
            </div>

            <div className="text-right mt-2">
              <RegistButton label={texts.button.regist} onClick={paddleDataInsert} />
              <ClearButton onClick={registClear} />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      <MemberSearchModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleSelectMember}
      />
    </>
  );
};

export default PaddleRegistrationFormAccordion;
