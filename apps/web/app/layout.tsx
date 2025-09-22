
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Ground Zero",
  description: "Quiz engine, Next.js edition"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100">
        <main>{children}</main>
      </body>
    </html>
  );
}
