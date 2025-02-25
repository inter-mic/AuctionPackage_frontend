import { texts } from '@/config/texts';
export function UploadButton() {
    return (
        <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full w-40">
            <span >{ texts.button.upload }</span>
         </button>
    );
}