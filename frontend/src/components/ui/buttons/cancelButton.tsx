import { useLocale } from "@/hooks/useLocale";
export function CancelButton() {
  const handleReload = () => {
    window.location.reload();
  };
  const { texts } = useLocale();
  return (
    <button
      type="button"
      onClick={handleReload}
      className="bg-gray-500 hover:bg-gray-700  text-white font-bold py-2 px-4 rounded-full w-40 "
    >
      <span>{texts.button.cancel}</span>
    </button>
  );
}
