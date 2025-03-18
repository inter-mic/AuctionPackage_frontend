
import { texts } from '@/config/texts';
import { TPageProps } from '@/types/member/memberPage';
//スタイル
import styles from '@/styles/member/Complete.module.css';

interface Props extends TPageProps {
    isLogin: boolean;
}


const ContactPageCompletionComponent: React.FC<Props> = ({ isLogin }) => {

    return (
        <>
            <div className={styles.page}>
                <div className={styles.container}>
                    <div >
                        <h1 className={styles.title}>{texts.menu.memberContactCompletion}</h1>
                        <label className="flex justify-center items-center text-gray-500 text-sm">
                            <div>
                                <h1>{texts.contact.confirm_complete_note_1}</h1>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactPageCompletionComponent;