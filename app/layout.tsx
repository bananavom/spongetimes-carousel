import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🍍 스폰지타임즈 2기 캐러셀",
  description: "스폰지클럽 2기 · 스폰지타임즈 인스타그램 캐러셀 자동 생성기 (@spongeclub)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
