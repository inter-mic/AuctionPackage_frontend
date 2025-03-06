import { GetServerSideProps } from 'next';
import { texts } from '@/config/texts';
//ホック
import { withAuth } from '@/hocs/withAdminAuth';
import withAdminLayout from '@/hocs/withAdminLayout';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
import { useKengenRedirect } from '@/hooks/useKengenRedirect';
import { useExecutionPermission } from '@/hooks/useExecutionPermission';
//API
import { useAdminSearchAPI }  from '@/hooks/api/admin/admin/useAdminSearchAPI';
import { useAdminRegistAPI } from '@/hooks/api/admin/admin/useAdminRegistAPI';
import { useZipCodeSearchAPI } from '@/hooks/api/public/useZipCodeSearchAPI';
//型定義
import { TAdminRegistRequest } from '@/types/admin/admin/register';
import { PageProps } from '@/types/admin/adminPage';
//コンポーネント
import { TodofukenPullDown } from '@/components/ui/pulldowns/TodofukenPullDown';
import { RequiredMark } from '@/components/ui/marks/RequiredMark';
//ボタン
import { RegistButton } from '@/components/ui/buttons/admin/registButton';
//スタイル
import breadcrumbStyles from '@/styles/breadcrumb.module.css';



export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const otherData = {};
  return {
    props: {
      pageTitle: texts.menu.adminAdminRegist
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen  }) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  
  useKengenRedirect(kengen, 504);
  const { executionPermission } = useExecutionPermission(kengen);
  
  const { adminData, adminSearch } = useAdminSearchAPI();

  useEffect(() => {
    if (!adminData) {
      adminSearch();
    }
  }, [adminSearch, adminData]);

  const [admin, setAdmin] = useState<TAdminRegistRequest>({});
  useEffect(() => {
    if (adminData) { setAdmin(adminData[0]); }
  }, [adminData]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdmin((prevAdmin) => ({ ...prevAdmin, [name]: value }));
    if (errors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const { address, zipCodeSearch } = useZipCodeSearchAPI();
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zipCode1 = (document.getElementById('zipCode1') as HTMLInputElement).value;
    const zipCode2 = (document.getElementById('zipCode2') as HTMLInputElement).value;
    handleChange({ target: { name: 'zipCode', value: `${zipCode1}-${zipCode2}` } } as React.ChangeEvent<HTMLInputElement>);
    if (zipCode1.length === 3 && zipCode2.length === 4) {
      const paramZipCode = zipCode1 + zipCode2;
      zipCodeSearch(paramZipCode);
    }
  };
    useEffect(() => {
      if (address) {
        handleChange({ target: { name: 'todofukenName', value: address.todofukenName } } as React.ChangeEvent<HTMLInputElement>);
        handleChange({ target: { name: 'address1', value: address.address } } as React.ChangeEvent<HTMLInputElement>);
      }
       // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

  const [selectedTodofukenId, setSelectedTodofukenId] = useState<string | null>(null);
  const handleTodofukenChange = (name: string, value: string) => {
    setSelectedTodofukenId(value);
    handleChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
  };
  useEffect(() => {
    if (admin.todofukenName) {
      setSelectedTodofukenId(admin.todofukenName);
    }
  }, [admin]);

  const handleTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tel1 = (document.getElementById('tel1') as HTMLInputElement).value;
    const tel2 = (document.getElementById('tel2') as HTMLInputElement).value;
    const tel3 = (document.getElementById('tel3') as HTMLInputElement).value;
    handleChange({ target: { name: 'tel', value: `${tel1}-${tel2}-${tel3}` } } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleFaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fax1 = (document.getElementById('fax1') as HTMLInputElement).value;
    const fax2 = (document.getElementById('fax2') as HTMLInputElement).value;
    const fax3 = (document.getElementById('fax3') as HTMLInputElement).value;
    handleChange({ target: { name: 'fax', value: `${fax1}-${fax2}-${fax3}` } } as React.ChangeEvent<HTMLInputElement>);
  };

  const { responseData, errors, adminRegist } = useAdminRegistAPI();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const handleSubmit = () => {
    adminRegist(admin);
  };
  useEffect(() => {
    if (errors) { setFormErrors(errors); }
  }, [errors]);

  return (
    <div>
      <div>
        <div className={breadcrumbStyles.breadcrumb}>
          <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminAdminRegist}</span>
        </div>
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
          <div className="w-full p-8 space-y-6 bg-white shadow-md md:max-w-full md:rounded">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                {texts.member.companyName}
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={admin.companyName || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 mt-1 border  focus:outline-none `}
              />
              {formErrors?.companyName && <p className="error-message">{formErrors.companyName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {texts.member.zipCode}
              </label>
              <div className="flex items-center space-x-2 lg:w-6/12 sm:w-full">
                <input
                  id="zipCode1"
                  name="zipCode1"
                  type="text"
                  value={admin.zipCode?.split('-')[0] || ''}
                  onChange={handleZipCodeChange}
                  className={`w-full px-3 py-2 mt-1 border  focus:outline-none`}
                />
                <span>-</span>
                <input
                  id="zipCode2"
                  name="zipCode2"
                  type="text"
                  value={admin.zipCode?.split('-')[1] || ''}
                  onChange={handleZipCodeChange}
                  className={`w-full px-3 py-2 mt-1 border  focus:outline-none`}
                />
              </div>
              {formErrors?.zipCode && <p className="error-message">{formErrors.zipCode}</p>}
            </div>
            <div>
              <label htmlFor="todofuken" className="block text-sm font-medium text-gray-700">
                {texts.member.todofuken}
              </label>
              <TodofukenPullDown
                onChange={(value) => handleTodofukenChange('todofukenName', value)}
                selectedId={selectedTodofukenId}
              />
            </div>
            <div>
              <label htmlFor="address1" className="block text-sm font-medium text-gray-700">
                {texts.member.address1}
              </label>
              <input
                id="address1"
                name="address1"
                type="text"
                value={admin.address1 || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 mt-1 border  focus:outline-none`}
              />
              {formErrors?.address1 && <p className="error-message">{formErrors.address1}</p>}
            </div>
            <div>
              <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
                {texts.member.address2}
              </label>
              <input
                id="address2"
                name="address2"
                type="text"
                value={admin.address2 || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 mt-1 border  focus:outline-none`}
              />
              {formErrors?.address2 && <p className="error-message">{formErrors.address2}</p>}
            </div>
            <div>
              <label htmlFor="tel" className="block text-sm font-medium text-gray-700">
                {texts.member.tel}
              </label>
              <div className="flex items-center space-x-2 lg:w-6/12 sm:w-full">
                <input
                  id="tel1"
                  name="tel1"
                  type="text"
                  value={admin.tel?.split('-')[0] || ''}
                  onChange={handleTelChange}
                  className={`w-full px-3 py-2 mt-1 border  focus:outline-none`}
                />
                <span>-</span>
                <input
                  id="tel2"
                  name="tel2"
                  type="text"
                  value={admin.tel?.split('-')[1] || ''}
                  onChange={handleTelChange}
                  className={`w-full px-3 py-2 mt-1 border  focus:outline-none`}
                />
                <span>-</span>
                <input
                  id="tel3"
                  name="tel3"
                  type="text"
                  value={admin.tel?.split('-')[2] || ''}
                  onChange={handleTelChange}
                  className={`w-full  px-3 py-2 mt-1 border  focus:outline-none`}
                />
              </div>
              {formErrors?.tel && <p className="error-message">{formErrors.tel}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {texts.member.fax}
              </label>
              <div className="flex items-center space-x-2 lg:w-6/12 sm:w-full">
                <input
                  id="fax1"
                  name="fax1"
                  type="text"
                  value={admin.fax?.split('-')[0] || ''}
                  onChange={handleFaxChange}
                  className={`w-full px-3 py-2 mt-1 border  focus:outline-none`}
                />
                <span>-</span>
                <input
                  id="fax2"
                  name="fax2"
                  type="text"
                  value={admin.fax?.split('-')[1] || ''}
                  onChange={handleFaxChange}
                  className={`w-full px-3 py-2 mt-1 border  focus:outline-none`}
                />
                <span>-</span>
                <input
                  id="fax3"
                  name="fax3"
                  type="text"
                  value={admin.fax?.split('-')[2] || ''}
                  onChange={handleFaxChange}
                  className={`w-full px-3 py-2 mt-1 border  focus:outline-none`}
                />
              </div>
              {formErrors?.fax && <p className="error-message">{formErrors.fax}</p>}
            </div>
            <div>
              <div className="flex items-center">
                <RequiredMark />
                <label htmlFor="mail" className="block text-sm font-medium text-gray-700">
                  {texts.common.mail}{texts.admin.admin_note_3}
                </label>
              </div>
              <input
                id="mail"
                name="mail"
                type="email"
                value={admin.mail || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 mt-1 border  focus:outline-none`}
              />
              {formErrors?.mail && <p className="error-message">{formErrors.mail}</p>}
            </div>
            <div>
              <label htmlFor="companyUrl" className="block text-sm font-medium text-gray-700">
                {texts.admin.companyUrl}{texts.admin.admin_note_2}
              </label>
              <input
                id="companyUrl"
                name="companyUrl"
                type="text"
                value={admin.companyUrl || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 mt-1 border  focus:outline-none`}
              />
              {formErrors?.companyUrl && <p className="error-message">{formErrors.companyUrl}</p>}
            </div>
            <div>
              <label htmlFor="kobutsuBango" className="block text-sm font-medium text-gray-700">
                {texts.admin.kobutsuBango}{texts.admin.admin_note_1}
              </label>
              <input
                id="kobutsuBango"
                name="kobutsuBango"
                type="text"
                value={admin.kobutsuBango || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 mt-1 border  focus:outline-none`}
              />
              {formErrors?.kobutsuBango && <p className="error-message">{formErrors.kobutsuBango}</p>}
            </div>
            <div>
              <label htmlFor="copyRight" className="block text-sm font-medium text-gray-700">
                {texts.admin.copyRight}{texts.admin.admin_note_1}
              </label>
              <input
                id="copyRight"
                name="copyRight"
                type="text"
                value={admin.copyRight || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 mt-1 border  focus:outline-none `}
              />
              {formErrors?.copyRight && <p className="error-message">{formErrors.copyRight}</p>}
            </div>
            <div>
              <label htmlFor="invoiceNo" className="block text-sm font-medium text-gray-700">
                {texts.admin.invoiceNo}{texts.admin.admin_note_4}
              </label>
              <input
                id="invoiceNo"
                name="invoiceNo"
                type="text"
                value={admin.invoiceNo || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 mt-1 border  focus:outline-none `}
              />
              {formErrors?.invoiceNo && <p className="error-message">{formErrors.invoiceNo}</p>}
            </div>
            <div>
              <label htmlFor="furikomiKozaName" className="block text-sm font-medium text-gray-700">
                {texts.admin.furikomiKozaName}{texts.admin.admin_note_4}
              </label>
              <input
                id="furikomiKozaName"
                name="furikomiKozaName"
                type="text"
                value={admin.furikomiKozaName || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 mt-1 border  focus:outline-none `}
              />
              {formErrors?.furikomiKozaName && <p className="error-message">{formErrors.furikomiKozaName}</p>}
            </div>
            <div>
              <label htmlFor="furikomiGinkoName" className="block text-sm font-medium text-gray-700">
                {texts.admin.furikomiGinkoName}{texts.admin.admin_note_4}
              </label>
              <input
                id="furikomiGinkoName"
                name="furikomiGinkoName"
                type="text"
                value={admin.furikomiGinkoName || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 mt-1 border  focus:outline-none `}
              />
              {formErrors?.furikomiGinkoName && <p className="error-message">{formErrors.furikomiGinkoName}</p>}
            </div>
            <div>
              <label htmlFor="furikomiShitenName" className="block text-sm font-medium text-gray-700">
                {texts.admin.furikomiShitenName}{texts.admin.admin_note_4}
              </label>
              <input
                id="furikomiShitenName"
                name="furikomiShitenName"
                type="text"
                value={admin.furikomiShitenName || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 mt-1 border  focus:outline-none `}
              />
              {formErrors?.furikomiShitenName && <p className="error-message">{formErrors.furikomiShitenName}</p>}
            </div>
            <div>
              <label htmlFor="furikomiKozaShurui" className="block text-sm font-medium text-gray-700">
                {texts.admin.furikomiKozaShurui}{texts.admin.admin_note_4}
              </label>
              <input
                id="furikomiKozaShurui"
                name="furikomiKozaShurui"
                type="text"
                value={admin.furikomiKozaShurui || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 mt-1 border  focus:outline-none `}
              />
              {formErrors?.furikomiKozaShurui && <p className="error-message">{formErrors.furikomiKozaShurui}</p>}
            </div>
            <div>
              <label htmlFor="furikomiKozaNo" className="block text-sm font-medium text-gray-700">
                {texts.admin.furikomiKozaNo}{texts.admin.admin_note_4}
              </label>
              <input
                id="furikomiKozaNo"
                name="furikomiKozaNo"
                type="text"
                value={admin.furikomiKozaNo || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 mt-1 border  focus:outline-none `}
              />
              {formErrors?.furikomiKozaNo && <p className="error-message">{formErrors.furikomiKozaNo}</p>}
            </div>
            {executionPermission(101, 2) && (
              <div className="text-right">
                <RegistButton label={texts.button.regist} onClick={handleSubmit}/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );  
};

export default withAdminLayout(Page);