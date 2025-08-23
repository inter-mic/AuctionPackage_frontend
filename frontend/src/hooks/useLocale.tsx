import { useRouter } from "next/router";
import { getTexts } from "@/config/texts";

export const useLocale = () => {
  const { locale } = useRouter();
  const texts = getTexts(locale);
  return { locale, texts };
};
