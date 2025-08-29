import { useCallback } from "react";
//コンフィグ
import { texts } from "@/config/texts.ja";
//API
import useCategoryDeleteAPI from "@/hooks/api/admin/category/useCategoryDeleteAPI";

interface RegistButtonProps {
  categorySeq: string;
  onDelete?: (categorySeq: string) => void;
}
export const CategoryDeleteButton: React.FC<RegistButtonProps> = ({ categorySeq, onDelete }) => {
  const { categoryDelete } = useCategoryDeleteAPI();

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault(); // フォーム送信を防止
      e.stopPropagation(); // イベントの伝播を停止

      // 新しいカテゴリーの場合はAPIコールをスキップして直接削除処理を呼び出し
      if (String(categorySeq).startsWith("new_")) {
        if (onDelete) {
          onDelete(categorySeq);
        }
        return;
      }

      // 既存のカテゴリーの場合はAPIコールを実行
      await categoryDelete(categorySeq);
    },
    [categorySeq, categoryDelete, onDelete]
  );

  return (
    <button
      onClick={handleClick}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className="bg-red-500 hover:bg-opacity-50  text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
    >
      <span>{texts.button.delete}</span>
    </button>
  );
};
