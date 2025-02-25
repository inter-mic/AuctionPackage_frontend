import { texts } from '@/config/texts';
import { useCallback } from 'react';
import  useTeishiOnOffAPI  from '@/hooks/api/admin/staff/useTeishiOnOffAPI';

interface StaffTeishiButtonProps {
    staffId: number;
    onUpdate: (staffId: number, teishiFlg: boolean) => void;
}
const StaffTeishiOnButton: React.FC<StaffTeishiButtonProps> = ({ staffId, onUpdate}) => {
    const { teishiOnOffAPI } = useTeishiOnOffAPI();
  
    const handleClick = useCallback(async () => {
     const success = await teishiOnOffAPI(staffId, true);
     if (success) {
       onUpdate(staffId, true);
     }
   }, [staffId, teishiOnOffAPI, onUpdate]);
 
   return (
         <button onClick={handleClick} className="bg-red-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40">
             <span>{ texts.button.teishiOn }</span>
          </button>
     );
};

const StaffTeishiOffButton: React.FC<StaffTeishiButtonProps> = ({ staffId, onUpdate  }) => {
    const { teishiOnOffAPI } = useTeishiOnOffAPI();
  
    const handleClick = useCallback(async() => {
        const success = await teishiOnOffAPI(staffId, false);
        if (success) {
            onUpdate(staffId, false);
          }
    }, [staffId, teishiOnOffAPI, onUpdate]);
  
    return (
        <button onClick={handleClick} className="bg-gray-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40">
            <span>{ texts.button.teishiOff }</span>
         </button>
    );
};

export { StaffTeishiOnButton, StaffTeishiOffButton };