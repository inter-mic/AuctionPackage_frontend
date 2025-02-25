import React from 'react';
//コンフィグ
import { texts } from '@/config/texts';
export function RequiredMark() {
    return (
        <span className="bg-red-500 text-white text-xs w-10 p-1 mr-2 text-center">
            <span >{ texts.label.require }</span>
         </span>
    );
  };