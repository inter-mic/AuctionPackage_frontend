import { GetServerSideProps } from "next";
import { getTexts } from "@/config/texts";
//ホック
import { withAuth } from "@/hocs/withMemberAuth";
import withMemberLayout from "@/hocs/withMemberLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//API
import { useUserUpdateAPI } from "@/hooks/api/member/mypage/useUserUpdateAPI";
import { useUserSearchAPI } from "@/hooks/api/member/mypage/useUserSearchAPI";
//型定義
import { TUserMemberRegistRequest } from "@/types/common/user";
import { TPageProps } from "@/types/member/memberPage";
//コンポーネント
import { MemberFormFields } from "@/components/common/MemberFormFields";
//ボタン
import { SignupButton } from "@/components/ui/buttons/member/signUpButton";
//スタイル
import memberStyles from "@/styles/member/MemberCommon.module.css";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const { locale } = context;
  const texts = getTexts(locale);
  return {
    props: {
      pageTitle: texts.menu.memberAccount,
    },
  };
});

const Page: React.FC<TPageProps> = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [member, setMember] = useState<TUserMemberRegistRequest>({});
  const { userData, userSearchAPI } = useUserSearchAPI();
  useEffect(() => {
    userSearchAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (userData) {
      setMember(userData);
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setMember((prevMember) => ({ ...prevMember, [name]: value }));
  };

  //会員情報登録
  const { errors, userUpdateAPI } = useUserUpdateAPI();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const handleSubmit = () => {
    userUpdateAPI(member);
  };
  useEffect(() => {
    if (errors) {
      setFormErrors(errors);
    }
  }, [errors]);

  return (
    <>
      <div className={memberStyles.mainTitleContainer}>
        <span className={memberStyles.mainTitle}>{texts.menu.memberAccount}</span>
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

            <div className="flex justify-center items-center ">
              <SignupButton onClick={handleSubmit} label={texts.button.memberRegist} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withMemberLayout(Page);
