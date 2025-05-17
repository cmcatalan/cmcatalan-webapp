import "./globals.css";
import {ReactNode} from "react";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'FemEquip',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
