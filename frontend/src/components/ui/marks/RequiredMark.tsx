import React from "react";
import { useLocale } from "@/hooks/useLocale";
export function RequiredMark() {
  const { texts } = useLocale();
  return (
    <span className="bg-red-500 text-white text-xs w-10 p-1 mr-2 text-center">
      <span>{texts.label.require}</span>
    </span>
  );
}
