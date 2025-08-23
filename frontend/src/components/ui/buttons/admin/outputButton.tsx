//コンフィグ
import { texts } from "@/config/texts.ja";

type Props = {
  onClick: () => void; // onClickプロパティを追加
  text?: string;
};

export const OutPutButton: React.FC<Props> = ({ onClick, text = texts.button.csv }) => {
  return (
    <button
      onClick={onClick}
      className="bg-yellow-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40 sm:ml-1  mt-2 lg:mt-0"
    >
      <span>{text}</span>
    </button>
  );
};
