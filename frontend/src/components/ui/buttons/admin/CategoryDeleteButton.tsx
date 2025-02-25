import { useCallback } from 'react';
//コンフィグ
import { texts } from '@/config/texts';
//API
import useCategoryDeleteAPI from '@/hooks/api/admin/category/useCategoryDeleteAPI';



interface RegistButtonProps {
  categorySeq: string;
}
export const CategoryDeleteButton: React.FC<RegistButtonProps> = ({ categorySeq }) => {
    const { categoryDelete } = useCategoryDeleteAPI();

    const handleClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault(); // フォーム送信を防止
      e.stopPropagation(); // イベントの伝播を停止
        await categoryDelete(categorySeq);
      }, [categorySeq, categoryDelete]);

    return (
        <button onClick={handleClick} className="bg-red-500 hover:bg-opacity-50  text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40" >
          <span>{ texts.button.delete }</span>
        </button>
    );
};