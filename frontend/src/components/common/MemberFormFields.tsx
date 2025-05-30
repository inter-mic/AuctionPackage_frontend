import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { UserData } from "@/types/admin/member/register";
import { Errors } from "@/types/errors";
//コンポーネント
import { TodofukenPullDown } from "@/components/ui/pulldowns/TodofukenPullDown";
import { RequiredMark } from "@/components/ui/marks/RequiredMark";
//API
import { useUserAddinfoItemAPI } from "@/hooks/api/public/useUserAddinfoItemAPI";
import { useZipCodeSearchAPI } from "@/hooks/api/public/useZipCodeSearchAPI";
//スタイル
import styles from "@/styles/CommonRegister.module.css";

interface Props {
  member: UserData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Errors;
  setErrors: React.Dispatch<React.SetStateAction<Errors>>;
}

export const MemberFormFields: React.FC<Props> = ({
  member,
  handleChange,
  errors,
  setErrors,
}) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } =
    useCommonSetup();

  const [selectedTodofukenId, setSelectedTodofukenId] = useState<string | null>(
    null
  );

  const handleTodofukenChange = (name: string, value: string) => {
    setSelectedTodofukenId(value);
    handleChange({
      target: { name, value },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const { userAddinfo } = useUserAddinfoItemAPI();
  useEffect(() => {
    if (member.todofukenName) {
      setSelectedTodofukenId(member.todofukenName);
    }
  }, [member]);

  const { address, zipCodeSearch } = useZipCodeSearchAPI();
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zipCode1 = (document.getElementById("zipCode1") as HTMLInputElement)
      .value;
    const zipCode2 = (document.getElementById("zipCode2") as HTMLInputElement)
      .value;
    handleChange({
      target: { name: "zipCode", value: `${zipCode1}-${zipCode2}` },
    } as React.ChangeEvent<HTMLInputElement>);

    if (zipCode1.length === 3 && zipCode2.length === 4) {
      const paramZipCode = zipCode1 + zipCode2;
      zipCodeSearch(paramZipCode);
    }
  };
  useEffect(() => {
    if (address) {
      handleChange({
        target: { name: "todofukenName", value: address.todofukenName },
      } as React.ChangeEvent<HTMLInputElement>);
      handleChange({
        target: { name: "address1", value: address.address },
      } as React.ChangeEvent<HTMLInputElement>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const handleTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tel1 = (document.getElementById("tel1") as HTMLInputElement).value;
    const tel2 = (document.getElementById("tel2") as HTMLInputElement).value;
    const tel3 = (document.getElementById("tel3") as HTMLInputElement).value;
    handleChange({
      target: { name: "tel", value: `${tel1}-${tel2}-${tel3}` },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleFaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fax1 = (document.getElementById("fax1") as HTMLInputElement).value;
    const fax2 = (document.getElementById("fax2") as HTMLInputElement).value;
    const fax3 = (document.getElementById("fax3") as HTMLInputElement).value;
    handleChange({
      target: { name: "fax", value: `${fax1}-${fax2}-${fax3}` },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mobile1 = (document.getElementById("mobile1") as HTMLInputElement)
      .value;
    const mobile2 = (document.getElementById("mobile2") as HTMLInputElement)
      .value;
    const mobile3 = (document.getElementById("mobile3") as HTMLInputElement)
      .value;
    handleChange({
      target: { name: "mobile", value: `${mobile1}-${mobile2}-${mobile3}` },
    } as React.ChangeEvent<HTMLInputElement>);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange(e);
  };
  const [auctionMailJushinFlg, setAuctionMailJushinFlg] = useState("1");
  useEffect(() => {
    if (member.userId === undefined) {
      // エラーハンドリングは不要
    } else if (typeof member.auctionMailJushinFlg === "boolean") {
      setAuctionMailJushinFlg(member.auctionMailJushinFlg ? "1" : "0"); // auctionMailJushinFlg が boolean の場合
    } else {
      setAuctionMailJushinFlg("0"); // それ以外の場合は "0" を設定
    }
  }, [member]);
  const handleAuctionMailJushinFlg = (
    _event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (newAlignment !== null) {
      setAuctionMailJushinFlg(newAlignment);

      const event = new Event("input", {
        bubbles: true,
      }) as unknown as React.ChangeEvent<HTMLInputElement>;
      Object.defineProperty(event, "target", {
        value: {
          name: "auctionMailJushinFlg",
          value: newAlignment === "1", // boolean に変換
        },
        writable: false,
      });

      handleChange(event);
    }
  };

  return (
    <>
      <div>
        <div className="flex items-center">
          <RequiredMark />
          <label htmlFor="loginId" className="formlabel">
            {texts.member.loginId}
          </label>
        </div>
        <input
          id="loginId"
          name="loginId"
          type="text"
          value={member.loginId || ""}
          onChange={handleInputChange}
          className={`${styles.commonInput} ${styles.input50}`}
        />
        {errors?.loginId && (
          <p className={`error-message ${styles.input50}`}>{errors.loginId}</p>
        )}
      </div>
      <div>
        <div className="flex items-center">
          <RequiredMark />
          <label htmlFor="userName" className="formlabel">
            {texts.member.userName}
          </label>
        </div>
        <input
          id="userName"
          name="userName"
          type="text"
          value={member.userName || ""}
          onChange={handleInputChange}
          className={`${styles.commonInput} ${styles.input50}`}
        />
        {errors?.userName && (
          <p className={`error-message ${styles.input50}`}>{errors.userName}</p>
        )}
      </div>
      <div>
        <div className="flex items-center">
          <label htmlFor="userNameKana" className="formlabel">
            {texts.member.userNameKana}
          </label>
        </div>
        <input
          id="userNameKana"
          name="userNameKana"
          type="text"
          value={member.userNameKana || ""}
          onChange={handleInputChange}
          className={`${styles.commonInput} ${styles.input50}`}
        />
        {errors?.userNameKana && (
          <p className={`error-message ${styles.input50}`}>
            {errors.userNameKana}
          </p>
        )}
      </div>
      <div>
        <div className="flex items-center">
          <label htmlFor="companyName" className="formlabel">
            {texts.member.companyName}
          </label>
        </div>
        <input
          id="companyName"
          name="companyName"
          type="text"
          value={member.companyName || ""}
          onChange={handleInputChange}
          className={`${styles.commonInput} ${styles.input50}`}
        />
        {errors?.companyName && (
          <p className={`error-message ${styles.input50}`}>
            {errors.companyName}
          </p>
        )}
      </div>
      <div>
        <div className="flex items-center">
          <label htmlFor="companyNameKana" className="formlabel">
            {texts.member.companyNameKana}
          </label>
        </div>
        <input
          id="companyNameKana"
          name="companyNameKana"
          type="text"
          value={member.companyNameKana || ""}
          onChange={handleInputChange}
          className={`${styles.commonInput} ${styles.input50}`}
        />
        {errors?.companyNameKana && (
          <p className={`error-message ${styles.input50}`}>
            {errors.companyNameKana}
          </p>
        )}
      </div>
      <div>
        <div className="flex items-center">
          <label htmlFor="companyUrl" className="formlabel">
            {texts.member.companyUrl}
          </label>
        </div>
        <input
          id="companyUrl"
          name="companyUrl"
          type="text"
          value={member.companyUrl || ""}
          onChange={handleInputChange}
          className={`${styles.commonInput} ${styles.input50}`}
        />
        {errors?.companyUrl && (
          <p className={`error-message ${styles.input50}`}>
            {errors.companyUrl}
          </p>
        )}
      </div>
      <div>
        <div className="flex items-center">
          <RequiredMark />
          <label htmlFor="mail" className="formlabel">
            {texts.common.mail}
          </label>
        </div>
        <input
          id="mail"
          name="mail"
          type="email"
          value={member.mail || ""}
          onChange={handleInputChange}
          className={`${styles.commonInput} ${styles.input50}`}
        />
        {errors?.mail && (
          <p className={`error-message ${styles.input50}`}>{errors.mail}</p>
        )}
      </div>
      <div>
        <div className="flex items-center">
          <label htmlFor="mail" className="formlabel">
            {texts.member.auctionMailJushinFlg}
          </label>
        </div>
        <ToggleButtonGroup
          color="primary"
          size="large"
          value={auctionMailJushinFlg}
          exclusive
          onChange={handleAuctionMailJushinFlg}
        >
          <ToggleButton value="1">{texts.common.mailJushinOn}</ToggleButton>
          <ToggleButton value="0">{texts.common.mailJushinOff}</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div>
        <label className="formlabel">
          {texts.member.zipCode}
          {texts.label.hankakuInput}
        </label>
        <div className="flex items-center space-x-2 lg:w-6/12 sm:w-full">
          <input
            id="zipCode1"
            name="zipCode1"
            type="number"
            value={member.zipCode?.split("-")[0] || ""}
            onChange={handleZipCodeChange}
            className={`${styles.commonInput} ${styles.input100}`}
          />
          <span>-</span>
          <input
            id="zipCode2"
            name="zipCode2"
            type="number"
            value={member.zipCode?.split("-")[1] || ""}
            onChange={handleZipCodeChange}
            className={`${styles.commonInput} ${styles.input100}`}
          />
        </div>
        {errors?.zipCode && (
          <p className={`error-message ${styles.input100}`}>{errors.zipCode}</p>
        )}
      </div>
      <div className="flex flex-col w-full">
        <label htmlFor="todofuken" className="formlabel w-full">
          {texts.member.todofuken}
        </label>
        <TodofukenPullDown
          onChange={(value) => handleTodofukenChange("todofukenName", value)}
          selectedId={selectedTodofukenId}
        />
      </div>
      <div>
        <label htmlFor="address1" className="formlabel">
          {texts.member.address1}
        </label>
        <input
          id="address1"
          name="address1"
          type="text"
          value={member.address1 || ""}
          onChange={handleInputChange}
          className={`${styles.commonInput} ${styles.input100}`}
        />
        {errors?.address1 && (
          <p className={`error-message ${styles.input100}`}>
            {errors.address1}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="address2" className="formlabel">
          {texts.member.address2}
        </label>
        <input
          id="address2"
          name="address2"
          type="text"
          value={member.address2 || ""}
          onChange={handleInputChange}
          className={`${styles.commonInput} ${styles.input100}`}
        />
        {errors?.address2 && (
          <p className={`error-message ${styles.input100}`}>
            {errors.address2}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="tel" className="formlabel">
          {texts.member.tel}
          {texts.label.hankakuInput}
        </label>
        <div className="flex items-center space-x-2 lg:w-6/12 sm:w-full">
          <input
            id="tel1"
            name="tel1"
            type="number"
            value={member.tel?.split("-")[0] || ""}
            onChange={handleTelChange}
            className={`${styles.commonInput} ${styles.input100}`}
          />
          <span>-</span>
          <input
            id="tel2"
            name="tel2"
            type="number"
            value={member.tel?.split("-")[1] || ""}
            onChange={handleTelChange}
            className={`${styles.commonInput} ${styles.input100}`}
          />
          <span>-</span>
          <input
            id="tel3"
            name="tel3"
            type="number"
            value={member.tel?.split("-")[2] || ""}
            onChange={handleTelChange}
            className={`${styles.commonInput} ${styles.input100}`}
          />
        </div>
        {errors?.tel && (
          <p className={`error-message ${styles.input50}`}>{errors.tel}</p>
        )}
      </div>
      <div>
        <label className="formlabel">
          {texts.member.fax}
          {texts.label.hankakuInput}
        </label>
        <div className="flex items-center space-x-2 lg:w-6/12 sm:w-full">
          <input
            id="fax1"
            name="fax1"
            type="text"
            value={member.fax?.split("-")[0] || ""}
            onChange={handleFaxChange}
            className={`${styles.commonInput} ${styles.input100}`}
          />
          <span>-</span>
          <input
            id="fax2"
            name="fax2"
            type="text"
            value={member.fax?.split("-")[1] || ""}
            onChange={handleFaxChange}
            className={`${styles.commonInput} ${styles.input100}`}
          />
          <span>-</span>
          <input
            id="fax3"
            name="fax3"
            type="text"
            value={member.fax?.split("-")[2] || ""}
            onChange={handleFaxChange}
            className={`${styles.commonInput} ${styles.input100}`}
          />
        </div>
        {errors?.fax && (
          <p className={`error-message ${styles.input50}`}>{errors.fax}</p>
        )}
      </div>
      <div>
        <label className="formlabel">
          {texts.member.mobile}
          {texts.label.hankakuInput}
        </label>
        <div className="flex items-center space-x-2 lg:w-6/12 sm:w-full">
          <input
            id="mobile1"
            name="mobile1"
            type="nummber"
            value={member.mobile?.split("-")[0] || ""}
            onChange={handleMobileChange}
            className={`${styles.commonInput} ${styles.input100}`}
          />
          <span>-</span>
          <input
            id="mobile2"
            name="mobile2"
            type="nummber"
            value={member.mobile?.split("-")[1] || ""}
            onChange={handleMobileChange}
            className={`${styles.commonInput} ${styles.input100}`}
          />
          <span>-</span>
          <input
            id="mobile3"
            name="mobile3"
            type="nummber"
            value={member.mobile?.split("-")[2] || ""}
            onChange={handleMobileChange}
            className={`${styles.commonInput} ${styles.input100}`}
          />
        </div>
        {errors?.mobile && (
          <p className={`error-message ${styles.input50}`}>{errors.mobile}</p>
        )}
      </div>
      {userAddinfo.map(
        (data) =>
          data.userAddinfo && (
            <>
              <div key={data.seq}>
                <label htmlFor="" className="formlabel">
                  {data.userAddinfo}
                </label>
                <input
                  id={`addInfo${data.seq}`}
                  name={`addInfo${data.seq}`}
                  type="text"
                  value={(member as any)[`addInfo${data.seq}`] || ""}
                  onChange={handleInputChange}
                  className={`${styles.commonInput} ${styles.input100}`}
                />
              </div>
            </>
          )
      )}
    </>
  );
};
