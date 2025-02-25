import { useCallback } from 'react';
//コンフィグ
import { texts } from '@/config/texts';
//API
import useGoodsAddinfoItemRegistAPI from '@/hooks/api/admin/goods/useGoodsAddinfoItemRegistAPI';



interface RegistButtonProps {
  seq: number;
  goodsAddinfo: string | null;
}
export const GoodsAddinfoItemRegistButton: React.FC<RegistButtonProps> = ({ seq, goodsAddinfo }) => {
    const { goodsAddinfoItemRegistAPI } = useGoodsAddinfoItemRegistAPI();

    const handleClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation(); // イベントの伝播を停止
      const requestData = {
          goodsAddinfo: goodsAddinfo || '', 
        };
        await goodsAddinfoItemRegistAPI(seq, requestData);
      }, [goodsAddinfo, seq, goodsAddinfoItemRegistAPI]);

    return (
        <button onClick={handleClick} className="bg-yellow-500  hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg  w-20 sm:w-full" >
          <span>{ texts.button.update }</span>
        </button>
    );
};