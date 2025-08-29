import React from "react";

interface CategoryAddButtonProps {
  onClick: () => void;
  label?: string;
}

export const CategoryAddButton: React.FC<CategoryAddButtonProps> = ({
  onClick,
  label = "追加",
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-300 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
    >
      <span>{label}</span>
    </button>
  );
};
