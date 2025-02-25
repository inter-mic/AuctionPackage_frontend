import { texts } from '@/config/texts';
export function ShiyoshoButton() {

    const handleOutput = () => {
        const fileUrl = '/Qbrick_csv_import_lump_goods_regist.xlsx'; // 公開パス
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = '仕様書.xlsx';
        link.click();
    };
    return (
        <button
            type="button"
            onClick={handleOutput} 
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full w-40">
            <span>{ texts.goods.shiyosho }</span>
        </button>
    );
}