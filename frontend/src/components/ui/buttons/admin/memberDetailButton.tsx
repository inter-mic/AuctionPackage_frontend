import { texts } from "@/config/texts.ja";

interface MemberDetailButtonProps {
  userId: string | number;
}

export function MemberDetailButton({ userId }: MemberDetailButtonProps) {
  const handleClick = () => {
    window.open(`/admin/member/register?userId=${userId}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-400 hover:bg-opacity-50 font-bold text-white py-2 px-4 rounded-lg w-40"
    >
      <span>{texts.button.memberInfo}</span>
    </button>
  );
}
