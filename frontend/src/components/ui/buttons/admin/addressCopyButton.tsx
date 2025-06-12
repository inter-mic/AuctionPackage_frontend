import { useLocale } from "@/hooks/useLocale";
type AddressCopyButtonProps = {
  onClick: () => void; // onClickプロパティを追加
};

export const AddressCopyButton: React.FC<AddressCopyButtonProps> = ({ onClick }) => {
  const { texts } = useLocale();
  return (
    <button
      onClick={onClick}
      className="bg-yellow-500  hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-60 sm:ml-1 mt-2 lg:mt-0"
    >
      <span>{texts.button.addressCopy}</span>
    </button>
  );
};
