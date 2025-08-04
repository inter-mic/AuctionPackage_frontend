import React, { useEffect, useState } from "react";
import { texts } from "@/config/texts.ja";
import { useGoodsFavoriteSearchAPI } from "@/hooks/api/admin/goods/useGoodsFavoriteSearchAPI";
import { TAdminGoodsFavoriteSelect } from "@/types/admin/goods/favoriteSearch";

interface FavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  goodsId: number;
}

export const FavoriteModal: React.FC<FavoriteModalProps> = ({ isOpen, onClose, goodsId }) => {
  const [favoriteList, setFavoriteList] = useState<TAdminGoodsFavoriteSelect[]>([]);
  const { data, goodsFavoriteSearchAPI } = useGoodsFavoriteSearchAPI();

  useEffect(() => {
    if (isOpen && goodsId) {
      const searchParams = {
        goodsId: goodsId.toString(),
        pageNumber: 1,
        pageSize: 100, // 十分な件数を取得
      };
      goodsFavoriteSearchAPI(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, goodsId]);

  useEffect(() => {
    if (data) {
      setFavoriteList(data);
    }
  }, [data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{texts.button.favoriteCheck}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {favoriteList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    {texts.member.userName}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    {texts.member.companyName}
                  </th>
                </tr>
              </thead>
              <tbody>
                {favoriteList.map((favorite, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-left">
                      {favorite.userName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-left">
                      {favorite.companyName || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">{texts.message.noData}</div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            {texts.button.close}
          </button>
        </div>
      </div>
    </div>
  );
};
