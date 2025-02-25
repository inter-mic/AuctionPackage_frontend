import React from 'react';
//コンフィグ
import { texts } from '@/config/texts';
export function GoodsListMark() {
    return (
        <span className="bg-gray-500 text-white text-xs w-10 p-1  mx-1">
            <span >{ texts.label.goodsListMark }</span>
         </span>
    );
  };