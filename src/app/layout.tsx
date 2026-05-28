import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { ServiceWorkerRegistration } from "@/components/layout/ServiceWorkerRegistration";
import { I18nProvider } from "@/components/providers/I18nProvider";

export const metadata: Metadata = {
  title: { default: "EduStar — Gestion Scolaire", template: "%s · EduStar" },
  description: "Plateforme de gestion scolaire EduStar — Yaoundé, Cameroun",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <I18nProvider>
          <ToastProvider>{children}</ToastProvider>
        </I18nProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
