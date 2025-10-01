import React from "react";
import { useLocale } from "@/hooks/useLocale";
import buttonStyles from "@/styles/Button.module.css";

interface DetailButtonProps {
  onClick: () => void;

}

export function DetailButton({ onClick}: DetailButtonProps) {
  const { texts } = useLocale();
  
  return (
    <button
      onClick={onClick}
      className={`${buttonStyles.detailButton}`}
    >
      {texts.button.detail || "詳細"}
    </button>
  );
}

