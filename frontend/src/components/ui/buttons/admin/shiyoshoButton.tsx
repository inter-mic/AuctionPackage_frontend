import { texts } from '@/config/texts';
export function ShiyoshoButton({
    fileUrl = '/goods_regist_csv.xlsx',
    fileName = '商品情報一括取込仕様書.xlsx'
}: {
    fileUrl?: string;
    fileName?: string;
}) {
    const handleOutput = () => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.click();
    };

    return (
        <button
            type="button"
            onClick={handleOutput} 
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full w-40">
            <span>{texts.goods.shiyosho}</span>
        </button>
    );
}
