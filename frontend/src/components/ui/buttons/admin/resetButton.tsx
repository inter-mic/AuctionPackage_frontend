import { texts } from "@/config/texts.ja";
export function ResetButton() {
  const handleReload = () => {
    window.location.reload();
  };
  return (
    <button
      onClick={handleReload}
      className="bg-gray-300 hover:bg-opacity-50 text-gray-700 py-2 px-4 rounded-lg  w-full sm:w-40 "
    >
      <span>{texts.button.reset}</span>
    </button>
  );
}
