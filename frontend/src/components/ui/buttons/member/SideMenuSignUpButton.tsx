import { useRouter } from 'next/navigation';
//コンフィグ
import { texts } from '@/config/texts';


export function SideMenuSignUpButton() {

    const router = useRouter();
    const handleClick = () => {
        router.push(`/signup`);
        
    };
    return (
        <button
            onClick={handleClick}
            className="bg-white text-gray-400 border border-solid border-gray-300 
        hover:bg-gray-300 hover:text-white
        py-4 px-4 mx-4 my-4 w-60"
        >
            <span >{texts.button.newSignup}</span>
        </button>
    );
}