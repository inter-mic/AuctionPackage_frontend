import React from "react";

interface ChildCategoryButtonProps {
  onClick: () => void;
  label?: string;
}

export const ChildCategoryButton: React.FC<ChildCategoryButtonProps> = ({
  onClick,
  label = "子階層",
}) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="bg-blue-300 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
    >
      {label}
    </button>
  );
};
