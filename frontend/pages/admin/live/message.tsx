import { GetServerSideProps } from 'next';
import breadcrumbStyles from '@/styles/breadcrumb.module.css';
import { texts } from '@/config/texts';
//ホック
import { withAuth } from '@/hocs/withAdminAuth';
import withAdminLayout from '@/hocs/withAdminLayout';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
import { useKengenRedirect } from '@/hooks/useKengenRedirect';
import { useExecutionPermission } from '@/hooks/useExecutionPermission';
//API
import { useMessageSearchAPI } from '@/hooks/api/admin/live/message/useMessageSearchAPI';
import { useMessageRegistAPI } from '@/hooks/api/admin/live/message/useMessageRegistAPI';
//型定義
import { PageProps } from '@/types/admin/adminPage';
//ボタン
import { RegistButton } from '@/components/ui/buttons/admin/registButton';
import { MessageDeleteButton } from '@/components/ui/buttons/admin/MessageDeleteButton';

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminLiveMessageRegist
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen  }) => {
  const { useState, useEffect, useCallback, texts } = useCommonSetup();
  useKengenRedirect(kengen, 306);
  const { executionPermission } = useExecutionPermission(kengen);
  const { message } = useMessageSearchAPI();

  const [newmessage, setNewmessage] = useState<{ [key: string]: string }>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formUpdateErrors, setFormUpdateErrors] = useState<{ [key: string]: { [key: string]: string } }>({});

  const handleNewmessageChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewmessage((prevmessage) => ({ ...prevmessage, [name]: value }));
  };

  const { responseData, errors, messageRegistAPI } = useMessageRegistAPI();
  const handleSubmit = () => {
    messageRegistAPI(null, newmessage);
  };
  const handleUpdateSubmit = (messageSeq: string, message: string) => {
    messageRegistAPI(messageSeq, message);
  };


  useEffect(() => {
    if (errors) { setFormErrors(errors); }
  }, [errors]);

  const [messageItems, setMessageItems] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (message) {
      const initialState = message.reduce((acc: any, item: any) => {
        acc[`message_${item.messageSeq}`] = item.message || '';
        return acc;
      }, {});
      setMessageItems(initialState);
    }
  }, [message]);

  const handleChange = (messageSeq: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMessageItems((prevItems) => ({
      ...prevItems,
      [`message_${messageSeq}`]: value,
    }));
    if (formUpdateErrors?.[messageSeq]?.message) {
      setFormUpdateErrors((prevErrors) => ({
        ...prevErrors,
        [messageSeq]: {
          ...prevErrors[messageSeq],
          message: '',
        },
      }));
    }
  };



  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminLiveMessageRegist}</span>
      </div>
      <div className="flex flex-col items-center justify-center my-3 bg-gray-100">
        <div className="w-full space-y-3 bg-white shadow-md md:max-w-full md:rounded">
          <div className="p-4">
            {texts.label.newRegist} 
            <div className="flex flex-col md:flex-row items-end space-y-4">
              <div className="w-full sm:w-1/3">
                <input
                  id="messageName"
                  type='text'
                  name="messageName"
                  onChange={handleNewmessageChange}
                  className="w-full border p-2 rounded h-10"
                />
              </div>
              {executionPermission(306, 2) ? (
                <RegistButton label={texts.button.regist} onClick={handleSubmit}/>
              ) : (
                <></>
              )}
            </div>
            <div className="w-full sm:w-1/3">
              {formErrors?.messageName && <p className="error-message">{formErrors.messageName}</p>}
            </div>
          </div>
        </div>
      </div>
      {message && message.length > 0 ? (
        <div className="flex flex-col items-center justify-center my-3 bg-gray-100">
          <div className="w-full space-y-3 bg-white shadow-md md:max-w-full md:rounded">
            <div className="p-4">
              <table className="w-full sm:w-1/2 bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 w-3/5 border-b">{texts.livemessage.message}</th>
                    <th className="py-2 px-4 w-1/5 border-b"></th>
                    <th className="py-2 px-4 w-1/5 border-b"></th>
                  </tr>
                </thead>
                <tbody>
                  {message.map((result) => (
                    <tr key={result.messageSeq}>
                      <td className="py-2 px-4 border-b text-left">
                        <input
                          id={`message_${result.messageSeq}`}
                          name={`message_${result.messageSeq}`}
                          type="text"
                          value={messageItems[`message_${result.messageSeq}`] || ''}
                          onChange={handleChange(result.messageSeq)} 
                          className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300`}
                        />
                        {formUpdateErrors?.[result.messageSeq]?.messageName && <p className="error-message">{formUpdateErrors?.[result.messageSeq]?.messageName}</p>}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {executionPermission(306, 2) ? (
                            <RegistButton 
                            label={texts.button.update} 
                            onClick={() => handleUpdateSubmit(result.messageSeq, messageItems[`message_${result.messageSeq}`] || '')}
                          />                      
                        ) : (
                          <></>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {executionPermission(306, 2) ? (
                          <MessageDeleteButton 
                          messageSeq={result.messageSeq}
                        />
                        ) : (
                          <></>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default withAdminLayout(Page);