import { GetServerSideProps } from "next";
import Link from "next/link";
import { getTexts } from "@/config/texts";
//ホック
import { withSystemSetting } from "@/hocs/withSystemSetting";
import withMemberLayout from "@/hocs/withMemberLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//API
import { useMemberSignUpAPI } from "@/hooks/api/public/useMemberSignUpAPI";
//型定義
import { TUserMemberRegistRequest } from "@/types/common/user";
import { TPageProps } from "@/types/member/memberPage";
//コンポーネント
import { MemberFormFields } from "@/components/common/MemberFormFields";
import { RequiredMark } from "@/components/ui/marks/RequiredMark";
//ボタン
import { SignupButton } from "@/components/ui/buttons/member/signUpButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
//スタイル
import memberStyles from "@/styles/member/MemberCommon.module.css";

export const getServerSideProps: GetServerSideProps = withSystemSetting(
  async (context) => {
    const { locale } = context;
    const texts = getTexts(locale);
    return {
      props: {
        pageTitle: texts.menu.memberSignup,
      },
    };
  },
  true,
  false
);

const Page: React.FC<TPageProps> = ({ kiyakuPath, privacyPolicyPath }) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [member, setMember] = useState<TUserMemberRegistRequest>({
    privacyPolicyAgreed: !privacyPolicyPath, // 非表示なら true
    kiyakuAgreed: !kiyakuPath, // 非表示なら true
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setMember((prevMember) => ({ ...prevMember, [name]: value }));
    if (errors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };
  // プライバシーポリシーと利用規約のチェック状態のハンドラー
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setMember((prevMember) => ({ ...prevMember, [name]: checked }));
  };

  //会員情報登録
  const { errors, userRegist } = useMemberSignUpAPI();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const handleSubmit = () => {
    userRegist(member);
  };
  useEffect(() => {
    if (errors) {
      setFormErrors(errors);
    }
  }, [errors]);

  return (
    <>
      <div className={memberStyles.mainTitleContainer}>
        <span className={memberStyles.mainTitle}>{texts.menu.memberSignup}</span>
      </div>
      <div className="lg:flex flex-col items-center justify-center min-h-screen ">
        <div className="lg:w-6/12 p-8 space-y-6 bg-white md:max-w-full md:rounded">
          <div className="space-y-4">
            {
              <MemberFormFields
                member={member}
                handleChange={handleChange}
                errors={formErrors}
                setErrors={setFormErrors}
              />
            }
            {privacyPolicyPath != "" && (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={member.privacyPolicyAgreed || false}
                      onChange={handleCheckboxChange}
                      name="privacyPolicyAgreed"
                    />
                  }
                  label={
                    <span>
                      <RequiredMark />
                      <Link
                        className="text-blue-600 underline"
                        href={privacyPolicyPath}
                        target="_blank"
                      >
                        {texts.member.privacyPolicy}
                      </Link>{" "}
                      {texts.member.consent}
                    </span>
                  }
                />
              </>
            )}
            {errors?.privacyPolicyAgreed && (
              <p className="error-message">{errors.privacyPolicyAgreed}</p>
            )}
            {kiyakuPath != "" && (
              <>
                <br />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={member.kiyakuAgreed || false}
                      onChange={handleCheckboxChange}
                      name="kiyakuAgreed"
                    />
                  }
                  label={
                    <span>
                      <RequiredMark />
                      <Link className="text-blue-600 underline" href={kiyakuPath} target="_blank">
                        {texts.member.kiyaku}
                      </Link>{" "}
                      {texts.member.consent}
                    </span>
                  }
                />
              </>
            )}
            {errors?.kiyakuAgreed && <p className="error-message">{errors.kiyakuAgreed}</p>}
            <div className="flex justify-center items-center ">
              <SignupButton onClick={handleSubmit} label={texts.button.newSignup} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withMemberLayout(Page);
