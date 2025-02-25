import { useCallback } from 'react';
//コンフィグ
import { texts } from '@/config/texts';



interface RegistButtonProps {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}
export function PrivacyPolicyRegistButton({ onClick }: RegistButtonProps) {
    return (
        <button className="bg-yellow-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-60" onClick={onClick}>
            <span>{ texts.button.privacyPolicyRegist }</span>
         </button>
    );
}

interface DeleteButtonProps {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}
export const PrivacyPolicyDeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
    return (
        <button className="bg-red-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-60" onClick={onClick}>
            <span>{ texts.button.privacyPolicyDelete }</span>
         </button>
    );
};