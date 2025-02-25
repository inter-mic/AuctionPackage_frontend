import React from 'react';

interface Props {
    price: number;
}

export const FormatPrice: React.FC<Props> = ({ price }) => {
    if(String(price) == null || String(price) == ""){
        return "";
    }
    return parseFloat(String(price)).toLocaleString();
};
