import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TGoodsSelect } from '@/types/common/goods';

interface GoodsListContextType {
  goodsList: TGoodsSelect[];
  setGoodsList: (goodsList: TGoodsSelect[]) => void;
  clearGoodsList: () => void;
}

const GoodsListContext = createContext<GoodsListContextType | undefined>(undefined);

interface GoodsListProviderProps {
  children: ReactNode;
}

export const GoodsListProvider: React.FC<GoodsListProviderProps> = ({ children }) => {
  // セッションストレージから商品一覧を復元
  const [goodsList, setGoodsList] = useState<TGoodsSelect[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('goodsList');
        return stored ? JSON.parse(stored) : [];
      } catch {
       
        return [];
      }
    }
    return [];
  });

  const clearGoodsList = () => {
    setGoodsList([]);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('goodsList');
    }
  };

  // 商品一覧が更新されたらセッションストレージに保存
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (goodsList.length > 0) {
        sessionStorage.setItem('goodsList', JSON.stringify(goodsList));
      } else {
        sessionStorage.removeItem('goodsList');
      }
    }
  }, [goodsList]);

  return (
    <GoodsListContext.Provider value={{ goodsList, setGoodsList, clearGoodsList }}>
      {children}
    </GoodsListContext.Provider>
  );
};

export const useGoodsListContext = () => {
  const context = useContext(GoodsListContext);
  if (context === undefined) {
    throw new Error('useGoodsListContext must be used within a GoodsListProvider');
  }
  return context;
};
