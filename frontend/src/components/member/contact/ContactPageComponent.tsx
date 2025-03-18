//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
import ConfirmDialog from '@/components/ui/dialog/confirmDialog';
//API
import { useUserSearchAPI } from '@/hooks/api/member/mypage/useUserSearchAPI';
import { useContactSendAPI } from '@/hooks/api/public/useContactSendAPI';
//型定義
import { Contact, initialContact } from '@/types/public/contact';
import { TPageProps } from '@/types/member/memberPage';
//コンポーネント
import { RequiredMark } from '@/components/ui/marks/RequiredMark';
//スタイル
import memberStyles from '@/styles/member/MemberCommon.module.css';
import buttonStyles from '@/styles/Button.module.css';

interface Props extends TPageProps {
    isLogin: boolean;
}


const ContactPageComponent: React.FC<Props> = ({ isLogin }) => {
    const { useState, useEffect, texts } = useCommonSetup();
    const [data, setData] = useState<Contact>(initialContact);
    const { userData, userSearchAPI } = useUserSearchAPI();
    useEffect(() => {
        if (isLogin) { userSearchAPI(); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (userData) {
            setData({
                name: userData.userName ?? '',
                nameKana: userData.userNameKana ?? '',
                tel: userData.tel ?? '',
                title: '',
                text: '',
                mail: userData.mail ?? ''
            });

        }
    }, [userData]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tel1 = (document.getElementById('tel1') as HTMLInputElement).value;
        const tel2 = (document.getElementById('tel2') as HTMLInputElement).value;
        const tel3 = (document.getElementById('tel3') as HTMLInputElement).value;
        handleChange({ target: { name: 'tel', value: `${tel1}-${tel2}-${tel3}` } } as React.ChangeEvent<HTMLInputElement>);
    };


    const { errors, contactSendAPI } = useContactSendAPI();
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const handleSubmit = () => {
        contactSendAPI(data, true, isLogin);

    };
    useEffect(() => {
        if (errors) { setFormErrors(errors); }
    }, [errors]);
    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;

        if (formErrors[name]) {
            setFormErrors((prevFormErrors) => ({
                ...prevFormErrors,
                [name]: '',
            }));
        }
    };

    return (
        <>
            <div className={memberStyles.mainTitleContainer}>
                <span className={memberStyles.mainTitle}>{texts.menu.memberContact}</span>
            </div>

            <div className="lg:flex flex-col items-center justify-center min-h-screen ">

                <div className="lg:w-6/12 p-8 space-y-6 bg-white md:max-w-full md:rounded">

                    <div>
                        <div className="flex items-center">
                            <RequiredMark />
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                {texts.contact.name}
                            </label>
                        </div>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={data.name || ''}
                            onChange={handleChange}
                            onFocus={handleInputFocus}
                            className={`w-full lg:w-6/12 px-3 py-2 mt-1 border  focus:outline-none `}
                        />
                        {errors?.name && <p className="error-message">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="nameKana" className="block text-sm font-medium text-gray-700">
                            {texts.contact.nameKana}
                        </label>
                        <input
                            id="nameKana"
                            name="nameKana"
                            type="text"
                            value={data.nameKana || ''}
                            onChange={handleChange}
                            onFocus={handleInputFocus}
                            className="w-full lg:w-6/12 px-3 py-2 mt-1 border  focus:outline-none "
                        />
                        {errors?.nameKana && <p className="error-message">{errors.nameKana}</p>}
                    </div>
                    <div>
                        <label htmlFor="tel" className="block text-sm font-medium text-gray-700">
                            {texts.contact.tel}
                        </label>
                        <div className="flex items-center space-x-2 lg:w-6/12 sm:w-full">
                            <input
                                id="tel1"
                                name="tel1"
                                type="text"
                                value={data.tel?.split('-')[0] || ''}
                                onChange={handleTelChange}
                                onFocus={handleInputFocus}
                                className="w-full px-3 py-2 mt-1 border  focus:outline-none "
                            />
                            <span>-</span>
                            <input
                                id="tel2"
                                name="tel2"
                                type="text"
                                value={data.tel?.split('-')[1] || ''}
                                onChange={handleTelChange}
                                onFocus={handleInputFocus}
                                className="w-full px-3 py-2 mt-1 border  focus:outline-none "
                            />
                            <span>-</span>
                            <input
                                id="tel3"
                                name="tel3"
                                type="text"
                                value={data.tel?.split('-')[2] || ''}
                                onChange={handleTelChange}
                                onFocus={handleInputFocus}
                                className="w-full px-3 py-2 mt-1 border  focus:outline-none "
                            />
                        </div>
                        {errors?.tel && <p className="error-message">{errors.tel}</p>}
                    </div>
                    <div>
                        <div className="flex items-center">
                            <RequiredMark />
                            <label htmlFor="mail" className="block text-sm font-medium text-gray-700">
                                {texts.common.mail}
                            </label>
                        </div>


                        <input
                            id="mail"
                            name="mail"
                            type="email"
                            value={data.mail || ''}
                            onChange={handleChange}
                            onFocus={handleInputFocus}
                            className={`w-full lg:w-6/12 px-3 py-2 mt-1 border  focus:outline-none `}
                        />
                        {errors?.mail && <p className="error-message">{errors.mail}</p>}
                    </div>

                    <div>
                        <div className="flex items-center">
                            <RequiredMark />
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                {texts.contact.title}
                            </label>
                        </div>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={data.title || ''}
                            onChange={handleChange}
                            onFocus={handleInputFocus}
                            className={`w-full lg:w-6/12 px-3 py-2 mt-1 border  focus:outline-none `}
                        />
                        {errors?.title && <p className="error-message">{errors.title}</p>}
                    </div>
                    <div>
                        <div className="flex items-center">
                            <RequiredMark />
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                {texts.contact.text}
                            </label>
                        </div>
                        <textarea
                            id="text"
                            name="text"
                            value={data.text || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none  h-80"
                        />
                         {errors?.text && <p className="error-message">{errors.text}</p>}
                    </div>


                    <div className="flex justify-center items-center ">
                        <ConfirmDialog
                            title={texts.contact.confirm}
                            description={texts.contact.confirm_note_1}
                            buttonTitle={texts.button.send}
                            className={buttonStyles.sendButton}
                            dialogCancelClassName={buttonStyles.diaLogCancelButton}
                            dialogClassName={buttonStyles.diaLogSendButton}
                            onSubmit={handleSubmit}
                            buttonText={texts.button.send}
                        />

                    </div>


                </div>
            </div>
        </>
    );
};

export default ContactPageComponent;