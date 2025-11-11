import React from 'react';

interface Props {
    price: number | null | undefined;
}

export const FormatPrice: React.FC<Props> = ({ price }) => {
    if(price == null || isNaN(price)){
        return "";
    }
    return parseFloat(String(price)).toLocaleString();
};
