import { texts } from '@/config/texts';
interface FurakusatsuButtonProps {
    onClick?: () => void; 
  }
export function FurakusatsuButton({ onClick }: FurakusatsuButtonProps) {

    return (
        <button  onClick={onClick} className="bg-gray-500 hover:bg-opacity-50  text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40 ">
            <span >{ texts.button.backFurakusatsu }</span>
         </button>
    );
}