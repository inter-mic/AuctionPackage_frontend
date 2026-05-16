import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useFormFieldHandlers } from "@/hooks/useFormFieldHandlers";
//型定義
import { TAdminUserRegistRequest } from "@/types/admin/member/register";
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
  member: TAdminUserRegistRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Errors;
  setErrors: React.Dispatch<React.SetStateAction<Errors>>;
}

export const MemberFormFields: React.FC<Props> = ({ member, handleChange, errors }) => {
  const { useState, useEffect, texts } = useCommonSetup();

  const [selectedTodofukenId, setSelectedTodofukenId] = useState<string | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    handleChange({
      target: { name, value },
    } as React.ChangeEvent<HTMLInputElement>);
  };
  const { handleZipCodeChange, handlePhoneChange } = useFormFieldHandlers({
    handleChange,
    zipCodeSearch,
  });

  // IME入力中かどうかを追跡する状態
  const [isComposing, setIsComposing] = useState<{ [key: string]: boolean }>({});
  // IME入力開始時のハンドラー
  const handleCompositionStart = (e: React.CompositionEvent<HTMLInputElement>) => {
    const inputId = (e.target as HTMLInputElement).id;
    setIsComposing((prev) => ({ ...prev, [inputId]: true }));
  };
  // 数字のみを入力可能にするヘルパー関数
  const handleNumericInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputId = (e.target as HTMLInputElement).id;
    // IME入力中はブロックしない
    if (isComposing[inputId]) {
      return;
    }
    // 数字、Backspace、Delete、Tab、Arrow keys、Home、End、Enter を許可
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "Enter",
    ];
    if (
      allowedKeys.includes(e.key) ||
      (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
    ) {
      return;
    }
    // 数字以外のキーをブロック
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  // 入力値を数字のみに制限する関数
  const handleNumericChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    originalHandler?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value !== e.target.value) {
      // 数字以外の文字が含まれている場合は、数字のみの値に置き換える
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: value,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      if (originalHandler) {
        originalHandler(syntheticEvent);
      }
    } else {
      // 数字のみの場合はそのまま元のハンドラーを呼び出す
      if (originalHandler) {
        originalHandler(e);
      }
    }
  };
  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    const inputId = (e.target as HTMLInputElement).id;
    setIsComposing((prev) => ({ ...prev, [inputId]: false }));
    // IME入力が終了したら、数字以外を削除
    const input = e.currentTarget;
    const originalValue = input.value;
    const value = originalValue.replace(/[^0-9]/g, "");
    if (value !== originalValue) {
      input.value = value;
      // 各フィールドのonChangeハンドラーを呼び出す
      const syntheticEvent = {
        target: input,
        currentTarget: input,
      } as React.ChangeEvent<HTMLInputElement>;
      if (inputId.startsWith("zipCode")) {
        handleNumericChange(syntheticEvent, () => handleZipCodeChange("zipCode"));
      } else if (inputId.startsWith("tel")) {
        handleNumericChange(syntheticEvent, () => handlePhoneChange("tel"));
      } else if (inputId.startsWith("fax")) {
        handleNumericChange(syntheticEvent, () => handlePhoneChange("fax"));
      } else if (inputId.startsWith("mobile")) {
        handleNumericChange(syntheticEvent, () => handlePhoneChange("mobile"));
      }
    }
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
    newAlignment: string | null,
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
        {errors?.loginId && <p className={`error-message ${styles.input50}`}>{errors.loginId}</p>}
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
        {errors?.userName && <p className={`error-message ${styles.input50}`}>{errors.userName}</p>}
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
          <p className={`error-message ${styles.input50}`}>{errors.userNameKana}</p>
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
          <p className={`error-message ${styles.input50}`}>{errors.companyName}</p>
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
          <p className={`error-message ${styles.input50}`}>{errors.companyNameKana}</p>
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
          <p className={`error-message ${styles.input50}`}>{errors.companyUrl}</p>
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
        {errors?.mail && <p className={`error-message ${styles.input50}`}>{errors.mail}</p>}
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
        <div className="flex items-center space-x-2 lg:w-3/12 sm:w-full">
          <input
            id="zipCode1"
            name="zipCode1"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={member.zipCode?.split("-")[0] || ""}
            onKeyPress={handleNumericInput}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onChange={(e) => handleNumericChange(e, () => handleZipCodeChange("zipCode"))}
            className={`${styles.commonInput} ${styles.input100}`}
          />
          <span>-</span>
          <input
            id="zipCode2"
            name="zipCode2"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={member.zipCode?.split("-")[1] || ""}
            onKeyPress={handleNumericInput}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onChange={(e) => handleNumericChange(e, () => handleZipCodeChange("zipCode"))}
            className={`${styles.commonInput} ${styles.input100}`}
          />
        </div>
        {errors?.zipCode && <p className={`error-message ${styles.input100}`}>{errors.zipCode}</p>}
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
          <p className={`error-message ${styles.input100}`}>{errors.address1}</p>
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
          <p className={`error-message ${styles.input100}`}>{errors.address2}</p>
        )}
      </div>
      <div>
        <label htmlFor="tel" className="formlabel">
          {texts.member.tel}
          {texts.label.hankakuInput}
        </label>
        <div className="flex items-center space-x-2 lg:w-4/12 sm:w-full">
          <input
            id="tel1"
            name="tel1"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={member.tel?.split("-")[0] || ""}
            onKeyPress={handleNumericInput}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onChange={(e) => handleNumericChange(e, () => handlePhoneChange("tel"))}
            className={`${styles.commonInput} ${styles.input100}`}
          />
          <span>-</span>
          <input
            id="tel2"
            name="tel2"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={member.tel?.split("-")[1] || ""}
            onKeyPress={handleNumericInput}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onChange={(e) => handleNumericChange(e, () => handlePhoneChange("tel"))}
            className={`${styles.commonInput} ${styles.input100}`}
          />
          <span>-</span>
          <input
            id="tel3"
            name="tel3"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={member.tel?.split("-")[2] || ""}
            onKeyPress={handleNumericInput}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onChange={(e) => handleNumericChange(e, () => handlePhoneChange("tel"))}
            className={`${styles.commonInput} ${styles.input100}`}
          />
        </div>
        {errors?.tel && <p className={`error-message ${styles.input50}`}>{errors.tel}</p>}
      </div>
      <div>
        <label className="formlabel">
          {texts.member.fax}
          {texts.label.hankakuInput}
        </label>
        <div className="flex items-center space-x-2 lg:w-4/12 sm:w-full">
          <input
            id="fax1"
            name="fax1"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={member.fax?.split("-")[0] || ""}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyPress={handleNumericInput}
            onChange={(e) => handleNumericChange(e, () => handlePhoneChange("fax"))}
            className={`${styles.commonInput} ${styles.input100}`}
          />
          <span>-</span>
          <input
            id="fax2"
            name="fax2"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={member.fax?.split("-")[1] || ""}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyPress={handleNumericInput}
            onChange={(e) => handleNumericChange(e, () => handlePhoneChange("fax"))}
            className={`${styles.commonInput} ${styles.input100}`}
          />
          <span>-</span>
          <input
            id="fax3"
            name="fax3"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={member.fax?.split("-")[2] || ""}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyPress={handleNumericInput}
            onChange={(e) => handleNumericChange(e, () => handlePhoneChange("fax"))}
            className={`${styles.commonInput} ${styles.input100}`}
          />
        </div>
        {errors?.fax && <p className={`error-message ${styles.input50}`}>{errors.fax}</p>}
      </div>
      <div>
        <label className="formlabel">
          {texts.member.mobile}
          {texts.label.hankakuInput}
        </label>
        <div className="flex items-center space-x-2 lg:w-4/12 sm:w-full">
          <input
            id="mobile1"
            name="mobile1"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={member.mobile?.split("-")[0] || ""}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyPress={handleNumericInput}
            onChange={(e) => handleNumericChange(e, () => handlePhoneChange("mobile"))}
            className={`${styles.commonInput} ${styles.input100}`}
          />
          <span>-</span>
          <input
            id="mobile2"
            name="mobile2"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={member.mobile?.split("-")[1] || ""}
            onKeyPress={handleNumericInput}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onChange={(e) => handleNumericChange(e, () => handlePhoneChange("mobile"))}
            className={`${styles.commonInput} ${styles.input100}`}
          />
          <span>-</span>
          <input
            id="mobile3"
            name="mobile3"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={member.mobile?.split("-")[2] || ""}
            onKeyPress={handleNumericInput}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onChange={(e) => handleNumericChange(e, () => handlePhoneChange("mobile"))}
            className={`${styles.commonInput} ${styles.input100}`}
          />
        </div>
        {errors?.mobile && <p className={`error-message ${styles.input50}`}>{errors.mobile}</p>}
      </div>
      <div>
        <div className="flex items-center">
          <label htmlFor="ginkoCode" className="formlabel">
            {texts.member.ginkoCode}
          </label>
        </div>
        <input
          id="ginkoCode"
          name="ginkoCode"
          type="text"
          value={member.ginkoCode || ""}
          onChange={handleInputChange}
          className={`${styles.commonInput} ${styles.input25}`}
        />
        {errors?.ginkoCode && (
          <p className={`error-message ${styles.input25}`}>{errors.ginkoCode}</p>
        )}
      </div>
      <div>
        <div className="flex items-center">
          <label htmlFor="ginkoName" className="formlabel">
            {texts.member.ginkoName}
          </label>
        </div>
        <input
          id="ginkoName"
          name="ginkoName"
          type="text"
          value={member.ginkoName || ""}
          onChange={handleInputChange}
          className={`${styles.commonInput} ${styles.input50}`}
        />
        {errors?.ginkoName && (
          <p className={`error-message ${styles.input50}`}>{errors.ginkoName}</p>
        )}
      </div>
      <div>
        <div className="flex items-center">
          <label htmlFor="shitenCode" className="formlabel">
            {texts.member.shitenCode}
          </label>
        </div>
        <input
          id="shitenCode"
          name="shitenCode"
          type="text"
          value={member.shitenCode || ""}
          onChange={handleInputChange}
          className={`${styles.commonInput} ${styles.input25}`}
        />
        {errors?.shitenCode && (
          <p className={`error-message ${styles.input25}`}>{errors.shitenCode}</p>
        )}
      </div>
      <div>
        <div className="flex items-center">
          <label htmlFor="shitenName" className="formlabel">
            {texts.member.shitenName}
          </label>
        </div>
        <input
          id="shitenName"
          name="shitenName"
          type="text"
          value={member.shitenName || ""}
          onChange={handleInputChange}
          className={`${styles.commonInput} ${styles.input50}`}
        />
        {errors?.shitenName && (
          <p className={`error-message ${styles.input50}`}>{errors.shitenName}</p>
        )}
      </div>
      <div>
        <div className="flex items-center">
          <label htmlFor="kozaType" className="formlabel">
            {texts.member.kozaType}
          </label>
        </div>
        <select
          id="kozaType"
          name="kozaType"
          value={member.kozaType || ""}
          onChange={handleSelectChange}
          className={`${styles.commonInput} ${styles.input25}`}
        >
          <option value="">---</option>
          <option value="1">{texts.member.kozaType1}</option>
          <option value="2">{texts.member.kozaType2}</option>
        </select>
        {errors?.kozaType && <p className={`error-message ${styles.input25}`}>{errors.kozaType}</p>}
      </div>
      <div>
        <div className="flex items-center">
          <label htmlFor="kozameigi" className="formlabel">
            {texts.member.kozameigi}
          </label>
        </div>
        <input
          id="kozameigi"
          name="kozameigi"
          type="text"
          value={member.kozameigi || ""}
          onChange={handleInputChange}
          className={`${styles.commonInput} ${styles.input50}`}
        />
        {errors?.kozameigi && (
          <p className={`error-message ${styles.input50}`}>{errors.kozameigi}</p>
        )}
      </div>
      <div>
        <div className="flex items-center">
          <label htmlFor="kozabango" className="formlabel">
            {texts.member.kozabango}
          </label>
        </div>
        <input
          id="kozabango"
          name="kozabango"
          type="text"
          value={member.kozabango || ""}
          onChange={handleInputChange}
          className={`${styles.commonInput} ${styles.input50}`}
        />
        {errors?.kozabango && (
          <p className={`error-message ${styles.input50}`}>{errors.kozabango}</p>
        )}
      </div>
      {userAddinfo.map(
        (data) =>
          data.userAddinfo && (
            <React.Fragment key={data.seq}>
              <div>
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
            </React.Fragment>
          ),
      )}
    </>
  );
};
