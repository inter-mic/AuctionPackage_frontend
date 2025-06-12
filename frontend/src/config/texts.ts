import { texts as jaTexts } from "@/config/texts.ja";
import { texts as enTexts } from "@/config/texts.en";

export const getTexts = (locale: string | undefined) => {
  switch (locale) {
    case "en":
      return enTexts;
    case "ja":
    default:
      return jaTexts;
  }
};
