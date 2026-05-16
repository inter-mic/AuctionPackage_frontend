import React from "react";

interface UseFormFieldHandlersProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  zipCodeSearch?: (zipCode: string) => void;
}

export const useFormFieldHandlers = ({ handleChange, zipCodeSearch }: UseFormFieldHandlersProps) => {
  const handleZipCodeChange = (prefix: "zipCode" | "sofuZipCode") => {
    const zipCode1 = (document.getElementById(`${prefix}1`) as HTMLInputElement).value;
    const zipCode2 = (document.getElementById(`${prefix}2`) as HTMLInputElement).value;
    handleChange({
      target: { name: prefix, value: `${zipCode1}-${zipCode2}` },
    } as React.ChangeEvent<HTMLInputElement>);

    // 郵便番号検索を実行
    if (zipCode1.length === 3 && zipCode2.length === 4 && zipCodeSearch) {
      const paramZipCode = zipCode1 + zipCode2;
      zipCodeSearch(paramZipCode);
    }
  };

  const handlePhoneChange = (fieldName: "tel" | "fax" | "mobile") => {
    const part1 = (document.getElementById(`${fieldName}1`) as HTMLInputElement).value;
    const part2 = (document.getElementById(`${fieldName}2`) as HTMLInputElement).value;
    const part3 = (document.getElementById(`${fieldName}3`) as HTMLInputElement).value;
    handleChange({
      target: { name: fieldName, value: `${part1}-${part2}-${part3}` },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return {
    handleZipCodeChange,
    handlePhoneChange,
  };
};


