import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Finanzas personales · Tu dinero, con propósito", description: "Organiza tus gastos, planifica tu mes y avanza hacia tus metas.", icons: { icon: "/koala.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html>; }

