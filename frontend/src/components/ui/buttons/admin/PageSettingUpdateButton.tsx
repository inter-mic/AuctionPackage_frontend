import { texts } from '@/config/texts';
//型定義
import { TTtPageSetting } from '@/types/admin/pagesetting/search';


interface PageSettingUpdateButtonProps {
  pageSeq: number;
  registData: TTtPageSetting;
  onSubmit: (pageSeq: number, data: TTtPageSetting) => void;
}
export const PageSettingUpdateButton: React.FC<PageSettingUpdateButtonProps> = ({ pageSeq, registData, onSubmit }) => {
  return (
    <button
      onClick={() => onSubmit(pageSeq, registData)}
      className="bg-yellow-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
    >
      { texts.button.regist }
    </button>
  );
};