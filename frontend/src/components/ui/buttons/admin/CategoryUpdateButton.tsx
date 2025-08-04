//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//API
import useCategoryRegistAPI from "@/hooks/api/admin/category/useCategoryRegistAPI";

interface RegistButtonProps {
  categorySeq: string;
  categoryName: string | null;
  setFormUpdateErrors: React.Dispatch<
    React.SetStateAction<{ [key: string]: { [key: string]: string } }>
  >;
}
export const CategoryUpdateButton: React.FC<RegistButtonProps> = ({
  categorySeq,
  categoryName,
  setFormUpdateErrors,
}) => {
  const { useEffect, useCallback, texts } = useCommonSetup();
  const { errors, categoryRegist } = useCategoryRegistAPI();

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault(); // フォーム送信を防止
      e.stopPropagation(); // イベントの伝播を停止
      const requestData = {
        categoryName: categoryName || "",
      };
      await categoryRegist(categorySeq, requestData);
    },
    [categorySeq, categoryName, categoryRegist]
  );

  useEffect(() => {
    if (errors) {
      setFormUpdateErrors((prevErrors) => ({
        ...prevErrors,
        [categorySeq]: {
          categoryName: errors.categoryName || "",
        },
      }));
    }
  }, [errors, categorySeq, setFormUpdateErrors]);

  return (
    <button
      onClick={handleClick}
      className="bg-yellow-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
    >
      <span>{texts.button.update}</span>
    </button>
  );
};
