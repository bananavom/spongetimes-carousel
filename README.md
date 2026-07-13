# 🍍 스폰지타임즈 2기 캐러셀

**스폰지클럽 2기 · 스폰지타임즈(Sponge Times)** 인스타그램 캐러셀 자동 생성 웹앱입니다.
표지부터 CTA까지 6장짜리 캐러셀(4:5, 1080×1350)을 브라우저에서 만들고, PNG · MP4 · ZIP으로 내보냅니다.

- **브랜드**: 셀피쉬클럽 › 스폰지클럽
- **매거진**: 스폰지타임즈 (Sponge Times) — [@spongeclub](https://instagram.com/spongeclub)
- **편집팀**: 봄 · 위버 · 포비 · 필리줄리
- **기간 / 발행**: 6주 워크숍, 주 2~3회
- **포맷**: Instagram Carousel (4:5, 1080×1350)

## 슬라이드 구성 (표지 → CTA)

| # | 슬라이드 | 내용 |
|---|----------|------|
| 1 | 표지 | 이번 회차 메인 카피 + 서브 카피 |
| 2 | 편집팀 | 스폰지타임즈를 만드는 편집팀 소개 |
| 3 | 매거진 소개 | 스폰지타임즈가 무엇을 담는지 |
| 4 | 컨셉 | 강조 박스로 핵심 메시지 (드래그·리사이즈) |
| 5 | 타임라인 | 현재 주차 · 진행 상황 |
| 6 | CTA | 마무리 메시지 + 팔로우 유도 |

## 주요 기능

- 슬라이드별 텍스트 실시간 편집 (자동 저장 — localStorage)
- 이미지 / 영상 업로드, 마우스 드래그 · 리사이즈 배치, 애니메이션 효과
- 슬라이드 이름 · 주차(1~6주) 커스터마이즈
- 내보내기: 개별 **PNG** · **MP4** · 전체 **ZIP**

## 로컬 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인합니다.

```bash
npm run build   # 프로덕션 빌드
npm run start   # 프로덕션 서버
```

## Vercel 배포

이 저장소는 별도 설정 없이 Vercel에 그대로 배포됩니다 (`vercel.json` 포함).

**대시보드로 배포 (권장)**
1. [vercel.com/new](https://vercel.com/new) 에서 이 GitHub 저장소를 import 합니다.
2. Framework Preset이 **Next.js** 로 자동 인식됩니다 (Build: `npm run build`).
3. **Deploy** 를 누르면 끝. 이후 `main` 브랜치에 푸시할 때마다 자동 배포되고,
   다른 브랜치는 프리뷰 배포가 생성됩니다.

**CLI로 배포**
```bash
npm i -g vercel
vercel        # 프리뷰 배포
vercel --prod # 프로덕션 배포
```

## 기술 스택

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
html-to-image / html2canvas (PNG) · @ffmpeg (MP4) · JSZip (ZIP)
