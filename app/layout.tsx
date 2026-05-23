import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🍍 데굴데굴 캐러셀 | 스폰지타임즈",
  description: "스폰지클럽 1기 인스타그램 캐러셀 자동 생성기",
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
