interface RegistButtonProps {
  label: string;
  onClick?: () => void; 
}
export function MailShomeiRegistButton({ label, onClick }: RegistButtonProps) {
  return (
    <button className="bg-yellow-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40" onClick={onClick} >
          <span>{ label }</span>
       </button>
  );
}