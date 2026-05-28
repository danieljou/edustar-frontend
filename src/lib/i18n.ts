import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import commonFr from "@/locales/common/fr.json";
import commonEn from "@/locales/common/en.json";
import dashboardFr from "@/locales/dashboard/fr.json";
import dashboardEn from "@/locales/dashboard/en.json";
import academiqueFr from "@/locales/academique/fr.json";
import academiqueEn from "@/locales/academique/en.json";
import evaluationsFr from "@/locales/evaluations/fr.json";
import evaluationsEn from "@/locales/evaluations/en.json";
import pedagogieFr from "@/locales/pedagogie/fr.json";
import pedagogieEn from "@/locales/pedagogie/en.json";
import administrationFr from "@/locales/administration/fr.json";
import administrationEn from "@/locales/administration/en.json";
import communicationFr from "@/locales/communication/fr.json";
import communicationEn from "@/locales/communication/en.json";
import systemeFr from "@/locales/systeme/fr.json";
import systemeEn from "@/locales/systeme/en.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "fr",
    defaultNS: "common",
    ns: [
      "common",
      "dashboard",
      "academique",
      "evaluations",
      "pedagogie",
      "administration",
      "communication",
      "systeme",
    ],
    resources: {
      fr: {
        common: commonFr,
        dashboard: dashboardFr,
        academique: academiqueFr,
        evaluations: evaluationsFr,
        pedagogie: pedagogieFr,
        administration: administrationFr,
        communication: communicationFr,
        systeme: systemeFr,
      },
      en: {
        common: commonEn,
        dashboard: dashboardEn,
        academique: academiqueEn,
        evaluations: evaluationsEn,
        pedagogie: pedagogieEn,
        administration: administrationEn,
        communication: communicationEn,
        systeme: systemeEn,
      },
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "edustar_lang",
    },
  });

export default i18n;
