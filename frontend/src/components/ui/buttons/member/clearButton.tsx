import React from "react";
import { useLocale } from "@/hooks/useLocale";
import buttonStyles from "@/styles/Button.module.css";
interface ClearButtonProps {
  onClear: () => void;
}

export function ClearButton({ onClear }: ClearButtonProps) {
  const { texts } = useLocale();
  return (
    <button type="button" onClick={onClear} className={buttonStyles.clearButton}>
      <span>{texts.button.clear}</span>
    </button>
  );
}
