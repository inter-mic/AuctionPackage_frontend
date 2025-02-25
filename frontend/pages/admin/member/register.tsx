import { GetServerSideProps } from 'next';
import { useSearchParams } from 'next/navigation';
import { texts } from '@/config/texts';
//ホック
import { withAuth } from '@/hocs/withAdminAuth';
import withAdminLayout from '@/hocs/withAdminLayout';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
import { useKengenRedirect } from '@/hooks/useKengenRedirect';
import { useExecutionPermission } from '@/hooks/useExecutionPermission';
//API
import { useUserGetInfoAPI } from '@/hooks/api/admin/user/useUserGetInfoAPI';
import { useUserRegistAPI } from '@/hooks/api/admin/user/useUserRegistAPI';
import { useUserDeleteAPI } from '@/hooks/api/admin/user/useUserDeleteAPI';
//型定義
import { UserData } from '@/types/admin/member/register';
import { PageProps } from '@/types/admin/adminPage';
//コンポーネント
import { MemberFormFields } from '@/components/common/MemberFormFields';
import ConfirmDialog from '@/components/ui/dialog/confirmDialog';
//ボタン
import { RegistButton } from '@/components/ui/buttons/admin/registButton';
import { ShoninOnButton, ShoninOffButton } from '@/components/ui/buttons/admin/shoninButton';
import { MemberTeishiOnButton, MemberTeishiOffButton } from '@/components/ui/buttons/admin/memberTeishiButton';
//スタイル
import breadcrumbStyles from '@/styles/breadcrumb.module.css';
import styles from '@/styles/admin/MemberRegist.module.css';



export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const otherData = {};
  return {
    props: {
      pageTitle: texts.menu.adminMemberRegist
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  useKengenRedirect(kengen, 101);
  const { executionPermission } = useExecutionPermission(kengen);
  const { data, userGetInfo } = useUserGetInfoAPI();
  const params = useSearchParams();
  const paramsUserId = params ? params.get('userId') : null;
  useEffect(() => {
    if (paramsUserId) {
      userGetInfo(paramsUserId);
    }else{
      setMember({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsUserId]);
  const [member, setMember] = useState<UserData>({});
  useEffect(() => {
    if (data) { setMember(data[0]); }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setMember((prevMember) => ({ ...prevMember, [name]: value }));
    if (errors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  //会員情報登録
  const { responseData, errors, userRegist } = useUserRegistAPI();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const handleSubmit = () => {

    userRegist(member);
  };

  useEffect(() => {
    if (responseData) { setMember(responseData[0]); }
  }, [responseData]);

  useEffect(() => {
    if (errors) { setFormErrors(errors); }
  }, [errors]);

  //承認処理
  const updateShoninFlg = useCallback((userId: number, newFlg: boolean) => {
    setMember((prevMember) => {
      return { ...prevMember, shoninFlg: newFlg };
    });
  }, []);

  //停止処理
  const updateTeishiFlg = useCallback((userId: number, newFlg: boolean) => {
    setMember((prevMember) => {
      return { ...prevMember, teishiFlg: newFlg };
    });
  }, []);

  //削除処理
  const { userDelete } = useUserDeleteAPI();
  const handleDeleteSubmit = () => {
    userDelete(member);
  };

  return (
    <div>
       <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminMemberRegist}</span>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full p-8 space-y-6 bg-white shadow-md md:max-w-full md:rounded">
            {<MemberFormFields member={member} handleChange={handleChange} errors={formErrors} setErrors={setFormErrors} />}
            <div>
            <div className="flex items-center">
              <label htmlFor="adminBiko" className="formlabel">
                {texts.member.adminBiko}
              </label>
              </div>
              <textarea
                id="adminBiko"
                name="adminBiko"
                value={member.adminBiko || ''}
                onChange={handleChange}
                className={`${styles.commonInput} ${styles.input100}`}
              />
            </div>
            {executionPermission(101, 2) && (
            <div className="text-right">
              <RegistButton label={texts.button.regist} onClick={handleSubmit}/>
              {errors?.haita && <p className={`error-message ${styles.input50}`}>{errors.haita}</p>}
            </div>
         )}
          {executionPermission(101, 2) && member.userId !== undefined && (
            <>
              <div className="divide-y border-gray-500"></div>
              <h1 className={styles.heading}> {texts.member.shonin}</h1>
              <div className="sm:flex sm:justify-between sm:items-center">
                <label className="noteLabel">
                  {texts.member.shonin_note_1}<br />
                  {texts.member.shonin_note_2}
                </label>
                {member.userId !== undefined && (
                  member.shoninFlg ? (
                    <ShoninOffButton
                      userId={member.userId}
                      onUpdate={updateShoninFlg}
                    />
                  ) : (
                    <ShoninOnButton
                      userId={member.userId}
                      onUpdate={updateShoninFlg}
                    />
                  )
                )}
              </div>
              <div className="divide-y border-gray-500"></div>
              <h1 className={styles.heading}>  {texts.label.teishi}</h1>
              <div className="sm:flex sm:justify-between sm:items-center">
              <label className="noteLabel">
                  {texts.label.teishi_note_1}
                </label>
                {member.userId !== undefined && (
                  member.teishiFlg ? (
                    <MemberTeishiOffButton
                      userId={member.userId}
                      onUpdate={updateTeishiFlg}
                    />
                  ) : (
                    <MemberTeishiOnButton
                      userId={member.userId}
                      onUpdate={updateTeishiFlg}
                    />
                  )
                )}
              </div>
                <div className="divide-y border-gray-500"></div>
                <h1 className={styles.heading}> {texts.label.delete}</h1>
                <div className="sm:flex sm:justify-between sm:items-center">
                <label className="noteLabel">
                    {texts.label.delete_note_1}<br />
                  </label>
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
                </div>
            </>
           )}
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(Page);