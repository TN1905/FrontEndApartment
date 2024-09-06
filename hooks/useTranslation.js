import { useRouter } from "next/router";
import en from "../public/locales/en/common.json";
import vi from "../public/locales/vi/common.json";

const translations = { en, vi };

export const useTranslation = () => {
  const { locale } = useRouter();
  const t = (key) => translations[locale][key] || key;
  return { t };
};
