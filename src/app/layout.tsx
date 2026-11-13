import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./typography.css";
import "./avatar-theme.css";

const nunito = localFont({
  src: "./fonts/Nunito-Variable.ttf",
  variable: "--font-nunito",
  weight: "200 1000",
  style: "normal",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});
export const metadata: Metadata = { title: "Finanzas personales · Tu dinero, con propósito", description: "Organiza tus gastos, planifica tu mes y avanza hacia tus metas.", icons: { icon: "/koala.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es" className={nunito.variable}><body>{children}</body></html>; }

